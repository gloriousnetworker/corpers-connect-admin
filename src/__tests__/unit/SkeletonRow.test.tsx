import { render, screen } from '@testing-library/react';
import { SkeletonRow } from '@/components/ui/SkeletonRow';

describe('SkeletonRow', () => {
  it('renders default 5 rows and 5 columns', () => {
    render(
      <table>
        <SkeletonRow />
      </table>,
    );
    const tbody = screen.getByTestId('skeleton-row');
    expect(tbody.querySelectorAll('tr')).toHaveLength(5);
    expect(tbody.querySelectorAll('tr')[0].querySelectorAll('td')).toHaveLength(5);
  });

  it('renders correct number of rows when rows prop is set', () => {
    render(
      <table>
        <SkeletonRow rows={3} />
      </table>,
    );
    const tbody = screen.getByTestId('skeleton-row');
    expect(tbody.querySelectorAll('tr')).toHaveLength(3);
  });

  it('renders correct number of columns when columns prop is set', () => {
    render(
      <table>
        <SkeletonRow columns={7} rows={1} />
      </table>,
    );
    const tbody = screen.getByTestId('skeleton-row');
    expect(tbody.querySelectorAll('tr')[0].querySelectorAll('td')).toHaveLength(7);
  });

  it('each cell contains a shimmer element', () => {
    render(
      <table>
        <SkeletonRow rows={1} columns={3} />
      </table>,
    );
    const cells = screen.getByTestId('skeleton-row').querySelectorAll('td');
    cells.forEach((cell) => {
      expect(cell.querySelector('.shimmer')).toBeInTheDocument();
    });
  });

  it('renders as a tbody element', () => {
    render(
      <table>
        <SkeletonRow />
      </table>,
    );
    expect(screen.getByTestId('skeleton-row').tagName).toBe('TBODY');
  });
});
