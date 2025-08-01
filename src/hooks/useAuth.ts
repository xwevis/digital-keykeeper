import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  authenticate: (username: string, password: string) => Promise<boolean>;
}

// Mock users storage (in a real app, this would be handled by backend)
const mockUsers = new Map<string, { id: string; username: string; email: string; password: string }>();

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
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
        get().login({ id: newUser.id, username, email });
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
              get().login({ id: userData.id, username: userData.username, email: userData.email });
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
      }),
    }
  )
);