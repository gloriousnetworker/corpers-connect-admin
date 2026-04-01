import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OpportunitiesPage from '@/app/(admin)/opportunities/page';
import type { Opportunity } from '@/types/models';
import { OpportunityType } from '@/types/enums';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockFeature = { mutate: jest.fn(), isPending: false };
const mockRemove = { mutate: jest.fn(), isPending: false };

let mockReturn = {
  data: undefined as { data: Opportunity[]; total?: number } | undefined,
  isLoading: false,
  search: '', setSearch: jest.fn(),
  typeFilter: '', setTypeFilter: jest.fn(),
  hasPrev: false, hasNext: false,
  goNext: jest.fn(), goPrev: jest.fn(),
  feature: mockFeature,
  remove: mockRemove,
};

jest.mock('@/hooks/useOpportunities', () => ({
  useOpportunities: () => mockReturn,
}));

const mockOpp: Opportunity = {
  id: 'opp1',
  title: 'Software Engineering Intern',
  description: 'Great opportunity',
  type: OpportunityType.INTERNSHIP,
  companyName: 'TechCorp',
  location: 'Lagos',
  isRemote: false,
  isFeatured: false,
  applicationCount: 42,
  author: { id: 'u1', firstName: 'Admin', lastName: 'User', stateCode: 'LA/23A/1' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('OpportunitiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReturn = { ...mockReturn, data: undefined, isLoading: false };
  });

  it('renders opportunities page', () => {
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('opportunities-page')).toBeInTheDocument();
  });

  it('shows Opportunities heading', () => {
    render(<OpportunitiesPage />);
    expect(screen.getByText('Opportunities')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('shows loading skeleton', () => {
    mockReturn = { ...mockReturn, isLoading: true };
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });

  it('renders opportunity rows', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp], total: 1 } };
    render(<OpportunitiesPage />);
    expect(screen.getByText('Software Engineering Intern')).toBeInTheDocument();
    expect(screen.getByText('TechCorp')).toBeInTheDocument();
  });

  it('shows total count when data loaded', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp], total: 99 } };
    render(<OpportunitiesPage />);
    expect(screen.getByText('99 opportunities')).toBeInTheDocument();
  });

  it('renders feature button', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp] } };
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('feature-opp1')).toBeInTheDocument();
  });

  it('calls feature.mutate with correct isFeatured toggle', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp] } };
    render(<OpportunitiesPage />);
    fireEvent.click(screen.getByTestId('feature-opp1'));
    expect(mockFeature.mutate).toHaveBeenCalledWith({ id: 'opp1', isFeatured: true });
  });

  it('renders remove button', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp] } };
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('remove-opp-opp1')).toBeInTheDocument();
  });

  it('shows remove confirm modal on remove click', () => {
    mockReturn = { ...mockReturn, data: { data: [mockOpp] } };
    render(<OpportunitiesPage />);
    fireEvent.click(screen.getByTestId('remove-opp-opp1'));
    expect(screen.getByText('Remove Opportunity')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    mockReturn = { ...mockReturn, data: { data: [] } };
    render(<OpportunitiesPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
