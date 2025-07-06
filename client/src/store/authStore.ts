import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse, RefreshTokenResponse, UserResponse } from '../types';
import { apiClient } from '../services/api';
import { socketService } from '../services/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  refreshAuthToken: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.login(credentials) as AuthResponse;
          
          if (response.success) {
            const { user, token, refreshToken } = response;
            
            set({
              user,
              token,
              refreshToken,
              loading: false,
              error: null,
            });
            
            apiClient.setToken(token);
            socketService.connect(token);
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.register(userData) as AuthResponse;
          
          if (response.success) {
            const { user, token, refreshToken } = response;
            
            set({
              user,
              token,
              refreshToken,
              loading: false,
              error: null,
            });
            
            apiClient.setToken(token);
            socketService.connect(token);
          } else {
            throw new Error(response.error || 'Registration failed');
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: null,
          });
          
          apiClient.clearToken();
          socketService.disconnect();
        }
      },

      setUser: (user) => set({ user }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await apiClient.refreshToken(refreshToken) as RefreshTokenResponse;
          
          if (response.success) {
            const { token, refreshToken: newRefreshToken } = response;
            
            set({
              token,
              refreshToken: newRefreshToken,
            });
            
            apiClient.setToken(token);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
        }
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await apiClient.getMe() as UserResponse;
          
          if (response.success) {
            set({ user: response.user, loading: false });
            socketService.connect(token);
          } else {
            throw new Error('Authentication check failed');
          }
        } catch (error) {
          console.error('Auth check error:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'yeettalk-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);