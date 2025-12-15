import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  colorize?: boolean;
}

const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1000,
  decimals = 2,
  className = '',
  colorize = false,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);

  useEffect(() => {
    const startValue = previousValue.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (value - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formattedValue = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const colorClass = colorize
    ? value >= 0
      ? 'text-green-500'
      : 'text-red-500'
    : '';

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`font-bold tabular-nums ${colorClass} ${className}`}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
