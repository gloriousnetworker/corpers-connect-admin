import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminLayout } from '@/components/shell/AdminLayout';

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

jest.mock('next/link', () => {
  const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
  Link.displayName = 'Link';
  return Link;
});

jest.mock('@/hooks/useAdminAuth', () => ({
  useAdminAuth: () => ({
    admin: { id: '1', firstName: 'Alice', lastName: 'Admin', email: 'alice@cc.ng', role: 'ADMIN', isActive: true, lastLoginAt: null, createdAt: '' },
    isAuthenticated: true,
    isLoading: false,
    isSuperAdmin: false,
    logout: jest.fn(),
  }),
}));

jest.mock('@/store/ui.store', () => ({
  useUiStore: (selector: (s: { sidebarCollapsed: boolean; toggleSidebar: () => void }) => unknown) =>
    selector({ sidebarCollapsed: false, toggleSidebar: jest.fn() }),
}));

jest.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (s: { token: string; isAuthenticated: boolean; hydrate: () => void }) => unknown) =>
    selector({ token: 'mock-token', isAuthenticated: true, hydrate: jest.fn() }),
}));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AdminLayout', () => {
  it('renders admin-layout container', () => {
    render(<AdminLayout><div>content</div></AdminLayout>);
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
  });

  it('renders the sidebar', () => {
    render(<AdminLayout><div>content</div></AdminLayout>);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders the topbar', () => {
    render(<AdminLayout><div>content</div></AdminLayout>);
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
  });

  it('renders children in main area', () => {
    render(<AdminLayout><div data-testid="child-content">Hello World</div></AdminLayout>);
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('main area has correct testid', () => {
    render(<AdminLayout><div>content</div></AdminLayout>);
    expect(screen.getByTestId('admin-main')).toBeInTheDocument();
  });
});
