import { useEffect, useRef } from 'react';
import useNotificationStore from '../store/notificationStore';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const SIGNIFICANT_CHANGE_THRESHOLD = 3; // 3% change triggers alert

export const usePriceAlerts = (prices: CryptoPrice[]) => {
  const previousPrices = useRef<Map<string, number>>(new Map());
  const { addToast, addNotification, priceAlerts } = useNotificationStore();

  useEffect(() => {
    if (!prices || prices.length === 0) return;

    prices.forEach((price) => {
      const prevPrice = previousPrices.current.get(price.symbol);

      if (prevPrice) {
        const changePercent = ((price.price - prevPrice) / prevPrice) * 100;

        // Check for significant price movement
        if (Math.abs(changePercent) >= SIGNIFICANT_CHANGE_THRESHOLD) {
          const isUp = changePercent > 0;

          addToast({
            type: 'price_alert',
            title: `${price.symbol} ${isUp ? 'Surge' : 'Drop'}!`,
            message: `${price.symbol} ${isUp ? 'up' : 'down'} ${Math.abs(changePercent).toFixed(1)}% to $${price.price.toLocaleString()}`,
            data: { symbol: price.symbol, change: changePercent },
          });

          addNotification({
            type: 'price_alert',
            title: `${price.symbol} Price Alert`,
            message: `${price.symbol} has ${isUp ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(2)}%`,
            data: { symbol: price.symbol, change: changePercent, price: price.price },
          });
        }
      }

      // Check custom price alerts
      priceAlerts
        .filter((alert) => alert.active && alert.symbol === price.symbol)
        .forEach((alert) => {
          const triggered =
            (alert.condition === 'above' && price.price >= alert.targetPrice) ||
            (alert.condition === 'below' && price.price <= alert.targetPrice);

          if (triggered) {
            addToast({
              type: 'price_alert',
              title: `${alert.symbol} Target Reached!`,
              message: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice.toLocaleString()} at $${price.price.toLocaleString()}`,
            });
          }
        });

      previousPrices.current.set(price.symbol, price.price);
    });
  }, [prices, priceAlerts, addToast, addNotification]);
};

export default usePriceAlerts;
