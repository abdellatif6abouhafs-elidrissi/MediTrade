import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Lock,
  Star,
  Sparkles,
  TrendingUp,
  Wallet,
  Target,
  Award,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementStats {
  total: number;
  unlocked: number;
  percentage: number;
}

interface GroupedAchievements {
  trading: Achievement[];
  profit: Achievement[];
  portfolio: Achievement[];
  diversity: Achievement[];
  special: Achievement[];
}

const rarityColors = {
  common: {
    bg: 'from-gray-400 to-gray-500',
    border: 'border-gray-400',
    text: 'text-gray-600 dark:text-gray-400',
    glow: '',
  },
  uncommon: {
    bg: 'from-green-400 to-emerald-500',
    border: 'border-green-400',
    text: 'text-green-600 dark:text-green-400',
    glow: 'shadow-green-500/20',
  },
  rare: {
    bg: 'from-blue-400 to-indigo-500',
    border: 'border-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-500/30',
  },
  legendary: {
    bg: 'from-yellow-400 via-orange-500 to-red-500',
    border: 'border-yellow-400',
    text: 'text-yellow-600 dark:text-yellow-400',
    glow: 'shadow-yellow-500/40',
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  trading: <TrendingUp className="w-5 h-5" />,
  profit: <Wallet className="w-5 h-5" />,
  portfolio: <Target className="w-5 h-5" />,
  diversity: <Sparkles className="w-5 h-5" />,
  special: <Star className="w-5 h-5" />,
};

const categoryNames: Record<string, string> = {
  trading: 'Trading Milestones',
  profit: 'Profit Achievements',
  portfolio: 'Portfolio Goals',
  diversity: 'Diversification',
  special: 'Special Achievements',
};

const AchievementCard: React.FC<{ achievement: Achievement; index: number }> = ({
  achievement,
  index,
}) => {
  const colors = rarityColors[achievement.rarity];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        achievement.unlocked
          ? `bg-white dark:bg-gray-800 ${colors.border} shadow-lg ${colors.glow}`
          : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
      }`}
    >
      {/* Rarity Badge */}
      <div
        className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.bg}`}
      >
        {achievement.rarity}
      </div>

      {/* Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            achievement.unlocked
              ? `bg-gradient-to-br ${colors.bg} shadow-lg`
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold truncate ${
              achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
            }`}
          >
            {achievement.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Unlock Status */}
      {achievement.unlocked && achievement.unlockedAt && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Award className="w-3 h-3" />
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
};

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [achievements, setAchievements] = useState<GroupedAchievements | null>(null);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAchievements();
    checkAchievements();
  }, [isAuthenticated, navigate]);

  const fetchAchievements = async () => {
    try {
      const { data } = await apiClient.get('/achievements');
      setAchievements(data.achievements);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievements = async () => {
    setChecking(true);
    try {
      const { data } = await apiClient.post('/achievements/check');
      if (data.newAchievements && data.newAchievements.length > 0) {
        setNewUnlocks(data.newAchievements);
        // Refresh achievements list
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Achievements
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Complete challenges and earn badges
          </p>
        </motion.div>

        {/* New Unlocks Banner */}
        {newUnlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="font-bold text-gray-900 dark:text-white">New Achievements Unlocked!</span>
              <div className="flex gap-2 flex-wrap">
                {newUnlocks.map((a) => (
                  <span
                    key={a.id}
                    className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium"
                  >
                    {a.icon} {a.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-black text-primary-600">{stats.unlocked}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Achievements Unlocked</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-black text-gray-600 dark:text-gray-400">{stats.total}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Achievements</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-black text-yellow-500">{stats.percentage}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
              {/* Progress Bar */}
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievement Categories */}
        {achievements && (
          <div className="space-y-8">
            {Object.entries(achievements).map(([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-500">
                    {categoryIcons[category]}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {categoryNames[category]}
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    ({(items as Achievement[]).filter((a: Achievement) => a.unlocked).length}/{(items as Achievement[]).length})
                  </div>
                </div>

                {/* Achievement Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(items as Achievement[]).map((achievement: Achievement, index: number) => (
                    <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Check Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <button
            onClick={checkAchievements}
            disabled={checking}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {checking ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Checking...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Check for New Achievements
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Achievements;
