import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MarketplacePage from '@/app/(admin)/marketplace/page';
import type { SellerApplication, Listing } from '@/types/models';
import { SellerApplicationStatus, ListingStatus, ListingCategory, ListingType } from '@/types/enums';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/image', () => {
  const Img = ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />;
  Img.displayName = 'Image';
  return Img;
});

const mockApprove = { mutate: jest.fn(), isPending: false };
const mockReject = { mutate: jest.fn(), isPending: false };
const mockRemove = { mutate: jest.fn(), isPending: false };

const mockAppsReturn = {
  data: undefined as { data: SellerApplication[] } | undefined,
  isLoading: false,
  statusFilter: '',
  setStatusFilter: jest.fn(),
  hasPrev: false, hasNext: false,
  goNext: jest.fn(), goPrev: jest.fn(),
  approve: mockApprove,
  reject: mockReject,
};

const mockListingsReturn = {
  data: undefined as { data: Listing[] } | undefined,
  isLoading: false,
  search: '', setSearch: jest.fn(),
  statusFilter: '', setStatusFilter: jest.fn(),
  hasPrev: false, hasNext: false,
  goNext: jest.fn(), goPrev: jest.fn(),
  remove: mockRemove,
};

jest.mock('@/hooks/useMarketplace', () => ({
  useSellerApplications: () => mockAppsReturn,
  useListings: () => mockListingsReturn,
}));

const mockApp: SellerApplication = {
  id: 'app1',
  applicant: { id: 'u1', firstName: 'Alice', lastName: 'A', stateCode: 'LA/23A/1' },
  businessName: 'Alice Designs',
  businessDescription: 'Creative designs',
  category: ListingCategory.SERVICES,
  status: SellerApplicationStatus.PENDING,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockListing: Listing = {
  id: 'lst1',
  title: 'iPhone 14',
  description: 'Brand new phone',
  price: 250000,
  category: ListingCategory.ELECTRONICS,
  type: ListingType.FOR_SALE,
  status: ListingStatus.ACTIVE,
  imageUrls: [],
  viewCount: 120,
  seller: { id: 'u2', firstName: 'Bob', lastName: 'B', stateCode: 'RV/23A/2' },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('MarketplacePage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders marketplace page', () => {
    render(<MarketplacePage />);
    expect(screen.getByTestId('marketplace-page')).toBeInTheDocument();
  });

  it('renders tab buttons', () => {
    render(<MarketplacePage />);
    expect(screen.getByTestId('tab-applications')).toBeInTheDocument();
    expect(screen.getByTestId('tab-listings')).toBeInTheDocument();
  });

  it('shows applications tab content by default', () => {
    render(<MarketplacePage />);
    expect(screen.getByTestId('applications-tab-content')).toBeInTheDocument();
  });

  it('switches to listings tab on click', () => {
    render(<MarketplacePage />);
    fireEvent.click(screen.getByTestId('tab-listings'));
    expect(screen.getByTestId('listings-tab-content')).toBeInTheDocument();
  });

  it('renders application rows', () => {
    mockAppsReturn.data = { data: [mockApp] };
    render(<MarketplacePage />);
    expect(screen.getByText('Alice Designs')).toBeInTheDocument();
    mockAppsReturn.data = undefined;
  });

  it('renders approve and reject buttons for pending application', () => {
    mockAppsReturn.data = { data: [mockApp] };
    render(<MarketplacePage />);
    expect(screen.getByTestId('approve-app1')).toBeInTheDocument();
    expect(screen.getByTestId('reject-app1')).toBeInTheDocument();
    mockAppsReturn.data = undefined;
  });

  it('calls approve.mutate when approve is clicked', () => {
    mockAppsReturn.data = { data: [mockApp] };
    render(<MarketplacePage />);
    fireEvent.click(screen.getByTestId('approve-app1'));
    expect(mockApprove.mutate).toHaveBeenCalledWith('app1');
    mockAppsReturn.data = undefined;
  });

  it('renders listing rows in listings tab', () => {
    mockListingsReturn.data = { data: [mockListing] };
    render(<MarketplacePage />);
    fireEvent.click(screen.getByTestId('tab-listings'));
    expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    mockListingsReturn.data = undefined;
  });

  it('renders remove button for active listing', () => {
    mockListingsReturn.data = { data: [mockListing] };
    render(<MarketplacePage />);
    fireEvent.click(screen.getByTestId('tab-listings'));
    expect(screen.getByTestId('remove-lst1')).toBeInTheDocument();
    mockListingsReturn.data = undefined;
  });

  it('shows reject confirm modal when reject is clicked', () => {
    mockAppsReturn.data = { data: [mockApp] };
    render(<MarketplacePage />);
    fireEvent.click(screen.getByTestId('reject-app1'));
    expect(screen.getByText('Reject Application')).toBeInTheDocument();
    mockAppsReturn.data = undefined;
  });
});
