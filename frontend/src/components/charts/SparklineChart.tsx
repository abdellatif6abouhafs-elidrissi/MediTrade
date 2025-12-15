import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: 'positive' | 'negative' | 'neutral';
  strokeWidth?: number;
}

const SparklineChart = ({
  data,
  width = 80,
  height = 32,
  color = 'neutral',
  strokeWidth = 1.5,
}: SparklineChartProps) => {
  // Determine color based on trend or explicit prop
  const getColor = () => {
    if (color === 'positive') return '#10b981';
    if (color === 'negative') return '#ef4444';

    // Auto-detect based on first and last values
    if (data.length >= 2) {
      const first = data[0];
      const last = data[data.length - 1];
      return last >= first ? '#10b981' : '#ef4444';
    }

    return '#6b7280'; // neutral gray
  };

  const chartData = data.map((value, index) => ({ value, index }));
  const strokeColor = getColor();

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Generate mock price history data for a symbol
export const generateMockPriceHistory = (
  currentPrice: number,
  points: number = 20,
  volatility: number = 0.02
): number[] => {
  const data: number[] = [];
  let price = currentPrice * (0.9 + Math.random() * 0.1);

  for (let i = 0; i < points; i++) {
    const drift = (currentPrice - price) / (points - i) * 0.2;
    const random = (Math.random() - 0.5) * price * volatility;
    price = Math.max(0.01, price + drift + random);
    data.push(price);
  }

  // Ensure last value is close to current price
  data[data.length - 1] = currentPrice;

  return data;
};

export default SparklineChart;
