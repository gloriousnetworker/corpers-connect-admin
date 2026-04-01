import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar, type FilterConfig } from '@/components/ui/FilterBar';

const mockSearch = { value: '', onChange: jest.fn(), placeholder: 'Search users…' };

const mockFilters: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    value: 'all',
    onChange: jest.fn(),
    options: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
];

beforeEach(() => jest.clearAllMocks());

describe('FilterBar', () => {
  it('renders the search input', () => {
    render(<FilterBar search={mockSearch} />);
    expect(screen.getByTestId('filter-bar-search')).toBeInTheDocument();
  });

  it('shows search placeholder', () => {
    render(<FilterBar search={mockSearch} />);
    expect(screen.getByPlaceholderText('Search users…')).toBeInTheDocument();
  });

  it('calls search.onChange when typing', async () => {
    render(<FilterBar search={mockSearch} />);
    await userEvent.type(screen.getByTestId('filter-bar-search'), 'Iniubong');
    expect(mockSearch.onChange).toHaveBeenCalled();
  });

  it('renders filters toggle button when filters are provided', () => {
    render(<FilterBar filters={mockFilters} />);
    expect(screen.getByTestId('filter-bar-toggle')).toBeInTheDocument();
  });

  it('does not render toggle when no filters', () => {
    render(<FilterBar search={mockSearch} />);
    expect(screen.queryByTestId('filter-bar-toggle')).not.toBeInTheDocument();
  });

  it('expands filter dropdowns on toggle click', async () => {
    render(<FilterBar filters={mockFilters} />);
    expect(screen.queryByTestId('filter-bar-expanded')).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId('filter-bar-toggle'));
    expect(screen.getByTestId('filter-bar-expanded')).toBeInTheDocument();
  });

  it('collapses filters on second toggle click', async () => {
    render(<FilterBar filters={mockFilters} />);
    await userEvent.click(screen.getByTestId('filter-bar-toggle'));
    await userEvent.click(screen.getByTestId('filter-bar-toggle'));
    expect(screen.queryByTestId('filter-bar-expanded')).not.toBeInTheDocument();
  });

  it('renders filter select with options when expanded', async () => {
    render(<FilterBar filters={mockFilters} />);
    await userEvent.click(screen.getByTestId('filter-bar-toggle'));
    const select = screen.getByTestId('filter-select-status');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Suspended')).toBeInTheDocument();
  });

  it('calls filter onChange when select value changes', async () => {
    render(<FilterBar filters={mockFilters} />);
    await userEvent.click(screen.getByTestId('filter-bar-toggle'));
    await userEvent.selectOptions(screen.getByTestId('filter-select-status'), 'active');
    expect(mockFilters[0].onChange).toHaveBeenCalledWith('active');
  });

  it('shows Clear all button when search has value', () => {
    const onClear = jest.fn();
    render(<FilterBar search={{ ...mockSearch, value: 'test' }} onClear={onClear} />);
    expect(screen.getByTestId('filter-bar-clear')).toBeInTheDocument();
  });

  it('calls onClear when Clear all is clicked', async () => {
    const onClear = jest.fn();
    render(<FilterBar search={{ ...mockSearch, value: 'test' }} onClear={onClear} />);
    await userEvent.click(screen.getByTestId('filter-bar-clear'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('does not show Clear all when no active filters', () => {
    render(<FilterBar search={mockSearch} onClear={jest.fn()} />);
    expect(screen.queryByTestId('filter-bar-clear')).not.toBeInTheDocument();
  });
});
