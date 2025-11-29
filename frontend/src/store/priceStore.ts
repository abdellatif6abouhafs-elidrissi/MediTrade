import { create } from 'zustand';
import apiClient from '../api/client';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

interface PriceState {
  prices: CryptoPrice[];
  loading: boolean;
  error: string | null;
  fetchPrices: () => Promise<void>;
  getPriceBySymbol: (symbol: string) => CryptoPrice | undefined;
}

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: [],
  loading: false,
  error: null,

  fetchPrices: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await apiClient.get('/trades/prices');
      set({ prices: data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getPriceBySymbol: (symbol) => {
    return get().prices.find((p) => p.symbol === symbol);
  },
}));
