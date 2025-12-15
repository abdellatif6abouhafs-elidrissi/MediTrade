import { create } from 'zustand';

export interface PortfolioSnapshot {
  date: string;
  totalValue: number;
}

export interface TradeStats {
  totalTrades: number;
  profitableTrades: number;
  totalVolume: number;
  avgTradeSize: number;
  bestTrade: { symbol: string; profit: number; percentage: number } | null;
  worstTrade: { symbol: string; loss: number; percentage: number } | null;
  winRate: number;
}

interface DashboardState {
  // Portfolio History
  portfolioHistory: PortfolioSnapshot[];
  selectedTimeframe: '24h' | '7d' | '30d' | '1y';

  // Stats
  tradeStats: TradeStats | null;

  // UI State
  expandedHolding: string | null;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';

  // Favorites
  favoriteSymbols: string[];

  // Loading states
  isLoadingHistory: boolean;
  isLoadingStats: boolean;

  // Actions
  setPortfolioHistory: (history: PortfolioSnapshot[]) => void;
  setTimeframe: (timeframe: '24h' | '7d' | '30d' | '1y') => void;
  setTradeStats: (stats: TradeStats) => void;
  toggleHoldingExpanded: (symbol: string) => void;
  setSorting: (column: string) => void;
  toggleFavorite: (symbol: string) => void;
  setLoadingHistory: (loading: boolean) => void;
  setLoadingStats: (loading: boolean) => void;

  // Generate mock portfolio history
  generatePortfolioHistory: (currentValue: number, timeframe: '24h' | '7d' | '30d' | '1y') => void;

  // Calculate trade stats from trades
  calculateTradeStats: (trades: any[]) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  portfolioHistory: [],
  selectedTimeframe: '7d',
  tradeStats: null,
  expandedHolding: null,
  sortColumn: 'value',
  sortOrder: 'desc',
  favoriteSymbols: ['BTC', 'ETH', 'SOL'],
  isLoadingHistory: false,
  isLoadingStats: false,

  setPortfolioHistory: (history) => set({ portfolioHistory: history }),

  setTimeframe: (timeframe) => {
    set({ selectedTimeframe: timeframe });
  },

  setTradeStats: (stats) => set({ tradeStats: stats }),

  toggleHoldingExpanded: (symbol) => {
    set((state) => ({
      expandedHolding: state.expandedHolding === symbol ? null : symbol,
    }));
  },

  setSorting: (column) => {
    set((state) => ({
      sortColumn: column,
      sortOrder: state.sortColumn === column && state.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  },

  toggleFavorite: (symbol) => {
    set((state) => ({
      favoriteSymbols: state.favoriteSymbols.includes(symbol)
        ? state.favoriteSymbols.filter((s) => s !== symbol)
        : [...state.favoriteSymbols, symbol],
    }));
  },

  setLoadingHistory: (loading) => set({ isLoadingHistory: loading }),
  setLoadingStats: (loading) => set({ isLoadingStats: loading }),

  generatePortfolioHistory: (currentValue, timeframe) => {
    set({ isLoadingHistory: true });

    const points = {
      '24h': 24,
      '7d': 7,
      '30d': 30,
      '1y': 365,
    }[timeframe];

    const volatility = 0.015; // 1.5% volatility
    const data: PortfolioSnapshot[] = [];
    let value = currentValue * (0.85 + Math.random() * 0.1); // Start 85-95% of current

    const now = new Date();

    for (let i = points; i >= 0; i--) {
      const date = new Date(now);

      if (timeframe === '24h') {
        date.setHours(date.getHours() - i);
      } else {
        date.setDate(date.getDate() - i);
      }

      // Random walk with trend toward current value
      const drift = (currentValue - value) / (i + 1) * 0.15;
      const random = (Math.random() - 0.5) * value * volatility;
      value = Math.max(0, value + drift + random);

      data.push({
        date: date.toISOString(),
        totalValue: value,
      });
    }

    // Ensure last point is current value
    if (data.length > 0) {
      data[data.length - 1].totalValue = currentValue;
    }

    set({ portfolioHistory: data, isLoadingHistory: false });
  },

  calculateTradeStats: (trades) => {
    set({ isLoadingStats: true });

    if (!trades || trades.length === 0) {
      set({
        tradeStats: {
          totalTrades: 0,
          profitableTrades: 0,
          totalVolume: 0,
          avgTradeSize: 0,
          bestTrade: null,
          worstTrade: null,
          winRate: 0,
        },
        isLoadingStats: false,
      });
      return;
    }

    const totalTrades = trades.length;
    const totalVolume = trades.reduce((sum, t) => sum + (t.total || t.price * t.amount), 0);
    const avgTradeSize = totalVolume / totalTrades;

    // Calculate profits for sell trades
    const sellTrades = trades.filter(t => t.type === 'sell');
    const buyTrades = trades.filter(t => t.type === 'buy');

    // Simple profit calculation (in real app, would track actual P/L)
    let profitableTrades = 0;
    let bestTrade: { symbol: string; profit: number; percentage: number } | null = null;
    let worstTrade: { symbol: string; loss: number; percentage: number } | null = null;

    sellTrades.forEach(trade => {
      const profit = trade.total * 0.1 * (Math.random() - 0.3); // Mock profit
      if (profit > 0) profitableTrades++;

      if (!bestTrade || profit > bestTrade.profit) {
        bestTrade = {
          symbol: trade.symbol,
          profit: Math.abs(profit),
          percentage: (profit / trade.total) * 100,
        };
      }
      if (!worstTrade || profit < worstTrade.loss) {
        worstTrade = {
          symbol: trade.symbol,
          loss: Math.abs(profit),
          percentage: (profit / trade.total) * 100,
        };
      }
    });

    // If no sell trades, use buy trades for stats
    if (sellTrades.length === 0 && buyTrades.length > 0) {
      profitableTrades = Math.floor(buyTrades.length * 0.6);
      bestTrade = {
        symbol: buyTrades[0].symbol,
        profit: buyTrades[0].total * 0.15,
        percentage: 15,
      };
      worstTrade = {
        symbol: buyTrades[buyTrades.length - 1].symbol,
        loss: buyTrades[buyTrades.length - 1].total * 0.05,
        percentage: -5,
      };
    }

    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;

    set({
      tradeStats: {
        totalTrades,
        profitableTrades,
        totalVolume,
        avgTradeSize,
        bestTrade,
        worstTrade,
        winRate,
      },
      isLoadingStats: false,
    });
  },
}));

export default useDashboardStore;
