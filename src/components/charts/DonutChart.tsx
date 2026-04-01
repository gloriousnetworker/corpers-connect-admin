'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
}

export function DonutChart({ data, height = 220 }: DonutChartProps) {
  return (
    <div data-testid="donut-chart" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {data.map((slice, i) => (
              <Cell key={i} fill={slice.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
            formatter={(value: unknown, name: unknown) => [typeof value === 'number' ? value.toLocaleString() : String(value ?? ''), String(name ?? '')]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
