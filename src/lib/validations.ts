import { z } from 'zod';
import { AdminRole, BroadcastTarget } from '@/types/enums';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const suspendUserSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
  duration: z.string().optional(),
});
export type SuspendUserInput = z.infer<typeof suspendUserSchema>;

export const grantPremiumSchema = z.object({
  plan: z.string().min(1, 'Select a plan'),
  durationMonths: z.number().int().min(1).max(36),
});
export type GrantPremiumInput = z.infer<typeof grantPremiumSchema>;

export const createAdminSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.nativeEnum(AdminRole),
});
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export const broadcastSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  target: z.nativeEnum(BroadcastTarget),
  targetState: z.string().optional(),
});
export type BroadcastInput = z.infer<typeof broadcastSchema>;

export const rejectSellerSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});
export type RejectSellerInput = z.infer<typeof rejectSellerSchema>;

export const reviewReportSchema = z.object({
  reason: z.string().max(500).optional(),
});
export type ReviewReportInput = z.infer<typeof reviewReportSchema>;
