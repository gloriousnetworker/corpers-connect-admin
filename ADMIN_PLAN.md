# Corpers Connect — Admin Dashboard Build Plan

## Overview

A full-featured internal admin panel for managing Corpers Connect. Built with Next.js 15 App Router, TypeScript, TanStack Query, Zustand, React Hook Form + Zod, and the same NYSC-green design language as the user app. Runs at port 3001 (`/admin/*`). Entirely separate from the user app — no shared codebase.

**Backend base URL:** `https://corpers-connect-server-production.up.railway.app/api/v1`
**Admin API prefix:** `/admin/*`
**Admin login endpoint:** `POST /admin/auth/login`

---

## Design System

All styles mirror the user-facing app exactly. Same Tailwind token names, same color values.

### Color Tokens

```
primary:            #008751   (NYSC green — buttons, links, active states)
primary-dark:       #006640   (hover state)
primary-light:      #E8F5EE   (tinted backgrounds, badges)
gold:               #C8992A   (premium / CORPER level indicator)
gold-light:         #FFF8E7
surface:            #FFFFFF   (cards, panels)
surface-elevated:   #F8F9FA   (page background)
surface-alt:        #F1F3F4   (inputs, table rows alt)
foreground:         #111827   (headings)
foreground-secondary: #6B7280 (body text)
foreground-muted:   #9CA3AF   (captions, placeholders)
border:             #E5E7EB
success:            #10B981   (approved, active)
success-light:      #D1FAE5
warning:            #F59E0B   (pending, review)
warning-light:      #FEF3C7
error:              #EF4444   (danger, suspended, deleted)
error-light:        #FEE2E2
info:               #3B82F6
info-light:         #DBEAFE
```

### Radius Scale
```
sm: 6px   md: 8px   lg: 12px   xl: 16px   2xl: 20px   3xl: 24px
```

### Shadow
```
card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
```

### Typography
```
Font: system-ui (Inter via next/font)
Heading sizes: 3xl(30px) 2xl(24px) xl(20px) lg(18px) base(16px)
Label/caption: sm(14px) xs(12px) 2xs(11px)
```

---

## Admin Role System

| Role | Capabilities |
|---|---|
| `ADMIN` | All features except: create/deactivate admins, view audit log of other admins |
| `SUPERADMIN` | Full access including admin management and complete audit trail |

The backend enforces this via `requireAdmin` + `requireSuperAdmin` middleware. The frontend reflects it by hiding SUPERADMIN-only UI sections unless `admin.role === 'SUPERADMIN'`.

---

## App Shell Layout

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (240px, fixed, collapsible on md)          │
│  ┌──────────────────────────────────────────────┐   │
│  │  Logo + "Admin Portal" badge                 │   │
│  │  ─────────────────────────────               │   │
│  │  📊 Dashboard                                │   │
│  │  👥 Users                                    │   │
│  │  🚩 Moderation (Reports)                     │   │
│  │  🏪 Marketplace                              │   │
│  │  💼 Opportunities                            │   │
│  │  💳 Subscriptions                            │   │
│  │  📢 Broadcasts                               │   │
│  │  ⚙️  Settings                                │   │
│  │  🔐 Admin Accounts (SUPERADMIN only)         │   │
│  │  📋 Audit Logs (SUPERADMIN only)             │   │
│  │  ─────────────────────────────               │   │
│  │  [Admin avatar + name + role badge]          │   │
│  │  [Sign out]                                  │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  TOPBAR (56px, full width)                          │
│  [Hamburger? Page title]      [Search]  [Notif]     │
├─────────────────────────────────────────────────────┤
│                                                      │
│   MAIN CONTENT (flex-1, scrollable)                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Route structure:**
```
/login                      — Admin login (public, unauthenticated only)
/dashboard                  — Dashboard home (default after login)
/users                      — User list
/users/[userId]             — User detail
/moderation                 — Reports queue
/moderation/[reportId]      — Report detail
/marketplace                — Seller applications + listings
/marketplace/[listingId]    — Listing detail
/opportunities              — Opportunities list
/subscriptions              — Subscription records
/broadcasts                 — Create + history of broadcasts
/settings                   — System settings
/admins                     — Admin accounts (SUPERADMIN)
/audit-logs                 — Audit trail (SUPERADMIN)
```

---

## Tech Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | Upgrade from scaffold's Next.js 14; consistent with user app |
| Language | TypeScript 5 | Already scaffolded |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate | Same design tokens as user app |
| State | Zustand 5 | Lightweight, same as user app |
| Data fetching | TanStack React Query 5 | Same as user app; cache + pagination |
| Forms | React Hook Form 7 + Zod | Same as user app |
| HTTP | Axios | Same as user app |
| Tables | TanStack Table 8 | Sortable, filterable, paginated data tables |
| Charts | Recharts | Lightweight charting for dashboard metrics |
| Icons | Lucide React | Same as user app |
| Dates | date-fns | Formatting timestamps throughout |
| Toasts | Sonner | Same as user app |
| Testing | Jest + React Testing Library + Playwright | Mirrors user app test setup |

---

## Page-by-Page Feature Spec

### `/login` — Admin Sign In

**What it does:**
- Email + password form (no NYSC state code — admins are email-only)
- Calls `POST /admin/auth/login`
- On success: stores JWT in memory (Zustand) + `cc_admin_session` httpOnly cookie equivalent (localStorage for simplicity since admin panel isn't a PWA)
- Redirects to `/dashboard`
- Shows lockout message if 5 failed attempts

**Form fields:** Email, Password (toggle visibility), [Sign In] button
**Validation:** Zod — valid email required, password min 8 chars
**Error states:** "Invalid credentials", "Account locked — try again in X minutes"

---

### `/dashboard` — Analytics Overview

**What it does:**
- Calls `GET /admin/dashboard` — returns aggregated stats
- Displays stat cards, trend charts, recent activity

**Stat cards (top row):**
| Card | Metric | Icon |
|---|---|---|
| Total Users | count + % change this week | Users |
| Active Today | DAU count | Activity |
| Premium Subscribers | count + revenue | CreditCard |
| Pending Reports | unreviewed count (links to /moderation) | Flag |
| Pending Seller Apps | count (links to /marketplace) | Store |
| New Registrations (7d) | count + sparkline | UserPlus |

**Charts (main area):**
- **User Growth** — 30-day line chart (new registrations per day)
- **Revenue** — 30-day bar chart (subscription payments per day, NGN)
- **Content Activity** — 7-day area chart (posts + stories + reels created)
- **Subscription Mix** — Donut chart (FREE vs PREMIUM %)

**Recent activity table (bottom):**
- Last 10 reports (status badge, type, timestamp, [Review] link)
- Last 10 registrations (name, state code, level, timestamp)

**Refresh:** React Query `staleTime: 60s`, refetch on window focus

---

### `/users` — User Management

**What it does:**
- `GET /admin/users` with server-side pagination + search + filters
- Searchable by name / email / state code
- Filterable by: subscription tier, user level, status (active/suspended), serving state, verification status

**Table columns:**
| Column | Notes |
|---|---|
| Avatar + Name | Clicking opens `/users/[userId]` |
| State Code / State | NYSC state code + serving state |
| Level | OTONDO / KOPA / CORPER badge |
| Subscription | FREE / PREMIUM badge |
| Verified | checkmark if verified |
| Status | Active / Suspended badge |
| Joined | date |
| Actions | View, Suspend/Reactivate, Delete |

**Bulk actions:** Select multiple → Suspend all / Delete all (with confirmation modal)

**Filters panel (collapsible):**
- Search input
- Status dropdown (All / Active / Suspended)
- Subscription dropdown (All / Free / Premium)
- Level dropdown (All / OTONDO / KOPA / CORPER)
- Verified toggle

**Pagination:** Cursor-based, 25 per page, "Load more" or page buttons

---

### `/users/[userId]` — User Detail

**What it does:**
- `GET /admin/users/:userId` — full profile + activity stats
- Shows all info, all admin actions on that user

**Layout:**
```
Left column (1/3):
  - Avatar (large)
  - Full name + @stateCode
  - Level + Subscription badges
  - Status badge (Active / Suspended)
  - Bio
  - Serving state + NYSC batch year
  - Joined date + last active date
  - Follower / Following counts
  - Post count / Story count
  - Action buttons:
    [ Verify ] / [ Remove Verification ]
    [ Grant Premium ] / [ Revoke Premium ]
    [ Suspend ] / [ Reactivate ]
    [ Delete Account ]  ← danger, confirm modal

Right column (2/3):
  Tabs:
    [Posts] — paginated post list (content preview, reactions count, comments count, created date, [View] link)
    [Reports Against User] — reports submitted about this user
    [Subscription History] — tier changes, payment events
    [Activity Log] — logins, post creates (if available)
```

**Modals:**
- **Suspend** — reason text field required, optional duration
- **Grant Premium** — duration picker (1 month / 3 months / 6 months / 1 year / Lifetime)
- **Delete** — "Type the user's name to confirm" safety check

---

### `/moderation` — Reports Queue

**What it does:**
- `GET /admin/reports` — paginated list of reports
- Filterable by status (PENDING / REVIEWED / ACTIONED / DISMISSED) and entity type (POST / STORY / REEL / LISTING / USER / COMMENT)

**Table columns:**
| Column | Notes |
|---|---|
| Report Type | entity type badge + reporter name |
| Reported Content | short preview / link |
| Reason | reason text |
| Reporter | name + link |
| Reported User | name + link |
| Status | badge |
| Date | relative time |
| Action | [Review] button |

**Filters:** Status, Entity Type, Date range
**Default sort:** Oldest PENDING first (most urgent first)

---

### `/moderation/[reportId]` — Report Detail

**What it does:**
- `GET /admin/reports/:reportId` — full report details
- Shows the reported content inline (post text, image, or story)
- Shows reporter details + reason
- Shows reported user's history (prior warnings, suspensions)

**Action panel (right side):**
```
[ Dismiss Report ]      — mark as reviewed, no action
[ Warn User ]           — send in-app notification to reported user
[ Remove Content ]      — delete the reported post/story/listing
[ Suspend User ]        — suspend the reported user (opens modal with duration)
[ Escalate ]            — mark for SUPERADMIN review
```

Each action calls `PATCH /admin/reports/:reportId` with `{ action: 'dismiss'|'warn'|'remove'|'suspend'|'escalate' }`.
After action: mark report as ACTIONED/DISMISSED and navigate back to queue.

---

### `/marketplace` — Marketplace Management

**Two tabs: Seller Applications | Listings**

#### Tab 1: Seller Applications

**What it does:**
- `GET /admin/seller-applications` — paginated, filterable by status (PENDING / APPROVED / REJECTED)

**Table columns:**
| Column | Notes |
|---|---|
| Applicant | avatar + name + state code |
| Business Name | from application |
| Category | marketplace category |
| Status | PENDING / APPROVED / REJECTED badge |
| Submitted | date |
| Actions | [Review] button |

**Review modal (inline, no separate page):**
- Shows applicant details + ID document (image)
- Business description
- [ Approve ] / [ Reject with reason ] buttons
- Calls `PATCH /admin/seller-applications/:appId/approve` or `reject`

#### Tab 2: Listings

**What it does:**
- Browse all marketplace listings (from regular `GET /marketplace/listings` with admin view)
- Filter by category, type, status
- Can mark as REMOVED (admin moderation action)

**Table columns:** Thumbnail, Title, Seller, Category, Type, Price, Status, Views, Created, Actions

---

### `/opportunities` — Opportunities Management

**What it does:**
- `GET /opportunities` with admin view (all opportunities, not just followed users)
- Feature/unfeature opportunities (calls PATCH if backend supports it, otherwise hides from view)

**Table columns:**
| Column | Notes |
|---|---|
| Title | link to detail |
| Type | INTERNSHIP / JOB / SCHOLARSHIP / VOLUNTEERING badge |
| Company | |
| Author | name + link |
| Featured | toggle |
| Applications | count |
| Created | date |
| Actions | View, Feature/Unfeature, Remove |

---

### `/subscriptions` — Subscription Records

**What it does:**
- Shows all subscription records from `GET /admin/users` filtered to PREMIUM users
- Aggregated stats: Total revenue, Active subscribers, Churn rate, MRR
- Individual records: user, plan, amount, start date, status

**Stats cards (top):**
- Total Subscribers (active)
- Monthly Revenue (MRR in NGN)
- New This Month
- Cancelled This Month

**Table columns:**
| Column | Notes |
|---|---|
| User | avatar + name |
| Plan | MONTHLY / QUARTERLY / ANNUAL |
| Amount | NGN |
| Status | ACTIVE / CANCELLED / EXPIRED |
| Start | date |
| End / Renewal | date |
| Actions | [Grant] / [Revoke] |

**Manual grant/revoke:** `POST /admin/users/:userId/subscription` / `DELETE /admin/users/:userId/subscription`

---

### `/broadcasts` — Broadcast Messaging

**What it does:**
- Create + send in-app broadcast notifications to user segments
- View broadcast history

**Compose form:**
```
Title*
Message body* (textarea, max 500 chars)
Target audience:
  ● All users
  ○ By subscription tier  → [FREE | PREMIUM]
  ○ By serving state      → [State selector dropdown]
  ○ By level              → [OTONDO | KOPA | CORPER]

[ Preview ] [ Send Broadcast ]
```

**History table:**
| Column |
|---|
| Title |
| Message preview |
| Target |
| Recipients count |
| Sent by |
| Date |

---

### `/settings` — System Settings

**What it does:**
- `GET /admin/settings` — all key-value settings
- `PUT /admin/settings/:key` — update individual setting

**Settings groups:**

**Maintenance**
- Maintenance mode toggle (ON/OFF) — shows maintenance banner to all users
- Maintenance message (text field)

**Content Moderation**
- Auto-flag keywords (comma-separated list) — posts containing these get auto-flagged
- Max reports before auto-review (number)

**Registration**
- Allow new registrations toggle
- Require email verification toggle

**Marketplace**
- Seller application review enabled toggle
- Max listing images (number, 1–10)
- Commission rate % (for future payment integration)

**Subscriptions**
- Premium monthly price (NGN)
- Premium quarterly price (NGN)
- Premium annual price (NGN)

Each setting is an inline editable field with [Save] button per row.

---

### `/admins` — Admin Accounts (SUPERADMIN only)

**What it does:**
- `GET /admin/admins` — list all admin accounts
- `POST /admin/admins` — create new admin
- `PATCH /admin/admins/:adminId/deactivate` — deactivate admin

**Table columns:**
| Column | Notes |
|---|---|
| Name | |
| Email | |
| Role | ADMIN / SUPERADMIN badge |
| Status | Active / Inactive |
| Last Login | |
| Created | |
| Actions | [Deactivate] (SUPERADMIN cannot deactivate self) |

**Create Admin modal:**
```
Full name*
Email*
Password* (generated or manual)
Role*  [ADMIN ▼]
[ Create Admin ]
```

---

### `/audit-logs` — Audit Trail (SUPERADMIN only)

**What it does:**
- `GET /admin/audit-logs` — immutable log of every admin action
- Filterable by admin, action type, date range

**Table columns:**
| Column | Notes |
|---|---|
| Admin | who did it |
| Action | suspend_user / approve_seller / delete_post / etc. |
| Target | who/what was acted on (linked) |
| Details | JSON payload preview |
| IP Address | |
| Timestamp | |

**Export:** CSV download button (client-side, formats visible rows)

---

## Shared Components

### Layout
- `AdminLayout` — sidebar + topbar shell, wraps all authenticated pages
- `Sidebar` — nav links, active state, collapse on mobile
- `Topbar` — page title, search, admin avatar menu
- `ProtectedRoute` — redirects to `/login` if no token; checks role for SUPERADMIN pages

### Data Display
- `DataTable` — TanStack Table v8 wrapper: sortable columns, sticky header, row selection, pagination
- `StatCard` — icon + title + value + change % chip
- `Badge` — status/role/level color-coded badge
- `Avatar` — circular avatar with initials fallback
- `EmptyState` — icon + title + description for empty tables
- `Pagination` — cursor-based and page-number variants
- `FilterBar` — collapsible filter panel above tables

### Forms & Feedback
- `ConfirmModal` — generic destructive action confirm dialog
- `ActionModal` — form inside a modal (suspend, grant premium, etc.)
- `Toast` — Sonner integration (success/error/warning)
- `Spinner` — loading state
- `SkeletonRow` — table skeleton while loading

### Charts
- `LineChart` — user growth trend
- `BarChart` — revenue bars
- `AreaChart` — content activity
- `DonutChart` — subscription mix

---

## API Client Design

```
src/
  lib/
    api/
      client.ts         — Axios instance with baseURL + auth interceptor + 401 handler
      admin.ts          — Dashboard, settings, audit endpoints
      users.ts          — User list, user detail, admin actions
      moderation.ts     — Reports endpoints
      marketplace.ts    — Seller apps + listings
      opportunities.ts  — Opportunities admin
      subscriptions.ts  — Subscription admin
      broadcasts.ts     — Broadcast messaging
      admins.ts         — Admin account management
    query-keys.ts       — All React Query cache keys
    types/
      models.ts         — Admin, User, Report, Listing, etc. types
      enums.ts          — AdminRole, ReportStatus, SubscriptionTier, etc.
    utils.ts            — formatDate, formatCurrency, getInitials, getBadgeColor, etc.
    validations.ts      — Zod schemas for all forms
  store/
    auth.store.ts       — Admin JWT + profile (Zustand)
    ui.store.ts         — Sidebar collapsed state, theme
```

### Auth Flow
1. POST `/admin/auth/login` → receive `{ token, admin }`
2. Store token in Zustand + `localStorage` (admin panel, not a PWA, no httpOnly cookie concern)
3. Axios interceptor attaches `Authorization: Bearer <token>` on every request
4. On 401: clear store + redirect to `/login`
5. Token expiry: backend returns 401, client handles redirect

---

## File Structure (Final)

```
corpers-connect-admin/
├── ADMIN_PLAN.md
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.ts
├── jest.setup.ts
├── playwright.config.ts
├── .env.local                        (NEXT_PUBLIC_API_URL)
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx                — Root layout (providers, fonts)
    │   ├── globals.css               — Tailwind base + token CSS variables
    │   ├── login/
    │   │   └── page.tsx             — Login page (public)
    │   └── (admin)/                 — Route group: all authenticated pages
    │       ├── layout.tsx           — AdminLayout shell
    │       ├── dashboard/page.tsx
    │       ├── users/
    │       │   ├── page.tsx         — User list
    │       │   └── [userId]/page.tsx — User detail
    │       ├── moderation/
    │       │   ├── page.tsx         — Reports queue
    │       │   └── [reportId]/page.tsx
    │       ├── marketplace/
    │       │   ├── page.tsx         — Seller apps + listings
    │       │   └── [listingId]/page.tsx
    │       ├── opportunities/page.tsx
    │       ├── subscriptions/page.tsx
    │       ├── broadcasts/page.tsx
    │       ├── settings/page.tsx
    │       ├── admins/page.tsx      — SUPERADMIN only
    │       └── audit-logs/page.tsx  — SUPERADMIN only
    ├── components/
    │   ├── layout/
    │   │   ├── AdminLayout.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Topbar.tsx
    │   ├── ui/
    │   │   ├── Badge.tsx
    │   │   ├── Avatar.tsx
    │   │   ├── StatCard.tsx
    │   │   ├── DataTable.tsx
    │   │   ├── Pagination.tsx
    │   │   ├── FilterBar.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ConfirmModal.tsx
    │   │   ├── ActionModal.tsx
    │   │   ├── Spinner.tsx
    │   │   └── SkeletonRow.tsx
    │   ├── charts/
    │   │   ├── LineChart.tsx
    │   │   ├── BarChart.tsx
    │   │   ├── AreaChart.tsx
    │   │   └── DonutChart.tsx
    │   ├── dashboard/
    │   │   └── DashboardStats.tsx
    │   ├── users/
    │   │   ├── UserTable.tsx
    │   │   ├── UserDetail.tsx
    │   │   ├── SuspendModal.tsx
    │   │   ├── GrantPremiumModal.tsx
    │   │   └── DeleteUserModal.tsx
    │   ├── moderation/
    │   │   ├── ReportTable.tsx
    │   │   └── ReportDetail.tsx
    │   ├── marketplace/
    │   │   ├── SellerApplicationTable.tsx
    │   │   ├── ReviewApplicationModal.tsx
    │   │   └── ListingsTable.tsx
    │   ├── subscriptions/
    │   │   └── SubscriptionTable.tsx
    │   ├── broadcasts/
    │   │   └── BroadcastComposer.tsx
    │   ├── admins/
    │   │   ├── AdminTable.tsx
    │   │   └── CreateAdminModal.tsx
    │   └── settings/
    │       └── SettingsForm.tsx
    ├── hooks/
    │   ├── useAdminAuth.ts          — Auth state + redirect
    │   ├── useDashboard.ts
    │   ├── useUsers.ts
    │   ├── useReports.ts
    │   ├── useMarketplace.ts
    │   ├── useSubscriptions.ts
    │   └── useBroadcasts.ts
    ├── lib/
    │   ├── api/
    │   │   ├── client.ts
    │   │   ├── admin.ts
    │   │   ├── users.ts
    │   │   ├── moderation.ts
    │   │   ├── marketplace.ts
    │   │   ├── opportunities.ts
    │   │   ├── subscriptions.ts
    │   │   ├── broadcasts.ts
    │   │   └── admins.ts
    │   ├── query-keys.ts
    │   ├── utils.ts
    │   └── validations.ts
    ├── providers/
    │   └── Providers.tsx            — QueryClientProvider + auth init
    ├── store/
    │   ├── auth.store.ts
    │   └── ui.store.ts
    └── types/
        ├── models.ts
        └── enums.ts
```

---

## Build Phases

---

### Phase 1 — Project Setup & Infrastructure
**Goal:** Upgrade stack, install all dependencies, configure Tailwind tokens, set up API client, providers, and auth store. No UI yet — just solid foundations.

**Tasks:**
1. Upgrade Next.js 14 → 15, add all production dependencies (`@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `axios`, `lucide-react`, `sonner`, `recharts`, `@tanstack/react-table`, `date-fns`)
2. Add dev dependencies (`jest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jest-environment-jsdom`, `ts-jest`, `playwright`)
3. Expand Tailwind config with full design token set (all colors, radius, shadow, animation)
4. Rewrite `globals.css` with CSS custom properties mirroring the user app
5. Configure `next.config.mjs` (API rewrites for dev, image domains, security headers)
6. Create `.env.local` with `NEXT_PUBLIC_API_URL`
7. Create `src/types/enums.ts` + `src/types/models.ts` (all types: Admin, User, Report, Listing, etc.)
8. Create `src/lib/api/client.ts` (Axios instance, auth interceptor, 401 handler)
9. Create all API function files (admin.ts, users.ts, moderation.ts, marketplace.ts, opportunities.ts, subscriptions.ts, broadcasts.ts, admins.ts)
10. Create `src/lib/query-keys.ts`
11. Create `src/lib/utils.ts` (formatDate, formatCurrency, getInitials, getBadgeColor, getStatusColor)
12. Create `src/lib/validations.ts` (Zod schemas: loginSchema, suspendSchema, grantPremiumSchema, createAdminSchema, broadcastSchema)
13. Create `src/store/auth.store.ts` (Zustand: token, admin profile, setAuth, clearAuth)
14. Create `src/store/ui.store.ts` (sidebarCollapsed, setSidebarCollapsed)
15. Create `src/providers/Providers.tsx` (QueryClientProvider, Sonner Toaster)
16. Rewrite root `layout.tsx` (next/font Inter, Providers, Toaster)
17. Configure `jest.config.ts` + `jest.setup.ts`
18. Configure `playwright.config.ts`

**Deliverable:** `npm run build` passes. No pages yet but full infrastructure ready.

---

### Phase 2 — Design System Components
**Goal:** Build all shared UI primitives. These are the building blocks used in every page.

**Tasks:**
1. `Badge.tsx` — color-coded badge for status/role/level/subscription (variants: success, warning, error, info, primary, gold, neutral)
2. `Avatar.tsx` — circular avatar with image + initials fallback, size variants (sm/md/lg/xl)
3. `StatCard.tsx` — metric card: icon, label, value, change chip (+X% up/down), optional sparkline slot
4. `Spinner.tsx` — loading spinner, sizes sm/md/lg, centered variant
5. `SkeletonRow.tsx` — table row skeleton (4-8 shimmer columns)
6. `EmptyState.tsx` — icon + title + description, optional CTA button
7. `ConfirmModal.tsx` — title, description, [Cancel] + [Confirm] (danger variant), loading state
8. `ActionModal.tsx` — generic modal shell with title, body slot, footer slot
9. `Pagination.tsx` — cursor-based: prev/next + current range display. Page-number variant (optional)
10. `FilterBar.tsx` — collapsible panel: search input + filter dropdowns + active filter chips + [Clear all]
11. `DataTable.tsx` — TanStack Table v8 wrapper: sortable columns, sticky header, row selection checkboxes, column visibility toggle, loading/empty state, hover rows

**Deliverable:** All components render correctly. No tests yet.

---

### Phase 3 — App Shell (Layout, Sidebar, Auth Gate)
**Goal:** Build the authenticated shell layout and route protection. All protected pages use this.

**Tasks:**
1. `Sidebar.tsx` — nav links with icons + active state highlight, collapsible on click, SUPERADMIN-only sections hidden by role, admin avatar + name at bottom, sign out button
2. `Topbar.tsx` — hamburger for sidebar toggle, breadcrumb/page title, admin avatar dropdown (profile, sign out)
3. `AdminLayout.tsx` — sidebar + topbar + main content shell. Reads `ui.store` for collapse state
4. `src/app/(admin)/layout.tsx` — auth gate (reads `auth.store`, redirects to `/login` if no token)
5. `src/hooks/useAdminAuth.ts` — auth state hook, `isLoading` guard, role check helpers (`isSuperAdmin`)

**Deliverable:** Visiting `/dashboard` without a token redirects to `/login`. Layout renders correctly with sidebar and topbar.

---

### Phase 4 — Authentication
**Goal:** Full working admin login flow.

**Tasks:**
1. Rewrite `src/app/login/page.tsx` — full login form using React Hook Form + Zod (`loginSchema`). Submit calls `POST /admin/auth/login`. On success: store token + admin in Zustand + localStorage, redirect to `/dashboard`. Error states: invalid credentials, account locked.
2. Handle auto-login on page load: `Providers.tsx` reads token from localStorage on mount, hydrates Zustand store, validates token still works (optional `/admin/dashboard` prefetch), clears if 401.
3. Handle logout: `clearAuth()` from Zustand, remove localStorage item, `router.replace('/login')`
4. Redirect already-logged-in users away from `/login` to `/dashboard`
5. Show password toggle (eye icon)

**Deliverable:** Login works end-to-end. Token persists across page reloads. Logout clears session.

---

### Phase 5 — Dashboard
**Goal:** Full analytics dashboard with live data from `GET /admin/dashboard`.

**Tasks:**
1. `src/app/(admin)/dashboard/page.tsx` — page shell, Suspense boundaries
2. `src/hooks/useDashboard.ts` — `useQuery` wrapping `GET /admin/dashboard`
3. `DashboardStats.tsx` — 6 stat cards in responsive grid (2 cols mobile, 3 cols md, 6 cols xl)
4. User Growth line chart — 30-day daily registrations (Recharts `LineChart`)
5. Revenue bar chart — 30-day daily subscription payments in NGN (Recharts `BarChart`)
6. Content activity area chart — posts + stories + reels per day for 7 days (Recharts `AreaChart`)
7. Subscription mix donut chart — FREE vs PREMIUM % (Recharts `PieChart`)
8. Recent reports table — last 10 reports, each row links to `/moderation/[reportId]`
9. Recent registrations table — last 10 users, each row links to `/users/[userId]`
10. Skeleton loading state for all sections
11. `staleTime: 60_000`, refetch on window focus

**Deliverable:** Dashboard loads with real data, charts render, links work.

---

### Phase 6 — User Management
**Goal:** Full user list + user detail with all admin actions.

**Tasks:**

#### User List (`/users`)
1. `src/app/(admin)/users/page.tsx`
2. `src/hooks/useUsers.ts` — `useInfiniteQuery` on `GET /admin/users` with search/filter params
3. `UserTable.tsx` — DataTable with all columns, row click → `/users/[userId]`, bulk selection
4. `FilterBar` integration — search, status, subscription, level, state dropdowns
5. Bulk action bar (appears on selection): Suspend selected / Delete selected
6. Column: Actions dropdown (View, Suspend/Reactivate, Grant/Revoke Premium, Delete)
7. Inline status toggle: suspend → opens `SuspendModal`, reactivate → confirm + `PATCH /admin/users/:userId/reactivate`

#### User Detail (`/users/[userId]`)
8. `src/app/(admin)/users/[userId]/page.tsx`
9. `src/hooks/useUserDetail.ts` — `useQuery` on `GET /admin/users/:userId`
10. `UserDetail.tsx` — two-column layout as specced
11. Tabs: Posts, Reports Against User, Subscription History, Activity Log
12. `SuspendModal.tsx` — reason field + optional duration → `PATCH /admin/users/:userId/suspend`
13. `GrantPremiumModal.tsx` — duration picker → `POST /admin/users/:userId/subscription`
14. `DeleteUserModal.tsx` — "type name to confirm" safety check → `DELETE /admin/users/:userId`
15. Verify / Remove Verification button → `PATCH /admin/users/:userId/verify`
16. After each action: invalidate `queryKeys.users()` + `queryKeys.user(userId)`, show toast

**Deliverable:** User list loads, filters work, pagination works. All admin actions execute and give feedback.

---

### Phase 7 — Content Moderation
**Goal:** Reports queue with full review workflow.

**Tasks:**

#### Reports Queue (`/moderation`)
1. `src/app/(admin)/moderation/page.tsx`
2. `src/hooks/useReports.ts` — `useInfiniteQuery` on `GET /admin/reports`
3. `ReportTable.tsx` — DataTable: entity type, preview, reason, reporter, reported user, status badge, date, [Review] link
4. Filter: Status (PENDING default), Entity Type, Date range

#### Report Detail (`/moderation/[reportId]`)
5. `src/app/(admin)/moderation/[reportId]/page.tsx`
6. `useQuery` on `GET /admin/reports/:reportId`
7. `ReportDetail.tsx` — two-column: left = reported content (inline post/story/comment render), right = action panel
8. Action buttons: Dismiss, Warn, Remove Content, Suspend User, Escalate
9. Each action → `PATCH /admin/reports/:reportId` with `{ action, reason? }`
10. Suspend flow opens `SuspendModal` (reused from Phase 6)
11. After action: show toast, navigate back to `/moderation`

**Deliverable:** Reports queue is the first page admins see when something is wrong. All actions work.

---

### Phase 8 — Marketplace, Opportunities & Subscriptions
**Goal:** Three feature management pages.

**Tasks:**

#### Marketplace (`/marketplace`)
1. `src/app/(admin)/marketplace/page.tsx` — tabs: Seller Applications | Listings
2. `src/hooks/useMarketplace.ts` — queries for seller apps + listings
3. `SellerApplicationTable.tsx` — with PENDING/APPROVED/REJECTED filter
4. `ReviewApplicationModal.tsx` — inline ID document preview, [Approve] / [Reject with reason]
5. Approve → `PATCH /admin/seller-applications/:appId/approve`; Reject → `PATCH /admin/seller-applications/:appId/reject`
6. `ListingsTable.tsx` — filter by category/type/status, [Remove] action

#### Opportunities (`/opportunities`)
7. `src/app/(admin)/opportunities/page.tsx`
8. Query `GET /opportunities?limit=25` (all opportunities visible to admin)
9. Table: title, type, company, author, featured toggle, applications count, created date, [Remove]
10. Featured toggle → `PATCH /opportunities/:opportunityId` with `{ isFeatured: true/false }`

#### Subscriptions (`/subscriptions`)
11. `src/app/(admin)/subscriptions/page.tsx`
12. `src/hooks/useSubscriptions.ts`
13. Stat cards (total, MRR, new this month, churned)
14. `SubscriptionTable.tsx` — user, plan, amount, status, dates, [Grant]/[Revoke] actions
15. Manual grant → `POST /admin/users/:userId/subscription`
16. Manual revoke → `DELETE /admin/users/:userId/subscription`

**Deliverable:** Three pages fully functional with correct API calls.

---

### Phase 9 — Broadcasts, Settings, Admin Accounts & Audit Logs
**Goal:** Final four feature pages.

**Tasks:**

#### Broadcasts (`/broadcasts`)
1. `src/app/(admin)/broadcasts/page.tsx`
2. `BroadcastComposer.tsx` — form: title, message, target audience selector, preview, [Send]
3. Send → custom endpoint (if backend exposes it; else use `POST /notifications` with broadcast flag)
4. History table: title, target, recipients, sent by, date
5. Character count on message field

#### Settings (`/settings`)
6. `src/app/(admin)/settings/page.tsx`
7. `GET /admin/settings` — load all key-value settings
8. `SettingsForm.tsx` — grouped sections (Maintenance, Content, Registration, Marketplace, Subscriptions)
9. Each setting: inline edit + [Save] → `PUT /admin/settings/:key`
10. Maintenance mode toggle shows a warning before enabling

#### Admin Accounts (`/admins`) — SUPERADMIN only
11. `src/app/(admin)/admins/page.tsx` — route guard: if `!isSuperAdmin` → 403 screen
12. `AdminTable.tsx` — list admins, role badge, status, last login, [Deactivate]
13. `CreateAdminModal.tsx` — name, email, password, role → `POST /admin/admins`
14. Deactivate → confirm modal → `PATCH /admin/admins/:adminId/deactivate`

#### Audit Logs (`/audit-logs`) — SUPERADMIN only
15. `src/app/(admin)/audit-logs/page.tsx` — route guard
16. `GET /admin/audit-logs` with date range + admin filter
17. Table: admin, action, target, details, IP, timestamp
18. CSV export button (client-side)

**Deliverable:** All pages work. SUPERADMIN-only pages show 403 to regular admins.

---

### Phase 10 — Testing
**Goal:** Comprehensive unit + integration + e2e test coverage.

**Unit Tests (Jest + RTL):**

```
src/__tests__/
  unit/
    utils.test.ts                 — formatDate, formatCurrency, getBadgeColor, getInitials
    validations.test.ts           — Zod schema edge cases
  components/
    Badge.test.tsx
    Avatar.test.tsx
    StatCard.test.tsx
    DataTable.test.tsx
    ConfirmModal.test.tsx
    FilterBar.test.tsx
    Pagination.test.tsx
  integration/
    login.test.tsx                — Login form submit, error states, redirect
    dashboard.test.tsx            — Stat cards render, chart sections render
    users.test.tsx                — Table loads, filters, modals (suspend, grant, delete)
    moderation.test.tsx           — Reports table, review actions
    marketplace.test.tsx          — Seller app review, approve/reject
    subscriptions.test.tsx        — Stat cards, grant/revoke actions
    settings.test.tsx             — Settings load, save individual key
    admins.test.tsx               — Admin table, create admin, deactivate (SUPERADMIN mock)
```

**E2E Tests (Playwright):**

```
tests/e2e/
  auth.spec.ts          — Login success, login failure, logout, redirect to /login if no token
  dashboard.spec.ts     — Dashboard loads, stats visible, chart sections present
  users.spec.ts         — Search users, open detail, suspend action
  moderation.spec.ts    — View reports, click review, dismiss action
  marketplace.spec.ts   — Switch tabs, approve seller app
```

**Target:** 300+ tests, 0 failures, build passes.

---

### Phase 11 — Polish & Deployment
**Goal:** Production-ready. Vercel deployment configuration.

**Tasks:**
1. `vercel.json` — security headers (CSP, X-Frame-Options, HSTS), cache-control for static assets, `iad1` region
2. Error boundaries — each page has `error.tsx` and `loading.tsx`
3. 404 page — `not-found.tsx` with link back to dashboard
4. Responsive audit — sidebar collapses to icon-only on tablet, full mobile sheet on small screens
5. Keyboard navigation — all modals trap focus, Escape closes them
6. Empty state for every table (no data yet, first time use)
7. Loading skeleton for every page
8. Meta tags + favicon (CC admin favicon distinct from user app)
9. Final build verification + push to remote

---

## Progress Tracker

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Setup & Infrastructure | ⬜ Not started |
| Phase 2 | Design System Components | ⬜ Not started |
| Phase 3 | App Shell & Layout | ⬜ Not started |
| Phase 4 | Authentication | ⬜ Not started |
| Phase 5 | Dashboard | ⬜ Not started |
| Phase 6 | User Management | ⬜ Not started |
| Phase 7 | Content Moderation | ⬜ Not started |
| Phase 8 | Marketplace + Opportunities + Subscriptions | ⬜ Not started |
| Phase 9 | Broadcasts + Settings + Admins + Audit | ⬜ Not started |
| Phase 10 | Testing | ⬜ Not started |
| Phase 11 | Polish & Deployment | ⬜ Not started |

---

## Key Decisions & Constraints

1. **No shared code with user app** — admin and user are separate deployments. Types are duplicated (they diverge in admin-specific fields).
2. **PWA enabled** — admin is a PWA using `@ducanh2912/next-pwa`. Admins can install it to their phone and manage the platform on the go. Offline fallback page shown when network is unavailable.
3. **Token in localStorage** — admin token stored in localStorage. Accessible to the installed PWA on trusted admin devices.
4. **Cursor pagination everywhere** — matches the backend; no offset pagination.
5. **No Socket.IO in admin** — admin doesn't need real-time updates for MVP. Dashboard refetches on focus. Moderation queue has a manual refresh button.
6. **Charts are informational only** — Recharts with no drill-down. Data comes directly from `/admin/dashboard` endpoint — no aggregation on the client.
7. **SUPERADMIN UI gating is client-side only** — backend enforces the real restriction. Client hides/shows sections for UX but backend rejects unauthorized calls regardless.
8. **Broadcast endpoint** — if the backend `/admin/broadcast` endpoint does not exist, broadcasts are skipped in Phase 9 and marked as TODO in the UI.
8. **Design fidelity** — the admin uses the same color tokens and radius scale as the user app. It is more "dense" (compact tables, less whitespace than the social feed) but visually consistent.
