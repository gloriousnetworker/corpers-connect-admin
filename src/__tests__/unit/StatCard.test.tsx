import { render, screen } from '@testing-library/react';
import { Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard icon={Users} label="Total Users" value={1240} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-value')).toHaveTextContent('1240');
  });

  it('renders string value', () => {
    render(<StatCard icon={Users} label="Revenue" value="₦50,000" />);
    expect(screen.getByTestId('stat-card-value')).toHaveTextContent('₦50,000');
  });

  it('renders no change chip when change is undefined', () => {
    render(<StatCard icon={Users} label="Users" value={10} />);
    expect(screen.queryByTestId('stat-card-change')).not.toBeInTheDocument();
  });

  it('renders positive change chip with success styles', () => {
    render(<StatCard icon={Users} label="Users" value={10} change={12} />);
    const chip = screen.getByTestId('stat-card-change');
    expect(chip).toHaveTextContent('12%');
    expect(chip).toHaveClass('bg-success-light', 'text-success');
  });

  it('renders negative change chip with error styles', () => {
    render(<StatCard icon={Users} label="Users" value={10} change={-5} />);
    const chip = screen.getByTestId('stat-card-change');
    expect(chip).toHaveTextContent('5%');
    expect(chip).toHaveClass('bg-error-light', 'text-error');
  });

  it('renders flat change chip with muted styles when change is 0', () => {
    render(<StatCard icon={Users} label="Users" value={10} change={0} />);
    const chip = screen.getByTestId('stat-card-change');
    expect(chip).toHaveClass('bg-surface-alt', 'text-foreground-muted');
  });

  it('appends changeLabel to change chip', () => {
    render(<StatCard icon={Users} label="Users" value={10} change={8} changeLabel="this week" />);
    expect(screen.getByTestId('stat-card-change')).toHaveTextContent('8% this week');
  });

  it('renders as a Link when href is provided', () => {
    render(<StatCard icon={Users} label="Reports" value={3} href="/moderation" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/moderation');
  });

  it('does not render a link when href is absent', () => {
    render(<StatCard icon={Users} label="Reports" value={3} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the icon container', () => {
    render(<StatCard icon={Users} label="Users" value={5} />);
    expect(screen.getByTestId('stat-card')).toBeInTheDocument();
  });
});
