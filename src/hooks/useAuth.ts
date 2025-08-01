import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import { generateTokens, verifyToken, isTokenExpired, refreshAccessToken } from '@/utils/jwt';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  authenticate: (username: string, password: string) => Promise<boolean>;
  checkTokenValidity: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
}

// Mock users storage (in a real app, this would be handled by backend)
const mockUsers = new Map<string, { id: string; username: string; email: string; password: string }>();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,

      login: async (user: User) => {
        const { accessToken, refreshToken } = await generateTokens(user.id, user.username, user.email);
        set({ 
          user, 
          isAuthenticated: true, 
          accessToken, 
          refreshToken 
        });
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          accessToken: null, 
          refreshToken: null 
        });
      },

      checkTokenValidity: async () => {
        const { accessToken, refreshToken } = get();
        
        if (!accessToken || !refreshToken) {
          get().logout();
          return;
        }

        // Check if access token is expired
        if (isTokenExpired(accessToken)) {
          // Try to refresh the token
          const success = await get().refreshAuthToken();
          if (!success) {
            get().logout();
          }
        }
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken || isTokenExpired(refreshToken)) {
          return false;
        }

        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          set({ accessToken: newAccessToken });
          return true;
        }
        
        return false;
      },

      register: async (username: string, email: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        for (const [, userData] of mockUsers) {
          if (userData.username === username || userData.email === email) {
            return false;
          }
        }

        // Hash password with bcrypt (salt rounds: 12)
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          email,
          password: hashedPassword
        };
        
        mockUsers.set(newUser.id, newUser);
        
        // Auto login after registration
        await get().login({ id: newUser.id, username, email });
        return true;
      },

      authenticate: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user and verify password with bcrypt
        for (const [, userData] of mockUsers) {
          if (userData.username === username || userData.email === username) {
            const isPasswordValid = await bcrypt.compare(password, userData.password);
            if (isPasswordValid) {
              await get().login({ id: userData.id, username: userData.username, email: userData.email });
              return true;
            }
          }
        }
        
        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Check token validity on app load
        if (state) {
          state.checkTokenValidity();
        }
      },
    }
  )
);