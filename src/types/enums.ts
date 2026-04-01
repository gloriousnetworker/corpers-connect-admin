export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum UserLevel {
  OTONDO = 'OTONDO',
  KOPA = 'KOPA',
  CORPER = 'CORPER',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  ACTIONED = 'ACTIONED',
  DISMISSED = 'DISMISSED',
}

export enum ReportEntityType {
  POST = 'POST',
  STORY = 'STORY',
  REEL = 'REEL',
  LISTING = 'LISTING',
  USER = 'USER',
  COMMENT = 'COMMENT',
}

export enum ReportAction {
  DISMISS = 'dismiss',
  WARN = 'warn',
  REMOVE = 'remove',
  SUSPEND = 'suspend',
  ESCALATE = 'escalate',
}

export enum SellerApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  INACTIVE = 'INACTIVE',
  REMOVED = 'REMOVED',
}

export enum ListingCategory {
  HOUSING = 'HOUSING',
  UNIFORM = 'UNIFORM',
  ELECTRONICS = 'ELECTRONICS',
  FOOD = 'FOOD',
  SERVICES = 'SERVICES',
  OPPORTUNITIES = 'OPPORTUNITIES',
  OTHERS = 'OTHERS',
}

export enum ListingType {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SERVICE = 'SERVICE',
  FREE = 'FREE',
}

export enum OpportunityType {
  INTERNSHIP = 'INTERNSHIP',
  JOB = 'JOB',
  SCHOLARSHIP = 'SCHOLARSHIP',
  VOLUNTEERING = 'VOLUNTEERING',
  OTHER = 'OTHER',
}

export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum BroadcastTarget {
  ALL = 'ALL',
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  STATE = 'STATE',
  OTONDO = 'OTONDO',
  KOPA = 'KOPA',
  CORPER = 'CORPER',
}
