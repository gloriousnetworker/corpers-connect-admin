import { apiClient } from './client';
import type { SellerApplication, Listing, PaginatedResponse } from '@/types/models';

export async function getSellerApplications(params?: {
  cursor?: string;
  status?: string;
  limit?: number;
}): Promise<PaginatedResponse<SellerApplication>> {
  const res = await apiClient.get('/admin/seller-applications', { params });
  return res.data.data;
}

export async function approveSellerApplication(appId: string) {
  const res = await apiClient.patch(`/admin/seller-applications/${appId}/approve`);
  return res.data;
}

export async function rejectSellerApplication(appId: string, reason: string) {
  const res = await apiClient.patch(`/admin/seller-applications/${appId}/reject`, { reason });
  return res.data;
}

export async function getListings(params?: {
  cursor?: string;
  category?: string;
  type?: string;
  status?: string;
  search?: string;
  limit?: number;
}): Promise<PaginatedResponse<Listing>> {
  const res = await apiClient.get('/marketplace/listings', { params });
  return res.data.data;
}

export async function removeListing(listingId: string) {
  const res = await apiClient.patch(`/marketplace/listings/${listingId}`, { status: 'REMOVED' });
  return res.data;
}
