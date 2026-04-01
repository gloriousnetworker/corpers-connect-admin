import React from 'react';
import { render, screen } from '@testing-library/react';
import SubscriptionsPage from '@/app/(admin)/subscriptions/page';
import type { SubscriptionRecord } from '@/types/models';
import { SubscriptionStatus, SubscriptionPlan } from '@/types/enums';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

let mockReturn = {
  data: undefined as { data: SubscriptionRecord[]; total?: number } | undefined,
  isLoading: false,
  statusFilter: '', setStatusFilter: jest.fn(),
  planFilter: '', setPlanFilter: jest.fn(),
  hasPrev: false, hasNext: false,
  goNext: jest.fn(), goPrev: jest.fn(),
};

jest.mock('@/hooks/useSubscriptions', () => ({
  useSubscriptions: () => mockReturn,
}));

const mockSub: SubscriptionRecord = {
  id: 'sub1',
  user: { id: 'u1', firstName: 'Jane', lastName: 'Doe', stateCode: 'LA/23A/1' },
  plan: SubscriptionPlan.MONTHLY,
  amount: 2000,
  status: SubscriptionStatus.ACTIVE,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-02-01T00:00:00Z',
  createdAt: new Date().toISOString(),
};

describe('SubscriptionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReturn = { ...mockReturn, data: undefined, isLoading: false };
  });

  it('renders subscriptions page', () => {
    render(<SubscriptionsPage />);
    expect(screen.getByTestId('subscriptions-page')).toBeInTheDocument();
  });

  it('shows Subscriptions heading', () => {
    render(<SubscriptionsPage />);
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<SubscriptionsPage />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('shows loading skeleton', () => {
    mockReturn = { ...mockReturn, isLoading: true };
    render(<SubscriptionsPage />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });

  it('renders subscription records', () => {
    mockReturn = { ...mockReturn, data: { data: [mockSub], total: 1 } };
    render(<SubscriptionsPage />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('shows total count', () => {
    mockReturn = { ...mockReturn, data: { data: [mockSub], total: 250 } };
    render(<SubscriptionsPage />);
    expect(screen.getByText('250 records')).toBeInTheDocument();
  });

  it('shows ACTIVE status badge', () => {
    mockReturn = { ...mockReturn, data: { data: [mockSub] } };
    render(<SubscriptionsPage />);
    expect(screen.getByText(SubscriptionStatus.ACTIVE)).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    mockReturn = { ...mockReturn, data: { data: [] } };
    render(<SubscriptionsPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders pagination', () => {
    render(<SubscriptionsPage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
