import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import apiClient from '../api/client';

interface Trade {
  _id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const { prices, fetchPrices, getPriceBySymbol } = usePriceStore();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          fetchUser(),
          fetchPrices(),
          loadTrades(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const loadTrades = async () => {
    try {
      const { data } = await apiClient.get('/trades/history');
      setTrades(data.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to load trades:', error);
    }
  };

  const calculatePortfolioValue = () => {
    if (!user?.portfolio || !prices.length) return user?.balance || 0;

    const portfolioValue = user.portfolio.reduce((total, holding) => {
      const currentPrice = getPriceBySymbol(holding.symbol);
      return total + (holding.amount * (currentPrice?.price || 0));
    }, 0);

    return user.balance + portfolioValue;
  };

  const totalValue = calculatePortfolioValue();
  const initialBalance = 100000;
  const profitLoss = totalValue - initialBalance;
  const profitLossPercentage = ((profitLoss / initialBalance) * 100).toFixed(2);

  if (loading) {
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
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Wallet className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</div>
                <div className="text-2xl font-bold">${user?.balance.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profit/Loss</div>
                <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitLoss >= 0 ? '+' : ''}{profitLoss.toLocaleString()}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${profitLoss >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                {profitLoss >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
            <div className={`text-sm mt-2 ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitLoss >= 0 ? '+' : ''}{profitLossPercentage}%
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Trades</div>
                <div className="text-2xl font-bold">{trades.length}</div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Portfolio */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Portfolio</h2>
              <Button size="sm" onClick={() => navigate('/prices')}>
                Trade
              </Button>
            </div>

            {user?.portfolio && user.portfolio.length > 0 ? (
              <div className="space-y-4">
                {user.portfolio.map((holding) => {
                  const currentPrice = getPriceBySymbol(holding.symbol);
                  const currentValue = holding.amount * (currentPrice?.price || 0);
                  const investedValue = holding.amount * holding.averagePrice;
                  const gainLoss = currentValue - investedValue;
                  const gainLossPercent = ((gainLoss / investedValue) * 100).toFixed(2);

                  return (
                    <div
                      key={holding.symbol}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <div className="font-bold text-lg">{holding.symbol}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {holding.amount.toFixed(6)} @ ${holding.averagePrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${currentValue.toLocaleString()}</div>
                        <div className={`text-sm ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {gainLoss >= 0 ? '+' : ''}{gainLossPercent}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p className="mb-4">No positions yet</p>
                <Button onClick={() => navigate('/prices')}>
                  Start Trading
                </Button>
              </div>
            )}
          </Card>

          {/* Recent Trades */}
          <Card>
            <h2 className="text-2xl font-bold mb-6">Recent Trades</h2>

            {trades.length > 0 ? (
              <div className="space-y-3">
                {trades.map((trade) => (
                  <div
                    key={trade._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        trade.type === 'buy'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                      }`}>
                        {trade.type.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{trade.symbol}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{trade.amount} {trade.symbol}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${trade.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No trades yet
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
