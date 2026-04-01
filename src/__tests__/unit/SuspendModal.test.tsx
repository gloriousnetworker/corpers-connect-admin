import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SuspendModal } from '@/app/(admin)/users/SuspendModal';

describe('SuspendModal', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    isPending: false,
    userName: 'John Doe',
  };

  beforeEach(() => jest.clearAllMocks());

  it('renders modal title with user name', () => {
    render(<SuspendModal {...defaultProps} />);
    expect(screen.getByText('Suspend John Doe')).toBeInTheDocument();
  });

  it('renders reason textarea', () => {
    render(<SuspendModal {...defaultProps} />);
    expect(screen.getByTestId('suspend-reason')).toBeInTheDocument();
  });

  it('renders duration select', () => {
    render(<SuspendModal {...defaultProps} />);
    expect(screen.getByTestId('suspend-duration')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SuspendModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Suspend John Doe')).not.toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<SuspendModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows validation error when reason is too short', async () => {
    render(<SuspendModal {...defaultProps} />);
    await userEvent.type(screen.getByTestId('suspend-reason'), 'Short');
    fireEvent.click(screen.getByTestId('suspend-confirm-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('suspend-reason-error')).toBeInTheDocument();
    });
  });

  it('calls onConfirm with reason and duration on valid submit', async () => {
    render(<SuspendModal {...defaultProps} />);
    await userEvent.type(
      screen.getByTestId('suspend-reason'),
      'This user violated community guidelines multiple times.'
    );
    fireEvent.click(screen.getByTestId('suspend-confirm-btn'));
    await waitFor(() => {
      expect(defaultProps.onConfirm).toHaveBeenCalledWith(
        'This user violated community guidelines multiple times.',
        undefined
      );
    });
  });

  it('shows "Suspending…" text when isPending is true', () => {
    render(<SuspendModal {...defaultProps} isPending />);
    expect(screen.getByTestId('suspend-confirm-btn')).toHaveTextContent('Suspending…');
  });

  it('disables confirm button when isPending', () => {
    render(<SuspendModal {...defaultProps} isPending />);
    expect(screen.getByTestId('suspend-confirm-btn')).toBeDisabled();
  });
});
