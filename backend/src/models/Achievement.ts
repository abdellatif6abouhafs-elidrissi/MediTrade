import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  user: mongoose.Types.ObjectId;
  achievementId: string;
  unlockedAt: Date;
}

// Achievement definitions
export const ACHIEVEMENTS = {
  // Trading milestones
  FIRST_TRADE: {
    id: 'first_trade',
    name: 'First Steps',
    description: 'Complete your first trade',
    icon: '🎯',
    category: 'trading',
    rarity: 'common',
  },
  TRADER_10: {
    id: 'trader_10',
    name: 'Getting Started',
    description: 'Complete 10 trades',
    icon: '📈',
    category: 'trading',
    rarity: 'common',
  },
  TRADER_50: {
    id: 'trader_50',
    name: 'Active Trader',
    description: 'Complete 50 trades',
    icon: '🔥',
    category: 'trading',
    rarity: 'uncommon',
  },
  TRADER_100: {
    id: 'trader_100',
    name: 'Trading Pro',
    description: 'Complete 100 trades',
    icon: '⚡',
    category: 'trading',
    rarity: 'rare',
  },
  TRADER_500: {
    id: 'trader_500',
    name: 'Trading Legend',
    description: 'Complete 500 trades',
    icon: '👑',
    category: 'trading',
    rarity: 'legendary',
  },

  // Profit milestones
  FIRST_PROFIT: {
    id: 'first_profit',
    name: 'In The Green',
    description: 'Make your first profitable trade',
    icon: '💚',
    category: 'profit',
    rarity: 'common',
  },
  PROFIT_1K: {
    id: 'profit_1k',
    name: 'Thousand Dollar Club',
    description: 'Earn $1,000 in total profits',
    icon: '💰',
    category: 'profit',
    rarity: 'uncommon',
  },
  PROFIT_10K: {
    id: 'profit_10k',
    name: 'Big Earner',
    description: 'Earn $10,000 in total profits',
    icon: '💎',
    category: 'profit',
    rarity: 'rare',
  },
  PROFIT_100K: {
    id: 'profit_100k',
    name: 'Whale Status',
    description: 'Earn $100,000 in total profits',
    icon: '🐋',
    category: 'profit',
    rarity: 'legendary',
  },

  // Portfolio milestones
  PORTFOLIO_10K: {
    id: 'portfolio_10k',
    name: 'Building Wealth',
    description: 'Reach $10,000 portfolio value',
    icon: '📊',
    category: 'portfolio',
    rarity: 'common',
  },
  PORTFOLIO_50K: {
    id: 'portfolio_50k',
    name: 'Serious Investor',
    description: 'Reach $50,000 portfolio value',
    icon: '🏆',
    category: 'portfolio',
    rarity: 'uncommon',
  },
  PORTFOLIO_100K: {
    id: 'portfolio_100k',
    name: 'Six Figure Club',
    description: 'Reach $100,000 portfolio value',
    icon: '🌟',
    category: 'portfolio',
    rarity: 'rare',
  },
  PORTFOLIO_1M: {
    id: 'portfolio_1m',
    name: 'Millionaire',
    description: 'Reach $1,000,000 portfolio value',
    icon: '🎖️',
    category: 'portfolio',
    rarity: 'legendary',
  },

  // Diversity achievements
  DIVERSIFIED_3: {
    id: 'diversified_3',
    name: 'Diversifying',
    description: 'Hold 3 different cryptocurrencies',
    icon: '🎨',
    category: 'diversity',
    rarity: 'common',
  },
  DIVERSIFIED_5: {
    id: 'diversified_5',
    name: 'Well Balanced',
    description: 'Hold 5 different cryptocurrencies',
    icon: '⚖️',
    category: 'diversity',
    rarity: 'uncommon',
  },
  DIVERSIFIED_ALL: {
    id: 'diversified_all',
    name: 'Collector',
    description: 'Hold all available cryptocurrencies',
    icon: '🏅',
    category: 'diversity',
    rarity: 'rare',
  },

  // Special achievements
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Join MediTrade platform',
    icon: '🐣',
    category: 'special',
    rarity: 'common',
  },
  DIAMOND_HANDS: {
    id: 'diamond_hands',
    name: 'Diamond Hands',
    description: 'Hold a position for 7 days without selling',
    icon: '💎',
    category: 'special',
    rarity: 'uncommon',
  },
  TOP_10: {
    id: 'top_10',
    name: 'Top Performer',
    description: 'Reach top 10 on the leaderboard',
    icon: '🥇',
    category: 'special',
    rarity: 'rare',
  },
  TOP_3: {
    id: 'top_3',
    name: 'Elite Trader',
    description: 'Reach top 3 on the leaderboard',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
  },
};

const AchievementSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievementId: {
    type: String,
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicates
AchievementSchema.index({ user: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
