import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLoginPage from '@/app/login/page';
import { AdminRole } from '@/types/enums';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

const mockSetAuth = jest.fn();
let mockToken: string | null = null;
let mockIsAuthenticated = false;

jest.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (s: {
    token: string | null;
    isAuthenticated: boolean;
    setAuth: jest.Mock;
  }) => unknown) =>
    selector({ token: mockToken, isAuthenticated: mockIsAuthenticated, setAuth: mockSetAuth }),
}));

const mockAdminLogin = jest.fn();

jest.mock('@/lib/api/admin', () => ({
  adminLogin: (...args: unknown[]) => mockAdminLogin(...args),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockAdmin = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Admin',
  email: 'alice@cc.ng',
  role: AdminRole.ADMIN,
  isActive: true,
  lastLoginAt: null,
  createdAt: '2024-01-01T00:00:00Z',
};

function renderLoginPage() {
  return render(<AdminLoginPage />);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AdminLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToken = null;
    mockIsAuthenticated = false;
  });

  // ── Rendering ──

  it('renders the login card', () => {
    renderLoginPage();
    expect(screen.getByTestId('login-card')).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    renderLoginPage();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderLoginPage();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Sign In');
  });

  it('renders password toggle button', () => {
    renderLoginPage();
    expect(screen.getByTestId('password-toggle')).toBeInTheDocument();
  });

  it('password field is type=password by default', () => {
    renderLoginPage();
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
  });

  // ── Password visibility toggle ──

  it('toggles password visibility on click', async () => {
    renderLoginPage();
    const toggle = screen.getByTestId('password-toggle');
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });

  // ── Validation ──

  it('shows email validation error when email is empty', async () => {
    renderLoginPage();
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'not-an-email');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Enter a valid email address');
    });
  });

  it('shows password validation error when password is empty', async () => {
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'admin@cc.ng');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
    });
  });

  // ── Successful login ──

  it('calls adminLogin with correct credentials on valid submit', async () => {
    mockAdminLogin.mockResolvedValueOnce({ token: 'tok123', admin: mockAdmin });
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'password123');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockAdminLogin).toHaveBeenCalledWith('alice@cc.ng', 'password123');
    });
  });

  it('calls setAuth with token and admin on success', async () => {
    mockAdminLogin.mockResolvedValueOnce({ token: 'tok123', admin: mockAdmin });
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'password123');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith('tok123', mockAdmin);
    });
  });

  it('redirects to /dashboard after successful login', async () => {
    mockAdminLogin.mockResolvedValueOnce({ token: 'tok123', admin: mockAdmin });
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'password123');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  // ── Error handling ──

  it('displays server error message on API failure', async () => {
    mockAdminLogin.mockRejectedValueOnce(new Error('Invalid credentials'));
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'wrongpass');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toBeInTheDocument();
      expect(screen.getByTestId('login-error')).toHaveTextContent('Invalid credentials');
    });
  });

  it('clears server error on subsequent submit attempt', async () => {
    mockAdminLogin
      .mockRejectedValueOnce(new Error('Invalid credentials'))
      .mockResolvedValueOnce({ token: 'tok123', admin: mockAdmin });
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'wrongpass');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.getByTestId('login-error')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => expect(screen.queryByTestId('login-error')).not.toBeInTheDocument());
  });

  it('login error has role="alert" for accessibility', async () => {
    mockAdminLogin.mockRejectedValueOnce(new Error('Forbidden'));
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'pass');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // ── Already-authenticated redirect ──

  it('redirects to /dashboard if already authenticated', () => {
    mockToken = 'existing-token';
    mockIsAuthenticated = true;
    renderLoginPage();
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });

  // ── Loading state ──

  it('disables submit button while submitting', async () => {
    // Never resolves, so stays in loading state
    mockAdminLogin.mockReturnValue(new Promise(() => {}));
    renderLoginPage();
    await userEvent.type(screen.getByTestId('email-input'), 'alice@cc.ng');
    await userEvent.type(screen.getByTestId('password-input'), 'password123');
    fireEvent.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
});
