import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, BarChart3, DollarSign, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const features = [
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Real-time Trading',
      description: 'Practice trading with live cryptocurrency price simulations',
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: '100% Risk-Free',
      description: 'Trade with virtual money, no real financial risk involved',
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Lightning Fast',
      description: 'Execute trades instantly with our high-performance platform',
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: 'Advanced Charts',
      description: 'Professional TradingView charts with technical indicators',
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: 'Multiple Coins',
      description: 'Trade popular cryptocurrencies like BTC, ETH, and more',
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Portfolio Management',
      description: 'Track your holdings and performance in real-time',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Trade Crypto{' '}
                <span className="gradient-text">Without Risk</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Learn cryptocurrency trading with our advanced simulation platform. Practice with $100,000 virtual money and master the markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/prices">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Prices
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <div className="text-2xl font-bold text-primary-600">$100K</div>
                  <div>Virtual Balance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">10+</div>
                  <div>Cryptocurrencies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">24/7</div>
                  <div>Trading</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">BTC/USD</div>
                      <div className="text-2xl font-bold">$43,250.75</div>
                    </div>
                    <div className="text-green-600 font-bold">+2.5%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ETH/USD</div>
                      <div className="text-2xl font-bold">$2,280.50</div>
                    </div>
                    <div className="text-red-600 font-bold">-1.2%</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">SOL/USD</div>
                      <div className="text-2xl font-bold">$98.45</div>
                    </div>
                    <div className="text-green-600 font-bold">+5.8%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose MediTrade?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to master cryptocurrency trading
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="mb-4 text-blue-500 dark:text-blue-400">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of traders learning and practicing their skills on MediTrade
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
