import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import useDashboardStore from '../store/dashboardStore';
import useAchievementStore from '../store/achievementStore';
import apiClient from '../api/client';

// Premium Components
import HeroSection from '../components/dashboard/HeroSection';
import StatsGrid from '../components/dashboard/StatsGrid';
import PortfolioTable from '../components/dashboard/PortfolioTable';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTrades from '../components/dashboard/RecentTrades';
import AchievementBadges from '../components/dashboard/AchievementBadges';
import PortfolioAreaChart from '../components/charts/PortfolioAreaChart';
import AssetAllocationPie from '../components/charts/AssetAllocationPie';
import NotificationToast from '../components/notifications/NotificationToast';
import GlassCard from '../components/ui/GlassCard';
import Skeleton from '../components/ui/Skeleton';
import Confetti from '../components/ui/Confetti';

// Hooks
import { usePriceAlerts } from '../hooks/usePriceAlerts';

interface Trade {
  _id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  createdAt: string;
}

interface PortfolioHolding {
  symbol: string;
  amount: number;
  averagePrice: number;
}

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const { prices, fetchPrices, getPriceBySymbol } = usePriceStore();
  const {
    portfolioHistory,
    selectedTimeframe,
    setTimeframe,
    generatePortfolioHistory,
    tradeStats,
    calculateTradeStats,
    expandedHolding,
    toggleHoldingExpanded,
    sortColumn,
    sortOrder,
    setSorting,
  } = useDashboardStore();
  const { checkAndUnlock } = useAchievementStore();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Price alerts hook
  const cryptoPrices = useMemo(() =>
    prices.map(p => ({
      symbol: p.symbol,
      name: p.name,
      price: p.price,
      change24h: p.change24h,
    })),
    [prices]
  );
  usePriceAlerts(cryptoPrices);

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
      setAllTrades(data.data);
      setTrades(data.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to load trades:', error);
    }
  };

  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    if (!user?.portfolio || !prices.length) return user?.balance || 0;

    const portfolioValue = user.portfolio.reduce((total: number, holding: PortfolioHolding) => {
      const currentPrice = getPriceBySymbol(holding.symbol);
      return total + (holding.amount * (currentPrice?.price || 0));
    }, 0);

    return user.balance + portfolioValue;
  };

  const totalValue = calculatePortfolioValue();
  const initialBalance = 100000;
  const profitLoss = totalValue - initialBalance;
  const profitLossPercentage = (profitLoss / initialBalance) * 100;

  // Generate portfolio history for chart when data is ready
  useEffect(() => {
    if (totalValue > 0 && !loading) {
      generatePortfolioHistory(totalValue, selectedTimeframe);
    }
  }, [totalValue, loading, selectedTimeframe]);

  // Calculate trade stats
  useEffect(() => {
    if (allTrades.length > 0) {
      calculateTradeStats(allTrades);
    }
  }, [allTrades]);

  // Check achievements when stats change
  useEffect(() => {
    if (tradeStats && totalValue > 0) {
      const unlockedAchievement = checkAndUnlock({
        totalTrades: tradeStats.totalTrades,
        totalVolume: tradeStats.totalVolume,
        winRate: tradeStats.winRate,
        portfolioValue: totalValue,
        profitLoss: profitLoss,
      });

      if (unlockedAchievement) {
        setShowConfetti(true);
      }
    }
  }, [tradeStats, totalValue, profitLoss]);

  // Handle confetti completion
  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  // Handle timeframe change
  const handleTimeframeChange = (timeframe: '24h' | '7d' | '30d' | '1y') => {
    setTimeframe(timeframe);
    if (totalValue > 0) {
      generatePortfolioHistory(totalValue, timeframe);
    }
  };

  // Prepare portfolio table data
  const portfolioTableData = useMemo(() => {
    if (!user?.portfolio) return [];

    return user.portfolio.map((holding: PortfolioHolding) => {
      const currentPrice = getPriceBySymbol(holding.symbol);
      const value = holding.amount * (currentPrice?.price || 0);
      const gainLoss = value - (holding.amount * holding.averagePrice);
      const gainLossPercent = holding.averagePrice > 0
        ? ((currentPrice?.price || 0) - holding.averagePrice) / holding.averagePrice * 100
        : 0;

      return {
        symbol: holding.symbol,
        name: currentPrice?.name || holding.symbol,
        amount: holding.amount,
        averagePrice: holding.averagePrice,
        currentPrice: currentPrice?.price || 0,
        value,
        gainLoss,
        gainLossPercent,
      };
    });
  }, [user?.portfolio, prices]);

  // Prepare asset allocation data
  const allocationData = useMemo(() => {
    if (!user?.portfolio || !prices.length) return [];

    const holdings = user.portfolio.map((holding: PortfolioHolding) => {
      const currentPrice = getPriceBySymbol(holding.symbol);
      const value = holding.amount * (currentPrice?.price || 0);
      return {
        symbol: holding.symbol,
        name: currentPrice?.name || holding.symbol,
        value,
        percentage: 0, // Will be calculated by the component
      };
    });

    // Add cash balance
    if (user.balance > 0) {
      holdings.push({
        symbol: 'USD',
        name: 'US Dollar',
        value: user.balance,
        percentage: 0,
      });
    }

    return holdings;
  }, [user?.portfolio, user?.balance, prices]);

  // Favorite symbols for quick actions
  const favoriteSymbols = useMemo(() => {
    const symbols = user?.portfolio?.map((h: PortfolioHolding) => h.symbol) || [];
    const defaultSymbols = ['BTC', 'ETH', 'SOL', 'XRP'];
    return [...new Set([...symbols, ...defaultSymbols])].slice(0, 4);
  }, [user?.portfolio]);

  // Calculate period changes for hero section
  const dailyChange = profitLossPercentage * 0.1; // Simulated daily change
  const weeklyChange = profitLossPercentage * 0.4; // Simulated weekly change
  const monthlyChange = profitLossPercentage; // Actual monthly (total) change

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 space-y-6">
          {/* Hero Skeleton */}
          <Skeleton className="h-48 w-full rounded-2xl" />

          {/* Charts Skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <HeroSection
              userName={user?.name || 'Trader'}
              totalValue={totalValue}
              dailyChange={dailyChange}
              weeklyChange={weeklyChange}
              monthlyChange={monthlyChange}
            />
          </motion.div>

          {/* Charts Section */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
            {/* Portfolio Chart - 2/3 width */}
            <div className="lg:col-span-2">
              <GlassCard className="h-full">
                <PortfolioAreaChart
                  data={portfolioHistory}
                  timeframe={selectedTimeframe}
                  onTimeframeChange={handleTimeframeChange}
                  height={300}
                />
              </GlassCard>
            </div>

            {/* Asset Allocation - 1/3 width */}
            <div>
              <GlassCard className="h-full">
                <AssetAllocationPie
                  holdings={allocationData}
                  showLegend={false}
                />
              </GlassCard>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants}>
            <StatsGrid stats={tradeStats} />
          </motion.div>

          {/* Portfolio Table & Quick Actions */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
            {/* Portfolio Table - 2/3 width */}
            <div className="lg:col-span-2">
              <PortfolioTable
                holdings={portfolioTableData}
                expandedRow={expandedHolding}
                onToggleExpand={toggleHoldingExpanded}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={setSorting}
              />
            </div>

            {/* Quick Actions & Recent Trades - 1/3 width */}
            <div className="space-y-6">
              <QuickActions
                favoriteSymbols={favoriteSymbols}
                balance={user?.balance || 0}
              />
              <AchievementBadges />
              <RecentTrades trades={trades} maxItems={5} />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Confetti Animation */}
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />

      {/* Notification Toast Container */}
      <NotificationToast />
    </div>
  );
};

export default Dashboard;
