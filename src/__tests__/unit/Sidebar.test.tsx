import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '@/components/shell/Sidebar';
import { AdminRole } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockPathname = '/dashboard';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
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

const mockLogout = jest.fn();
let mockAdmin = { id: '1', firstName: 'Alice', lastName: 'Admin', email: 'alice@cc.ng', role: AdminRole.ADMIN, isActive: true, lastLoginAt: null, createdAt: '' };
let mockIsSuperAdmin = false;

jest.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({
    admin: mockAdmin,
    isAuthenticated: true,
    isLoading: false,
    isSuperAdmin: mockIsSuperAdmin,
    logout: mockLogout,
  }),
}));

let mockCollapsed = false;
const mockToggle = jest.fn();

jest.mock('@/store/ui.store', () => ({
  useUiStore: (selector: (s: { sidebarCollapsed: boolean; toggleSidebar: () => void }) => unknown) =>
    selector({ sidebarCollapsed: mockCollapsed, toggleSidebar: mockToggle }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/dashboard';
    mockCollapsed = false;
    mockIsSuperAdmin = false;
    mockAdmin = { id: '1', firstName: 'Alice', lastName: 'Admin', email: 'alice@cc.ng', role: AdminRole.ADMIN, isActive: true, lastLoginAt: null, createdAt: '' };
  });

  it('renders the sidebar', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders standard nav items', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('nav-item-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-users')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-moderation')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-marketplace')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-opportunities')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-subscriptions')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-broadcasts')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-settings')).toBeInTheDocument();
  });

  it('hides SUPERADMIN-only items for regular admin', () => {
    mockIsSuperAdmin = false;
    render(<Sidebar />);
    expect(screen.queryByTestId('nav-item-admins')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-item-audit-logs')).not.toBeInTheDocument();
  });

  it('shows SUPERADMIN-only items for superadmin', () => {
    mockIsSuperAdmin = true;
    render(<Sidebar />);
    expect(screen.getByTestId('nav-item-admins')).toBeInTheDocument();
    expect(screen.getByTestId('nav-item-audit-logs')).toBeInTheDocument();
  });

  it('applies active style to current route', () => {
    mockPathname = '/dashboard';
    render(<Sidebar />);
    const dashboardLink = screen.getByTestId('nav-item-dashboard');
    expect(dashboardLink.className).toMatch(/bg-primary/);
  });

  it('does not apply active style to non-current route', () => {
    mockPathname = '/dashboard';
    render(<Sidebar />);
    const usersLink = screen.getByTestId('nav-item-users');
    expect(usersLink.className).not.toMatch(/bg-primary/);
  });

  it('displays admin name and role', () => {
    render(<Sidebar />);
    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
    expect(screen.getByText(AdminRole.ADMIN)).toBeInTheDocument();
  });

  // Note: "Alice Admin" comes from `{admin.firstName} {admin.lastName}`

  it('calls logout when sign out button is clicked', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByTestId('sidebar-logout'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('calls toggleSidebar when toggle button is clicked', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByTestId('sidebar-toggle'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders collapsed state with w-16 class', () => {
    mockCollapsed = true;
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar').className).toMatch(/w-16/);
  });

  it('renders expanded state with w-60 class', () => {
    mockCollapsed = false;
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar').className).toMatch(/w-60/);
  });

  it('shows "Expand sidebar" label when collapsed', () => {
    mockCollapsed = true;
    render(<Sidebar />);
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('shows "Collapse sidebar" label when expanded', () => {
    mockCollapsed = false;
    render(<Sidebar />);
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument();
  });
});
