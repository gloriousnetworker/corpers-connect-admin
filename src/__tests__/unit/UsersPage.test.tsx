import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UsersPage from '@/app/(admin)/users/page';
import type { UserListItem } from '@/types/models';
import { UserLevel, SubscriptionTier } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

const mockUpdateFilters = jest.fn();
const mockClearFilters = jest.fn();
const mockGoNext = jest.fn();
const mockGoPrev = jest.fn();

let mockUsersReturn = {
  data: undefined as { data: UserListItem[]; total?: number; hasMore: boolean; nextCursor?: string | null } | undefined,
  isLoading: true,
  filters: { search: '', status: '', subscriptionTier: '', level: '' },
  updateFilters: mockUpdateFilters,
  clearFilters: mockClearFilters,
  hasPrev: false,
  hasNext: false,
  goNext: mockGoNext,
  goPrev: mockGoPrev,
};

jest.mock('@/hooks/useUsers', () => ({
  useUsers: () => mockUsersReturn,
}));

// ── Fixture ───────────────────────────────────────────────────────────────────

const mockUsers: UserListItem[] = [
  {
    id: 'u1',
    stateCode: 'LA/23A/1234',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@cc.ng',
    profilePicture: null,
    servingState: 'Lagos',
    level: UserLevel.CORPER,
    subscriptionTier: SubscriptionTier.FREE,
    isVerified: true,
    isSuspended: false,
    createdAt: new Date().toISOString(),
    lastActiveAt: null,
  },
  {
    id: 'u2',
    stateCode: 'RV/23A/5678',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@cc.ng',
    profilePicture: null,
    servingState: 'Rivers',
    level: UserLevel.KOPA,
    subscriptionTier: SubscriptionTier.PREMIUM,
    isVerified: false,
    isSuspended: true,
    createdAt: new Date().toISOString(),
    lastActiveAt: null,
  },
];

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsersReturn = {
      data: undefined,
      isLoading: true,
      filters: { search: '', status: '', subscriptionTier: '', level: '' },
      updateFilters: mockUpdateFilters,
      clearFilters: mockClearFilters,
      hasPrev: false,
      hasNext: false,
      goNext: mockGoNext,
      goPrev: mockGoPrev,
    };
  });

  it('renders users page container', () => {
    render(<UsersPage />);
    expect(screen.getByTestId('users-page')).toBeInTheDocument();
  });

  it('shows "Users" heading', () => {
    render(<UsersPage />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<UsersPage />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('renders data table', () => {
    render(<UsersPage />);
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
  });

  it('shows skeleton loading state', () => {
    mockUsersReturn = { ...mockUsersReturn, isLoading: true };
    render(<UsersPage />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
  });

  it('renders user rows when data is loaded', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: mockUsers, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows total user count when data is loaded', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: mockUsers, total: 1234, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    expect(screen.getByText('1,234 total users')).toBeInTheDocument();
  });

  it('navigates to user detail on row click', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: mockUsers, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    fireEvent.click(screen.getByText('John Doe'));
    expect(mockPush).toHaveBeenCalledWith('/users/u1');
  });

  it('shows empty state when no users', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: [], total: 0, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('shows pagination component', () => {
    render(<UsersPage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders verified badge for verified user', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: mockUsers, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders Suspended badge for suspended user', () => {
    mockUsersReturn = {
      ...mockUsersReturn,
      data: { data: mockUsers, total: 2, hasMore: false },
      isLoading: false,
    };
    render(<UsersPage />);
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });
});
