import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePriceStore } from '../store/priceStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Prices: React.FC = () => {
  const navigate = useNavigate();
  const { prices, loading, fetchPrices } = usePriceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const filteredPrices = prices
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return b.change24h - a.change24h;
      return 0;
    });

  if (loading && prices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Cryptocurrency Prices</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Live prices updated every 5 seconds
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5 text-gray-400" />}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="change">Sort by Change</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPrices.map((coin, index) => (
            <motion.div
              key={coin.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="cursor-pointer" onClick={() => navigate(`/trade?symbol=${coin.symbol}`)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{coin.symbol}</div>
                    <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{coin.name}</div>
                  </div>
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    coin.change24h >= 0
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                  }`}>
                    {coin.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">{Math.abs(coin.change24h).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary-600">
                      ${coin.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                      <div className="text-sm sm:text-base font-semibold">${(coin.volume24h / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Market Cap</div>
                      <div className="text-sm sm:text-base font-semibold">${(coin.marketCap / 1000000000).toFixed(1)}B</div>
                    </div>
                  </div>
                </div>

                <Button variant="primary" size="sm" fullWidth className="mt-4">
                  Trade {coin.symbol}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPrices.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No cryptocurrencies found matching your search.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Prices;
