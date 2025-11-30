import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import apiClient from '../api/client';

const Trade: React.FC = () => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('symbol') || 'BTC';
  const { isAuthenticated, user, updateBalance, fetchUser } = useAuthStore();
  const { fetchPrices, getPriceBySymbol } = usePriceStore();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentPrice = getPriceBySymbol(symbol);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  useEffect(() => {
    // Load TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      new (window as any).TradingView.widget({
        width: '100%',
        height: 500,
        symbol: `BINANCE:${symbol}USDT`,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [symbol]);

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setMessage({ type: 'error', text: 'Please login to trade' });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { data } = await apiClient.post(`/trades/${tradeType}`, {
        symbol,
        amount: parseFloat(amount),
        price: currentPrice?.price,
      });

      setMessage({
        type: 'success',
        text: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${symbol}`
      });
      setAmount('');
      updateBalance(data.balance);
      await fetchUser();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Trade failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const total = amount && currentPrice ? parseFloat(amount) * currentPrice.price : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-2">Trade {symbol}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentPrice?.name} Trading Terminal
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card padding="sm">
              {currentPrice && (
                <div className="flex items-center justify-between mb-4 p-4">
                  <div>
                    <div className="text-3xl font-bold">
                      ${currentPrice.price.toLocaleString()}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {currentPrice.name} Price
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 text-lg font-semibold ${
                    currentPrice.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentPrice.change24h >= 0 ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                    <span>{currentPrice.change24h.toFixed(2)}%</span>
                  </div>
                </div>
              )}
              <div id="tradingview_chart" className="rounded-lg overflow-hidden"></div>
            </Card>
          </div>

          {/* Trading Panel */}
          <div>
            <Card>
              <h2 className="text-2xl font-bold mb-6">Place Order</h2>

              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please login to start trading
                  </p>
                  <Button onClick={() => window.location.href = '/login'}>
                    Login
                  </Button>
                </div>
              ) : (
                <>
                  {/* Trade Type Tabs */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setTradeType('buy')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                        tradeType === 'buy'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTradeType('sell')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                        tradeType === 'sell'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {/* Balance Info */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Available Balance</div>
                    <div className="text-2xl font-bold">${user?.balance.toLocaleString()}</div>
                  </div>

                  {/* Order Form */}
                  <form onSubmit={handleTrade} className="space-y-4">
                    <Input
                      type="number"
                      label={`Amount (${symbol})`}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.00001"
                      min="0"
                      required
                    />

                    {currentPrice && amount && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Price per {symbol}</span>
                          <span className="font-semibold">${currentPrice.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-400">Total</span>
                          <span className="font-bold text-lg">${total.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {message && (
                      <div className={`p-3 rounded-lg text-sm ${
                        message.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant={tradeType === 'buy' ? 'success' : 'danger'}
                      fullWidth
                      loading={loading}
                    >
                      {tradeType === 'buy' ? 'Buy' : 'Sell'} {symbol}
                    </Button>
                  </form>
                </>
              )}
            </Card>

            {/* Market Stats */}
            {currentPrice && (
              <Card className="mt-6">
                <h3 className="font-bold mb-4">Market Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">24h Change</span>
                    <span className={currentPrice.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {currentPrice.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                    <span className="font-semibold">${(currentPrice.volume24h / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                    <span className="font-semibold">${(currentPrice.marketCap / 1000000000).toFixed(1)}B</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;
