import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Topbar } from '@/components/shell/Topbar';
import { AdminRole } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();
let mockPathname = '/dashboard';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

const mockLogout = jest.fn();
let mockAdmin = { id: '1', firstName: 'Alice', lastName: 'Admin', email: 'alice@cc.ng', role: AdminRole.ADMIN, isActive: true, lastLoginAt: null, createdAt: '' };

jest.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({
    admin: mockAdmin,
    isAuthenticated: true,
    isLoading: false,
    isSuperAdmin: false,
    logout: mockLogout,
  }),
}));

const mockToggle = jest.fn();

jest.mock('@/store/ui.store', () => ({
  useUiStore: (selector: (s: { sidebarCollapsed: boolean; toggleSidebar: () => void }) => unknown) =>
    selector({ sidebarCollapsed: false, toggleSidebar: mockToggle }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Topbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/dashboard';
    mockAdmin = { id: '1', firstName: 'Alice', lastName: 'Admin', email: 'alice@cc.ng', role: AdminRole.ADMIN, isActive: true, lastLoginAt: null, createdAt: '' };
  });

  it('renders the topbar', () => {
    render(<Topbar />);
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('shows page title for current route', () => {
    mockPathname = '/dashboard';
    render(<Topbar />);
    expect(screen.getByTestId('topbar-title')).toHaveTextContent('Dashboard');
  });

  it('shows correct title for /users route', () => {
    mockPathname = '/users';
    render(<Topbar />);
    expect(screen.getByTestId('topbar-title')).toHaveTextContent('Users');
  });

  it('shows correct title for /moderation route', () => {
    mockPathname = '/moderation';
    render(<Topbar />);
    expect(screen.getByTestId('topbar-title')).toHaveTextContent('Moderation');
  });

  it('shows correct title for /audit-logs route', () => {
    mockPathname = '/audit-logs';
    render(<Topbar />);
    expect(screen.getByTestId('topbar-title')).toHaveTextContent('Audit Logs');
  });

  it('calls toggleSidebar when menu button is clicked', () => {
    render(<Topbar />);
    fireEvent.click(screen.getByTestId('topbar-menu-toggle'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('shows admin name in avatar button', () => {
    render(<Topbar />);
    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
  });

  // Note: "Alice Admin" comes from `{admin.firstName} {admin.lastName}`

  it('opens dropdown when avatar button clicked', () => {
    render(<Topbar />);
    expect(screen.queryByTestId('topbar-dropdown')).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    expect(screen.getByTestId('topbar-dropdown')).toBeInTheDocument();
  });

  it('shows admin email in dropdown', () => {
    render(<Topbar />);
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    expect(screen.getByText('alice@cc.ng')).toBeInTheDocument();
  });

  it('closes dropdown after clicking profile', () => {
    render(<Topbar />);
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    fireEvent.click(screen.getByTestId('topbar-profile-link'));
    expect(screen.queryByTestId('topbar-dropdown')).not.toBeInTheDocument();
  });

  it('calls logout when sign out is clicked in dropdown', () => {
    render(<Topbar />);
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    fireEvent.click(screen.getByTestId('topbar-logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('toggles dropdown closed on second click', () => {
    render(<Topbar />);
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    expect(screen.getByTestId('topbar-dropdown')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('topbar-avatar-button'));
    expect(screen.queryByTestId('topbar-dropdown')).not.toBeInTheDocument();
  });
});
