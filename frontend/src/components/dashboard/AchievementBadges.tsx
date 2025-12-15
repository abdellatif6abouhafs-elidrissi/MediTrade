import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import useAchievementStore from '../../store/achievementStore';
import GlassCard from '../ui/GlassCard';

const AchievementBadges = () => {
  const { getUnlockedAchievements, getLockedAchievements } = useAchievementStore();

  const unlocked = getUnlockedAchievements();
  const locked = getLockedAchievements();

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>
        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          {unlocked.length}/{unlocked.length + locked.length}
        </span>
      </div>

      {/* Unlocked Achievements */}
      {unlocked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Unlocked</p>
          <div className="flex flex-wrap gap-2">
            {unlocked.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="relative group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl cursor-pointer shadow-lg shadow-yellow-500/10">
                  {achievement.icon}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  <p className="font-semibold">{achievement.title}</p>
                  <p className="text-gray-400">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements Preview */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          {unlocked.length === 0 ? 'Start Trading to Unlock' : 'Locked'}
        </p>
        <div className="flex flex-wrap gap-2">
          {locked.slice(0, 6).map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer opacity-50">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                <p className="font-semibold">{achievement.title}</p>
                <p className="text-gray-400">{achievement.description}</p>
              </div>
            </motion.div>
          ))}
          {locked.length > 6 && (
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500">
              +{locked.length - 6}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round((unlocked.length / (unlocked.length + locked.length)) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / (unlocked.length + locked.length)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default AchievementBadges;
