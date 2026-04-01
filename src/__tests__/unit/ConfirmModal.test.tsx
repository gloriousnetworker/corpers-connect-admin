import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  title: 'Delete User',
  description: 'This action cannot be undone.',
};

beforeEach(() => jest.clearAllMocks());

describe('ConfirmModal', () => {
  it('renders when open=true', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<ConfirmModal {...defaultProps} open={false} />);
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });

  it('displays title and description', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Delete User')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Confirm button is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);
    await userEvent.click(screen.getByTestId('confirm-modal-confirm-btn'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);
    await userEvent.click(screen.getByLabelText('Close'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    render(<ConfirmModal {...defaultProps} />);
    await userEvent.click(screen.getByTestId('confirm-modal-overlay'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom confirmLabel and cancelLabel', () => {
    render(
      <ConfirmModal {...defaultProps} confirmLabel="Yes, delete" cancelLabel="Go back" />,
    );
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
  });

  it('disables buttons when loading=true', () => {
    render(<ConfirmModal {...defaultProps} loading />);
    expect(screen.getByTestId('confirm-modal-confirm-btn')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('shows spinner when loading=true', () => {
    render(<ConfirmModal {...defaultProps} loading />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('applies danger variant styles to confirm button', () => {
    render(<ConfirmModal {...defaultProps} variant="danger" />);
    expect(screen.getByTestId('confirm-modal-confirm-btn')).toHaveClass('bg-error');
  });

  it('applies default variant styles to confirm button', () => {
    render(<ConfirmModal {...defaultProps} variant="default" />);
    expect(screen.getByTestId('confirm-modal-confirm-btn')).toHaveClass('bg-primary');
  });

  it('has accessible role=dialog and aria-modal', () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal');
  });
});
