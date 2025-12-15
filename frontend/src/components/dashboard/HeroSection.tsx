import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

interface HeroSectionProps {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  monthlyChange: number;
  userName: string;
}

const HeroSection = ({
  totalValue,
  dailyChange,
  weeklyChange,
  monthlyChange,
  userName,
}: HeroSectionProps) => {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isPositive = dailyChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-white/80 text-lg">
            {getGreeting()}, <span className="font-semibold text-white">{userName}</span>
          </span>
        </motion.div>

        {/* Main Value Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
            Total Portfolio Value
          </p>
          <div className="flex items-baseline gap-4 flex-wrap">
            <span className="text-5xl md:text-7xl font-black text-white tracking-tight">
              <AnimatedCounter
                value={totalValue}
                prefix="$"
                decimals={0}
                duration={1500}
              />
            </span>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                isPositive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-semibold">
                {isPositive ? '+' : ''}
                {dailyChange.toFixed(2)}%
              </span>
              <span className="text-white/60 text-xs">24h</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Period Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-4 md:gap-8"
        >
          <PeriodStat label="24 Hours" value={dailyChange} />
          <PeriodStat label="7 Days" value={weeklyChange} />
          <PeriodStat label="30 Days" value={monthlyChange} />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-8 right-8 hidden md:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/10" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-8 right-24 hidden md:block"
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm border border-white/10" />
      </motion.div>
    </motion.div>
  );
};

// Period stat sub-component
const PeriodStat = ({ label, value }: { label: string; value: number }) => {
  const isPositive = value >= 0;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p
        className={`text-lg md:text-xl font-bold ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {isPositive ? '+' : ''}
        {value.toFixed(2)}%
      </p>
    </div>
  );
};

export default HeroSection;
