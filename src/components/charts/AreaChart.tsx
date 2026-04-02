'use client';

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaSeries {
  key: string;
  color: string;
  label?: string;
}

interface AreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: AreaSeries[];
  yFormatter?: (value: number) => string;
  height?: number;
}

export function AreaChart({
  data,
  xKey,
  series,
  yFormatter,
  height = 220,
}: AreaChartProps) {
  return (
    <div data-testid="area-chart" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={1}>
        <ReAreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={s.color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
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
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
