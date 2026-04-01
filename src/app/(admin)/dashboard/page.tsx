'use client';

import { Users, CreditCard, Flag, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { StatCard, SkeletonRow, Badge } from '@/components/ui';
import { LineChart, BarChart, AreaChart, DonutChart } from '@/components/charts';
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';
import { getReportStatusColor } from '@/lib/utils';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-foreground mb-3">{children}</h2>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  // ── Stat cards ──────────────────────────────────────────────────────────────

  const statCards = [
    {
      testId: 'stat-total-users',
      icon: Users,
      label: 'Total Users',
      value: data ? formatNumber(data.users.total) : '—',
      change: data?.users.newThisWeekChange ?? null,
      changeLabel: 'vs last week',
      href: '/users',
    },
    {
      testId: 'stat-premium',
      icon: CreditCard,
      label: 'Premium Subscribers',
      value: data ? formatNumber(data.subscriptions.premium) : '—',
      change: data?.subscriptions.revenueChange ?? null,
      changeLabel: 'revenue change',
      href: '/subscriptions',
    },
    {
      testId: 'stat-revenue',
      icon: TrendingUp,
      label: 'Revenue (30d)',
      value: data ? formatCurrency(data.subscriptions.revenue30d) : '—',
      change: data?.subscriptions.revenueChange ?? null,
      changeLabel: 'vs prior period',
    },
    {
      testId: 'stat-reports',
      icon: Flag,
      label: 'Pending Reports',
      value: data ? formatNumber(data.moderation.pendingReports) : '—',
      change: null,
      changeLabel: undefined,
      href: '/moderation',
    },
    {
      testId: 'stat-seller-apps',
      icon: ShoppingBag,
      label: 'Seller Applications',
      value: data ? formatNumber(data.moderation.pendingSellerApps) : '—',
      change: null,
      changeLabel: undefined,
      href: '/marketplace',
    },
    {
      testId: 'stat-active-today',
      icon: TrendingDown,
      label: 'Active Today',
      value: data ? formatNumber(data.users.activeToday) : '—',
      change: null,
      changeLabel: undefined,
    },
  ];

  // ── Donut data ───────────────────────────────────────────────────────────────

  const subscriptionMixData = data
    ? [
        { label: 'Free', value: data.charts.subscriptionMix.free, color: '#9CA3AF' },
        { label: 'Premium', value: data.charts.subscriptionMix.premium, color: '#C8992A' },
      ]
    : [];

  return (
    <div data-testid="dashboard-page" className="space-y-6">

      {/* ── Stat Cards ── */}
      <section data-testid="stat-cards-section">
        <SectionTitle>Overview</SectionTitle>
        {isError && (
          <p data-testid="dashboard-error" className="text-sm text-error">
            Failed to load dashboard data. Please refresh.
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-4 h-28 animate-pulse" />
              ))
            : statCards.map((card) => (
                <div key={card.testId} data-testid={card.testId}>
                  <StatCard
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    change={card.change ?? undefined}
                    changeLabel={card.changeLabel}
                    href={card.href}
                  />
                </div>
              ))}
        </div>
      </section>

      {/* ── Charts Row 1 ── */}
      <section data-testid="charts-section">
        <SectionTitle>Analytics</SectionTitle>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="User Growth (30 days)">
            <LineChart
              data={data?.charts.userGrowth ?? []}
              xKey="date"
              yKey="count"
              color="#008751"
              yFormatter={formatNumber}
            />
          </ChartCard>

          <ChartCard title="Revenue (30 days)">
            <BarChart
              data={data?.charts.revenue ?? []}
              xKey="date"
              yKey="amount"
              color="#C8992A"
              yFormatter={(v) => formatCurrency(v)}
            />
          </ChartCard>
        </div>

        {/* ── Charts Row 2 ── */}
        <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title="Content Activity (30 days)">
              <AreaChart
                data={data?.charts.contentActivity ?? []}
                xKey="date"
                series={[
                  { key: 'posts', color: '#008751', label: 'Posts' },
                  { key: 'stories', color: '#C8992A', label: 'Stories' },
                  { key: 'reels', color: '#3B82F6', label: 'Reels' },
                ]}
                yFormatter={formatNumber}
              />
            </ChartCard>
          </div>
          <ChartCard title="Subscription Mix">
            <DonutChart data={subscriptionMixData} />
          </ChartCard>
        </div>
      </section>

      {/* ── Recent activity ── */}
      <section data-testid="recent-section">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Recent Reports */}
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-foreground mb-3">Recent Reports</p>
            {isLoading ? (
              <table className="w-full">
                <tbody>
                  <SkeletonRow rows={5} columns={3} />
                </tbody>
              </table>
            ) : !data?.recentReports.length ? (
              <p className="text-sm text-foreground-secondary py-4 text-center">No recent reports</p>
            ) : (
              <table className="w-full text-sm" data-testid="recent-reports-table">
                <thead>
                  <tr className="text-xs text-foreground-secondary border-b border-border">
                    <th className="text-left pb-2 font-medium">Type</th>
                    <th className="text-left pb-2 font-medium">Reason</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                    <th className="text-left pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentReports.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="py-2 capitalize text-foreground-secondary">{r.entityType.toLowerCase()}</td>
                      <td className="py-2 text-foreground truncate max-w-[100px]">{r.reason}</td>
                      <td className="py-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getReportStatusColor(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 text-foreground-secondary whitespace-nowrap">
                        {formatRelativeTime(r.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-foreground mb-3">Recent Registrations</p>
            {isLoading ? (
              <table className="w-full">
                <tbody>
                  <SkeletonRow rows={5} columns={3} />
                </tbody>
              </table>
            ) : !data?.recentRegistrations.length ? (
              <p className="text-sm text-foreground-secondary py-4 text-center">No recent registrations</p>
            ) : (
              <table className="w-full text-sm" data-testid="recent-registrations-table">
                <thead>
                  <tr className="text-xs text-foreground-secondary border-b border-border">
                    <th className="text-left pb-2 font-medium">Name</th>
                    <th className="text-left pb-2 font-medium">State</th>
                    <th className="text-left pb-2 font-medium">Level</th>
                    <th className="text-left pb-2 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentRegistrations.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-2 text-foreground font-medium">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="py-2 text-foreground-secondary">{u.servingState}</td>
                      <td className="py-2">
                        <Badge variant="info">{u.level}</Badge>
                      </td>
                      <td className="py-2 text-foreground-secondary whitespace-nowrap">
                        {formatRelativeTime(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
