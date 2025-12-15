import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface HoldingData {
  symbol: string;
  name?: string;
  value: number;
  percentage: number;
}

interface AssetAllocationPieProps {
  holdings: HoldingData[];
  showLegend?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#84cc16', // lime
  '#6366f1', // indigo
  '#14b8a6', // teal
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 border border-white/20 shadow-xl">
        <p className="font-semibold text-gray-900 dark:text-white">{data.symbol}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-gray-500">{data.percentage.toFixed(1)}% of portfolio</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const AssetAllocationPie = ({ holdings, showLegend = true }: AssetAllocationPieProps) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);

  const data = holdings.map((h, index) => ({
    ...h,
    percentage: (h.value / totalValue) * 100,
    color: COLORS[index % COLORS.length],
  }));

  // Sort by value descending
  data.sort((a, b) => b.value - a.value);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Asset Allocation
      </h3>

      {holdings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-sm">No assets in portfolio</p>
        </div>
      ) : (
        <div className="relative" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="transparent"
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend content={<CustomLegend />} />}
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      )}

      {/* Asset List */}
      {holdings.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {data.slice(0, 5).map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: asset.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {asset.symbol}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(asset.value)}
                </p>
                <p className="text-xs text-gray-500">{asset.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AssetAllocationPie;
