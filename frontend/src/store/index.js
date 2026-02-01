import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    setUser: (user) => set({ user }),
    setToken: (token) => {
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: !!token });
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    },
  }))
);

export const useThemeStore = create(
  devtools((set) => ({
    currentTheme: localStorage.getItem('theme') || 'netflix',
    isDarkMode: localStorage.getItem('isDarkMode') !== 'false',
    currentLanguage: localStorage.getItem('language') || 'fr',
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      set({ currentTheme: theme });
    },
    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        localStorage.setItem('isDarkMode', newDarkMode);
        return { isDarkMode: newDarkMode };
      }),
    setLanguage: (language) => {
      localStorage.setItem('language', language);
      set({ currentLanguage: language });
    },
  }))
);

export const useUIStore = create(
  devtools((set) => ({
    isSidebarOpen: true,
    isLoading: false,
    notifications: [],
    toggleSidebar: () =>
      set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setLoading: (isLoading) => set({ isLoading }),
    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
  }))
);
