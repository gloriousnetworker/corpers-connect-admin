import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminsPage from '@/app/(admin)/admins/page';
import type { AdminUser } from '@/types/models';
import { AdminRole } from '@/types/enums';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockCreate = { mutateAsync: jest.fn(), isPending: false };
const mockDeactivate = { mutate: jest.fn(), isPending: false };

const mockAdminsReturn = {
  data: undefined as AdminUser[] | undefined,
  isLoading: false,
  isError: false,
  create: mockCreate,
  deactivate: mockDeactivate,
};

jest.mock('@/hooks/useAdmins', () => ({
  useAdmins: () => mockAdminsReturn,
}));

const mockAdmins: AdminUser[] = [
  {
    id: 'a1',
    firstName: 'Alice',
    lastName: 'Admin',
    email: 'alice@admin.com',
    role: AdminRole.ADMIN,
    isActive: true,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    firstName: 'Bob',
    lastName: 'Super',
    email: 'bob@admin.com',
    role: AdminRole.SUPERADMIN,
    isActive: false,
    lastLoginAt: null,
    createdAt: new Date().toISOString(),
  },
];

describe('AdminsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAdminsReturn.data = undefined;
    mockAdminsReturn.isLoading = false;
    mockAdminsReturn.isError = false;
    mockCreate.isPending = false;
    mockDeactivate.isPending = false;
  });

  it('renders admins page', () => {
    render(<AdminsPage />);
    expect(screen.getByTestId('admins-page')).toBeInTheDocument();
  });

  it('renders new admin button', () => {
    render(<AdminsPage />);
    expect(screen.getByTestId('new-admin-btn')).toBeInTheDocument();
  });

  it('does not show create form initially', () => {
    render(<AdminsPage />);
    expect(screen.queryByTestId('create-admin-form-card')).not.toBeInTheDocument();
  });

  it('shows create form when new admin button is clicked', () => {
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    expect(screen.getByTestId('create-admin-form-card')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    expect(screen.getByTestId('admin-firstName')).toBeInTheDocument();
    expect(screen.getByTestId('admin-lastName')).toBeInTheDocument();
    expect(screen.getByTestId('admin-email')).toBeInTheDocument();
    expect(screen.getByTestId('admin-password')).toBeInTheDocument();
    expect(screen.getByTestId('admin-role')).toBeInTheDocument();
  });

  it('hides form on cancel', () => {
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('create-admin-form-card')).not.toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    fireEvent.click(screen.getByTestId('create-admin-submit'));
    await waitFor(() => {
      expect(screen.getAllByRole('paragraph').length).toBeGreaterThan(0);
    });
  });

  it('calls create.mutateAsync with form data on valid submit', async () => {
    mockCreate.mutateAsync.mockResolvedValue({});
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    fireEvent.change(screen.getByTestId('admin-firstName'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByTestId('admin-lastName'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByTestId('admin-email'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByTestId('admin-password'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByTestId('create-admin-submit'));
    await waitFor(() => {
      expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' })
      );
    });
  });

  it('closes form after successful create', async () => {
    mockCreate.mutateAsync.mockResolvedValue({});
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('new-admin-btn'));
    fireEvent.change(screen.getByTestId('admin-firstName'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByTestId('admin-lastName'), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByTestId('admin-email'), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByTestId('admin-password'), { target: { value: 'Password123' } });
    fireEvent.click(screen.getByTestId('create-admin-submit'));
    await waitFor(() => {
      expect(screen.queryByTestId('create-admin-form-card')).not.toBeInTheDocument();
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    mockAdminsReturn.isLoading = true;
    render(<AdminsPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error message when isError is true', () => {
    mockAdminsReturn.isError = true;
    render(<AdminsPage />);
    expect(screen.getByTestId('admins-error')).toBeInTheDocument();
  });

  it('renders admins list when data is available', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    expect(screen.getByTestId('admins-list')).toBeInTheDocument();
  });

  it('renders admin rows', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    expect(screen.getByTestId('admin-row-a1')).toBeInTheDocument();
    expect(screen.getByTestId('admin-row-a2')).toBeInTheDocument();
  });

  it('shows admin names and emails', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
    expect(screen.getByText('alice@admin.com')).toBeInTheDocument();
  });

  it('shows deactivate button only for active admins', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    expect(screen.getByTestId('deactivate-a1')).toBeInTheDocument();
    expect(screen.queryByTestId('deactivate-a2')).not.toBeInTheDocument();
  });

  it('shows confirm modal when deactivate button is clicked', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('deactivate-a1'));
    expect(screen.getByText('Deactivate Admin')).toBeInTheDocument();
  });

  it('calls deactivate.mutate when confirmed', () => {
    mockAdminsReturn.data = mockAdmins;
    render(<AdminsPage />);
    fireEvent.click(screen.getByTestId('deactivate-a1'));
    fireEvent.click(screen.getByTestId('confirm-modal-confirm-btn'));
    expect(mockDeactivate.mutate).toHaveBeenCalledWith('a1');
  });

  it('shows empty message when admin list is empty', () => {
    mockAdminsReturn.data = [];
    render(<AdminsPage />);
    expect(screen.getByText('No admin accounts found.')).toBeInTheDocument();
  });
});
