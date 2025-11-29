import React from 'react';
import { TrendingUp } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold gradient-text">MediTrade</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your trusted platform for cryptocurrency trading simulation. Practice trading with virtual money and learn the markets risk-free.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/prices" className="hover:text-primary-600">Prices</a></li>
              <li><a href="/trade" className="hover:text-primary-600">Trade</a></li>
              <li><a href="/dashboard" className="hover:text-primary-600">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-600">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 MediTrade. All rights reserved. This is a simulation platform for educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
