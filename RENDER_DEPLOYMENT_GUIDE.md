# KCD Application - Render Deployment Configuration

This guide provides step-by-step instructions for deploying the KCD application to Render.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Render Account Setup](#render-account-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment](#post-deployment)
9. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Prerequisites

### Requirements
- GitHub account with access to: https://github.com/eoextrainer/kcd.git
- Render account (free or paid): https://render.com
- Git installed locally
- Node.js 18+ (for local testing)
- Python 3.9+ (for local testing)

### Verify Tools
```bash
node --version      # Should be 18.0.0 or higher
npm --version       # Should be 9.0.0 or higher
python --version    # Should be 3.9 or higher
pip --version       # Should be 21.0 or higher
git --version       # Should be 2.25 or higher
```

---

## GitHub Repository Setup

### Step 1: Clone or Verify Repository

If you haven't already cloned the repository:

```bash
git clone https://github.com/eoextrainer/kcd.git
cd kcd
```

If already cloned, verify the remote:

```bash
git remote -v
# Output should show:
# origin  https://github.com/eoextrainer/kcd.git (fetch)
# origin  https://github.com/eoextrainer/kcd.git (push)
```

### Step 2: Verify Branch Structure

```bash
git branch -a
# Should see main branch and other branches
```

### Step 3: Update Remote if Needed

```bash
git remote set-url origin https://github.com/eoextrainer/kcd.git
```

### Step 4: Create Deployment Branch (Optional)

For cleaner deployments, you can use a separate branch:

```bash
git checkout -b deploy/render
# Make changes as needed
git push -u origin deploy/render
```

---

## Render Account Setup

### Step 1: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Choose GitHub authentication
4. Authorize Render to access your GitHub account
5. Complete account setup

### Step 2: Connect GitHub Repository

1. Log in to Render Dashboard
2. Click "New +" → "Web Service"
3. Click "Connect a repository"
4. Search for "kcd" repository
5. Click "Connect"

### Step 3: Configure Git Permissions

Render should request permission to access your repository. Grant all permissions:
- Read repository contents
- Create webhooks
- Access deployment keys

---

## Frontend Deployment

### Step 1: Create Frontend Service on Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Select the "kcd" repository (or deploy/render branch)
3. Configure as follows:

**Service Settings:**
- Name: `kcd-frontend`
- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment: `Node 18`

### Step 2: Set Environment Variables

In the "Environment" tab, add:

```
VITE_API_BASE_URL=https://kcd-api.onrender.com/api/v1
VITE_APP_ENV=production
```

### Step 3: Configure Deploy Hooks (Optional)

For automatic deployments on push:
1. Go to Service Settings → Deploy Hook
2. Copy the webhook URL
3. Add to GitHub repository (Settings → Webhooks)
4. Trigger on: Push events

### Step 4: Deploy

1. Click "Create Static Site"
2. Render will automatically start the build
3. Wait for deployment to complete (~2-3 minutes)
4. Your frontend will be live at: `https://kcd-frontend.onrender.com`

---

## Backend Deployment

### Step 1: Create Backend Service on Render

1. In Render Dashboard, click "New +" → "Web Service"
2. Select the "kcd" repository
3. Configure as follows:

**Service Settings:**
- Name: `kcd-api`
- Root Directory: Leave empty (root of repo)
- Environment: `Python 3`
- Build Command: `cd backend && pip install -r requirements.txt`
- Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`

**Instance Type:**
- Start with Free tier for testing
- Upgrade to Starter ($7/month) for production

### Step 2: Set Environment Variables

In the "Environment" tab, add:

```
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@db.onrender.com:5432/kcd_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://kcd-frontend.onrender.com
CORS_ORIGINS=https://kcd-frontend.onrender.com
```

### Step 3: Configure Health Check

1. Go to Service Settings → Health Check
2. Health Check Path: `/api/v1/health`
3. Check Interval: 300 seconds
4. Timeout: 30 seconds

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will start the build
3. Wait for deployment (~3-5 minutes)
4. Your backend will be live at: `https://kcd-api.onrender.com`

---

## Database Setup

### Option 1: Render PostgreSQL Database

#### Create PostgreSQL Database:

1. Click "New +" → "PostgreSQL"
2. Configure:
   - Name: `kcd-db`
   - Database: `kcd_db`
   - User: `kcd_user`
   - Region: Choose closest to you
3. Click "Create Database"

#### Connection String:

After creation, you'll see the DATABASE_URL. It looks like:
```
postgresql://kcd_user:password@dpg-xxx.onrender.com:5432/kcd_db
```

Copy this and add to Backend environment variables.

#### Initialize Database:

```bash
# SSH into backend service or run migration script
cd backend
python -m alembic upgrade head
python seed_users.py  # Load demo data
```

### Option 2: External PostgreSQL

If using external database (AWS RDS, etc.):

1. Set `DATABASE_URL` environment variable
2. Ensure security groups allow Render IP
3. Run migrations as shown above

---

## Environment Variables

### Complete Environment Setup

**Frontend (.env file for local testing):**
```
VITE_API_BASE_URL=https://kcd-api.onrender.com/api/v1
VITE_APP_ENV=production
```

**Backend (.env file for local testing):**
```
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@host:5432/kcd_db
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://kcd-frontend.onrender.com
CORS_ORIGINS=https://kcd-frontend.onrender.com
DEBUG=false
LOG_LEVEL=INFO
```

### Securing Secrets

**NEVER commit .env files to GitHub!**

For Render:
1. Use Render Dashboard to set variables
2. Render stores secrets securely
3. Auto-injects at deployment time

For Local Development:
1. Copy `.env.example` to `.env`
2. Fill with your values
3. Keep `.env` in `.gitignore` (already configured)

---

## Post-Deployment

### Step 1: Verify Deployments

**Frontend:**
```bash
curl https://kcd-frontend.onrender.com
# Should return HTML content
```

**Backend:**
```bash
curl https://kcd-api.onrender.com/api/v1/health
# Should return: {"status": "ok"}
```

### Step 2: Check Logs

In Render Dashboard:
1. Select service
2. Click "Logs" tab
3. Look for errors or warnings

### Step 3: Run Database Migrations

```bash
# SSH into backend service:
cd backend
python -m alembic upgrade head
```

Or trigger via API:
```bash
curl -X POST https://kcd-api.onrender.com/api/v1/admin/migrate
```

### Step 4: Seed Demo Data (Optional)

```bash
# SSH into backend service:
cd backend
python seed_users.py
```

### Step 5: Test Application Flow

1. Go to https://kcd-frontend.onrender.com
2. Try logging in with demo credentials:
   - Email: `admin@kcd-agency.com`
   - Password: `admin123`
3. Test different user roles
4. Verify all features work

---

## Monitoring & Troubleshooting

### Common Issues & Solutions

#### Issue 1: Frontend Shows Blank Page

**Problem:** Blank white screen on load

**Solution:**
```bash
# Check browser console for errors
# Likely CORS or API URL issue

# Verify API URL:
curl https://kcd-api.onrender.com/api/v1/health

# Update VITE_API_BASE_URL in frontend environment variables
```

#### Issue 2: Backend Returns 503

**Problem:** Service Unavailable

**Solution:**
```bash
# Check backend logs
# Usually database connection issue

# Verify DATABASE_URL is correct:
psql $DATABASE_URL -c "SELECT 1"

# Check backend service status in Render Dashboard
```

#### Issue 3: CORS Errors

**Problem:** "No 'Access-Control-Allow-Origin' header"

**Solution:**
```bash
# Update CORS_ORIGINS in backend:
CORS_ORIGINS=https://kcd-frontend.onrender.com,http://localhost:3000

# Restart backend service
```

#### Issue 4: Database Connection Timeout

**Problem:** "could not connect to server"

**Solution:**
- Check PostgreSQL service status
- Verify firewall allows connections
- Ensure DATABASE_URL is in environment variables
- Test connection locally: `psql $DATABASE_URL`

#### Issue 5: Build Fails

**Problem:** "Build command failed"

**Solution:**
```bash
# Check build logs in Render Dashboard
# Common issues:
# - Missing dependencies: update requirements.txt or package.json
# - Node/Python version mismatch: specify in environment
# - Memory limit: upgrade instance type

# Test build locally:
cd frontend && npm run build
cd backend && pip install -r requirements.txt
```

### Monitoring Commands

```bash
# Check frontend status
curl -I https://kcd-frontend.onrender.com

# Check backend health
curl https://kcd-api.onrender.com/api/v1/health

# Check database connectivity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users"

# View recent logs
# Use Render Dashboard: Service → Logs → Last 100 lines
```

### Performance Monitoring

In Render Dashboard:
1. Select service
2. Click "Metrics" tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Network I/O
   - Response times

### Error Tracking

Set up error notifications:
1. Dashboard → Service Settings
2. Look for notification options
3. Configure email alerts

---

## Scaling & Optimization

### Frontend Scaling

Frontend is static, so no auto-scaling needed:
- Render uses global CDN
- Serves from edge locations
- No database calls

### Backend Scaling

For production traffic:

1. **Upgrade Instance Type:**
   - Free → Starter ($7/month)
   - Starter → Standard ($25/month)

2. **Enable Auto-Scaling:**
   - Go to Service Settings
   - Look for scaling options
   - Set min/max instances

3. **Database Scaling:**
   - Start with Starter PostgreSQL
   - Upgrade to Standard for production
   - Set connection pooling

### Cost Optimization

**Current Setup Costs:**
- Frontend: Free (static site)
- Backend: $7-50/month (depends on tier)
- Database: $7-30/month (depends on tier)
- **Total: $7-80/month**

To minimize costs:
- Use free tier for development
- Auto-pause services (if not needed 24/7)
- Use smaller instance types
- Monitor database connections

---

## Continuous Deployment

### Automatic Deployments

Render automatically deploys when you push to main branch:

```bash
git add .
git commit -m "Deploy: Update feature X"
git push origin main
```

Render will:
1. Detect push
2. Start build
3. Run tests (if configured)
4. Deploy changes
5. Run health checks

### Manual Deployment

If needed:
1. Go to Service in Render Dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"

### Rollback

If deployment fails:
1. Go to Service → Deploys
2. Find previous successful deploy
3. Click "Rollback"
4. Confirm

---

## Security Checklist

Before production deployment:

- [ ] Database credentials in environment variables (not code)
- [ ] SECRET_KEY is random and secure (32+ characters)
- [ ] CORS_ORIGINS only allows frontend domain
- [ ] HTTPS enabled (Render provides free SSL)
- [ ] Database backups enabled
- [ ] Monitoring and alerts configured
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] Authentication tokens secure
- [ ] Sensitive logs are masked

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor resource usage
- Verify health checks

**Monthly:**
- Review database size
- Check for unused services
- Update dependencies

**Quarterly:**
- Security audit
- Performance review
- Cost analysis

### Backup Strategy

**Database Backups:**
1. Render PostgreSQL auto-backs up daily
2. Retain 7-day backup history
3. Download backups as needed

```bash
# Download backup
pg_dump $DATABASE_URL > backup.sql

# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Support & Resources

### Documentation
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

### Troubleshooting
- Render Status: https://status.render.com
- Check logs in Render Dashboard
- Contact Render Support: https://support.render.com

### Community
- Stack Overflow: tag `render`
- GitHub Issues: Report bugs
- Discord: Community support

---

## Deployment Checklist

Before going live:

### Code Preparation
- [ ] All code committed to git
- [ ] No hardcoded secrets
- [ ] Environment variables defined
- [ ] Build script working locally
- [ ] Tests passing locally

### GitHub Setup
- [ ] Repository is public/accessible
- [ ] Correct branch configured
- [ ] Latest code pushed to GitHub
- [ ] SSH keys configured (if needed)

### Render Setup
- [ ] Account created and verified
- [ ] Services created (frontend + backend)
- [ ] Environment variables set
- [ ] Database created and migrated
- [ ] Health checks configured

### Testing
- [ ] Frontend loads without errors
- [ ] Backend API responds
- [ ] Database connections work
- [ ] Authentication works
- [ ] Key features tested

### Monitoring
- [ ] Logs accessible
- [ ] Alerts configured
- [ ] Health checks passing
- [ ] Performance metrics visible

### Documentation
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Rollback procedure known
- [ ] Support contacts available

---

## Quick Deployment Summary

```bash
# 1. Verify code is committed
git status

# 2. Push to GitHub
git push origin main

# 3. In Render Dashboard:
#    - Create Frontend Static Site
#    - Create Backend Web Service
#    - Create PostgreSQL Database
#    - Set environment variables
#    - Deploy

# 4. Verify deployments
curl https://kcd-frontend.onrender.com
curl https://kcd-api.onrender.com/api/v1/health

# 5. Run migrations
# SSH into backend service:
cd backend && python -m alembic upgrade head

# 6. Test application
# Open https://kcd-frontend.onrender.com
```

---

**Deployment Documentation Complete**
**Status: Ready for Production**
**Date: February 1, 2026**
