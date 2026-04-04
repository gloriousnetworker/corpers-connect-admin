import type {
  AdminRole,
  UserLevel,
  SubscriptionTier,
  UserStatus,
  ReportStatus,
  ReportEntityType,
  SellerApplicationStatus,
  ListingStatus,
  ListingCategory,
  ListingType,
  OpportunityType,
  SubscriptionPlan,
  SubscriptionStatus,
  BroadcastTarget,
} from './enums';

// ── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  isActive: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// ── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  stateCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string | null;
  bio?: string | null;
  servingState: string;
  lga?: string | null;
  ppa?: string | null;
  batch?: string | null;
  level: UserLevel;
  subscriptionTier: SubscriptionTier;
  isVerified: boolean;
  isSuspended: boolean;
  isOnboarded: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  storiesCount: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt?: string | null;
  suspendedReason?: string | null;
  suspendedAt?: string | null;
}

export interface UserListItem {
  id: string;
  stateCode: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string | null;
  servingState: string;
  level: UserLevel;
  subscriptionTier: SubscriptionTier;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastActiveAt?: string | null;
}

// ── Report ────────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  entityType: ReportEntityType;
  entityId: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  };
  reportedUser: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  } | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  actionTaken?: string | null;
  createdAt: string;
}

export interface ReportDetail extends Report {
  content?: {
    type: ReportEntityType;
    text?: string | null;
    mediaUrls?: string[];
    authorName?: string;
  } | null;
  reportedUserHistory?: {
    priorWarnings: number;
    priorSuspensions: number;
    priorRemovals: number;
  };
}

// ── Seller Application ────────────────────────────────────────────────────────

export interface SellerApplication {
  id: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  };
  businessName: string;
  businessDescription: string;
  category: ListingCategory;
  idDocumentUrl?: string | null;
  status: SellerApplicationStatus;
  reviewedBy?: string | null;
  reviewNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Listing ───────────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  category: ListingCategory;
  type: ListingType;
  status: ListingStatus;
  imageUrls: string[];
  viewCount: number;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Opportunity ───────────────────────────────────────────────────────────────

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  companyName: string;
  location?: string | null;
  isRemote: boolean;
  isFeatured: boolean;
  applicationCount: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

// ── Subscription ──────────────────────────────────────────────────────────────

export interface SubscriptionRecord {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    profilePicture?: string | null;
  };
  plan: SubscriptionPlan;
  amount: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string | null;
  cancelledAt?: string | null;
  createdAt: string;
}

// ── Broadcast ─────────────────────────────────────────────────────────────────

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  target: BroadcastTarget;
  targetState?: string | null;
  recipientCount: number;
  sentBy: string;
  sentByAdmin: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

// ── Audit Log ─────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  adminId: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  targetLabel?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  users: {
    total: number;
    activeToday: number;
    newThisWeek: number;
    newThisWeekChange: number;
  };
  subscriptions: {
    premium: number;
    revenue30d: number;
    revenueChange: number;
  };
  moderation: {
    pendingReports: number;
    pendingSellerApps: number;
  };
  charts: {
    userGrowth: Array<{ date: string; count: number }>;
    revenue: Array<{ date: string; amount: number }>;
    contentActivity: Array<{ date: string; posts: number; stories: number; reels: number }>;
    subscriptionMix: { free: number; premium: number };
  };
  recentReports: Array<{
    id: string;
    entityType: ReportEntityType;
    reason: string;
    status: ReportStatus;
    createdAt: string;
  }>;
  recentRegistrations: Array<{
    id: string;
    firstName: string;
    lastName: string;
    stateCode: string;
    servingState: string;
    level: UserLevel;
    createdAt: string;
  }>;
}

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string | null;
  hasMore: boolean;
  total?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
