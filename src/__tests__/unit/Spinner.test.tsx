import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders with default md size', () => {
    render(<Spinner />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6');
  });

  it('renders sm size', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByTestId('spinner')).toHaveClass('w-4', 'h-4');
  });

  it('renders lg size', () => {
    render(<Spinner size="lg" />);
    expect(screen.getByTestId('spinner')).toHaveClass('w-8', 'h-8');
  });

  it('has accessible role and label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('wraps in centered container when centered=true', () => {
    const { container } = render(<Spinner centered />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });

  it('does not wrap in container when centered is false (default)', () => {
    const { container } = render(<Spinner />);
    // The root element should be the spinner itself, not a wrapper div
    expect(container.firstChild).toHaveAttribute('data-testid', 'spinner');
  });

  it('applies animate-spin class', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner')).toHaveClass('animate-spin');
  });

  it('merges custom className', () => {
    render(<Spinner className="my-custom-class" />);
    expect(screen.getByTestId('spinner')).toHaveClass('my-custom-class');
  });
});
