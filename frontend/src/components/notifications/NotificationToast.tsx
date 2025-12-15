import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, CheckCircle, AlertCircle, Bell } from 'lucide-react';
import useNotificationStore from '../../store/notificationStore';
import type { Notification } from '../../store/notificationStore';

const NotificationToast = () => {
  const { toasts, removeToast } = useNotificationStore();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert':
        return <TrendingUp className="w-5 h-5" />;
      case 'trade_executed':
        return <CheckCircle className="w-5 h-5" />;
      case 'achievement':
        return <Bell className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert':
        return {
          bg: 'bg-amber-100 dark:bg-amber-900/30',
          icon: 'text-amber-600',
          border: 'border-amber-200 dark:border-amber-800',
        };
      case 'trade_executed':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          icon: 'text-green-600',
          border: 'border-green-200 dark:border-green-800',
        };
      case 'achievement':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          icon: 'text-purple-600',
          border: 'border-purple-200 dark:border-purple-800',
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          icon: 'text-blue-600',
          border: 'border-blue-200 dark:border-blue-800',
        };
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = getColors(toast.type);

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto glass-card p-4 min-w-[320px] max-w-md border ${colors.border} shadow-xl`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-full ${colors.bg}`}>
                  <span className={colors.icon}>{getIcon(toast.type)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {toast.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
