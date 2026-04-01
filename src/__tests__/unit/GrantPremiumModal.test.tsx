import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GrantPremiumModal } from '@/app/(admin)/users/GrantPremiumModal';

describe('GrantPremiumModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    isPending: false,
    userName: 'Jane Smith',
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders modal title with user name', () => {
    render(<GrantPremiumModal {...defaultProps} />);
    expect(screen.getByText('Grant Premium — Jane Smith')).toBeInTheDocument();
  });

  it('renders plan select', () => {
    render(<GrantPremiumModal {...defaultProps} />);
    expect(screen.getByTestId('grant-plan')).toBeInTheDocument();
  });

  it('renders duration input', () => {
    render(<GrantPremiumModal {...defaultProps} />);
    expect(screen.getByTestId('grant-duration')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<GrantPremiumModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Grant Premium — Jane Smith')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<GrantPremiumModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with plan and duration on valid submit', async () => {
    render(<GrantPremiumModal {...defaultProps} />);
    // Default plan is MONTHLY, default duration is 1
    fireEvent.click(screen.getByTestId('grant-confirm-btn'));
    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith('MONTHLY', 1);
    });
  });

  it('calls onConfirm with selected plan', async () => {
    render(<GrantPremiumModal {...defaultProps} />);
    await userEvent.selectOptions(screen.getByTestId('grant-plan'), 'ANNUAL');
    fireEvent.click(screen.getByTestId('grant-confirm-btn'));
    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith('ANNUAL', 1);
    });
  });

  it('shows "Granting…" when isPending', () => {
    render(<GrantPremiumModal {...defaultProps} isPending />);
    expect(screen.getByTestId('grant-confirm-btn')).toHaveTextContent('Granting…');
  });

  it('disables confirm button when isPending', () => {
    render(<GrantPremiumModal {...defaultProps} isPending />);
    expect(screen.getByTestId('grant-confirm-btn')).toBeDisabled();
  });
});
