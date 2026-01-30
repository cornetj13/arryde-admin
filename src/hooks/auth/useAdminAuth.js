import { useMutation, gql } from '@apollo/client';
import { useAuthStore } from '../../stores';

const LOGIN_ADMIN = gql`
  mutation LoginAdmin($input: LoginAdminInput!) {
    loginAdmin(input: $input) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;

const LOGOUT_ADMIN = gql`
  mutation LogoutAdmin {
    logoutAdmin {
      message
    }
  }
`;

const REFRESH_TOKEN = gql`
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

export const useLoginAdmin = () => {
  const { setAuth } = useAuthStore();
  const [loginMutation, { loading, error }] = useMutation(LOGIN_ADMIN);

  const login = async (username, password) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { username, password },
        },
      });

      if (data?.loginAdmin) {
        const { accessToken, user } = data.loginAdmin;
        setAuth(accessToken, user);
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    }
  };

  return { login, loading, error };
};

export const useLogoutAdmin = () => {
  const { clearAuth } = useAuthStore();
  const [logoutMutation] = useMutation(LOGOUT_ADMIN);

  const logout = async () => {
    try {
      await logoutMutation();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuth();
    }
  };

  return { logout };
};

export const useRefreshToken = () => {
  const { setAuth, clearAuth } = useAuthStore();
  const [refreshMutation] = useMutation(REFRESH_TOKEN);

  const refresh = async () => {
    try {
      const { data } = await refreshMutation();

      if (data?.refreshAccessTokenAdmin) {
        const { accessToken, user } = data.refreshAccessTokenAdmin;
        setAuth(accessToken, user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Token refresh error:', err);
      clearAuth();
      return false;
    }
  };

  return { refresh };
};
