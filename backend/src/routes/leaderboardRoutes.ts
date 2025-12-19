import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// Mock prices for portfolio calculation (in production, fetch from price API)
const MOCK_PRICES: Record<string, number> = {
  BTC: 43250,
  ETH: 2280,
  SOL: 98,
  XRP: 0.62,
  ADA: 0.58,
  DOGE: 0.08,
  DOT: 7.5,
  AVAX: 35,
  MATIC: 0.85,
  LINK: 14,
};

// Calculate portfolio value for a user
const calculatePortfolioValue = (user: any): number => {
  let portfolioValue = 0;

  if (user.portfolio && user.portfolio.length > 0) {
    for (const holding of user.portfolio) {
      const price = MOCK_PRICES[holding.symbol] || 0;
      portfolioValue += holding.amount * price;
    }
  }

  return user.balance + portfolioValue;
};

// @route   GET /api/leaderboard
// @desc    Get top traders leaderboard
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const skip = (page - 1) * limit;

    // Get all users (excluding password)
    const users = await User.find({ role: 'user' })
      .select('-password')
      .lean();

    // Calculate total value for each user and create leaderboard
    const leaderboard = users.map((user: any) => {
      const totalValue = calculatePortfolioValue(user);
      const initialBalance = 100000;
      const profitLoss = totalValue - initialBalance;
      const profitLossPercent = (profitLoss / initialBalance) * 100;

      return {
        _id: user._id,
        name: user.name,
        totalValue,
        profitLoss,
        profitLossPercent,
        holdingsCount: user.portfolio?.length || 0,
        joinedAt: user.createdAt,
      };
    });

    // Sort by total value (descending)
    leaderboard.sort((a, b) => b.totalValue - a.totalValue);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Paginate
    const paginatedLeaderboard = rankedLeaderboard.slice(skip, skip + limit);
    const totalTraders = rankedLeaderboard.length;

    // Get stats
    const stats = {
      totalTraders,
      totalVolume: rankedLeaderboard.reduce((sum, t) => sum + t.totalValue, 0),
      avgProfit: rankedLeaderboard.reduce((sum, t) => sum + t.profitLossPercent, 0) / totalTraders || 0,
      profitableTraders: rankedLeaderboard.filter(t => t.profitLoss > 0).length,
    };

    res.status(200).json({
      success: true,
      data: paginatedLeaderboard,
      stats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalTraders / limit),
        totalTraders,
      },
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message,
    });
  }
});

// @route   GET /api/leaderboard/top
// @desc    Get top 3 traders
// @access  Public
router.get('/top', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .lean();

    const leaderboard = users.map((user: any) => {
      const totalValue = calculatePortfolioValue(user);
      const initialBalance = 100000;
      const profitLoss = totalValue - initialBalance;
      const profitLossPercent = (profitLoss / initialBalance) * 100;

      return {
        _id: user._id,
        name: user.name,
        totalValue,
        profitLoss,
        profitLossPercent,
      };
    });

    leaderboard.sort((a, b) => b.totalValue - a.totalValue);

    const top3 = leaderboard.slice(0, 3).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    res.status(200).json({
      success: true,
      data: top3,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top traders',
    });
  }
});

export default router;
