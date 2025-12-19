import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Star,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  X,
  GripVertical,
  Zap,
  Info,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import apiClient from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { prices, fetchPrices } = usePriceStore();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWatchlist();
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, fetchPrices]);

  const fetchWatchlist = async () => {
    try {
      const { data } = await apiClient.get('/watchlist');
      setWatchlist(data.data || []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (symbol: string) => {
    try {
      const { data } = await apiClient.post('/watchlist/toggle', { symbol });
      setWatchlist(data.data);
    } catch (error: any) {
      console.error('Error toggling watchlist:', error);
      alert(error.response?.data?.message || 'Failed to update watchlist');
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    try {
      const { data } = await apiClient.post('/watchlist/remove', { symbol });
      setWatchlist(data.data);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleReorder = async (newOrder: string[]) => {
    setWatchlist(newOrder);
    try {
      await apiClient.put('/watchlist/reorder', { symbols: newOrder });
    } catch (error) {
      console.error('Error reordering watchlist:', error);
      fetchWatchlist(); // Revert on error
    }
  };

  const availableCoins = useMemo(() => {
    return prices.filter(
      (p) =>
        !watchlist.includes(p.symbol) &&
        (p.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [prices, watchlist, searchTerm]);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Star className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500 fill-yellow-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Watchlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Track your favorite cryptocurrencies
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              <p className="font-medium mb-1">Your Personal Watchlist</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-600 dark:text-yellow-400">
                <li>Add up to 20 coins to track</li>
                <li>Drag to reorder your watchlist</li>
                <li>Click on a coin to trade instantly</li>
                <li>Prices update every 5 seconds</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            className="w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Coin ({watchlist.length}/20)
          </Button>
        </motion.div>

        {/* Watchlist */}
        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                Your watchlist is empty
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                Add coins to track their prices
              </p>
              <Button onClick={() => setShowAddModal(true)} variant="primary">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Coin
              </Button>
            </Card>
          </motion.div>
        ) : (
          <Reorder.Group
            axis="y"
            values={watchlist}
            onReorder={handleReorder}
            className="space-y-3"
          >
            {watchlist.map((symbol, index) => {
              const coin = prices.find((p) => p.symbol === symbol);
              if (!coin) return null;

              return (
                <Reorder.Item key={symbol} value={symbol}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
                      <div className="flex items-center gap-4 p-4">
                        {/* Drag Handle */}
                        <div className="hidden sm:block text-gray-400 dark:text-gray-600">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Coin Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{coin.symbol}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {coin.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                            MCap: {formatMarketCap(coin.marketCap)}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPrice(coin.price)}</div>
                          <div
                            className={`flex items-center justify-end gap-1 text-sm ${
                              coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {coin.change24h >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {Math.abs(coin.change24h).toFixed(2)}%
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => navigate(`/trade?symbol=${coin.symbol}`)}
                            variant="primary"
                            size="sm"
                            className="hidden sm:flex"
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            Trade
                          </Button>
                          <button
                            onClick={() => navigate(`/trade?symbol=${coin.symbol}`)}
                            className="sm:hidden p-2 bg-primary-500 text-white rounded-lg"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(symbol)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAddModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[90vh] sm:max-h-[80vh]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">Add to Watchlist</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search coins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                {/* Coin List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {availableCoins.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No coins found' : 'All coins are in your watchlist!'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableCoins.map((coin) => (
                        <button
                          key={coin.symbol}
                          onClick={() => {
                            toggleWatchlist(coin.symbol);
                            if (watchlist.length >= 19) {
                              setShowAddModal(false);
                            }
                          }}
                          disabled={watchlist.length >= 20}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{coin.symbol}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {coin.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatPrice(coin.price)}</div>
                            <div
                              className={`text-sm ${
                                coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {coin.change24h >= 0 ? '+' : ''}
                              {coin.change24h.toFixed(2)}%
                            </div>
                          </div>
                          <Plus className="w-5 h-5 text-primary-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Watchlist;
