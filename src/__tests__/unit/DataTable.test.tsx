import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const columns: ColumnDef<User, unknown>[] = [
  { accessorKey: 'name',   header: 'Name' },
  { accessorKey: 'email',  header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
];

const data: User[] = [
  { id: '1', name: 'Iniubong Udofot',        email: 'ini@test.com',    status: 'active' },
  { id: '2', name: 'Pascal Chukwuemerie',    email: 'pascal@test.com', status: 'suspended' },
  { id: '3', name: 'Ada Obi',                email: 'ada@test.com',    status: 'active' },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders all data rows', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getAllByTestId('data-table-row')).toHaveLength(3);
  });

  it('renders correct cell values', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Iniubong Udofot')).toBeInTheDocument();
    expect(screen.getByText('pascal@test.com')).toBeInTheDocument();
  });

  it('shows skeleton rows when loading=true', () => {
    render(<DataTable columns={columns} data={[]} loading skeletonRows={3} />);
    expect(screen.getByTestId('skeleton-row')).toBeInTheDocument();
    expect(screen.queryByTestId('data-table-row')).not.toBeInTheDocument();
  });

  it('shows empty state when data is empty and not loading', () => {
    render(<DataTable columns={columns} data={[]} emptyTitle="No users found" />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('shows empty description when provided', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyTitle="No users"
        emptyDescription="Try adjusting your filters."
      />,
    );
    expect(screen.getByText('Try adjusting your filters.')).toBeInTheDocument();
  });

  it('calls onRowClick with the row data when a row is clicked', async () => {
    const onRowClick = jest.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    await userEvent.click(screen.getAllByTestId('data-table-row')[0]);
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('does not call onRowClick when onRowClick is not provided', async () => {
    // No error should be thrown
    render(<DataTable columns={columns} data={data} />);
    await userEvent.click(screen.getAllByTestId('data-table-row')[0]);
  });

  it('applies cursor-pointer when onRowClick is provided', () => {
    render(<DataTable columns={columns} data={data} onRowClick={jest.fn()} />);
    expect(screen.getAllByTestId('data-table-row')[0]).toHaveClass('cursor-pointer');
  });

  it('does not apply cursor-pointer when onRowClick is absent', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getAllByTestId('data-table-row')[0]).not.toHaveClass('cursor-pointer');
  });

  it('renders correct number of skeleton columns matching column count', () => {
    render(<DataTable columns={columns} data={[]} loading skeletonRows={1} />);
    const skeletonTds = screen.getByTestId('skeleton-row').querySelectorAll('td');
    expect(skeletonTds).toHaveLength(3); // matches columns.length
  });

  it('wraps in an overflow-x-auto container', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByTestId('data-table')).toHaveClass('overflow-x-auto');
  });
});
