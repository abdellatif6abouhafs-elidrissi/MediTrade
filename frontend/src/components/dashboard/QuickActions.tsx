import { motion } from 'framer-motion';
import { Plus, Minus, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

interface QuickActionsProps {
  favoriteSymbols: string[];
  balance: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const QuickActions = ({
  favoriteSymbols,
  balance,
}: QuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <GlassCard>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Quick Actions
      </h3>

      {/* Balance Display */}
      <div className="bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
          Available Balance
        </p>
        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wallet')}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base shadow-lg shadow-green-500/20 quick-action-btn"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Deposit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wallet')}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base shadow-lg shadow-orange-500/20 quick-action-btn"
        >
          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          Withdraw
        </motion.button>
      </div>

      {/* Favorite Assets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Trade
          </h4>
          <Star className="w-4 h-4 text-yellow-500" />
        </div>

        <div className="space-y-2">
          {favoriteSymbols.slice(0, 4).map((symbol) => (
            <motion.button
              key={symbol}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/trade?symbol=${symbol}`)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {symbol.slice(0, 2)}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {symbol}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* View All Prices */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate('/prices')}
          className="w-full mt-4 py-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          View All Markets
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default QuickActions;
