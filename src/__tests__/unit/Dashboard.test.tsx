import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/(admin)/dashboard/page';
import type { DashboardStats } from '@/types/models';
import { ReportStatus, UserLevel, ReportEntityType } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('next/link', () => {
  const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  Link.displayName = 'Link';
  return Link;
});

jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

// Mock chart components to avoid jsdom SVG issues (linearGradient, stop, etc.)
jest.mock('@/components/charts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  AreaChart: () => <div data-testid="area-chart" />,
  DonutChart: () => <div data-testid="donut-chart" />,
}));

let mockDashboardReturn: { data: DashboardStats | undefined; isLoading: boolean; isError: boolean } = {
  data: undefined,
  isLoading: true,
  isError: false,
};

jest.mock('@/hooks/useDashboard', () => ({
  useDashboard: () => mockDashboardReturn,
}));

// ── Fixture ───────────────────────────────────────────────────────────────────

const mockData: DashboardStats = {
  users: { total: 12450, activeToday: 342, newThisWeek: 87, newThisWeekChange: 12 },
  subscriptions: { premium: 2300, revenue30d: 460000, revenueChange: 8 },
  moderation: { pendingReports: 14, pendingSellerApps: 5 },
  charts: {
    userGrowth: [{ date: '2024-01-01', count: 100 }],
    revenue: [{ date: '2024-01-01', amount: 50000 }],
    contentActivity: [{ date: '2024-01-01', posts: 20, stories: 15, reels: 5 }],
    subscriptionMix: { free: 10150, premium: 2300 },
  },
  recentReports: [
    {
      id: 'r1',
      entityType: ReportEntityType.POST,
      reason: 'Spam content',
      status: ReportStatus.PENDING,
      createdAt: new Date().toISOString(),
    },
  ],
  recentRegistrations: [
    {
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      stateCode: 'LA',
      servingState: 'Lagos',
      level: UserLevel.CORPER,
      createdAt: new Date().toISOString(),
    },
  ],
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDashboardReturn = { data: undefined, isLoading: true, isError: false };
  });

  // ── Loading state ──

  it('renders dashboard page container', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders stat cards section', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('stat-cards-section')).toBeInTheDocument();
  });

  it('renders charts section', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('charts-section')).toBeInTheDocument();
  });

  it('renders recent section', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('recent-section')).toBeInTheDocument();
  });

  it('shows loading skeleton when data is loading', () => {
    mockDashboardReturn = { data: undefined, isLoading: true, isError: false };
    render(<DashboardPage />);
    // 6 loading placeholder cards should be present (animate-pulse divs)
    const pulseDivs = document.querySelectorAll('.animate-pulse');
    expect(pulseDivs.length).toBeGreaterThan(0);
  });

  // ── Error state ──

  it('shows error message when dashboard fetch fails', () => {
    mockDashboardReturn = { data: undefined, isLoading: false, isError: true };
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-error')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-error')).toHaveTextContent('Failed to load dashboard data');
  });

  // ── Data state ──

  it('renders stat cards with data', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByTestId('stat-total-users')).toBeInTheDocument();
    expect(screen.getByTestId('stat-premium')).toBeInTheDocument();
    expect(screen.getByTestId('stat-revenue')).toBeInTheDocument();
    expect(screen.getByTestId('stat-reports')).toBeInTheDocument();
    expect(screen.getByTestId('stat-seller-apps')).toBeInTheDocument();
    expect(screen.getByTestId('stat-active-today')).toBeInTheDocument();
  });

  it('displays formatted total users value', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    // 12450 → "12.4K" (12450/1000 = 12.45 → JS floating point rounds to 12.4)
    expect(screen.getByTestId('stat-total-users')).toHaveTextContent('12.4K');
  });

  it('renders recent reports table when data is loaded', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByTestId('recent-reports-table')).toBeInTheDocument();
    expect(screen.getByText('Spam content')).toBeInTheDocument();
  });

  it('renders recent registrations table when data is loaded', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByTestId('recent-registrations-table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows "No recent reports" when recentReports is empty', () => {
    mockDashboardReturn = {
      data: { ...mockData, recentReports: [] },
      isLoading: false,
      isError: false,
    };
    render(<DashboardPage />);
    expect(screen.getByText('No recent reports')).toBeInTheDocument();
  });

  it('shows "No recent registrations" when recentRegistrations is empty', () => {
    mockDashboardReturn = {
      data: { ...mockData, recentRegistrations: [] },
      isLoading: false,
      isError: false,
    };
    render(<DashboardPage />);
    expect(screen.getByText('No recent registrations')).toBeInTheDocument();
  });

  it('renders report status badge', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders serving state in registrations', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByText('Lagos')).toBeInTheDocument();
  });

  it('renders recharts chart containers', () => {
    mockDashboardReturn = { data: mockData, isLoading: false, isError: false };
    render(<DashboardPage />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
  });
});
