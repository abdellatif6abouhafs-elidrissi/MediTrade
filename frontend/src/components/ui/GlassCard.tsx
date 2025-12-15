import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'primary' | 'success' | 'danger' | 'purple' | 'none';
  glow?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const GlassCard = ({
  children,
  className = '',
  gradient = 'none',
  glow = false,
  hover = true,
  padding = 'md',
  onClick,
}: GlassCardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const glowClasses = {
    primary: 'glow-primary',
    success: 'glow-success',
    danger: 'glow-danger',
    purple: 'glow-purple',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`
        glass-card
        ${paddingClasses[padding]}
        ${glow ? glowClasses[gradient] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
