import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X, TrendingUp } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import NotificationBell from '../notifications/NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold gradient-text">MediTrade</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/prices" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Prices
            </Link>
            <Link to="/trade" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Trade
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated && <NotificationBell />}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.name}
                </span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-3">
                <Link to="/prices" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Prices
                </Link>
                <Link to="/trade" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
                  Trade
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
                      Dashboard
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">
                        Admin
                      </Link>
                    )}
                  </>
                )}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  {isAuthenticated && <NotificationBell />}
                  {isAuthenticated ? (
                    <Button onClick={handleLogout} variant="outline" size="sm" fullWidth>
                      Logout
                    </Button>
                  ) : (
                    <div className="flex space-x-2 w-full">
                      <Link to="/login" className="flex-1">
                        <Button variant="outline" size="sm" fullWidth>
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" className="flex-1">
                        <Button variant="primary" size="sm" fullWidth>
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
