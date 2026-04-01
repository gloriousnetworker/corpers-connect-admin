import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies neutral variant by default', () => {
    render(<Badge>Neutral</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-surface-alt', 'text-foreground-secondary');
  });

  it('applies success variant styles', () => {
    render(<Badge variant="success">Approved</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-success-light', 'text-success');
  });

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Pending</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-warning-light', 'text-warning');
  });

  it('applies error variant styles', () => {
    render(<Badge variant="error">Suspended</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-error-light', 'text-error');
  });

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-info-light', 'text-info');
  });

  it('applies primary variant styles', () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-primary-light', 'text-primary');
  });

  it('applies gold variant styles', () => {
    render(<Badge variant="gold">CORPER</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('bg-gold-light', 'text-gold');
  });

  it('merges custom className', () => {
    render(<Badge className="uppercase">Custom</Badge>);
    expect(screen.getByTestId('badge')).toHaveClass('uppercase');
  });

  it('renders as an inline element', () => {
    render(<Badge>Inline</Badge>);
    expect(screen.getByTestId('badge').tagName).toBe('SPAN');
  });
});
