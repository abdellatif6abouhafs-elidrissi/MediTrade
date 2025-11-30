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
    console.log('🟢 authStore.login CALLED');
    console.log('   Email:', email);
    console.log('   Password:', password ? '***' : 'EMPTY');

    set({ loading: true });
    console.log('   ⏳ Set loading to TRUE');

    try {
      console.log('   📡 Making API POST request to /auth/login...');
      console.log('   Request payload:', { email, password: '***' });

      const response = await apiClient.post('/auth/login', { email, password });

      console.log('   ✅ API response received!');
      console.log('   Response status:', response.status);
      console.log('   Response data:', response.data);

      const { data } = response;

      if (!data.token) {
        throw new Error('No token in response');
      }

      localStorage.setItem('token', data.token);
      console.log('   💾 Token saved to localStorage');

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      console.log('   ✅ Auth state updated successfully');
      console.log('   User:', data.user);
      console.log('🟢 LOGIN COMPLETE');

    } catch (error: any) {
      console.error('   ❌ authStore.login ERROR:', error);
      console.error('   Error message:', error.message);
      console.error('   Error response:', error.response?.data);
      console.error('   Error status:', error.response?.status);

      set({ loading: false });
      console.log('   ⏳ Set loading to FALSE');

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
