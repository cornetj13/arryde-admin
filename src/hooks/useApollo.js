import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '../stores';

const httpUri = import.meta.env.VITE_API_GRAPHQL_URI;
const wsUri = import.meta.env.VITE_API_GRAPHQL_WS;

export const useApollo = () => {
  const { accessToken, clearAuth } = useAuthStore();

  const client = useMemo(() => {
    // HTTP Link with auth header
    const httpLink = new HttpLink({
      uri: httpUri,
      credentials: 'include',
    });

    // Auth middleware - adds token to requests
    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }));
      return forward(operation);
    });

    // Error handling link
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          if (err.extensions?.code === 'UNAUTHORIZED') {
            console.log('Unauthorized - clearing auth');
            clearAuth();
          }
          console.error(`[GraphQL error]: ${err.message}`);
        }
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    // WebSocket link for subscriptions (if needed later)
    const wsLink = new GraphQLWsLink(
      createClient({
        url: wsUri,
        connectionParams: () => ({
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        }),
      })
    );

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

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });
  }, [accessToken, clearAuth]);

  return client;
};
