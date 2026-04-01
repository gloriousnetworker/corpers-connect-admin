import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BroadcastsPage from '@/app/(admin)/broadcasts/page';
import type { Broadcast } from '@/types/models';
import { BroadcastTarget } from '@/types/enums';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockCreate = { mutateAsync: jest.fn(), isPending: false };

const mockBroadcastsReturn = {
  data: undefined as { data: Broadcast[] } | undefined,
  isLoading: false,
  hasPrev: false,
  hasNext: false,
  goNext: jest.fn(),
  goPrev: jest.fn(),
  create: mockCreate,
};

jest.mock('@/hooks/useBroadcasts', () => ({
  useBroadcasts: () => mockBroadcastsReturn,
}));

const mockBroadcast: Broadcast = {
  id: 'bc1',
  title: 'Welcome Corpers!',
  message: 'Hello to all new corps members.',
  target: BroadcastTarget.ALL,
  targetState: null,
  recipientCount: 5000,
  sentBy: 'admin1',
  sentByAdmin: { firstName: 'John', lastName: 'Doe' },
  createdAt: new Date().toISOString(),
};

describe('BroadcastsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBroadcastsReturn.data = undefined;
    mockBroadcastsReturn.isLoading = false;
    mockCreate.isPending = false;
  });

  it('renders the broadcasts page', () => {
    render(<BroadcastsPage />);
    expect(screen.getByTestId('broadcasts-page')).toBeInTheDocument();
  });

  it('renders the new broadcast button', () => {
    render(<BroadcastsPage />);
    expect(screen.getByTestId('new-broadcast-btn')).toBeInTheDocument();
  });

  it('does not show compose form initially', () => {
    render(<BroadcastsPage />);
    expect(screen.queryByTestId('broadcast-form-card')).not.toBeInTheDocument();
  });

  it('shows compose form when new broadcast button is clicked', () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    expect(screen.getByTestId('broadcast-form-card')).toBeInTheDocument();
  });

  it('renders all form fields in compose form', () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    expect(screen.getByTestId('broadcast-title')).toBeInTheDocument();
    expect(screen.getByTestId('broadcast-message')).toBeInTheDocument();
    expect(screen.getByTestId('broadcast-target')).toBeInTheDocument();
    expect(screen.getByTestId('broadcast-submit')).toBeInTheDocument();
  });

  it('hides the form on cancel', () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    expect(screen.getByTestId('broadcast-form-card')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('broadcast-form-card')).not.toBeInTheDocument();
  });

  it('shows target state input when STATE target is selected', () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    fireEvent.change(screen.getByTestId('broadcast-target'), { target: { value: BroadcastTarget.STATE } });
    expect(screen.getByTestId('broadcast-target-state')).toBeInTheDocument();
  });

  it('does not show target state input for non-STATE targets', () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    fireEvent.change(screen.getByTestId('broadcast-target'), { target: { value: BroadcastTarget.ALL } });
    expect(screen.queryByTestId('broadcast-target-state')).not.toBeInTheDocument();
  });

  it('shows validation error when title is empty on submit', async () => {
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    fireEvent.click(screen.getByTestId('broadcast-submit'));
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('calls create.mutateAsync with form data on valid submit', async () => {
    mockCreate.mutateAsync.mockResolvedValue({});
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    fireEvent.change(screen.getByTestId('broadcast-title'), { target: { value: 'Test Broadcast' } });
    fireEvent.change(screen.getByTestId('broadcast-message'), { target: { value: 'Hello everyone!' } });
    fireEvent.click(screen.getByTestId('broadcast-submit'));
    await waitFor(() => {
      expect(mockCreate.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Test Broadcast', message: 'Hello everyone!' })
      );
    });
  });

  it('closes form after successful submit', async () => {
    mockCreate.mutateAsync.mockResolvedValue({});
    render(<BroadcastsPage />);
    fireEvent.click(screen.getByTestId('new-broadcast-btn'));
    fireEvent.change(screen.getByTestId('broadcast-title'), { target: { value: 'Test Broadcast' } });
    fireEvent.change(screen.getByTestId('broadcast-message'), { target: { value: 'Hello everyone!' } });
    fireEvent.click(screen.getByTestId('broadcast-submit'));
    await waitFor(() => {
      expect(screen.queryByTestId('broadcast-form-card')).not.toBeInTheDocument();
    });
  });

  it('renders broadcast rows in the data table', () => {
    mockBroadcastsReturn.data = { data: [mockBroadcast] };
    render(<BroadcastsPage />);
    expect(screen.getByText('Welcome Corpers!')).toBeInTheDocument();
  });

  it('shows recipient count for broadcasts', () => {
    mockBroadcastsReturn.data = { data: [mockBroadcast] };
    render(<BroadcastsPage />);
    expect(screen.getByText('5,000')).toBeInTheDocument();
  });

  it('shows sender name in broadcasts table', () => {
    mockBroadcastsReturn.data = { data: [mockBroadcast] };
    render(<BroadcastsPage />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    mockBroadcastsReturn.isLoading = true;
    render(<BroadcastsPage />);
    expect(screen.getAllByTestId('skeleton-row').length).toBeGreaterThan(0);
  });

  it('renders pagination controls', () => {
    render(<BroadcastsPage />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('prev button is disabled when hasPrev is false', () => {
    mockBroadcastsReturn.hasPrev = false;
    render(<BroadcastsPage />);
    expect(screen.getByTestId('pagination-prev')).toBeDisabled();
  });

  it('next button is disabled when hasNext is false', () => {
    mockBroadcastsReturn.hasNext = false;
    render(<BroadcastsPage />);
    expect(screen.getByTestId('pagination-next')).toBeDisabled();
  });
});
