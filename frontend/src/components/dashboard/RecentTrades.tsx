import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

interface Trade {
  _id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  createdAt: string;
}

interface RecentTradesProps {
  trades: Trade[];
  maxItems?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const RecentTrades = ({ trades, maxItems = 5 }: RecentTradesProps) => {
  const navigate = useNavigate();
  const recentTrades = trades.slice(0, maxItems);

  if (trades.length === 0) {
    return (
      <GlassCard>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Trades
        </h3>
        <div className="py-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No trades yet
          </p>
          <button
            onClick={() => navigate('/trade')}
            className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Make your first trade
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Trades
        </h3>
        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          {trades.length} total
        </span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {recentTrades.map((trade) => {
          const isBuy = trade.type === 'buy';

          return (
            <motion.div
              key={trade._id}
              variants={itemVariants}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/trade?symbol=${trade.symbol}`)}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isBuy
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  {isBuy ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {trade.symbol}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        isBuy
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {trade.amount.toFixed(4)} @ {formatCurrency(trade.price)}
                  </p>
                </div>
              </div>

              {/* Value & Time */}
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(trade.total)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(trade.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Link */}
      {trades.length > maxItems && (
        <button
          onClick={() => navigate('/trades')}
          className="w-full mt-4 py-2 text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          View all {trades.length} trades
        </button>
      )}
    </GlassCard>
  );
};

export default RecentTrades;
