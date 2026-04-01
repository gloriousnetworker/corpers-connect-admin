import { apiClient } from './client';
import type { SellerApplication, Listing, PaginatedResponse } from '@/types/models';

type RawApp = {
  id: string;
  user: { id: string; firstName: string; lastName: string; email: string; stateCode: string; profilePicture?: string | null };
  businessName: string; businessDescription: string; category: string;
  idDocumentUrl?: string | null; status: string;
  reviewedBy?: string | null; reviewNote?: string | null;
  createdAt: string; updatedAt: string;
};

export async function getSellerApplications(params?: {
  cursor?: string; status?: string; limit?: number;
}): Promise<PaginatedResponse<SellerApplication>> {
  const res = await apiClient.get('/admin/seller-applications', { params });
  const raw = res.data.data as { items?: RawApp[]; hasMore?: boolean };
  const items = raw?.items ?? [];
  return {
    data: items.map((a) => ({
      id: a.id,
      applicant: {
        id: a.user.id, firstName: a.user.firstName, lastName: a.user.lastName,
        stateCode: a.user.stateCode, profilePicture: a.user.profilePicture ?? null,
      },
      businessName: a.businessName,
      businessDescription: a.businessDescription,
      category: a.category as SellerApplication['category'],
      idDocumentUrl: a.idDocumentUrl ?? null,
      status: a.status as SellerApplication['status'],
      reviewedBy: a.reviewedBy ?? null,
      reviewNote: a.reviewNote ?? null,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.hasMore && items.length > 0 ? items[items.length - 1].id : null,
  };
}

export async function approveSellerApplication(appId: string) {
  return (await apiClient.patch(`/admin/seller-applications/${appId}/approve`)).data;
}

export async function rejectSellerApplication(appId: string, reason: string) {
  return (await apiClient.patch(`/admin/seller-applications/${appId}/reject`, { reason })).data;
}

export async function getListings(params?: {
  cursor?: string; category?: string; type?: string; status?: string; search?: string; limit?: number;
}): Promise<PaginatedResponse<Listing>> {
  const res = await apiClient.get('/marketplace/listings', { params });
  const raw = res.data.data as { items?: Listing[]; data?: Listing[]; hasMore?: boolean; nextCursor?: string | null };
  const items = (raw?.items ?? raw?.data) ?? [];
  return {
    data: items,
    hasMore: raw?.hasMore ?? false,
    nextCursor: raw?.nextCursor ?? (raw?.hasMore && items.length > 0 ? (items[items.length - 1] as {id:string}).id : null),
  };
}

export async function removeListing(listingId: string) {
  return (await apiClient.patch(`/marketplace/listings/${listingId}`, { status: 'REMOVED' })).data;
}
