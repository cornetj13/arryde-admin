import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        isAuth: false,
        admin: null,

        setAuth: (accessToken, admin) =>
          set({
            accessToken,
            isAuth: true,
            admin,
          }),

        clearAuth: () =>
          set({
            accessToken: null,
            isAuth: false,
            admin: null,
          }),

        updateToken: (accessToken) =>
          set({ accessToken }),
      }),
      {
        name: 'arryde-admin-auth',
        partialize: (state) => ({
          accessToken: state.accessToken,
          isAuth: state.isAuth,
          admin: state.admin,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
