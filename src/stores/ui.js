import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        // Mobile sidebar open/closed state
        sidebarOpen: false,
        // Desktop sidebar collapsed state (icon-only mode)
        sidebarCollapsed: false,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }),

        toggleSidebarCollapsed: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (collapsed) =>
          set({ sidebarCollapsed: collapsed }),
      }),
      {
        name: 'admin-ui-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
      }
    ),
    { name: 'UIStore' }
  )
);
