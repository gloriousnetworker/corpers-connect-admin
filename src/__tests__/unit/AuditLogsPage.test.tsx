import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuditLogsPage from '@/app/(admin)/audit-logs/page';
import type { AuditLog } from '@/types/models';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockSetAction = jest.fn();

const mockAuditLogsReturn = {
  data: undefined as { data: AuditLog[] } | undefined,
  isLoading: false,
  action: '',
  setAction: mockSetAction,
  hasPrev: false,
  hasNext: false,
  goNext: jest.fn(),
  goPrev: jest.fn(),
};

jest.mock('@/hooks/useAuditLogs', () => ({
  useAuditLogs: () => mockAuditLogsReturn,
}));

const mockLogs: AuditLog[] = [
  {
    id: 'log1',
    adminId: 'a1',
    admin: { firstName: 'John', lastName: 'Admin', email: 'john@admin.com' },
    action: 'SUSPEND_USER',
    targetType: 'USER',
    targetId: 'u1',
    targetLabel: 'Jane Corper',
    details: null,
    ipAddress: '192.168.1.1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'log2',
    adminId: 'a1',
    admin: { firstName: 'John', lastName: 'Admin', email: 'john@admin.com' },
    action: 'CREATE_BROADCAST',
    targetType: null,
    targetId: null,
    targetLabel: null,
    details: null,
    ipAddress: null,
    createdAt: new Date().toISOString(),
  },
];

describe('AuditLogsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuditLogsReturn.data = undefined;
    mockAuditLogsReturn.isLoading = false;
    mockAuditLogsReturn.action = '';
    mockAuditLogsReturn.hasPrev = false;
    mockAuditLogsReturn.hasNext = false;
  });

  it('renders audit logs page', () => {
    render(<AuditLogsPage />);
    expect(screen.getByTestId('audit-logs-page')).toBeInTheDocument();
  });

  it('renders the page title', () => {
    render(<AuditLogsPage />);
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
  });

  it('renders filter bar', () => {
    render(<AuditLogsPage />);
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
  });

  it('renders search input in filter bar', () => {
    render(<AuditLogsPage />);
    const input = screen.getByPlaceholderText(/filter by action/i);
    expect(input).toBeInTheDocument();
  });

  it('calls setAction when search input changes', () => {
    render(<AuditLogsPage />);
    const input = screen.getByPlaceholderText(/filter by action/i);
    fireEvent.change(input, { target: { value: 'SUSPEND_USER' } });
    expect(mockSetAction).toHaveBeenCalledWith('SUSPEND_USER');
  });

  it('renders loading skeletons when isLoading is true', () => {
    mockAuditLogsReturn.isLoading = true;
    render(<AuditLogsPage />);
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0);
  });

  it('renders audit log rows when data is available', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    expect(screen.getByText('SUSPEND_USER')).toBeInTheDocument();
    expect(screen.getByText('CREATE_BROADCAST')).toBeInTheDocument();
  });

  it('shows admin name for each log entry', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    expect(screen.getAllByText('John Admin').length).toBeGreaterThan(0);
  });

  it('shows admin email for each log entry', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    expect(screen.getAllByText('john@admin.com').length).toBeGreaterThan(0);
  });

  it('shows target label when available', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    expect(screen.getByText('Jane Corper')).toBeInTheDocument();
  });

  it('shows dash for null target label', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('shows ip address when available', () => {
    mockAuditLogsReturn.data = { data: mockLogs };
    render(<AuditLogsPage />);
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
  });

  it('shows empty state when no logs found', () => {
    mockAuditLogsReturn.data = { data: [] };
    render(<AuditLogsPage />);
    expect(screen.getByText('No audit logs found')).toBeInTheDocument();
  });

  it('renders pagination controls', () => {
    render(<AuditLogsPage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('prev button is disabled when hasPrev is false', () => {
    render(<AuditLogsPage />);
    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('next button is disabled when hasNext is false', () => {
    render(<AuditLogsPage />);
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
  });

  it('calls goNext when next button clicked', () => {
    mockAuditLogsReturn.hasNext = true;
    render(<AuditLogsPage />);
    fireEvent.click(screen.getByTestId('pagination-next'));
    expect(mockAuditLogsReturn.goNext).toHaveBeenCalled();
  });

  it('calls goPrev when prev button clicked', () => {
    mockAuditLogsReturn.hasPrev = true;
    render(<AuditLogsPage />);
    fireEvent.click(screen.getByTestId('pagination-prev'));
    expect(mockAuditLogsReturn.goPrev).toHaveBeenCalled();
  });
});
