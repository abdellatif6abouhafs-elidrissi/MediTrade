import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import type { PortfolioSnapshot } from '../../store/dashboardStore';

interface PortfolioAreaChartProps {
  data: PortfolioSnapshot[];
  timeframe: '24h' | '7d' | '30d' | '1y';
  onTimeframeChange: (timeframe: '24h' | '7d' | '30d' | '1y') => void;
  height?: number;
}

const timeframeOptions = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '1y', label: '1Y' },
] as const;

const formatDate = (dateStr: string, timeframe: string) => {
  const date = new Date(dateStr);
  if (timeframe === '24h') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label, timeframe }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/20 shadow-xl">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {formatDate(label, timeframe)}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const PortfolioAreaChart = ({
  data,
  timeframe,
  onTimeframeChange,
  height = 300,
}: PortfolioAreaChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date, timeframe),
  }));

  // Calculate change percentage
  const firstValue = data[0]?.totalValue || 0;
  const lastValue = data[data.length - 1]?.totalValue || 0;
  const changePercent = firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositive = changePercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Performance
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isPositive ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500">
              {timeframe === '24h' ? 'Today' : `Last ${timeframe}`}
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {timeframeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeframeChange(option.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                timeframe === option.value
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip timeframe={timeframe} />} />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#portfolioGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PortfolioAreaChart;
