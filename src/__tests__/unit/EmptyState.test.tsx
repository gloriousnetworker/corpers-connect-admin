import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No users found" />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No reports" description="All clear — no pending reports." />);
    expect(screen.getByText('All clear — no pending reports.')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByText(/All clear/)).not.toBeInTheDocument();
  });

  it('renders action button when action prop is provided', () => {
    const onClick = jest.fn();
    render(<EmptyState title="No listings" action={{ label: 'Add listing', onClick }} />);
    expect(screen.getByRole('button', { name: 'Add listing' })).toBeInTheDocument();
  });

  it('calls action.onClick when button is clicked', async () => {
    const onClick = jest.fn();
    render(<EmptyState title="Empty" action={{ label: 'Retry', onClick }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when action is omitted', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(<EmptyState icon={FolderOpen} title="Empty folder" />);
    // The icon renders as an SVG inside the container
    const container = screen.getByTestId('empty-state');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<EmptyState title="Empty" className="my-custom-class" />);
    expect(screen.getByTestId('empty-state')).toHaveClass('my-custom-class');
  });
});
