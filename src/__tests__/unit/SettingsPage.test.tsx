import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPage from '@/app/(admin)/settings/page';
import type { SystemSetting } from '@/types/models';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockUpdate = { mutate: jest.fn(), isPending: false };

const mockSettingsReturn = {
  data: undefined as SystemSetting[] | undefined,
  isLoading: false,
  isError: false,
  update: mockUpdate,
};

jest.mock('@/hooks/useSettings', () => ({
  useSettings: () => mockSettingsReturn,
}));

const mockSettings: SystemSetting[] = [
  {
    key: 'MAX_PREMIUM_USERS',
    value: '10000',
    description: 'Maximum number of premium users allowed',
    updatedAt: new Date().toISOString(),
  },
  {
    key: 'REGISTRATION_OPEN',
    value: 'true',
    description: 'Whether new user registration is open',
    updatedAt: new Date().toISOString(),
  },
];

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsReturn.data = undefined;
    mockSettingsReturn.isLoading = false;
    mockSettingsReturn.isError = false;
    mockUpdate.isPending = false;
  });

  it('renders the settings page', () => {
    render(<SettingsPage />);
    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
  });

  it('renders the page title', () => {
    render(<SettingsPage />);
    expect(screen.getByText('System Settings')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    mockSettingsReturn.isLoading = true;
    render(<SettingsPage />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('shows error message when isError is true', () => {
    mockSettingsReturn.isError = true;
    render(<SettingsPage />);
    expect(screen.getByTestId('settings-error')).toBeInTheDocument();
  });

  it('shows empty state when settings is empty array', () => {
    mockSettingsReturn.data = [];
    render(<SettingsPage />);
    expect(screen.getByTestId('settings-empty')).toBeInTheDocument();
  });

  it('renders setting rows for each setting', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    expect(screen.getByTestId('setting-value-MAX_PREMIUM_USERS')).toBeInTheDocument();
    expect(screen.getByTestId('setting-value-REGISTRATION_OPEN')).toBeInTheDocument();
  });

  it('shows setting values', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    expect(screen.getByTestId('setting-value-MAX_PREMIUM_USERS')).toHaveTextContent('10000');
    expect(screen.getByTestId('setting-value-REGISTRATION_OPEN')).toHaveTextContent('true');
  });

  it('shows edit buttons for each setting', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    expect(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS')).toBeInTheDocument();
    expect(screen.getByTestId('setting-edit-REGISTRATION_OPEN')).toBeInTheDocument();
  });

  it('shows input when edit button is clicked', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    expect(screen.getByTestId('setting-input-MAX_PREMIUM_USERS')).toBeInTheDocument();
  });

  it('hides the value display when in edit mode', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    expect(screen.queryByTestId('setting-value-MAX_PREMIUM_USERS')).not.toBeInTheDocument();
  });

  it('shows save and cancel buttons in edit mode', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    expect(screen.getByTestId('setting-save-MAX_PREMIUM_USERS')).toBeInTheDocument();
    expect(screen.getByTestId('setting-cancel-MAX_PREMIUM_USERS')).toBeInTheDocument();
  });

  it('pre-fills input with current value', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    expect(screen.getByTestId('setting-input-MAX_PREMIUM_USERS')).toHaveValue('10000');
  });

  it('calls update.mutate with key and new value on save', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    fireEvent.change(screen.getByTestId('setting-input-MAX_PREMIUM_USERS'), {
      target: { value: '20000' },
    });
    fireEvent.click(screen.getByTestId('setting-save-MAX_PREMIUM_USERS'));
    expect(mockUpdate.mutate).toHaveBeenCalledWith({ key: 'MAX_PREMIUM_USERS', value: '20000' });
  });

  it('reverts to view mode and resets draft on cancel', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    fireEvent.change(screen.getByTestId('setting-input-MAX_PREMIUM_USERS'), {
      target: { value: '99999' },
    });
    fireEvent.click(screen.getByTestId('setting-cancel-MAX_PREMIUM_USERS'));
    expect(screen.queryByTestId('setting-input-MAX_PREMIUM_USERS')).not.toBeInTheDocument();
    expect(screen.getByTestId('setting-value-MAX_PREMIUM_USERS')).toHaveTextContent('10000');
  });

  it('save button is disabled when update is pending', () => {
    mockUpdate.isPending = true;
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('setting-edit-MAX_PREMIUM_USERS'));
    expect(screen.getByTestId('setting-save-MAX_PREMIUM_USERS')).toBeDisabled();
  });

  it('shows description for settings that have one', () => {
    mockSettingsReturn.data = mockSettings;
    render(<SettingsPage />);
    expect(screen.getByText('Maximum number of premium users allowed')).toBeInTheDocument();
  });
});
