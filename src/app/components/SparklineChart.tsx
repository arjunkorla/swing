import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  type?: 'line' | 'area';
}

export function SparklineChart({ data, color = '#10b981', height = 40, type = 'line' }: SparklineChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  const isPositive = data[data.length - 1] >= data[0];
  const lineColor = color === 'auto' ? (isPositive ? '#10b981' : '#ef4444') : color;

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`sparkGrad-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            fill={`url(#sparkGrad-${lineColor.replace('#', '')})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          dot={false}
          strokeWidth={1.5}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
