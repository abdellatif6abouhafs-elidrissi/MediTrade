import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '../../api/client';
import { usePriceStore } from '../../store/priceStore';

interface PriceAlert {
  _id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currentPriceAtCreation: number;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
}

interface PriceAlertManagerProps {
  symbol?: string;
  currentPrice?: number;
  compact?: boolean;
}

const PriceAlertManager: React.FC<PriceAlertManagerProps> = ({
  symbol,
  currentPrice,
  compact = false,
}) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [selectedSymbol, setSelectedSymbol] = useState(symbol || 'BTC');

  const { prices } = usePriceStore();

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (symbol) {
      setSelectedSymbol(symbol);
    }
  }, [symbol]);

  const fetchAlerts = async () => {
    try {
      const { data } = await apiClient.get('/alerts');
      setAlerts(data.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const createAlert = async () => {
    if (!targetPrice || isNaN(parseFloat(targetPrice))) {
      setError('Please enter a valid price');
      return;
    }

    const price = prices.find((p) => p.symbol === selectedSymbol)?.price || currentPrice || 0;

    setLoading(true);
    setError('');

    try {
      await apiClient.post('/alerts', {
        symbol: selectedSymbol,
        targetPrice: parseFloat(targetPrice),
        condition,
        currentPrice: price,
      });

      setSuccess('Alert created successfully!');
      setTargetPrice('');
      setIsCreating(false);
      fetchAlerts();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      await apiClient.delete(`/alerts/${id}`);
      setAlerts(alerts.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  };

  const getCurrentPrice = (sym: string) => {
    return prices.find((p) => p.symbol === sym)?.price || 0;
  };

  const getProgress = (alert: PriceAlert) => {
    const current = getCurrentPrice(alert.symbol);
    const start = alert.currentPriceAtCreation;
    const target = alert.targetPrice;

    if (alert.condition === 'above') {
      if (current >= target) return 100;
      const range = target - start;
      const progress = current - start;
      return Math.max(0, Math.min(100, (progress / range) * 100));
    } else {
      if (current <= target) return 100;
      const range = start - target;
      const progress = start - current;
      return Math.max(0, Math.min(100, (progress / range) * 100));
    }
  };

  const activeAlerts = alerts.filter((a) => !a.isTriggered);
  const triggeredAlerts = alerts.filter((a) => a.isTriggered);

  if (compact) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {activeAlerts.length > 0 ? (
          <BellRing className="w-5 h-5 text-yellow-500" />
        ) : (
          <Bell className="w-5 h-5 text-gray-500" />
        )}
        {activeAlerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeAlerts.length}
          </span>
        )}

        <AnimatePresence>
          {isOpen && (
            <AlertModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Price Alerts
          </h3>
          {activeAlerts.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full">
              {activeAlerts.length} active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Alert
        </button>
      </div>

      {/* Create Alert Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Symbol Select */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Coin
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  >
                    {prices.map((p) => (
                      <option key={p.symbol} value={p.symbol}>
                        {p.symbol} - ${p.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Condition
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCondition('above')}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        condition === 'above'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Above
                    </button>
                    <button
                      onClick={() => setCondition('below')}
                      className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        condition === 'below'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <TrendingDown className="w-4 h-4" />
                      Below
                    </button>
                  </div>
                </div>

                {/* Target Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Target Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={createAlert}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-3 flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  {success}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No alerts yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Create your first price alert
            </p>
          </div>
        ) : (
          <>
            {/* Active Alerts */}
            {activeAlerts.map((alert) => (
              <AlertItem
                key={alert._id}
                alert={alert}
                currentPrice={getCurrentPrice(alert.symbol)}
                progress={getProgress(alert)}
                onDelete={() => deleteAlert(alert._id)}
              />
            ))}

            {/* Triggered Alerts */}
            {triggeredAlerts.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20">
                <div className="px-4 py-2 text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                  Triggered
                </div>
                {triggeredAlerts.map((alert) => (
                  <AlertItem
                    key={alert._id}
                    alert={alert}
                    currentPrice={getCurrentPrice(alert.symbol)}
                    progress={100}
                    onDelete={() => deleteAlert(alert._id)}
                    triggered
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Alert Item Component
const AlertItem: React.FC<{
  alert: PriceAlert;
  currentPrice: number;
  progress: number;
  onDelete: () => void;
  triggered?: boolean;
}> = ({ alert, currentPrice, progress, onDelete, triggered }) => {
  const isAbove = alert.condition === 'above';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 flex items-center justify-between ${
        triggered ? 'bg-green-50/50 dark:bg-green-900/10' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            triggered
              ? 'bg-green-100 dark:bg-green-900/30'
              : isAbove
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          {triggered ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : isAbove ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">
              {alert.symbol}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isAbove
                  ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {isAbove ? '↑ Above' : '↓ Below'}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Target: ${alert.targetPrice.toLocaleString()} • Current: $
            {currentPrice.toLocaleString()}
          </div>

          {/* Progress Bar */}
          {!triggered && (
            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${
                  isAbove ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Alert Modal (for compact mode)
const AlertModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Price Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          <PriceAlertManager />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PriceAlertManager;
