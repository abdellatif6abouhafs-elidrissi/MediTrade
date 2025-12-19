import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator as CalcIcon,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Info,
} from 'lucide-react';
import { usePriceStore } from '../store/priceStore';
import Card from '../components/ui/Card';

type CalculatorMode = 'profit' | 'converter' | 'dca';

const Calculator: React.FC = () => {
  const { prices, fetchPrices } = usePriceStore();
  const [mode, setMode] = useState<CalculatorMode>('profit');

  // Profit Calculator State
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [profitResult, setProfitResult] = useState<{
    profit: number;
    percentage: number;
    finalValue: number;
  } | null>(null);

  // Converter State
  const [fromCoin, setFromCoin] = useState('BTC');
  const [toCoin, setToCoin] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');

  // DCA Calculator State
  const [dcaCoin, setDcaCoin] = useState('BTC');
  const [dcaAmount, setDcaAmount] = useState('100');
  const [dcaFrequency, setDcaFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dcaDuration, setDcaDuration] = useState('12');
  const [dcaResult, setDcaResult] = useState<{
    totalInvested: number;
    estimatedValue: number;
    coinsAccumulated: number;
  } | null>(null);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Calculate Profit/Loss
  const calculateProfit = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const investment = parseFloat(investmentAmount);

    if (isNaN(buy) || isNaN(sell) || isNaN(investment) || buy === 0) {
      return;
    }

    const coinsOwned = investment / buy;
    const finalValue = coinsOwned * sell;
    const profit = finalValue - investment;
    const percentage = ((sell - buy) / buy) * 100;

    setProfitResult({ profit, percentage, finalValue });
  };

  // Convert between coins
  useEffect(() => {
    if (prices.length > 0 && fromAmount) {
      const fromPrice = prices.find((p) => p.symbol === fromCoin)?.price || 0;
      const toPrice = prices.find((p) => p.symbol === toCoin)?.price || 0;

      if (fromPrice > 0 && toPrice > 0) {
        const amount = parseFloat(fromAmount) || 0;
        const usdValue = amount * fromPrice;
        const result = usdValue / toPrice;
        setToAmount(result.toFixed(8));
      }
    }
  }, [fromCoin, toCoin, fromAmount, prices]);

  // Swap coins
  const swapCoins = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
    setFromAmount(toAmount);
  };

  // Calculate DCA
  const calculateDCA = () => {
    const amount = parseFloat(dcaAmount);
    const months = parseFloat(dcaDuration);
    const coinPrice = prices.find((p) => p.symbol === dcaCoin)?.price || 0;

    if (isNaN(amount) || isNaN(months) || coinPrice === 0) return;

    let periods = months;
    if (dcaFrequency === 'weekly') periods = months * 4;
    if (dcaFrequency === 'daily') periods = months * 30;

    const totalInvested = amount * periods;
    const coinsAccumulated = totalInvested / coinPrice;
    // Estimate with average 5% monthly growth
    const growthRate = 1.05;
    const estimatedValue = coinsAccumulated * coinPrice * Math.pow(growthRate, months);

    setDcaResult({ totalInvested, estimatedValue, coinsAccumulated });
  };

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const tabs = [
    { id: 'profit', label: 'Profit/Loss', icon: TrendingUp },
    { id: 'converter', label: 'Converter', icon: ArrowRightLeft },
    { id: 'dca', label: 'DCA Calculator', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <CalcIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Calculate profits, convert coins, and plan your DCA
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as CalculatorMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                mode === tab.id
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Profit/Loss Calculator */}
        {mode === 'profit' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Profit/Loss Calculator
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buy Price ($)
                  </label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sell Price ($)
                  </label>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <button
                  onClick={calculateProfit}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                >
                  Calculate
                </button>

                {profitResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl ${
                      profitResult.profit >= 0
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit/Loss</p>
                        <p
                          className={`text-lg font-bold ${
                            profitResult.profit >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {profitResult.profit >= 0 ? '+' : ''}
                          {formatNumber(profitResult.profit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Percentage</p>
                        <p
                          className={`text-lg font-bold flex items-center justify-center gap-1 ${
                            profitResult.percentage >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {profitResult.percentage >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(profitResult.percentage).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Final Value</p>
                        <p className="text-lg font-bold">{formatNumber(profitResult.finalValue)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Converter */}
        {mode === 'converter' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                Crypto Converter
              </h2>

              <div className="space-y-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={fromCoin}
                      onChange={(e) => setFromCoin(e.target.value)}
                      className="w-32 px-3 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {prices.map((p) => (
                        <option key={p.symbol} value={p.symbol}>
                          {p.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="1"
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapCoins}
                    className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={toCoin}
                      onChange={(e) => setToCoin(e.target.value)}
                      className="w-32 px-3 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {prices.map((p) => (
                        <option key={p.symbol} value={p.symbol}>
                          {p.symbol}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={toAmount}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>

                {/* Rate Info */}
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1 {fromCoin} ={' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {(
                        (prices.find((p) => p.symbol === fromCoin)?.price || 0) /
                        (prices.find((p) => p.symbol === toCoin)?.price || 1)
                      ).toFixed(8)}{' '}
                      {toCoin}
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* DCA Calculator */}
        {mode === 'dca' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-500" />
                DCA Calculator
              </h2>

              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                <p className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Dollar Cost Averaging (DCA) - invest fixed amounts regularly to reduce volatility impact
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Coin
                  </label>
                  <select
                    value={dcaCoin}
                    onChange={(e) => setDcaCoin(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {prices.map((p) => (
                      <option key={p.symbol} value={p.symbol}>
                        {p.symbol} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount per Period ($)
                  </label>
                  <input
                    type="number"
                    value={dcaAmount}
                    onChange={(e) => setDcaAmount(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setDcaFrequency(freq)}
                        className={`py-2 px-4 rounded-xl font-medium capitalize transition-all ${
                          dcaFrequency === freq
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    value={dcaDuration}
                    onChange={(e) => setDcaDuration(e.target.value)}
                    placeholder="12"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <button
                  onClick={calculateDCA}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors"
                >
                  Calculate DCA
                </button>

                {dcaResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Total Invested
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {formatNumber(dcaResult.totalInvested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {dcaCoin} Accumulated
                        </p>
                        <p className="text-lg font-bold">
                          {dcaResult.coinsAccumulated.toFixed(6)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Est. Value*
                        </p>
                        <p className="text-lg font-bold text-green-500">
                          {formatNumber(dcaResult.estimatedValue)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                      *Estimated with 5% monthly growth assumption
                    </p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
