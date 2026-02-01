# EOEX Platform - User Flow Verification Report
**Date:** February 1, 2026 | **Status:** ✅ LIVE TESTING READY

---

## 🎯 Seeded User Accounts & Access Points

### Demo User Credentials
```
┌─────────────────────────────────────────────────────────────────┐
│ ROLE            │ EMAIL                      │ PASSWORD          │
├─────────────────────────────────────────────────────────────────┤
│ 🔐 System Admin  │ admin@kcd-agency.com       │ admin123          │
│ 👔 Community Adm │ community.admin@kcd.com    │ comm_admin123     │
│ 🛡️  Moderator     │ moderator@kcd-agency.com   │ mod123            │
│ 💼 Premium User  │ premium@kcd-agency.com     │ premium123        │
│ 👤 Free User     │ free@kcd-agency.com        │ free123           │
│ 🎯 Guest         │ guest@kcd-agency.com       │ guest123          │
└─────────────────────────────────────────────────────────────────┘
```

### Platform Access
- **Frontend:** http://localhost:3100/
- **Backend API:** http://localhost:8100/api/v1/
- **Database:** SQLite (in-memory during dev)

---

## 🧪 Test Flow Matrix

### 1️⃣ System Admin Flow
**User:** `admin@kcd-agency.com` | **Theme:** Light Mode

#### Dashboard Components
- ✅ User Management Table
- ✅ Role Assignment Controls
- ✅ Service & Integration Overview
- ✅ Subscription Management
- ✅ Feature Request Vetting Queue

#### Expected Behaviors
```javascript
// Can perform:
✓ Create/Read/Update/Delete users
✓ Assign roles to any user
✓ Change user active/inactive status
✓ View all services and integrations
✓ Access all system configurations

// API Endpoints Hit:
GET    /api/v1/users
GET    /api/v1/users/roles
PUT    /api/v1/users/{id}          [Role change authorized]
GET    /api/v1/services
GET    /api/v1/integrations
GET    /api/v1/subscriptions
GET    /api/v1/feature-requests/all
PATCH  /api/v1/feature-requests/{id}
```

#### Verification Checklist
- [ ] Login with admin@kcd-agency.com / admin123
- [ ] Dashboard loads without errors (F12 → Console)
- [ ] Users table displays all 7 seeded accounts
- [ ] Can click role dropdown and change user roles
- [ ] Authorization guard prevents non-admin role changes (test with other accounts)
- [ ] Feature request vetting dropdown shows all statuses
- [ ] Subscription overview shows current metrics

---

### 2️⃣ Community Admin Flow
**User:** `community.admin@kcd-agency.com` | **Theme:** Blue

#### Dashboard Components
- ✅ Subscription Management Panel
- ✅ Marketing Campaign Dashboard
- ✅ Feature Request Vetting
- ✅ Community Interaction Metrics

#### Expected Behaviors
```javascript
// Can perform:
✓ View all users and their subscriptions
✓ Create and manage marketing campaigns
✓ Monitor campaign execution status
✓ Vet feature requests (approve/reject/prioritize)
✓ Track community categories (UI/UX, Complaints, Features)

// API Endpoints Hit:
GET    /api/v1/users
GET    /api/v1/subscriptions
POST   /api/v1/subscriptions        [Create campaign subscriptions]
GET    /api/v1/campaigns
POST   /api/v1/campaigns
PATCH  /api/v1/campaigns/{id}       [Update campaign status]
GET    /api/v1/feature-requests/all
PATCH  /api/v1/feature-requests/{id}
GET    /api/v1/forum/questions      [By category filters]
```

#### Verification Checklist
- [ ] Login with community.admin@kcd-agency.com / comm_admin123
- [ ] Blue theme applies correctly
- [ ] Subscription overview displays plan metrics
- [ ] Campaign create button triggers modal
- [ ] Can update campaign status (Draft → Executing → Monitoring)
- [ ] Feature request vetting shows unvetted queue
- [ ] Community category insights calculated correctly

---

### 3️⃣ Moderator Flow
**User:** `moderator@kcd-agency.com` | **Theme:** Dark Blue

#### Dashboard Components
- ✅ User Engagement & Happiness Score
- ✅ Opportunities & Issues Tracker
- ✅ Forum Moderation (3 categories)
- ✅ User Impersonation Tool

#### Expected Behaviors
```javascript
// Can perform:
✓ View user engagement metrics
✓ Calculate happiness score from issue backlog
✓ Track service opportunities with tier/category filters
✓ View and resolve pending user issues
✓ Moderate Q&A forum (3 category filters)
✓ Impersonate users (excluding system_admin)

// API Endpoints Hit:
GET    /api/v1/opportunities?tier=&category=
POST   /api/v1/opportunities
GET    /api/v1/issues
PATCH  /api/v1/issues/{id}
GET    /api/v1/forum/questions?category=platform_ui_ux
GET    /api/v1/forum/questions?category=community_complaints
GET    /api/v1/forum/questions?category=feature_requests
POST   /api/v1/impersonations/start
POST   /api/v1/impersonations/{id}/end
GET    /api/v1/users                 [Excludes system_admin]
```

#### Verification Checklist
- [ ] Login with moderator@kcd-agency.com / mod123
- [ ] Dark blue theme applies
- [ ] Happiness score calculates as: Math.max(60, 100 - (openIssues/total)*40)
- [ ] Opportunities filters work (Tier: Tier1/Tier2/Tier3, Category dropdowns)
- [ ] Forum moderation shows 3 tabs: Platform UI/UX, Community Complaints, Feature Requests
- [ ] Click "Impersonate" on any user (should exclude admin@kcd-agency.com)
- [ ] Impersonation banner displays at top during active session
- [ ] User impersonation can be ended via banner button

---

### 4️⃣ Premium User Flow
**User:** `premium@kcd-agency.com` | **Theme:** Netflix Red

#### Dashboard Components
- ✅ Latest Highlights (Opportunities)
- ✅ Top 5 Favorite Subscriptions
- ✅ Subscription Management
- ✅ Feature Request Submission

#### Expected Behaviors
```javascript
// Can perform:
✓ View personalized highlights (opportunities matching interests)
✓ See top 5 subscriptions by user popularity
✓ Manage active subscriptions (can cancel)
✓ Submit feature requests with AI routing
✓ Limited access to platform features

// API Endpoints Hit:
GET    /api/v1/subscriptions/plans
GET    /api/v1/users/{id}/subscriptions
GET    /api/v1/opportunities         [Displayed as highlights]
DELETE /api/v1/subscriptions/{id}    [Cancel subscription]
POST   /api/v1/feature-requests
POST   /api/v1/feature-requests/{id}/ai-prompts
GET    /api/v1/users/{id}/profile    [Current user context]
```

#### Verification Checklist
- [ ] Login with premium@kcd-agency.com / premium123
- [ ] Netflix theme (red accent) applies
- [ ] Highlights section shows 5 opportunities
- [ ] Top subscriptions calculated as sorted by user_count desc
- [ ] Can click "Cancel Subscription" (DELETE call succeeds)
- [ ] Feature request textarea accepts input
- [ ] Submitting request routes to /api/v1/feature-requests POST

---

### 5️⃣ Free User Flow
**User:** `free@kcd-agency.com` | **Theme:** Netflix Dark

#### Dashboard Components
- ✅ Limited Highlights (2 opportunities only)
- ✅ Top Subscriptions (Preview)
- ✅ Subscription Management (Limited)
- ✅ Feature Request Submission (Queued)

#### Expected Behaviors
```javascript
// Can perform:
✓ View 2 preview opportunities only
✓ See top subscriptions but limited detail
✓ View active subscriptions
✓ Submit feature requests (queued for review)

// API Endpoints Hit:
GET    /api/v1/subscriptions/plans
GET    /api/v1/users/{id}/subscriptions
GET    /api/v1/opportunities         [Sliced to first 2]
POST   /api/v1/feature-requests      [Status: pending_review]
```

#### Verification Checklist
- [ ] Login with free@kcd-agency.com / free123
- [ ] Netflix dark theme applies
- [ ] Highlights section shows only 2 opportunities
- [ ] Locked icon appears on additional opportunities (if any)
- [ ] Can view subscription plans (read-only)
- [ ] Feature request submission works

---

### 6️⃣ Guest Account Flow
**User:** `guest@kcd-agency.com` | **Theme:** Restricted Gray

#### Dashboard Components
- ✅ Limited Opportunity Preview (2 unlocked, rest locked)
- ✅ Account Status & Upgrade CTA
- ✅ Platform Features Overview

#### Expected Behaviors
```javascript
// Can perform:
✓ View 2 preview opportunities (unlocked)
✓ See 3+ opportunities with locked overlay
✓ View account status (guest, time-limited)
✓ Click "Request Access" or "Upgrade Account" CTA

// API Endpoints Hit:
GET    /api/v1/opportunities?limit=5
// Read-only, no mutations allowed
```

#### Verification Checklist
- [ ] Login with guest@kcd-agency.com / guest123
- [ ] Restricted gray theme applies
- [ ] First 2 opportunities marked as unlocked (preview=true)
- [ ] Remaining opportunities show locked icon + dark overlay
- [ ] Account status shows "Guest - Limited Access"
- [ ] "Upgrade Account" button visible
- [ ] Cannot access subscription management
- [ ] Cannot submit feature requests

---

## 📊 Authorization Testing Matrix

### Role Change Authorization Guard
```javascript
Test Case: Non-admin attempts role change

// Setup:
1. Login as free@kcd-agency.com (free user)
2. Open DevTools (F12 → Network)
3. Try to modify own role_id via form (if exposed) or API

Expected Result:
❌ HTTP 403 Forbidden
{
  "detail": "Role changes require system admin"
}

// Verify in backend/app/api/user.py:
if user_update.role_id is not None or user_update.is_active is not None:
    if current_user.role.name != "system_admin":
        raise HTTPException(status_code=403, detail="Role changes require system admin")
```

### Impersonation Guard
```javascript
Test Case: Attempt to impersonate system_admin

// Setup:
1. Login as moderator@kcd-agency.com
2. In Moderator dashboard, try to impersonate admin@kcd-agency.com

Expected Result:
✅ Admin account not in impersonation dropdown
(Filtered by: users.filter(u => u.role.name !== 'system_admin'))
```

---

## 🎨 Visual Assets Reference

### Casting Call Tiles
The following assets are available in `/res/` for dashboard tile illustrations:

```
📸 Image Files:
- 5bea97608338000ae2f7909a1c3998b1.jpg
- 5d6d6f4405f6c984339785ee5c611988.jpg
- model-casting-call-event-flyer-template.webp
- modern-fashion-show-poster-template.webp
- professional-modeling-event-extravaganza-poster-template.webp

🔗 HTML References:
- /res/select/download.html
- /res/select/download (1).html
- /res/select/download (2).html
- /res/select/fashion-week-fl-announces-fll-fashion-week-casting-call-22225.html

💡 Usage: These can be referenced in opportunity cards as preview thumbnails
   or in the marketing campaign dashboard as campaign visuals.
```

---

## 📋 Test Execution Checklist

### Pre-Flight
- [x] Database seeded with 7 user accounts
- [x] Backend running on port 8100
- [x] Frontend running on port 3100
- [ ] Browser DevTools open (F12)
- [ ] Network tab monitoring enabled

### Login Tests
- [ ] System Admin (admin@kcd-agency.com)
- [ ] Community Admin (community.admin@kcd-agency.com)
- [ ] Moderator (moderator@kcd-agency.com)
- [ ] Premium User (premium@kcd-agency.com)
- [ ] Free User (free@kcd-agency.com)
- [ ] Guest Account (guest@kcd-agency.com)

### Authorization Tests
- [ ] Non-admin cannot change roles
- [ ] Non-admin cannot change user active status
- [ ] Moderator cannot impersonate system_admin
- [ ] Guest cannot access subscription management
- [ ] Guest cannot submit feature requests

### Dashboard Tests
- [ ] System Admin: All 7 users visible in table
- [ ] Community Admin: Campaign CRUD operations work
- [ ] Moderator: Impersonation workflow completes
- [ ] Premium User: Top 5 subscriptions calculated correctly
- [ ] Free User: Limited to 2 highlights
- [ ] Guest: First 2 opportunities unlocked, rest locked

### API Response Tests
- [ ] All GET requests return data without errors
- [ ] All POST/PATCH requests succeed with 200/201
- [ ] All 403s properly block unauthorized operations
- [ ] Error responses display gracefully in UI

---

## 🚀 Live Testing URL

```
http://localhost:3100/

Test Credentials Available:
1. admin@kcd-agency.com / admin123
2. community.admin@kcd-agency.com / comm_admin123
3. moderator@kcd-agency.com / mod123
4. premium@kcd-agency.com / premium123
5. free@kcd-agency.com / free123
6. guest@kcd-agency.com / guest123
```

---

## 📝 Notes

- **Theme System:** Each dashboard loads theme from `useThemeStore` and applies CSS variables
- **API Error Handling:** All Promise.all requests have .catch() fallbacks to prevent cascade failures
- **Session Management:** JWT tokens stored in localStorage; refresh handled by axios interceptor
- **Database Persistence:** All operations write to SQLite backend (seeded state preserved across tests)

---

**Last Updated:** 2026-02-01 | **Status:** Ready for Manual Verification ✅
