import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  condition: string;
}

interface AchievementState {
  achievements: Achievement[];
  checkAndUnlock: (stats: {
    totalTrades: number;
    totalVolume: number;
    winRate: number;
    portfolioValue: number;
    profitLoss: number;
  }) => Achievement | null;
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first_trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    icon: '🎯',
    unlockedAt: null,
    condition: 'totalTrades >= 1',
  },
  {
    id: 'trader_10',
    title: 'Active Trader',
    description: 'Complete 10 trades',
    icon: '📈',
    unlockedAt: null,
    condition: 'totalTrades >= 10',
  },
  {
    id: 'trader_50',
    title: 'Trading Pro',
    description: 'Complete 50 trades',
    icon: '🏆',
    unlockedAt: null,
    condition: 'totalTrades >= 50',
  },
  {
    id: 'volume_10k',
    title: 'Big Spender',
    description: 'Trade $10,000 in volume',
    icon: '💰',
    unlockedAt: null,
    condition: 'totalVolume >= 10000',
  },
  {
    id: 'volume_100k',
    title: 'Whale Alert',
    description: 'Trade $100,000 in volume',
    icon: '🐋',
    unlockedAt: null,
    condition: 'totalVolume >= 100000',
  },
  {
    id: 'win_rate_60',
    title: 'Sharp Shooter',
    description: 'Achieve 60% win rate',
    icon: '🎯',
    unlockedAt: null,
    condition: 'winRate >= 60',
  },
  {
    id: 'win_rate_80',
    title: 'Trading Master',
    description: 'Achieve 80% win rate',
    icon: '👑',
    unlockedAt: null,
    condition: 'winRate >= 80',
  },
  {
    id: 'profit_1k',
    title: 'In The Green',
    description: 'Make $1,000 profit',
    icon: '💵',
    unlockedAt: null,
    condition: 'profitLoss >= 1000',
  },
  {
    id: 'profit_10k',
    title: 'Money Maker',
    description: 'Make $10,000 profit',
    icon: '💎',
    unlockedAt: null,
    condition: 'profitLoss >= 10000',
  },
  {
    id: 'portfolio_150k',
    title: 'Portfolio Growth',
    description: 'Grow portfolio to $150,000',
    icon: '🚀',
    unlockedAt: null,
    condition: 'portfolioValue >= 150000',
  },
  {
    id: 'diamond_hands',
    title: 'Diamond Hands',
    description: 'Hold through a 10% dip',
    icon: '💎🙌',
    unlockedAt: null,
    condition: 'special',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Trade after midnight',
    icon: '🦉',
    unlockedAt: null,
    condition: 'special',
  },
];

const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: defaultAchievements,

      checkAndUnlock: (stats) => {
        const { achievements } = get();
        let newlyUnlocked: Achievement | null = null;

        const updatedAchievements = achievements.map((achievement) => {
          if (achievement.unlockedAt) return achievement;

          let shouldUnlock = false;

          switch (achievement.id) {
            case 'first_trade':
              shouldUnlock = stats.totalTrades >= 1;
              break;
            case 'trader_10':
              shouldUnlock = stats.totalTrades >= 10;
              break;
            case 'trader_50':
              shouldUnlock = stats.totalTrades >= 50;
              break;
            case 'volume_10k':
              shouldUnlock = stats.totalVolume >= 10000;
              break;
            case 'volume_100k':
              shouldUnlock = stats.totalVolume >= 100000;
              break;
            case 'win_rate_60':
              shouldUnlock = stats.winRate >= 60 && stats.totalTrades >= 5;
              break;
            case 'win_rate_80':
              shouldUnlock = stats.winRate >= 80 && stats.totalTrades >= 10;
              break;
            case 'profit_1k':
              shouldUnlock = stats.profitLoss >= 1000;
              break;
            case 'profit_10k':
              shouldUnlock = stats.profitLoss >= 10000;
              break;
            case 'portfolio_150k':
              shouldUnlock = stats.portfolioValue >= 150000;
              break;
            case 'night_owl':
              const hour = new Date().getHours();
              shouldUnlock = hour >= 0 && hour < 5 && stats.totalTrades >= 1;
              break;
          }

          if (shouldUnlock) {
            newlyUnlocked = { ...achievement, unlockedAt: new Date() };
            return newlyUnlocked;
          }

          return achievement;
        });

        if (newlyUnlocked) {
          set({ achievements: updatedAchievements });
        }

        return newlyUnlocked;
      },

      getUnlockedAchievements: () => {
        return get().achievements.filter((a) => a.unlockedAt !== null);
      },

      getLockedAchievements: () => {
        return get().achievements.filter((a) => a.unlockedAt === null);
      },
    }),
    {
      name: 'meditrade-achievements',
    }
  )
);

export default useAchievementStore;
