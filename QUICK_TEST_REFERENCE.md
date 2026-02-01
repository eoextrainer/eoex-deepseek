# 🚀 EOEX Platform - Quick Reference Card

## ⚡ Quick Start (30 seconds)

```
1. Open: http://localhost:3100
2. Click "Login"
3. Use any credentials below:

System Admin     | admin@kcd-agency.com          | admin123
Community Admin  | community.admin@kcd-agency.com | comm_admin123  
Moderator        | moderator@kcd-agency.com      | mod123
Premium User     | premium@kcd-agency.com        | premium123
Free User        | free@kcd-agency.com           | free123
Guest            | guest@kcd-agency.com          | guest123
```

---

## 🎯 What to Test Per Role

### System Admin
```
✅ Login with admin@kcd-agency.com / admin123
✅ See 7-user table in Light theme
✅ View all subscription plans
✅ Check feature request queue
✅ Try to vet a feature request
```

### Community Admin
```
✅ Login with community.admin@kcd-agency.com / comm_admin123
✅ Dashboard loads in Blue theme
✅ View subscription overview
✅ Create a campaign (draft mode)
✅ Vet feature requests
```

### Moderator
```
✅ Login with moderator@kcd-agency.com / mod123
✅ Dashboard loads in Dark Blue theme
✅ See user engagement/happiness score
✅ View opportunities with filters
✅ Try impersonating a user (NOT admin)
✅ Moderate forum by 3 categories
```

### Premium User
```
✅ Login with premium@kcd-agency.com / premium123
✅ Dashboard loads in Netflix Red theme
✅ See latest highlights
✅ View top 5 subscriptions
✅ Submit a feature request
```

### Free User
```
✅ Login with free@kcd-agency.com / free123
✅ Dashboard loads in Netflix Dark theme
✅ Limited highlights (2 max)
✅ Read-only subscription view
✅ Submit feature request
```

### Guest
```
✅ Login with guest@kcd-agency.com / guest123
✅ Dashboard loads in Restricted Gray theme
✅ See 2 unlocked opportunities
✅ Locked overlay on others
✅ No subscription or FR access
```

---

## 🔧 Architecture Overview

```
Frontend (Vite)           Backend (FastAPI)        Database
Port 3100                 Port 8100                Port 5432
├─ Login                  ├─ Auth Endpoints        └─ Users (7 seeded)
├─ 6 Role Dashboards      ├─ User CRUD             └─ Roles (5 types)
├─ Theme System           ├─ Subscriptions         └─ Relationships
└─ Live API Calls         ├─ Campaigns
                          ├─ Opportunities
                          ├─ Issues
                          ├─ Forum
                          └─ Feature Requests
```

---

## 🔒 Authorization Verification

### Role Change Guard (CRITICAL)
```bash
# Try as non-admin user - should FAIL
curl -X PUT http://localhost:8100/api/v1/users/5 \
  -H "Authorization: Bearer <non-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"role_id": 1}'

# Expected: HTTP 403 "Role changes require system admin"
```

### Impersonation Guard
```bash
# Moderator cannot impersonate system_admin
# This is filtered automatically - admin not in dropdown
```

---

## 📊 Expected Behavior Matrix

| Feature | System Admin | Community Admin | Moderator | Premium User | Free User | Guest |
|---------|---|---|---|---|---|---|
| User Management | ✅ Full | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Campaign Management | ✅ View | ✅ CRUD | ❌ No | ❌ No | ❌ No | ❌ No |
| Opportunity Tracking | ✅ View | ✅ View | ✅ Full | ❌ No | ❌ No | ✅ Preview |
| Forum Moderation | ✅ View | ✅ View | ✅ Full | ❌ No | ❌ No | ❌ No |
| User Impersonation | ❌ No | ❌ No | ✅ Full | ❌ No | ❌ No | ❌ No |
| Feature Requests | ✅ Vet | ✅ Vet | ✅ Vet | ✅ Create | ✅ Create | ❌ No |
| Subscriptions | ✅ Full | ✅ Full | ❌ View | ✅ Manage | ✅ View | ❌ No |

---

## 🐛 If Something Breaks

### 503 / API not responding
```bash
docker restart kcd_backend && sleep 3
# Then refresh browser
```

### 403 Unauthorized
```bash
- Token expired? Logout and login again
- Check role has permission for that endpoint
- Verify token in DevTools (F12 → Application → localStorage)
```

### Dashboard shows "loading..." forever
```bash
- Open F12 Console
- Look for 404/500 errors in Network tab
- Check if correct API endpoint URL (http://localhost:8100)
```

---

## 📱 Browser Dev Tools Checklist

1. **F12 → Console**
   - Should see zero critical errors
   - Watch for 403/404/500 responses

2. **F12 → Network**
   - Login: POST /api/v1/auth/login → 200
   - Dashboard: GET /api/v1/users → 200
   - GET /api/v1/subscriptions/plans → 200

3. **F12 → Application → LocalStorage**
   - token key exists
   - Contains JWT payload with user_id and role

4. **F12 → Styles**
   - Check CSS variables applied: --primary-color, --secondary-color
   - Theme should match role (Light / Blue / Dark Blue / Red / Gray)

---

## ✅ Sign-Off Checklist

- [ ] All 6 users can login
- [ ] Each loads correct dashboard theme
- [ ] API calls return 200 (no 500s)
- [ ] Non-admin cannot change roles (gets 403)
- [ ] Moderator cannot impersonate admin
- [ ] Guest sees locked items properly
- [ ] Console has zero critical errors
- [ ] Network tab shows no failed API calls

---

## 📞 Quick Reference

**Frontend:** http://localhost:3100  
**Backend:** http://localhost:8100/api/v1/  
**All Tests:** FLOW_VERIFICATION_REPORT.md  
**Detailed Guide:** LIVE_TESTING_REPORT.md  

**Status:** ✅ ALL SYSTEMS GO - Ready for manual testing!

---

*Last Updated: Feb 1, 2026 | Platform: EOEX Enterprise Opportunity Exchange*
