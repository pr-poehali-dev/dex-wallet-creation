import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchPriceHistory, calculatePriceChange } from '@/utils/priceHistory';
import Icon from '@/components/ui/icon';

interface PriceChartProps {
  symbol: string;
  currentPrice?: number;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

const PriceChart = ({ symbol, currentPrice }: PriceChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceChange, setPriceChange] = useState({ change: 0, percentage: 0 });
  const [period, setPeriod] = useState<1 | 7 | 30>(7);

  useEffect(() => {
    loadPriceHistory();
  }, [symbol, period]);

  const loadPriceHistory = async () => {
    setLoading(true);
    try {
      const prices = await fetchPriceHistory(symbol, period);
      
      const formattedData = prices.map(point => ({
        time: new Date(point.timestamp).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'short'
        }),
        price: point.price
      }));
      
      setChartData(formattedData);
      const change = calculatePriceChange(prices);
      setPriceChange(change);
    } catch (error) {
      console.error('Error loading price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPositive = priceChange.percentage >= 0;
  const lineColor = isPositive ? '#10b981' : '#ef4444';

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {currentPrice && (
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-foreground">
                ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <Icon name={isPositive ? "TrendingUp" : "TrendingDown"} size={16} />
                <span className="text-sm font-semibold">
                  {isPositive ? '+' : ''}{priceChange.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 bg-secondary/30 rounded-lg p-1">
          <button
            onClick={() => setPeriod(1)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              period === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1Д
          </button>
          <button
            onClick={() => setPeriod(7)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              period === 7 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7Д
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              period === 30 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            1М
          </button>
        </div>
      </div>

      <div className="w-full h-48 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="time" 
              hide
            />
            <YAxis 
              hide
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
                fontSize: '12px'
              }}
              itemStyle={{
                color: lineColor,
                fontSize: '14px',
                fontWeight: 700
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
