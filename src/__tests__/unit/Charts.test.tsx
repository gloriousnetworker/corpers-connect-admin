/**
 * Chart component tests.
 *
 * Recharts renders via SVG in jsdom but ResizableContainer needs a real DOM size.
 * We mock `recharts` to avoid SVG/canvas rendering errors while still testing
 * that each chart wrapper renders its container and passes data correctly.
 */
import { render, screen } from '@testing-library/react';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { DonutChart } from '@/components/charts/DonutChart';

// Mock all recharts components so tests don't need a real browser layout engine
jest.mock('recharts', () => {
  const React = require('react');
  const mock = (name: string) =>
    function MockedComponent({ children }: { children?: React.ReactNode }) {
      return React.createElement('div', { 'data-recharts': name }, children);
    };
  return {
    LineChart: mock('LineChart'),
    BarChart: mock('BarChart'),
    AreaChart: mock('AreaChart'),
    PieChart: mock('PieChart'),
    Line: mock('Line'),
    Bar: mock('Bar'),
    Area: mock('Area'),
    Pie: mock('Pie'),
    Cell: mock('Cell'),
    XAxis: mock('XAxis'),
    YAxis: mock('YAxis'),
    CartesianGrid: mock('CartesianGrid'),
    Tooltip: mock('Tooltip'),
    Legend: mock('Legend'),
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { 'data-recharts': 'ResponsiveContainer' }, children),
  };
});

const lineData = [
  { date: '2026-03-01', count: 12 },
  { date: '2026-03-02', count: 18 },
  { date: '2026-03-03', count: 9 },
];

const revenueData = [
  { date: '2026-03-01', amount: 150000 },
  { date: '2026-03-02', amount: 200000 },
];

const activityData = [
  { date: '2026-03-01', posts: 40, stories: 25, reels: 10 },
  { date: '2026-03-02', posts: 55, stories: 30, reels: 15 },
];

const donutData = [
  { label: 'FREE',    value: 800, color: '#9CA3AF' },
  { label: 'PREMIUM', value: 200, color: '#008751' },
];

describe('LineChart', () => {
  it('renders its container div', () => {
    render(<LineChart data={lineData} xKey="date" yKey="count" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<LineChart data={lineData} xKey="date" yKey="count" height={300} />);
    expect(screen.getByTestId('line-chart')).toHaveStyle({ height: '300px' });
  });

  it('renders with default height of 220', () => {
    render(<LineChart data={lineData} xKey="date" yKey="count" />);
    expect(screen.getByTestId('line-chart')).toHaveStyle({ height: '220px' });
  });
});

describe('BarChart', () => {
  it('renders its container div', () => {
    render(<BarChart data={revenueData} xKey="date" yKey="amount" />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<BarChart data={revenueData} xKey="date" yKey="amount" height={280} />);
    expect(screen.getByTestId('bar-chart')).toHaveStyle({ height: '280px' });
  });

  it('renders with default height of 220', () => {
    render(<BarChart data={revenueData} xKey="date" yKey="amount" />);
    expect(screen.getByTestId('bar-chart')).toHaveStyle({ height: '220px' });
  });
});

describe('AreaChart', () => {
  const series = [
    { key: 'posts',   color: '#008751' },
    { key: 'stories', color: '#C8992A' },
    { key: 'reels',   color: '#3B82F6' },
  ];

  it('renders its container div', () => {
    render(<AreaChart data={activityData} xKey="date" series={series} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<AreaChart data={activityData} xKey="date" series={series} height={260} />);
    expect(screen.getByTestId('area-chart')).toHaveStyle({ height: '260px' });
  });
});

describe('DonutChart', () => {
  it('renders its container div', () => {
    render(<DonutChart data={donutData} />);
    expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(<DonutChart data={donutData} height={300} />);
    expect(screen.getByTestId('donut-chart')).toHaveStyle({ height: '300px' });
  });

  it('renders with default height of 220', () => {
    render(<DonutChart data={donutData} />);
    expect(screen.getByTestId('donut-chart')).toHaveStyle({ height: '220px' });
  });
});
