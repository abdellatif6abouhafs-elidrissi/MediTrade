import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import type { TradeStats } from '../../store/dashboardStore';
import GlassCard from '../ui/GlassCard';

interface StatsGridProps {
  stats: TradeStats | null;
  isLoading?: boolean;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatsGrid = ({ stats, isLoading = false }: StatsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card p-4 space-y-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-24" />
          </div>
        ))}
      </div>
    );
  }

  // Default stats if no trades yet
  const defaultStats: TradeStats = {
    totalTrades: 0,
    profitableTrades: 0,
    totalVolume: 0,
    avgTradeSize: 0,
    bestTrade: null,
    worstTrade: null,
    winRate: 0,
  };

  const displayStats = stats || defaultStats;

  const statCards = [
    {
      title: 'Best Trade',
      value: displayStats.bestTrade?.symbol || 'N/A',
      subtitle: displayStats.bestTrade
        ? `+${displayStats.bestTrade.percentage.toFixed(1)}%`
        : 'No trades yet',
      icon: TrendingUp,
      iconBg: 'from-green-400/20 to-emerald-500/20',
      iconColor: 'text-green-500',
      valueColor: 'text-green-500',
    },
    {
      title: 'Worst Trade',
      value: displayStats.worstTrade?.symbol || 'N/A',
      subtitle: displayStats.worstTrade
        ? `${displayStats.worstTrade.percentage.toFixed(1)}%`
        : 'No trades yet',
      icon: TrendingDown,
      iconBg: 'from-red-400/20 to-rose-500/20',
      iconColor: 'text-red-500',
      valueColor: 'text-red-500',
    },
    {
      title: 'Win Rate',
      value: `${displayStats.winRate.toFixed(0)}%`,
      subtitle: `${displayStats.profitableTrades}/${displayStats.totalTrades} trades`,
      icon: Target,
      iconBg: 'from-purple-400/20 to-violet-500/20',
      iconColor: 'text-purple-500',
      valueColor: displayStats.winRate >= 50 ? 'text-green-500' : 'text-orange-500',
    },
    {
      title: 'Total Trades',
      value: displayStats.totalTrades.toString(),
      subtitle: 'All time',
      icon: Activity,
      iconBg: 'from-blue-400/20 to-cyan-500/20',
      iconColor: 'text-blue-500',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      title: 'Avg Trade Size',
      value: formatCurrency(displayStats.avgTradeSize),
      subtitle: 'Per trade',
      icon: DollarSign,
      iconBg: 'from-amber-400/20 to-yellow-500/20',
      iconColor: 'text-amber-500',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      title: 'Total Volume',
      value: formatCurrency(displayStats.totalVolume),
      subtitle: 'Traded',
      icon: BarChart3,
      iconBg: 'from-pink-400/20 to-rose-500/20',
      iconColor: 'text-pink-500',
      valueColor: 'text-gray-900 dark:text-white',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {statCards.map((stat) => (
        <motion.div key={stat.title} variants={itemVariants}>
          <GlassCard className="stat-card" padding="md">
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mb-3`}
            >
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>

            {/* Title */}
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {stat.title}
            </p>

            {/* Value */}
            <p className={`text-xl font-bold ${stat.valueColor}`}>{stat.value}</p>

            {/* Subtitle */}
            {stat.subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.subtitle}
              </p>
            )}
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsGrid;
