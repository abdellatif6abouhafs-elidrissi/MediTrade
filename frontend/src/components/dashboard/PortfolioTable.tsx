import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SparklineChart, { generateMockPriceHistory } from '../charts/SparklineChart';
import GlassCard from '../ui/GlassCard';

interface Holding {
  symbol: string;
  name?: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface PortfolioTableProps {
  holdings: Holding[];
  expandedRow: string | null;
  onToggleExpand: (symbol: string) => void;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const SortHeader = ({
  label,
  column,
  currentSort,
  sortOrder,
  onSort,
}: {
  label: string;
  column: string;
  currentSort: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}) => (
  <th
    onClick={() => onSort(column)}
    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
  >
    <div className="flex items-center gap-1">
      {label}
      {currentSort === column && (
        <span className="text-primary-500">
          {sortOrder === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </th>
);

const PortfolioTable = ({
  holdings,
  expandedRow,
  onToggleExpand,
  sortColumn,
  sortOrder,
  onSort,
}: PortfolioTableProps) => {
  const navigate = useNavigate();

  // Sort holdings
  const sortedHoldings = [...holdings].sort((a, b) => {
    let aVal: number, bVal: number;

    switch (sortColumn) {
      case 'symbol':
        return sortOrder === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      case 'amount':
        aVal = a.amount;
        bVal = b.amount;
        break;
      case 'value':
        aVal = a.value;
        bVal = b.value;
        break;
      case 'gainLoss':
        aVal = a.gainLossPercent;
        bVal = b.gainLossPercent;
        break;
      default:
        aVal = a.value;
        bVal = b.value;
    }

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  if (holdings.length === 0) {
    return (
      <GlassCard>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Holdings Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start trading to build your portfolio
          </p>
          <button
            onClick={() => navigate('/trade')}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
          >
            Start Trading
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio Holdings
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              <SortHeader
                label="Asset"
                column="symbol"
                currentSort={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Chart
              </th>
              <SortHeader
                label="Amount"
                column="amount"
                currentSort={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                label="Value"
                column="value"
                currentSort={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <SortHeader
                label="P/L"
                column="gainLoss"
                currentSort={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              />
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sortedHoldings.map((holding) => {
              const isPositive = holding.gainLoss >= 0;
              const priceHistory = generateMockPriceHistory(holding.currentPrice);

              return (
                <motion.tr
                  key={holding.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="table-row-hover"
                >
                  {/* Asset */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {holding.symbol}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(holding.currentPrice)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Sparkline */}
                  <td className="px-4 py-4">
                    <SparklineChart
                      data={priceHistory}
                      color={isPositive ? 'positive' : 'negative'}
                    />
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {holding.amount.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: {formatCurrency(holding.averagePrice)}
                    </p>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(holding.value)}
                    </p>
                  </td>

                  {/* P/L */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <p
                          className={`font-semibold ${
                            isPositive ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {holding.gainLossPercent.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {isPositive ? '+' : ''}
                          {formatCurrency(holding.gainLoss)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Expand/Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/trade?symbol=${holding.symbol}`)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      >
                        Trade
                      </button>
                      <button
                        onClick={() => onToggleExpand(holding.symbol)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {expandedRow === holding.symbol ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default PortfolioTable;
