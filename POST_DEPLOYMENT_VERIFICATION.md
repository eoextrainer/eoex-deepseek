# Post-Deployment Verification Guide

## Overview

This guide provides step-by-step verification procedures after successfully deploying to Render.

---

## Phase 1: Immediate Post-Deployment (First 15 minutes)

### Step 1: Verify Service Status

**In Render Dashboard:**

1. Go to https://render.com/dashboard
2. Check "Services" section
3. For each service, verify:
   - Status is "Live" (green)
   - No error messages
   - Deploy time shows recent timestamp

```bash
# Service Status Check
# Frontend: kcd-frontend - Should be "Live"
# Backend: kcd-api - Should be "Live"
# Database: kcd-db - Should be "Live"
```

### Step 2: Check Build Logs

**Frontend Service Logs:**
```
Service: kcd-frontend
Look for:
✓ "npm install" completed
✓ "npm run build" completed
✓ "dist" directory created
✓ Deploy completed successfully
```

**Backend Service Logs:**
```
Service: kcd-api
Look for:
✓ "pip install" completed
✓ "Uvicorn running" message
✓ No import errors
✓ Application started successfully
```

### Step 3: Quick Health Checks

**Frontend Health:**
```bash
curl -I https://kcd-frontend.onrender.com

# Expected:
# HTTP/1.1 200 OK
# Content-Type: text/html
```

**Backend Health:**
```bash
curl https://kcd-api.onrender.com/api/v1/health

# Expected:
# {"status": "ok"}
# or
# {"status": "healthy"}
```

---

## Phase 2: Basic Functionality Testing (15-30 minutes)

### Test 1: Frontend Loads

**Manual Test:**
1. Open https://kcd-frontend.onrender.com in browser
2. Page should load without blank screen
3. Logo/header should be visible
4. Navigation menu should be visible
5. No console errors (Press F12 to check)

**Command Test:**
```bash
curl -s https://kcd-frontend.onrender.com | head -20

# Should see HTML content starting with <!DOCTYPE html>
```

### Test 2: Backend Responds

**API Health Endpoint:**
```bash
curl -X GET https://kcd-api.onrender.com/api/v1/health

# Expected Response:
# {"status": "ok"}
```

**API Info Endpoint (if exists):**
```bash
curl https://kcd-api.onrender.com/docs

# Should show Swagger documentation
```

### Test 3: Database Connection

**Check Backend Logs for DB Connection:**
```
Look for: "Successfully connected to database"
or: "Database connection established"

Look for errors like:
✗ "could not connect to server"
✗ "FATAL: database does not exist"
```

### Test 4: Authentication Flow

**Manual Test:**
1. Open https://kcd-frontend.onrender.com
2. Find login page
3. Try logging in with test credentials:
   - Email: `admin@kcd-agency.com`
   - Password: `admin123`
4. Should either:
   - Show error (database not seeded)
   - Redirect to dashboard (success)

**Expected Outcomes:**
- ✓ Login page loads
- ✓ Form submission works
- ✓ No network errors
- ✓ No CORS errors

---

## Phase 3: Comprehensive Testing (30-60 minutes)

### Test 1: Complete User Journey

```
1. Open https://kcd-frontend.onrender.com
   ✓ Page loads in < 3 seconds
   
2. Navigate to Login
   ✓ Login form displays
   ✓ No console errors
   
3. Attempt Login (use test credentials or admin override)
   ✓ Credentials accepted
   ✓ Redirected to dashboard
   
4. View Dashboard
   ✓ User data displays
   ✓ Navigation works
   ✓ All widgets load
   
5. Navigate to Other Pages
   ✓ All links work
   ✓ Pages load correctly
   ✓ Data displays
   
6. Test Logout
   ✓ Logout button works
   ✓ Redirected to login page
   ✓ Session cleared
```

### Test 2: API Testing

**Using curl or Postman:**

```bash
# 1. Health Check
curl https://kcd-api.onrender.com/api/v1/health

# 2. User Endpoint (if exists and auth not required)
curl https://kcd-api.onrender.com/api/v1/users

# 3. Login Endpoint
curl -X POST https://kcd-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kcd-agency.com","password":"admin123"}'

# 4. Protected Endpoint (using token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://kcd-api.onrender.com/api/v1/users/me
```

### Test 3: Error Scenarios

**Test 404 Errors:**
```bash
curl https://kcd-api.onrender.com/api/v1/notexists

# Expected:
# 404 Not Found
# {"detail": "Not found"}
```

**Test 400 Errors:**
```bash
curl -X POST https://kcd-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}'

# Expected:
# 400 Bad Request
```

**Test 500 Errors:**
```bash
# If endpoint exists, missing data should trigger error
curl -X POST https://kcd-api.onrender.com/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"missing":"fields"}'

# Expected:
# 500 Internal Server Error
# or 400 Validation Error
```

---

## Phase 4: Performance Verification (Optional but Recommended)

### Response Time Testing

**Frontend Load Time:**
```bash
# Using curl with timing
curl -w "@-" -o /dev/null -s \
  -H "Authorization: Bearer token" \
  https://kcd-frontend.onrender.com << 'EOF'
    time_namelookup:  %{time_namelookup}\n
    time_connect:     %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
    time_pretransfer: %{time_pretransfer}\n
    time_redirect:    %{time_redirect}\n
    time_starttransfer: %{time_starttransfer}\n
    time_total:       %{time_total}\n
EOF

# Expected:
# time_total: < 1000ms (1 second)
```

**Backend API Response Time:**
```bash
curl -w "Response time: %{time_total}s\n" \
  -o /dev/null -s \
  https://kcd-api.onrender.com/api/v1/health

# Expected:
# Response time: < 200ms (0.2 seconds)
```

### Browser Performance

**Using Chrome DevTools:**
1. Open https://kcd-frontend.onrender.com
2. Press F12 → Network tab
3. Reload page
4. Check:
   - Total load time < 3 seconds
   - No failed requests
   - No 404 errors
   - JavaScript bundle size acceptable

**Using Lighthouse:**
1. Open DevTools
2. Click "Lighthouse" tab
3. Run audit
4. Target scores:
   - Performance: > 80
   - Accessibility: > 80
   - Best Practices: > 80
   - SEO: > 80

---

## Phase 5: Monitoring & Logs

### Check Application Logs

**In Render Dashboard:**

1. Go to Service → Logs
2. Check for patterns:

**Good Logs:**
```
✓ Request processed: GET /api/v1/health - 200 OK
✓ User authentication: success
✓ Database query: completed in 45ms
```

**Bad Logs:**
```
✗ Error: connection timeout
✗ Error: database connection failed
✗ Error: CORS policy violation
✗ Error: JWT token invalid
✗ Error: 500 Internal Server Error
```

### Set Up Alerts

**In Render Dashboard:**

1. Service Settings → Notifications
2. Configure alerts for:
   - Service crashed
   - Build failed
   - High error rate
   - High resource usage

### Monitor Resource Usage

**In Render Dashboard:**

1. Service → Metrics
2. Monitor for first 30 minutes:
   - CPU usage (should stabilize < 50%)
   - Memory usage (should stabilize < 80%)
   - Request count (should be normal)
   - Error rate (should be 0% or near 0%)

---

## Phase 6: Database Verification

### Check Database Connection

**In Backend Logs:**
```
Look for: "Connected to PostgreSQL"
or: "Database connection established"
```

### Verify Seeded Data

**Test with API:**
```bash
# If seeding was run
curl https://kcd-api.onrender.com/api/v1/users

# Should return user list (or require auth)
```

**SSH into Backend Service (if available):**
```bash
# Connect to Render backend terminal
psql $DATABASE_URL

# Check tables
\dt

# Check users table
SELECT COUNT(*) FROM users;
```

---

## Phase 7: Security Verification

### Check HTTPS/SSL

```bash
# Verify HTTPS works
curl -v https://kcd-frontend.onrender.com 2>&1 | grep "SSL"

# Should show:
# SSL connection using TLSv1.3
# Server certificate verified
```

### Check Security Headers

```bash
curl -I https://kcd-api.onrender.com/api/v1/health | grep -i "security\|strict\|x-frame"

# Look for:
# Strict-Transport-Security
# X-Frame-Options
# X-Content-Type-Options
```

### Verify CORS Configuration

```bash
# Test CORS headers
curl -H "Origin: https://kcd-frontend.onrender.com" \
  -H "Access-Control-Request-Method: POST" \
  -i https://kcd-api.onrender.com/api/v1/health

# Should include:
# Access-Control-Allow-Origin: https://kcd-frontend.onrender.com
```

---

## Phase 8: Integration Testing

### Frontend-Backend Integration

**Test API Integration:**
1. Open https://kcd-frontend.onrender.com
2. Open browser DevTools → Network tab
3. Perform user action
4. Verify API calls:
   - Status code 200 for successful calls
   - Correct response format
   - No CORS errors
   - Response time < 1 second

**Test Data Flow:**
1. Login with valid credentials
2. Dashboard should display user data
3. Navigation should work
4. All features should function

### Database Integration

**Test CRUD Operations:**
```bash
# Create (POST)
curl -X POST https://kcd-api.onrender.com/api/v1/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test Item"}'

# Read (GET)
curl https://kcd-api.onrender.com/api/v1/items

# Update (PUT)
curl -X PUT https://kcd-api.onrender.com/api/v1/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Updated Item"}'

# Delete (DELETE)
curl -X DELETE https://kcd-api.onrender.com/api/v1/items/1 \
  -H "Authorization: Bearer TOKEN"
```

---

## Verification Checklist

### Immediate (5 minutes)
- [ ] Services show "Live" status
- [ ] No build errors in logs
- [ ] Health check responds
- [ ] Frontend URL loads
- [ ] Backend URL responds

### Basic (30 minutes)
- [ ] Frontend page loads without errors
- [ ] Login form displays
- [ ] Authentication works
- [ ] Dashboard displays
- [ ] No console errors
- [ ] API responds to requests

### Comprehensive (60 minutes)
- [ ] Complete user journey works
- [ ] All major features tested
- [ ] Error scenarios handled
- [ ] Performance acceptable
- [ ] Response times reasonable
- [ ] Logs show no errors

### Advanced (Optional)
- [ ] Performance metrics checked
- [ ] Security headers verified
- [ ] Database integrity confirmed
- [ ] Integration tests pass
- [ ] Monitoring configured
- [ ] Alerts working

---

## Troubleshooting During Verification

### Issue: Frontend shows blank page

**Diagnosis:**
```bash
# Check browser console
Press F12 → Console tab
Look for error messages

# Common errors:
- "Failed to fetch from https://kcd-api.onrender.com"
- "Access to XMLHttpRequest blocked by CORS policy"
- "Unexpected token < in JSON at position 0"
```

**Solution:**
1. Verify VITE_API_BASE_URL is correct
2. Check backend is running
3. Verify CORS configuration
4. See: GIT_PUSH_INSTRUCTIONS_DETAILED.md → Troubleshooting

### Issue: API returns 500 error

**Diagnosis:**
```bash
# Check backend logs
Render Dashboard → Service → Logs

# Look for error messages showing what failed
```

**Solution:**
1. Check database connection
2. Verify environment variables
3. Review error in logs
4. Restart service
5. See: RENDER_DEPLOYMENT_GUIDE.md → Common Issues

### Issue: Database connection timeout

**Diagnosis:**
```bash
# Test database URL
psql $DATABASE_URL -c "SELECT 1"

# Should return: 1 (or connect successfully)
```

**Solution:**
1. Verify DATABASE_URL in environment variables
2. Check PostgreSQL service is running
3. Verify network connectivity
4. Check firewall rules
5. See: RENDER_DEPLOYMENT_GUIDE.md → Database Issues

### Issue: CORS errors

**Diagnosis:**
```bash
# Check CORS headers in response
curl -I https://kcd-api.onrender.com/api/v1/health | grep "Access-Control"

# Should include Access-Control-Allow-Origin header
```

**Solution:**
1. Update CORS_ORIGINS in backend environment variables
2. Include frontend URL exactly as it appears in browser
3. Restart backend service
4. Test with curl as above
5. See: ENVIRONMENT_CONFIGURATION.md → CORS_ORIGINS

---

## Sign-Off Checklist

After completing all verification phases, confirm:

- [ ] **Phase 1**: Service status verified
- [ ] **Phase 2**: Basic functionality working
- [ ] **Phase 3**: Comprehensive tests passing
- [ ] **Phase 4**: Performance acceptable (or skipped)
- [ ] **Phase 5**: Logs monitored, no errors
- [ ] **Phase 6**: Database verified
- [ ] **Phase 7**: Security verified
- [ ] **Phase 8**: Integration verified

---

## Deployment Success Criteria

### Critical (Must Pass)
- ✓ Services show "Live" status
- ✓ Health check responds with 200 OK
- ✓ Frontend loads without blank page
- ✓ Login functionality works
- ✓ No critical errors in logs
- ✓ Database connection works

### Important (Should Pass)
- ✓ All major features working
- ✓ API responses correct
- ✓ Response times acceptable (< 1s)
- ✓ Error handling working
- ✓ CORS not blocking requests
- ✓ Authentication tokens working

### Nice to Have (Optional)
- ✓ Performance > 80 Lighthouse score
- ✓ Monitoring configured
- ✓ Alerts set up
- ✓ Backup strategy documented
- ✓ Scaling plan ready

---

## Next Steps

If all verification passes:

### Immediate
- [ ] Notify stakeholders of successful deployment
- [ ] Document any findings or issues
- [ ] Update deployment status in tracking system
- [ ] Create incident/issue tickets for any problems found

### Short-term (24 hours)
- [ ] Monitor application for 24 hours
- [ ] Check error rates remain low
- [ ] Verify no unexpected usage patterns
- [ ] Confirm no cascading failures

### Medium-term (1 week)
- [ ] Review performance metrics
- [ ] Analyze usage patterns
- [ ] Optimize if needed
- [ ] Document lessons learned

### Long-term (ongoing)
- [ ] Regular backups
- [ ] Security patches
- [ ] Performance optimization
- [ ] Feature development

---

## Support & Escalation

### If Issues Found

1. **Document the Issue**
   - What failed?
   - When did it start?
   - What were you doing?
   - What's the error message?

2. **Check Known Issues**
   - See: RENDER_DEPLOYMENT_GUIDE.md → Common Issues

3. **Review Logs**
   - Render Dashboard → Service → Logs
   - Look for error messages
   - Note timestamps

4. **Consult Documentation**
   - RENDER_DEPLOYMENT_GUIDE.md
   - ENVIRONMENT_CONFIGURATION.md
   - GIT_PUSH_INSTRUCTIONS_DETAILED.md

5. **Reach Out to Support**
   - Render Support: https://support.render.com
   - GitHub Issues (for code): https://github.com/eoextrainer/kcd/issues

---

## Deployment Complete ✓

**Status:** Successfully deployed to Render  
**Frontend:** https://kcd-frontend.onrender.com  
**Backend:** https://kcd-api.onrender.com  
**Database:** PostgreSQL on Render  
**Monitor:** Render Dashboard  
**Status Page:** https://status.render.com  

---

**Post-Deployment Verification Guide Complete**
**Date: February 1, 2026**
**Verified By:** [Your Name]
**Sign-off Date:** [Today's Date]
