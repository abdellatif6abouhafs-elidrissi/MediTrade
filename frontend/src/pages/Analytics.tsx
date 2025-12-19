import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import apiClient from '../api/client';

interface Holding {
  symbol: string;
  amount: number;
  averagePrice: number;
  currentPrice?: number;
  value?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  allocation?: number;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  bestPerformer: Holding | null;
  worstPerformer: Holding | null;
  diversificationScore: number;
}

interface Trade {
  _id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  createdAt: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const { prices, fetchPrices } = usePriceStore();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user && prices.length > 0) {
      calculatePortfolio();
    }
  }, [user, prices]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUser(), fetchPrices()]);
      const { data } = await apiClient.get('/trades/history');
      setTrades(data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolio = () => {
    if (!user?.portfolio) return;

    const portfolio = user.portfolio
      .filter((h) => h.amount > 0)
      .map((holding) => {
        const priceData = prices.find((p) => p.symbol === holding.symbol);
        const currentPrice = priceData?.price || holding.averagePrice;
        const value = holding.amount * currentPrice;
        const invested = holding.amount * holding.averagePrice;
        const profitLoss = value - invested;
        const profitLossPercent = invested > 0 ? (profitLoss / invested) * 100 : 0;

        return {
          ...holding,
          currentPrice,
          value,
          profitLoss,
          profitLossPercent,
          allocation: 0,
        };
      });

    // Calculate total and allocations
    const totalValue = portfolio.reduce((sum, h) => sum + (h.value || 0), 0) + user.balance;
    const totalInvested = portfolio.reduce((sum, h) => sum + h.amount * h.averagePrice, 0);

    portfolio.forEach((h) => {
      h.allocation = totalValue > 0 ? ((h.value || 0) / totalValue) * 100 : 0;
    });

    // Sort by value
    portfolio.sort((a, b) => (b.value || 0) - (a.value || 0));

    // Calculate stats
    const totalProfitLoss = portfolio.reduce((sum, h) => sum + (h.profitLoss || 0), 0);
    const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    const bestPerformer = portfolio.reduce(
      (best, h) => (!best || (h.profitLossPercent || 0) > (best.profitLossPercent || 0) ? h : best),
      null as Holding | null
    );

    const worstPerformer = portfolio.reduce(
      (worst, h) => (!worst || (h.profitLossPercent || 0) < (worst.profitLossPercent || 0) ? h : worst),
      null as Holding | null
    );

    // Diversification score (based on number of holdings and balance)
    const holdingsCount = portfolio.length;
    const diversificationScore = Math.min(100, holdingsCount * 15 + (user.balance > 10000 ? 25 : 10));

    setHoldings(portfolio);
    setStats({
      totalValue,
      totalInvested,
      totalProfitLoss,
      totalProfitLossPercent,
      bestPerformer,
      worstPerformer,
      diversificationScore,
    });
  };

  // Calculate trade stats
  const tradeStats = {
    total: trades.length,
    buys: trades.filter((t) => t.type === 'buy').length,
    sells: trades.filter((t) => t.type === 'sell').length,
    volume: trades.reduce((sum, t) => sum + t.total, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Portfolio Analytics
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Track your portfolio performance and insights
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
          >
            {/* Total Portfolio Value */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Value</span>
              </div>
              <p className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white">
                ${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Total P/L */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                  stats.totalProfitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {stats.totalProfitLoss >= 0 ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  )}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total P/L</span>
              </div>
              <p className={`text-xl sm:text-3xl font-black ${
                stats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stats.totalProfitLoss >= 0 ? '+' : ''}${stats.totalProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className={`text-xs sm:text-sm ${stats.totalProfitLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.totalProfitLossPercent >= 0 ? '+' : ''}{stats.totalProfitLossPercent.toFixed(2)}%
              </p>
            </div>

            {/* Cash Balance */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Cash Balance</span>
              </div>
              <p className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white">
                ${user?.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Diversification Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Diversification</span>
              </div>
              <p className="text-xl sm:text-3xl font-black text-purple-500">
                {stats.diversificationScore}%
              </p>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${stats.diversificationScore}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Portfolio Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Portfolio Allocation
              </h2>
            </div>

            {holdings.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Pie Chart Visual */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let cumulativePercent = 0;
                      const cashAllocation = stats ? (user?.balance || 0) / stats.totalValue * 100 : 0;

                      return (
                        <>
                          {holdings.map((holding, index) => {
                            const percent = holding.allocation || 0;
                            const startPercent = cumulativePercent;
                            cumulativePercent += percent;

                            const startAngle = startPercent * 3.6;
                            const endAngle = cumulativePercent * 3.6;
                            const largeArc = percent > 50 ? 1 : 0;

                            const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                            const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                            const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                            const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);

                            if (percent < 0.5) return null;

                            return (
                              <path
                                key={holding.symbol}
                                d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                                fill={COLORS[index % COLORS.length]}
                                className="transition-all hover:opacity-80"
                              />
                            );
                          })}
                          {/* Cash segment */}
                          {cashAllocation > 0.5 && (
                            <path
                              d={`M 50 50 L ${50 + 40 * Math.cos((cumulativePercent * 3.6 - 90) * Math.PI / 180)} ${50 + 40 * Math.sin((cumulativePercent * 3.6 - 90) * Math.PI / 180)} A 40 40 0 ${cashAllocation > 50 ? 1 : 0} 1 ${50 + 40 * Math.cos(((cumulativePercent + cashAllocation) * 3.6 - 90) * Math.PI / 180)} ${50 + 40 * Math.sin(((cumulativePercent + cashAllocation) * 3.6 - 90) * Math.PI / 180)} Z`}
                              fill="#94a3b8"
                              className="transition-all hover:opacity-80"
                            />
                          )}
                        </>
                      );
                    })()}
                    <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Holdings</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{holdings.length}</p>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2 max-h-56 overflow-y-auto">
                  {holdings.slice(0, 6).map((holding, index) => (
                    <div key={holding.symbol} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {holding.symbol}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">
                        {holding.allocation?.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                  {stats && user && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0 bg-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">Cash</span>
                      <span className="text-gray-500 text-sm ml-auto">
                        {((user.balance / stats.totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No holdings yet. Start trading to see your allocation!</p>
              </div>
            )}
          </motion.div>

          {/* Best & Worst Performers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Performance Highlights
              </h2>
            </div>

            <div className="space-y-4">
              {/* Best Performer */}
              {stats?.bestPerformer && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Best Performer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.bestPerformer.symbol}</p>
                      <p className="text-sm text-gray-500">${stats.bestPerformer.value?.toLocaleString(undefined, { maximumFractionDigits: 0 })} value</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-500">
                        +{stats.bestPerformer.profitLossPercent?.toFixed(2)}%
                      </p>
                      <p className="text-sm text-green-600">
                        +${stats.bestPerformer.profitLoss?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Worst Performer */}
              {stats?.worstPerformer && (stats.worstPerformer.profitLossPercent || 0) < 0 && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Worst Performer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.worstPerformer.symbol}</p>
                      <p className="text-sm text-gray-500">${stats.worstPerformer.value?.toLocaleString(undefined, { maximumFractionDigits: 0 })} value</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-red-500">
                        {stats.worstPerformer.profitLossPercent?.toFixed(2)}%
                      </p>
                      <p className="text-sm text-red-600">
                        ${stats.worstPerformer.profitLoss?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trading Activity */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trading Activity</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{tradeStats.total}</p>
                    <p className="text-xs text-gray-500">Total Trades</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${(tradeStats.volume / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-gray-500">Volume</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">{tradeStats.buys}</p>
                    <p className="text-xs text-gray-500">Buy Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-500">{tradeStats.sells}</p>
                    <p className="text-xs text-gray-500">Sell Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Holdings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-500" />
              Holdings Breakdown
            </h2>
          </div>

          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Asset</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Avg Price</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Current Price</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Value</th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">P/L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {holdings.map((holding, index) => (
                    <tr key={holding.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          >
                            {holding.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{holding.symbol}</p>
                            <p className="text-xs text-gray-500 sm:hidden">{holding.amount.toFixed(4)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-gray-900 dark:text-white hidden sm:table-cell">
                        {holding.amount.toFixed(4)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-gray-500 hidden md:table-cell">
                        ${holding.averagePrice.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right text-gray-900 dark:text-white hidden md:table-cell">
                        ${holding.currentPrice?.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                        ${holding.value?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className={`${(holding.profitLossPercent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <p className="font-semibold">
                            {(holding.profitLossPercent || 0) >= 0 ? '+' : ''}{holding.profitLossPercent?.toFixed(2)}%
                          </p>
                          <p className="text-xs">
                            {(holding.profitLoss || 0) >= 0 ? '+' : ''}${holding.profitLoss?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Wallet className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No holdings yet</p>
              <p className="text-sm">Start trading to build your portfolio!</p>
              <button
                onClick={() => navigate('/trade')}
                className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Start Trading
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
