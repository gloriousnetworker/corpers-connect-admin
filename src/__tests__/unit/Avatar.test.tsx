import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  it('renders initials when no src is provided', () => {
    render(<Avatar firstName="Iniubong" lastName="Udofot" />);
    expect(screen.getByText('IU')).toBeInTheDocument();
  });

  it('renders initials correctly for different names', () => {
    render(<Avatar firstName="Pascal" lastName="Chukwuemerie" />);
    expect(screen.getByText('PC')).toBeInTheDocument();
  });

  it('renders an image when src is provided', () => {
    render(
      <Avatar
        src="https://res.cloudinary.com/test/image/upload/avatar.jpg"
        firstName="Ada"
        lastName="Obi"
      />,
    );
    const img = screen.getByAltText('Ada Obi');
    expect(img).toBeInTheDocument();
  });

  it('does not render an image when src is null', () => {
    render(<Avatar src={null} firstName="Ada" lastName="Obi" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('AO')).toBeInTheDocument();
  });

  it('applies sm size class', () => {
    render(<Avatar firstName="A" lastName="B" size="sm" />);
    expect(screen.getByTestId('avatar')).toHaveClass('w-7', 'h-7');
  });

  it('applies md size class by default', () => {
    render(<Avatar firstName="A" lastName="B" />);
    expect(screen.getByTestId('avatar')).toHaveClass('w-9', 'h-9');
  });

  it('applies lg size class', () => {
    render(<Avatar firstName="A" lastName="B" size="lg" />);
    expect(screen.getByTestId('avatar')).toHaveClass('w-12', 'h-12');
  });

  it('applies xl size class', () => {
    render(<Avatar firstName="A" lastName="B" size="xl" />);
    expect(screen.getByTestId('avatar')).toHaveClass('w-16', 'h-16');
  });

  it('merges custom className', () => {
    render(<Avatar firstName="A" lastName="B" className="ring-2 ring-primary" />);
    expect(screen.getByTestId('avatar')).toHaveClass('ring-2', 'ring-primary');
  });

  it('renders as a div with rounded-full', () => {
    render(<Avatar firstName="A" lastName="B" />);
    expect(screen.getByTestId('avatar')).toHaveClass('rounded-full');
  });
});
