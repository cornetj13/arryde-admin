import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
  split,
  gql,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '../stores';

const httpUri = import.meta.env.VITE_API_GRAPHQL_URI;
const wsUri = import.meta.env.VITE_API_GRAPHQL_WS;

// The refresh token travels in the httpOnly cookie (credentials: 'include'),
// so this mutation needs no auth header.
const REFRESH_ACCESS_TOKEN_ADMIN = gql`
  mutation RefreshAccessTokenAdmin {
    refreshAccessTokenAdmin {
      accessToken
      user {
        id
        username
      }
    }
  }
`;

const getAuthState = () => useAuthStore.getState();

/* ============================================
   WEBSOCKET CLIENT (module scope — created once)
   ============================================ */

// connectionParams are only read when a connection is (re)established, so
// the socket is restarted whenever the access token changes — otherwise a
// socket opened with an old (or no) token keeps its stale identity and the
// server-side subscription filters deliver nothing admin-only.
const wsClient = createClient({
  url: wsUri,
  retryAttempts: 5,
  retryWait: async (retries) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000))
    );
  },
  connectionParams: () => {
    const { accessToken } = getAuthState();
    return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
  },
});

let lastWsToken = getAuthState().accessToken ?? null;
useAuthStore.subscribe((state) => {
  const token = state.accessToken ?? null;
  if (token === lastWsToken) return;
  lastWsToken = token;
  try {
    wsClient.restart();
  } catch (e) {
    // Socket not connected yet — nothing to restart.
  }
});

/* ============================================
   APOLLO CLIENT (stable — never recreated)
   ============================================ */

// Shared in-flight refresh: concurrent 401s all await the same refresh.
let refreshPromise = null;

const refreshAccessToken = (apolloClient) => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REFRESH_ACCESS_TOKEN_ADMIN,
      });
      const payload = data?.refreshAccessTokenAdmin;
      if (!payload?.accessToken) {
        throw new Error('No access token in refresh response');
      }
      getAuthState().setAuth(payload.accessToken, payload.user);
      return payload.accessToken;
    } catch (error) {
      // Dead session (revoked/expired/pre-V2.5 token) — back to login.
      getAuthState().clearAuth();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const useApollo = () => {
  const client = useMemo(() => {
    // HTTP Link with cookies (refresh token)
    const httpLink = new HttpLink({
      uri: httpUri,
      credentials: 'include',
    });

    // Auth middleware — reads the CURRENT token at request time, so the
    // client never needs to be recreated when the token changes.
    const authLink = new ApolloLink((operation, forward) => {
      const { accessToken } = getAuthState();
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }));
      return forward(operation);
    });

    // On UNAUTHORIZED: refresh the access token once and retry the
    // operation. Previously this just cleared auth, silently dumping the
    // admin to the login screen every ~10 minutes.
    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
      if (!graphQLErrors) return;

      const operationName = operation.operationName;
      // Never try to refresh the refresh/login operations themselves.
      if (['RefreshAccessTokenAdmin', 'LoginAdmin'].includes(operationName)) {
        return;
      }

      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHORIZED') {
          return new Observable((observer) => {
            refreshAccessToken(apolloClient)
              .then((newAccessToken) => {
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                }));
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              })
              .catch((error) => observer.error(error));
          });
        }
      }
    });

    // WebSocket link wraps the module-scope client above
    const wsLink = new GraphQLWsLink(wsClient);

    // Split link - subscriptions use WS, queries/mutations use HTTP
    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      ApolloLink.from([errorLink, authLink, httpLink])
    );

    const apolloClient = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });

    return apolloClient;
  }, []);

  return client;
};
