import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionModal } from '@/components/ui/ActionModal';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  title: 'Suspend User',
};

beforeEach(() => jest.clearAllMocks());

describe('ActionModal', () => {
  it('renders when open=true', () => {
    render(<ActionModal {...defaultProps}><p>Body content</p></ActionModal>);
    expect(screen.getByTestId('action-modal')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    render(<ActionModal {...defaultProps} open={false}><p>Hidden</p></ActionModal>);
    expect(screen.queryByTestId('action-modal')).not.toBeInTheDocument();
  });

  it('renders title in header', () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    expect(screen.getByText('Suspend User')).toBeInTheDocument();
  });

  it('renders children in body', () => {
    render(
      <ActionModal {...defaultProps}>
        <input placeholder="Reason for suspension" />
      </ActionModal>,
    );
    expect(screen.getByPlaceholderText('Reason for suspension')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <ActionModal {...defaultProps} footer={<button>Save</button>}>
        <p>Body</p>
      </ActionModal>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not render footer section when footer is omitted', () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    // There should be no border-t div for the footer
    const modal = screen.getByTestId('action-modal');
    const children = Array.from(modal.children);
    expect(children).toHaveLength(2); // header + body only
  });

  it('calls onClose when X button is clicked', async () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    await userEvent.click(screen.getByLabelText('Close'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop overlay is clicked', async () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    await userEvent.click(screen.getByTestId('action-modal-overlay'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('applies sm size class', () => {
    render(<ActionModal {...defaultProps} size="sm"><p>Body</p></ActionModal>);
    expect(screen.getByTestId('action-modal')).toHaveClass('max-w-sm');
  });

  it('applies md size class by default', () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    expect(screen.getByTestId('action-modal')).toHaveClass('max-w-md');
  });

  it('applies lg size class', () => {
    render(<ActionModal {...defaultProps} size="lg"><p>Body</p></ActionModal>);
    expect(screen.getByTestId('action-modal')).toHaveClass('max-w-lg');
  });

  it('has accessible role=dialog', () => {
    render(<ActionModal {...defaultProps}><p>Body</p></ActionModal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
