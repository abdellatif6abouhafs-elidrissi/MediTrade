import express, { Request, Response } from 'express';
import Achievement, { ACHIEVEMENTS } from '../models/Achievement';
import Trade from '../models/Trade';
import User from '../models/User';
import { protect } from '../middleware/auth';

const router = express.Router();

// Helper function to unlock achievement
const unlockAchievement = async (userId: string, achievementId: string) => {
  try {
    const existing = await Achievement.findOne({ user: userId, achievementId });
    if (!existing) {
      const achievement = await Achievement.create({
        user: userId,
        achievementId,
      });
      return achievement;
    }
    return null;
  } catch (error) {
    // Duplicate key error - already unlocked
    return null;
  }
};

// @route   GET /api/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const userAchievements = await Achievement.find({ user: (req as any).user._id });

    // Map achievements with full details
    const unlockedIds = userAchievements.map(a => a.achievementId);

    const allAchievements = Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
      unlockedAt: userAchievements.find(a => a.achievementId === achievement.id)?.unlockedAt,
    }));

    // Group by category
    const grouped = {
      trading: allAchievements.filter(a => a.category === 'trading'),
      profit: allAchievements.filter(a => a.category === 'profit'),
      portfolio: allAchievements.filter(a => a.category === 'portfolio'),
      diversity: allAchievements.filter(a => a.category === 'diversity'),
      special: allAchievements.filter(a => a.category === 'special'),
    };

    const stats = {
      total: Object.keys(ACHIEVEMENTS).length,
      unlocked: unlockedIds.length,
      percentage: Math.round((unlockedIds.length / Object.keys(ACHIEVEMENTS).length) * 100),
    };

    res.status(200).json({
      success: true,
      stats,
      achievements: grouped,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message,
    });
  }
});

// @route   POST /api/achievements/check
// @desc    Check and unlock any new achievements for user
// @access  Private
router.post('/check', protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const newAchievements: any[] = [];

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get trade stats
    const trades = await Trade.find({ userId: userId });
    const totalTrades = trades.length;

    // Calculate profit from sell trades (simple estimation)
    const sellTrades = trades.filter(t => t.type === 'sell');
    const totalProfit = sellTrades.reduce((sum, t) => sum + t.total, 0) * 0.1; // Estimate 10% profit on sells

    // Get holdings from portfolio
    const portfolio = user.portfolio || [];
    const holdingsCount = portfolio.filter((h) => h.amount > 0).length;

    // Calculate portfolio value (balance + holdings value)
    const portfolioValue = user.balance + portfolio.reduce((sum: number, h) => sum + (h.amount * (h.averagePrice || 0)), 0);

    // Check trading achievements
    if (totalTrades >= 1) {
      const result = await unlockAchievement(userId, 'first_trade');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.FIRST_TRADE, unlockedAt: result.unlockedAt });
    }
    if (totalTrades >= 10) {
      const result = await unlockAchievement(userId, 'trader_10');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.TRADER_10, unlockedAt: result.unlockedAt });
    }
    if (totalTrades >= 50) {
      const result = await unlockAchievement(userId, 'trader_50');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.TRADER_50, unlockedAt: result.unlockedAt });
    }
    if (totalTrades >= 100) {
      const result = await unlockAchievement(userId, 'trader_100');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.TRADER_100, unlockedAt: result.unlockedAt });
    }
    if (totalTrades >= 500) {
      const result = await unlockAchievement(userId, 'trader_500');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.TRADER_500, unlockedAt: result.unlockedAt });
    }

    // Check profit achievements (based on sell trades)
    if (sellTrades.length >= 1) {
      const result = await unlockAchievement(userId, 'first_profit');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.FIRST_PROFIT, unlockedAt: result.unlockedAt });
    }
    if (totalProfit >= 1000) {
      const result = await unlockAchievement(userId, 'profit_1k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PROFIT_1K, unlockedAt: result.unlockedAt });
    }
    if (totalProfit >= 10000) {
      const result = await unlockAchievement(userId, 'profit_10k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PROFIT_10K, unlockedAt: result.unlockedAt });
    }
    if (totalProfit >= 100000) {
      const result = await unlockAchievement(userId, 'profit_100k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PROFIT_100K, unlockedAt: result.unlockedAt });
    }

    // Check portfolio achievements
    if (portfolioValue >= 10000) {
      const result = await unlockAchievement(userId, 'portfolio_10k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PORTFOLIO_10K, unlockedAt: result.unlockedAt });
    }
    if (portfolioValue >= 50000) {
      const result = await unlockAchievement(userId, 'portfolio_50k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PORTFOLIO_50K, unlockedAt: result.unlockedAt });
    }
    if (portfolioValue >= 100000) {
      const result = await unlockAchievement(userId, 'portfolio_100k');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PORTFOLIO_100K, unlockedAt: result.unlockedAt });
    }
    if (portfolioValue >= 1000000) {
      const result = await unlockAchievement(userId, 'portfolio_1m');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.PORTFOLIO_1M, unlockedAt: result.unlockedAt });
    }

    // Check diversity achievements
    if (holdingsCount >= 3) {
      const result = await unlockAchievement(userId, 'diversified_3');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.DIVERSIFIED_3, unlockedAt: result.unlockedAt });
    }
    if (holdingsCount >= 5) {
      const result = await unlockAchievement(userId, 'diversified_5');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.DIVERSIFIED_5, unlockedAt: result.unlockedAt });
    }
    if (holdingsCount >= 10) {
      const result = await unlockAchievement(userId, 'diversified_all');
      if (result) newAchievements.push({ ...ACHIEVEMENTS.DIVERSIFIED_ALL, unlockedAt: result.unlockedAt });
    }

    // Early bird achievement (auto-unlock for all users)
    const earlyBird = await unlockAchievement(userId, 'early_bird');
    if (earlyBird) newAchievements.push({ ...ACHIEVEMENTS.EARLY_BIRD, unlockedAt: earlyBird.unlockedAt });

    res.status(200).json({
      success: true,
      newAchievements,
      message: newAchievements.length > 0
        ? `Unlocked ${newAchievements.length} new achievement(s)!`
        : 'No new achievements unlocked',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking achievements',
      error: error.message,
    });
  }
});

// @route   GET /api/achievements/recent
// @desc    Get recently unlocked achievements (for notifications)
// @access  Private
router.get('/recent', protect, async (req: Request, res: Response) => {
  try {
    const recentAchievements = await Achievement.find({ user: (req as any).user._id })
      .sort({ unlockedAt: -1 })
      .limit(5);

    const achievements = recentAchievements.map(a => {
      const details = Object.values(ACHIEVEMENTS).find(ach => ach.id === a.achievementId);
      return {
        ...details,
        unlockedAt: a.unlockedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: achievements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent achievements',
      error: error.message,
    });
  }
});

// @route   GET /api/achievements/leaderboard
// @desc    Get achievements leaderboard
// @access  Public
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const leaderboard = await Achievement.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$user.name',
          percentage: {
            $multiply: [{ $divide: ['$count', Object.keys(ACHIEVEMENTS).length] }, 100],
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements leaderboard',
      error: error.message,
    });
  }
});

export default router;
