import { create } from 'zustand';
import apiClient from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  portfolio?: Array<{
    symbol: string;
    amount: number;
    averagePrice: number;
  }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateBalance: (balance: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      set({ user: data.user });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  },

  updateBalance: (balance) => {
    set((state) => ({
      user: state.user ? { ...state.user, balance } : null,
    }));
  },
}));
