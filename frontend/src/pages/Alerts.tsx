import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Info } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import PriceAlertManager from '../components/alerts/PriceAlertManager';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { fetchPrices } = usePriceStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, fetchPrices]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Price Alerts
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Get notified when prices reach your targets
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">How Price Alerts Work</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600 dark:text-blue-400">
                <li>Set a target price and condition (above/below)</li>
                <li>You'll be notified when the price reaches your target</li>
                <li>Maximum 10 active alerts at a time</li>
                <li>Alerts are checked automatically every 5 seconds</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Price Alert Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PriceAlertManager />
        </motion.div>
      </div>
    </div>
  );
};

export default Alerts;
