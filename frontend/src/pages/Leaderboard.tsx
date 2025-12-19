import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Award,
  Crown,
  Flame,
} from 'lucide-react';
import apiClient from '../api/client';

interface Trader {
  _id: string;
  name: string;
  rank: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  holdingsCount: number;
  joinedAt: string;
}

interface Stats {
  totalTraders: number;
  totalVolume: number;
  avgProfit: number;
  profitableTraders: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Medal className="w-6 h-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 border-yellow-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 via-gray-300/10 to-gray-400/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-amber-600/20 border-amber-600/30';
    default:
      return 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
  }
};

const Leaderboard: React.FC = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [page]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/leaderboard?page=${page}&limit=10`);
      setTraders(data.data);
      setStats(data.stats);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Top traders ranked by portfolio value
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Traders</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTraders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Total Volume</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalVolume)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Avg. Profit</p>
                  <p className={`text-lg sm:text-2xl font-bold ${stats.avgProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.avgProfit >= 0 ? '+' : ''}{stats.avgProfit.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Profitable</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.profitableTraders}/{stats.totalTraders}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Top 3 Podium */}
        {traders.length >= 3 && page === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex justify-center items-end gap-4 mb-12"
          >
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-24 h-32 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl flex flex-col items-center justify-end pb-4">
                <Medal className="w-8 h-8 text-white mb-1" />
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-b-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                  {traders[1]?.name}
                </p>
                <p className="text-green-500 font-semibold text-sm">
                  {formatCurrency(traders[1]?.totalValue || 0)}
                </p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center -mt-8">
              <div className="w-28 h-44 bg-gradient-to-t from-yellow-500 to-amber-400 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-lg shadow-yellow-500/30">
                <Crown className="w-10 h-10 text-white mb-1" />
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-b-xl p-4 shadow-lg border-2 border-yellow-500">
                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                  {traders[0]?.name}
                </p>
                <p className="text-green-500 font-semibold">
                  {formatCurrency(traders[0]?.totalValue || 0)}
                </p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-xl flex flex-col items-center justify-end pb-4">
                <Medal className="w-8 h-8 text-white mb-1" />
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-b-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
                  {traders[2]?.name}
                </p>
                <p className="text-green-500 font-semibold text-sm">
                  {formatCurrency(traders[2]?.totalValue || 0)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Rankings
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading leaderboard...</p>
            </div>
          ) : traders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No traders found. Be the first to trade!
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {traders.map((trader) => (
                <motion.div
                  key={trader._id}
                  variants={itemVariants}
                  className={`flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${getRankBg(trader.rank)} border-l-4 ${trader.rank <= 3 ? '' : 'border-l-transparent'}`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                      {getRankIcon(trader.rank)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                        {trader.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {trader.holdingsCount} holdings
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-8">
                    {/* Profit/Loss */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Profit/Loss</p>
                      <div className={`flex items-center gap-1 ${trader.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trader.profitLoss >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold">
                          {trader.profitLoss >= 0 ? '+' : ''}{trader.profitLossPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(trader.totalValue)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
