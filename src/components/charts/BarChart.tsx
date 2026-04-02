'use client';

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  color?: string;
  yFormatter?: (value: number) => string;
  height?: number;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = '#008751',
  yFormatter,
  height = 220,
}: BarChartProps) {
  return (
    <div data-testid="bar-chart" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
        <ReBarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={yFormatter}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
            formatter={yFormatter ? (v: unknown) => typeof v === 'number' ? yFormatter(v) : String(v ?? '') : undefined}
            cursor={{ fill: '#F1F3F4' }}
          />
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={32} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
