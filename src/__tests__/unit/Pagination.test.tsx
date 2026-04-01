import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/ui/Pagination';

const defaultProps = {
  hasMore: true,
  hasPrev: true,
  onNext: jest.fn(),
  onPrev: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe('Pagination', () => {
  it('renders prev and next buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByTestId('pagination-prev')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
  });

  it('calls onNext when Next is clicked', async () => {
    render(<Pagination {...defaultProps} />);
    await userEvent.click(screen.getByTestId('pagination-next'));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev when Prev is clicked', async () => {
    render(<Pagination {...defaultProps} />);
    await userEvent.click(screen.getByTestId('pagination-prev'));
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  it('disables Next button when hasMore=false', () => {
    render(<Pagination {...defaultProps} hasMore={false} />);
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
  });

  it('disables Prev button when hasPrev=false', () => {
    render(<Pagination {...defaultProps} hasPrev={false} />);
    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('disables both buttons when loading=true', () => {
    render(<Pagination {...defaultProps} loading />);
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('does not call onNext when disabled', async () => {
    render(<Pagination {...defaultProps} hasMore={false} />);
    await userEvent.click(screen.getByTestId('pagination-next'));
    expect(defaultProps.onNext).not.toHaveBeenCalled();
  });

  it('renders summary text when provided', () => {
    render(<Pagination {...defaultProps} summary="1–25 of 240" />);
    expect(screen.getByText('1–25 of 240')).toBeInTheDocument();
  });

  it('does not render summary text when omitted', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.queryByText(/of/)).not.toBeInTheDocument();
  });

  it('has accessible aria-labels on buttons', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });
});
