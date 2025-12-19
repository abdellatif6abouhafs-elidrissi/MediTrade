import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Home,
  TrendingUp,
  BarChart3,
  Wallet,
  User,
  Moon,
  Sun,
  LogOut,
  Settings,
  Command,
  ArrowRight,
  Zap,
  Trophy,
  Bell,
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'actions' | 'trading';
  keywords?: string[];
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();
  const { isAuthenticated, logout } = useAuthStore();

  const commands: CommandItem[] = useMemo(() => {
    const baseCommands: CommandItem[] = [
      {
        id: 'home',
        title: 'Go to Home',
        description: 'Navigate to homepage',
        icon: <Home className="w-4 h-4" />,
        action: () => navigate('/'),
        category: 'navigation',
        keywords: ['home', 'main', 'start'],
      },
      {
        id: 'prices',
        title: 'View Prices',
        description: 'See live cryptocurrency prices',
        icon: <BarChart3 className="w-4 h-4" />,
        action: () => navigate('/prices'),
        category: 'navigation',
        keywords: ['prices', 'market', 'coins', 'crypto'],
      },
      {
        id: 'trade',
        title: 'Start Trading',
        description: 'Open trading terminal',
        icon: <TrendingUp className="w-4 h-4" />,
        action: () => navigate('/trade'),
        category: 'navigation',
        keywords: ['trade', 'buy', 'sell', 'exchange'],
      },
      {
        id: 'leaderboard',
        title: 'View Leaderboard',
        description: 'See top traders ranking',
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        action: () => navigate('/leaderboard'),
        category: 'navigation',
        keywords: ['leaderboard', 'ranking', 'top', 'traders', 'competition'],
      },
      {
        id: 'alerts',
        title: 'Price Alerts',
        description: 'Set alerts for price targets',
        icon: <Bell className="w-4 h-4 text-orange-500" />,
        action: () => navigate('/alerts'),
        category: 'navigation',
        keywords: ['alerts', 'notification', 'price', 'target', 'bell'],
      },
      {
        id: 'achievements',
        title: 'Achievements',
        description: 'View your badges and achievements',
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        action: () => navigate('/achievements'),
        category: 'navigation',
        keywords: ['achievements', 'badges', 'rewards', 'trophies', 'milestones'],
      },
      {
        id: 'analytics',
        title: 'Portfolio Analytics',
        description: 'View portfolio performance and insights',
        icon: <BarChart3 className="w-4 h-4 text-purple-500" />,
        action: () => navigate('/analytics'),
        category: 'navigation',
        keywords: ['analytics', 'portfolio', 'performance', 'charts', 'insights'],
      },
      {
        id: 'trade-btc',
        title: 'Trade Bitcoin',
        description: 'Quick trade BTC',
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
        action: () => navigate('/trade?symbol=BTC'),
        category: 'trading',
        keywords: ['bitcoin', 'btc'],
      },
      {
        id: 'trade-eth',
        title: 'Trade Ethereum',
        description: 'Quick trade ETH',
        icon: <Zap className="w-4 h-4 text-purple-500" />,
        action: () => navigate('/trade?symbol=ETH'),
        category: 'trading',
        keywords: ['ethereum', 'eth'],
      },
      {
        id: 'trade-sol',
        title: 'Trade Solana',
        description: 'Quick trade SOL',
        icon: <Zap className="w-4 h-4 text-green-500" />,
        action: () => navigate('/trade?symbol=SOL'),
        category: 'trading',
        keywords: ['solana', 'sol'],
      },
      {
        id: 'theme',
        title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        description: 'Toggle theme',
        icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        action: () => toggleTheme(),
        category: 'actions',
        keywords: ['theme', 'dark', 'light', 'mode', 'toggle'],
      },
    ];

    if (isAuthenticated) {
      baseCommands.push(
        {
          id: 'dashboard',
          title: 'Go to Dashboard',
          description: 'View your portfolio',
          icon: <User className="w-4 h-4" />,
          action: () => navigate('/dashboard'),
          category: 'navigation',
          keywords: ['dashboard', 'portfolio', 'account'],
        },
        {
          id: 'wallet',
          title: 'Open Wallet',
          description: 'Manage your funds',
          icon: <Wallet className="w-4 h-4" />,
          action: () => navigate('/wallet'),
          category: 'navigation',
          keywords: ['wallet', 'balance', 'funds', 'money'],
        },
        {
          id: 'logout',
          title: 'Logout',
          description: 'Sign out of your account',
          icon: <LogOut className="w-4 h-4" />,
          action: () => {
            logout();
            navigate('/');
          },
          category: 'actions',
          keywords: ['logout', 'signout', 'exit'],
        }
      );
    } else {
      baseCommands.push(
        {
          id: 'login',
          title: 'Login',
          description: 'Sign in to your account',
          icon: <User className="w-4 h-4" />,
          action: () => navigate('/login'),
          category: 'navigation',
          keywords: ['login', 'signin', 'account'],
        },
        {
          id: 'register',
          title: 'Create Account',
          description: 'Sign up for free',
          icon: <Settings className="w-4 h-4" />,
          action: () => navigate('/register'),
          category: 'navigation',
          keywords: ['register', 'signup', 'create', 'new'],
        }
      );
    }

    return baseCommands;
  }, [isDark, isAuthenticated, navigate, toggleTheme, logout]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const searchLower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(searchLower) ||
        cmd.description?.toLowerCase().includes(searchLower) ||
        cmd.keywords?.some((k) => k.includes(searchLower))
    );
  }, [commands, search]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      // Close with Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      // Navigate with arrow keys
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    },
    [isOpen, filteredCommands, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {
      navigation: [],
      trading: [],
      actions: [],
    };
    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <>
      {/* Keyboard Shortcut Hint */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Command Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search commands..."
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 rounded">
                    ESC
                  </kbd>
                </div>

                {/* Commands List */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {filteredCommands.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No commands found
                    </div>
                  ) : (
                    <>
                      {Object.entries(groupedCommands).map(
                        ([category, items]) =>
                          items.length > 0 && (
                            <div key={category}>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {category}
                              </div>
                              {items.map((cmd) => {
                                const globalIndex = filteredCommands.findIndex(
                                  (c) => c.id === cmd.id
                                );
                                return (
                                  <button
                                    key={cmd.id}
                                    onClick={() => {
                                      cmd.action();
                                      setIsOpen(false);
                                    }}
                                    onMouseEnter={() =>
                                      setSelectedIndex(globalIndex)
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                      selectedIndex === globalIndex
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        selectedIndex === globalIndex
                                          ? 'bg-blue-100 dark:bg-blue-900/50'
                                          : 'bg-gray-100 dark:bg-gray-800'
                                      }`}
                                    >
                                      {cmd.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">
                                        {cmd.title}
                                      </div>
                                      {cmd.description && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                          {cmd.description}
                                        </div>
                                      )}
                                    </div>
                                    {selectedIndex === globalIndex && (
                                      <ArrowRight className="w-4 h-4 text-blue-500" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↓</kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">↵</kbd>
                      select
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Command className="w-3 h-3" />
                    <span>MediTrade</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
