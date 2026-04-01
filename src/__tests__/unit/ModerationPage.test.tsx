import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModerationPage from '@/app/(admin)/moderation/page';
import type { Report } from '@/types/models';
import { ReportStatus, ReportEntityType } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUpdateFilters = jest.fn();
const mockClearFilters = jest.fn();
const mockGoNext = jest.fn();
const mockGoPrev = jest.fn();

let mockReportsReturn = {
  data: undefined as { data: Report[]; total?: number; hasMore: boolean } | undefined,
  isLoading: true,
  filters: { status: '', entityType: '' },
  updateFilters: mockUpdateFilters,
  clearFilters: mockClearFilters,
  hasPrev: false,
  hasNext: false,
  goNext: mockGoNext,
  goPrev: mockGoPrev,
};

jest.mock('@/hooks/useReports', () => ({
  useReports: () => mockReportsReturn,
  useReport: jest.fn(),
  useReviewReport: jest.fn(),
}));

// ── Fixture ───────────────────────────────────────────────────────────────────

const mockReports: Report[] = [
  {
    id: 'r1',
    entityType: ReportEntityType.POST,
    entityId: 'p1',
    reason: 'Spam content',
    status: ReportStatus.PENDING,
    reporter: { id: 'u1', firstName: 'Alice', lastName: 'A', stateCode: 'LA/23A/1' },
    reportedUser: { id: 'u2', firstName: 'Bob', lastName: 'B', stateCode: 'RV/23A/2' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'r2',
    entityType: ReportEntityType.USER,
    entityId: 'u3',
    reason: 'Harassment',
    status: ReportStatus.ACTIONED,
    reporter: { id: 'u3', firstName: 'Carol', lastName: 'C', stateCode: 'AB/23A/3' },
    reportedUser: null,
    createdAt: new Date().toISOString(),
  },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ModerationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReportsReturn = {
      data: undefined,
      isLoading: true,
      filters: { status: '', entityType: '' },
      updateFilters: mockUpdateFilters,
      clearFilters: mockClearFilters,
      hasPrev: false,
      hasNext: false,
      goNext: mockGoNext,
      goPrev: mockGoPrev,
    };
  });

  it('renders moderation page container', () => {
    render(<ModerationPage />);
    expect(screen.getByTestId('moderation-page')).toBeInTheDocument();
  });

  it('shows "Moderation" heading', () => {
    render(<ModerationPage />);
    expect(screen.getByText('Moderation')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<ModerationPage />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('renders data table', () => {
    render(<ModerationPage />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('shows loading skeleton', () => {
    render(<ModerationPage />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });

  it('renders report rows when data is loaded', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: mockReports, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    expect(screen.getByText('Spam content')).toBeInTheDocument();
    expect(screen.getByText('Harassment')).toBeInTheDocument();
  });

  it('shows total report count', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: mockReports, total: 42, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    expect(screen.getByText('42 reports')).toBeInTheDocument();
  });

  it('navigates to report detail on row click', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: mockReports, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    fireEvent.click(screen.getByText('Spam content'));
    expect(mockPush).toHaveBeenCalledWith('/moderation/r1');
  });

  it('shows empty state when no reports', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: [], total: 0, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No reports found')).toBeInTheDocument();
  });

  it('renders PENDING status badge', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: mockReports, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    expect(screen.getByText(ReportStatus.PENDING)).toBeInTheDocument();
  });

  it('shows dashes for report with no reported user', () => {
    mockReportsReturn = {
      ...mockReportsReturn,
      data: { data: mockReports, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<ModerationPage />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
