# Corpers Connect — Admin Panel User Story Document

**Version:** 1.0.0
**Date:** 2026-03-22
**Status:** Planning Phase

---

## 1. Overview

The Corpers Connect Admin Panel is an internal web application used exclusively by the Corpers Connect operations team to manage users, moderate content, oversee the Mami Market, handle subscriptions, broadcast messages, and view analytics across the platform.

It is separate from the user-facing app and is accessible only to authorised staff with admin or superadmin credentials.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | TanStack Query + Zustand |
| Forms | React Hook Form + Zod |
| Charts / Analytics | Recharts |
| Tables | TanStack Table |
| Auth | JWT-based (admin-specific tokens) |

---

## 3. Admin Roles

| Role | Description |
|---|---|
| **SUPERADMIN** | Full access including creating/managing other admin accounts |
| **ADMIN** | Full access except admin account management |
| **MODERATOR** (future) | Content moderation only — no user management |

---

## 4. Admin Screens & Modules

### 4.1 Authentication

- Admin login screen: email + password only.
- No NYSC state code — admins are staff, not corps members.
- Failed login locked after 5 attempts.
- Session expires after 8 hours of inactivity.
- First-time login forces a password change.
- Audit log: every admin login is recorded with IP and timestamp.

---

### 4.2 Dashboard (Analytics Overview)

The first screen after login. Shows key metrics at a glance:

**User Stats:**
- Total registered users (all-time)
- New users today / this week / this month
- Active users (DAU / WAU / MAU)
- Users by serving state (bar chart)
- Users by level: Otondo / Kopa / Corper (pie chart)
- Verified users count

**Content Stats:**
- Total posts today / this week
- Total stories active right now
- Total reels
- Trending posts (top 5 by engagement)

**Marketplace Stats:**
- Total active listings
- New listings today
- Total sold/fulfilled listings
- Pending verified seller applications

**Subscription Stats:**
- Total premium subscribers
- New subscriptions this month
- Revenue this month (₦)
- Churn rate

**Moderation Stats:**
- Open reports (unreviewed)
- Reports actioned today
- Flagged listings awaiting review

---

### 4.3 User Management

**User List Screen:**
- Searchable, sortable, paginated table.
- Columns: Name, State Code, Email, Serving State, Level, Verified, Subscription, Status, Joined, Actions.
- Filter by: serving state, level, subscription tier, status (active / suspended).
- Bulk actions: suspend, export.

**User Detail Screen:**
- All profile fields displayed.
- Posts, stories, reels by this user.
- Active marketplace listings.
- Recent activity log (logins, posts, chats, calls).
- Subscription history.
- Reports filed against this user.

**Admin Actions on a User:**
- **Verify** — grant verified badge.
- **Unverify** — revoke verified badge.
- **Suspend** — deactivate account (user cannot log in; their content is hidden).
- **Reactivate** — lift suspension.
- **Delete** — permanently delete account and all associated data (with confirmation modal).
- **Reset Password** — force password reset email.
- **Grant Premium** — manually grant premium subscription.
- **Revoke Premium** — manually revoke.
- **Change Level** — manually set level (Otondo / Kopa / Corper).
- **Send Message** — send a direct admin message to the user (appears as a system notification).

**Create User Screen (Admin-Created Account):**
- Fields: First Name, Last Name, Email, State Code, Serving State, Default Password.
- Submit → account created, welcome email sent.

---

### 4.4 Content Moderation

#### Reports Queue
- List of all user-submitted reports (posts, stories, reels, listings, messages).
- Filter by: entity type, report reason, status (pending / reviewed / actioned).
- Each report shows: reporter, reported entity, reason, date, current status.
- **Actions on a report:**
  - **Dismiss** — no action needed.
  - **Warn User** — send a warning notification to the content owner.
  - **Remove Content** — delete the post / story / reel / listing.
  - **Suspend User** — suspend the content owner's account.
  - **Escalate** — flag for superadmin review.

#### Flagged Content (Auto-moderation)
- Listings and posts flagged by the auto-moderation keyword filter.
- Same review and action flow as reports.

#### Post / Content Search
- Admin can search any post, story, or reel by keyword or user.
- View and action content even if not reported.

---

### 4.5 Mami Market Management

**Listings Overview:**
- All listings (active, sold, deactivated, flagged).
- Filter by category, state, verification status.
- Search by title or seller.

**Listing Detail View (Admin):**
- All listing fields, seller info, inquiry count.
- Actions: Remove, Feature, Unfeature, Flag.

**Verified Seller Applications Queue:**
- Pending applications table.
- Each row: applicant name, state code, submission date, ID document (downloadable).
- **Approve** → marks user as verified seller, sends success notification.
- **Reject** → sends rejection notification with reason.

---

### 4.6 Opportunities Management

- List of all opportunity posts.
- **Feature** an opportunity → pins it at the top of the opportunities feed for all users.
- **Unfeature**.
- Remove opportunity if it violates guidelines.

---

### 4.7 Broadcast & Communications

**Send Broadcast:**
- Target: All Users / By Serving State / By Level / Premium Only / Custom (state code list).
- Channel: In-App Notification / Push Notification / Email / All Channels.
- Message: subject (for email), body text.
- Schedule: Send Now or schedule for a future date/time.
- Preview before sending.

**Broadcast History:**
- List of past broadcasts with delivery stats (sent, delivered, opened).

---

### 4.8 Subscriptions & Payments

- Full subscription records table.
- Columns: User, Plan, Start Date, End Date, Paystack Reference, Status.
- Filter by: status (active, expired, cancelled), date range.
- Manual grant/revoke controls.
- Export to CSV.
- Revenue chart (monthly bar chart, ₦).

---

### 4.9 Admin Account Management (SUPERADMIN only)

- List of all admin accounts.
- Create new admin: email, first name, last name, role.
- Deactivate / Reactivate admin account.
- Change admin role.
- View login history for each admin.

---

### 4.10 Audit Logs

- Full log of all admin actions across the panel.
- Columns: Admin, Action, Entity Type, Entity ID, IP Address, Timestamp.
- Filterable and exportable.
- Immutable — no admin can delete audit log entries.

---

### 4.11 NYSC Integration Status

- Shows the live status of the NYSC integration (connected / error).
- Last successful sync timestamp.
- Trigger manual NYSC data sync.
- View recent sync logs and errors.

---

### 4.12 System Settings (SUPERADMIN only)

- Toggle maintenance mode (displays a maintenance page to all users).
- Set max group chat size.
- Set story expiry duration.
- Set post edit window (default 15 minutes).
- Configure keyword blocklist for auto-moderation.
- Toggle feature flags (enable / disable reels, marketplace, calls, subscriptions).

---

## 5. Key Admin User Stories

### US-A001: Review a Reported Post
> As a moderator, I want to review flagged posts and take action (remove or dismiss) so that the platform remains safe and appropriate.

**Acceptance Criteria:**
- I can see all pending reports in a queue.
- For each report, I can see the reported content and the reason.
- I can dismiss, warn the user, remove the content, or suspend the user.
- My action is logged in the audit trail.

### US-A002: Create a Corper Account
> As an admin, I want to manually create a corper account so that a corps member who cannot self-register can still join the platform.

**Acceptance Criteria:**
- I fill in the required fields and submit.
- The user receives a welcome email with a default password.
- The user is forced to change their password on first login.

### US-A003: Approve a Verified Seller Application
> As an admin, I want to review and approve a corper's verified seller application so they can access premium marketplace features.

**Acceptance Criteria:**
- I can view the submitted ID document.
- I can approve or reject with a reason.
- The applicant receives an in-app notification of the outcome.

### US-A004: Send a Broadcast Notification
> As an admin, I want to send a push notification to all corpers in Kogi state so that I can inform them about an important event.

**Acceptance Criteria:**
- I can select the target segment (Kogi state corpers).
- I can write the message and choose the channel.
- I can preview before sending.
- Delivery stats are tracked.

### US-A005: View Platform Analytics
> As a superadmin, I want to see an overview of platform health on the dashboard so that I can make informed operational decisions.

---

## 6. Admin Panel Design Principles

- **Clean, Data-Dense UI**: Admins need to process many records quickly. Prioritise table views and filters over visual flair.
- **Confirmation Modals**: All destructive actions (delete, suspend, remove content) require a confirmation step.
- **Role-Based UI**: Features invisible to lower roles are hidden, not just disabled.
- **Audit Everything**: Every action that mutates data must be recorded.
- **Responsive but Desktop-First**: Admin panel is primarily used on desktop/laptop.

---

## 7. Development Phases (Admin Panel)

| Phase | Feature |
|---|---|
| Phase 1 | Admin auth, dashboard overview |
| Phase 2 | User management (CRUD, suspend, verify) |
| Phase 3 | Content moderation (reports queue, actions) |
| Phase 4 | Mami Market management + verified seller approvals |
| Phase 5 | Broadcast & communications |
| Phase 6 | Subscriptions & payments view |
| Phase 7 | Admin account management (SUPERADMIN) |
| Phase 8 | Audit logs, NYSC integration status, system settings |
| Phase 9 | Analytics charts, advanced filters, CSV exports |
| Phase 10 | Performance, security hardening, deployment |

---

*This document should be updated whenever the admin panel scope changes. Coordinate with backend team to ensure all admin API endpoints are built before the UI phase begins.*
