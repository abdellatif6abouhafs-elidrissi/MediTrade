import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { usePriceStore } from '../../store/priceStore';

interface TickerItem {
  symbol: string;
  price: number;
  change24h: number;
}

const PriceTicker = () => {
  const { prices } = usePriceStore();
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);

  useEffect(() => {
    if (prices.length > 0) {
      // Duplicate items for seamless loop
      const items = prices.map(p => ({
        symbol: p.symbol,
        price: p.price,
        change24h: p.change24h,
      }));
      setTickerItems([...items, ...items]);
    }
  }, [prices]);

  if (tickerItems.length === 0) return null;

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="bg-gray-900 dark:bg-black border-b border-gray-800 overflow-hidden">
      <motion.div
        className="flex items-center gap-8 py-2 whitespace-nowrap"
        animate={{
          x: [0, -50 * tickerItems.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: tickerItems.length * 3,
            ease: 'linear',
          },
        }}
      >
        {tickerItems.map((item, index) => {
          const isPositive = item.change24h >= 0;
          return (
            <div
              key={`${item.symbol}-${index}`}
              className="flex items-center gap-3 px-4"
            >
              {/* Symbol */}
              <span className="font-bold text-white">{item.symbol}</span>

              {/* Price */}
              <span className="text-gray-300">{formatPrice(item.price)}</span>

              {/* Change */}
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? '+' : ''}
                {item.change24h.toFixed(2)}%
              </span>

              {/* Separator */}
              <span className="text-gray-700 ml-4">|</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default PriceTicker;
