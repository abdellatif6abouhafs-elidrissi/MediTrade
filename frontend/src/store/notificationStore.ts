import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'price_alert' | 'trade_executed' | 'system' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

export interface PriceAlert {
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
}

interface NotificationState {
  notifications: Notification[];
  priceAlerts: PriceAlert[];
  toasts: Notification[];

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  addToast: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  removeToast: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;

  // Price Alerts
  addPriceAlert: (alert: Omit<PriceAlert, 'active'>) => void;
  removePriceAlert: (symbol: string) => void;
  togglePriceAlert: (symbol: string) => void;

  // Computed
  unreadCount: () => number;
}

const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      priceAlerts: [],
      toasts: [],

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
        }));
      },

      addToast: (notification) => {
        const newToast: Notification = {
          ...notification,
          id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          read: false,
        };
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after 5 seconds
        setTimeout(() => {
          get().removeToast(newToast.id);
        }, 5000);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      addPriceAlert: (alert) => {
        set((state) => ({
          priceAlerts: [...state.priceAlerts, { ...alert, active: true }],
        }));
      },

      removePriceAlert: (symbol) => {
        set((state) => ({
          priceAlerts: state.priceAlerts.filter((a) => a.symbol !== symbol),
        }));
      },

      togglePriceAlert: (symbol) => {
        set((state) => ({
          priceAlerts: state.priceAlerts.map((a) =>
            a.symbol === symbol ? { ...a, active: !a.active } : a
          ),
        }));
      },

      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'meditrade-notifications',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 20),
        priceAlerts: state.priceAlerts,
      }),
    }
  )
);

export default useNotificationStore;
