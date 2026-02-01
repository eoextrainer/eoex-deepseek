# Environment Configuration Guide

## Overview

This guide explains all environment variables required for the KCD application across different environments (development, staging, production).

---

## Environment Variables by Service

### Frontend Environment Variables

#### Development
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
VITE_DEBUG=true
```

#### Staging (Render)
```
VITE_API_BASE_URL=https://kcd-api-staging.onrender.com/api/v1
VITE_APP_ENV=staging
VITE_DEBUG=true
```

#### Production (Render)
```
VITE_API_BASE_URL=https://kcd-api.onrender.com/api/v1
VITE_APP_ENV=production
VITE_DEBUG=false
```

### Backend Environment Variables

#### Development
```
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kcd_dev
SECRET_KEY=dev-secret-key-not-for-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
DEBUG=true
LOG_LEVEL=DEBUG
REDIS_URL=redis://localhost:6379/0
```

#### Staging (Render)
```
ENVIRONMENT=staging
DATABASE_URL=postgresql://user:password@db.onrender.com:5432/kcd_staging
SECRET_KEY=your-staging-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://kcd-frontend-staging.onrender.com
CORS_ORIGINS=https://kcd-frontend-staging.onrender.com
DEBUG=false
LOG_LEVEL=INFO
REDIS_URL=redis://cache.onrender.com:6379/0
```

#### Production (Render)
```
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@dpg-xxx.onrender.com:5432/kcd_db
SECRET_KEY=your-production-secret-key-min-32-chars-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=https://kcd-frontend.onrender.com
CORS_ORIGINS=https://kcd-frontend.onrender.com
DEBUG=false
LOG_LEVEL=WARNING
REDIS_URL=redis://cache.onrender.com:6379/0
SENTRY_DSN=your-sentry-dsn-for-error-tracking
```

---

## Variable Definitions

### Core Configuration

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `ENVIRONMENT` | String | `production` | Yes | Deployment environment (development, staging, production) |
| `DEBUG` | Boolean | `false` | Yes | Enable debug mode (true for dev, false for prod) |
| `LOG_LEVEL` | String | `INFO` | Yes | Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL) |

### Database Configuration

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `DATABASE_URL` | String | `postgresql://user:pass@host:5432/db` | Yes | PostgreSQL connection string |
| `DB_POOL_SIZE` | Integer | `20` | No | Database connection pool size |
| `DB_POOL_RECYCLE` | Integer | `3600` | No | Connection recycle time in seconds |
| `DB_ECHO` | Boolean | `false` | No | Log all SQL queries (dev only) |

### Authentication

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `SECRET_KEY` | String | `<random-32+-chars>` | Yes | JWT secret key (min 32 characters) |
| `ALGORITHM` | String | `HS256` | Yes | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Integer | `30` | Yes | JWT token expiration in minutes |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Integer | `7` | Yes | Refresh token expiration in days |

### API Configuration

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `FRONTEND_URL` | String | `https://frontend.com` | Yes | Frontend application URL |
| `CORS_ORIGINS` | String | `https://frontend.com,https://api.frontend.com` | Yes | Comma-separated CORS origins |
| `API_PREFIX` | String | `/api/v1` | No | API prefix (default: /api/v1) |
| `API_TITLE` | String | `KCD API` | No | API title for docs |

### Frontend Configuration

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `VITE_API_BASE_URL` | String | `https://api.com/api/v1` | Yes | Backend API base URL |
| `VITE_APP_ENV` | String | `production` | Yes | Application environment |
| `VITE_DEBUG` | Boolean | `false` | No | Debug mode for frontend |
| `VITE_APP_NAME` | String | `KCD` | No | Application name |

### Optional Services

| Variable | Type | Example | Required | Description |
|----------|------|---------|----------|-------------|
| `REDIS_URL` | String | `redis://host:6379/0` | No | Redis cache connection |
| `SENTRY_DSN` | String | `https://key@sentry.io/123` | No | Sentry error tracking |
| `SMTP_SERVER` | String | `smtp.gmail.com` | No | Email server for notifications |
| `SMTP_PORT` | Integer | `587` | No | Email server port |
| `SMTP_USER` | String | `noreply@app.com` | No | Email authentication user |
| `SMTP_PASSWORD` | String | `<secure-password>` | No | Email authentication password |

---

## Environment-Specific Setup

### Development Setup

**File:** `.env`

```bash
# Copy from .env.example
cp .env.example .env

# Update values for local development
ENVIRONMENT=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kcd_dev
VITE_API_BASE_URL=http://localhost:8000/api/v1
SECRET_KEY=dev-key-not-for-production
```

**Install & Run:**
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Staging Setup (Render)

**Step 1: Update .env.staging**
```bash
ENVIRONMENT=staging
DATABASE_URL=<get-from-render>
SECRET_KEY=<generate-new-secure-key>
VITE_API_BASE_URL=https://kcd-api-staging.onrender.com/api/v1
```

**Step 2: Deploy to Render**
```bash
git push origin deploy/staging
# Render auto-deploys with staging environment variables
```

**Step 3: Configure in Render Dashboard**
1. Frontend Service → Environment → Set VITE_API_BASE_URL
2. Backend Service → Environment → Set DATABASE_URL, SECRET_KEY, etc.

### Production Setup (Render)

**Step 1: Generate Secure Keys**
```bash
# Generate SECRET_KEY (32+ random characters)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Step 2: Update Render Environment Variables**

In Render Dashboard:

**Frontend Service:**
- Go to Settings → Environment
- Add/Update:
  - `VITE_API_BASE_URL=https://kcd-api.onrender.com/api/v1`
  - `VITE_APP_ENV=production`
  - `VITE_DEBUG=false`

**Backend Service:**
- Go to Settings → Environment
- Add/Update all backend variables (see above)
- Render will auto-inject at deployment

**Step 3: Deploy**
```bash
git push origin main
# Render auto-deploys with production environment variables
```

---

## Generating Secure Keys

### SECRET_KEY Generation

**Method 1: Python**
```python
import secrets
print(secrets.token_urlsafe(32))
# Output: Drmhze6EPcv0fN_81Bj-nA
```

**Method 2: OpenSSL**
```bash
openssl rand -base64 32
# Output: X7rL9kP2mQ5nR8sT1vW4xY6zAb3cD7eF
```

**Method 3: bash**
```bash
head -c 32 /dev/urandom | base64
```

---

## Security Best Practices

### DO's ✅

- ✅ Use Render Dashboard to set environment variables
- ✅ Generate new SECRET_KEY for each environment
- ✅ Keep SECRET_KEY unique per environment
- ✅ Use HTTPS URLs in production
- ✅ Rotate secrets regularly (monthly recommended)
- ✅ Log sensitive operations
- ✅ Use strong database passwords (16+ characters, mixed case, numbers, symbols)
- ✅ Enable database backups

### DON'Ts ❌

- ❌ Never commit .env files to Git
- ❌ Never hardcode secrets in code
- ❌ Never share SECRET_KEY across environments
- ❌ Never use default/weak passwords
- ❌ Never log SECRET_KEY or passwords
- ❌ Never expose DATABASE_URL in frontend
- ❌ Never use development keys in production
- ❌ Never disable HTTPS in production

---

## Variable Validation

### Frontend Validation

**In `src/config.js` or similar:**

```javascript
const requiredEnvVars = ['VITE_API_BASE_URL', 'VITE_APP_ENV'];

requiredEnvVars.forEach(variable => {
  if (!import.meta.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});
```

### Backend Validation

**In `app/core/config.py` or similar:**

```python
from pydantic import BaseSettings, Field

class Settings(BaseSettings):
    environment: str = Field(..., env='ENVIRONMENT')
    database_url: str = Field(..., env='DATABASE_URL')
    secret_key: str = Field(..., env='SECRET_KEY')
    
    class Config:
        env_file = '.env'
        case_sensitive = False

settings = Settings()
```

---

## Environment Variable Override Order

Render applies environment variables in this order (last wins):

1. Default values in code
2. `.env` file (development only)
3. System environment variables
4. Render Environment Variables (highest priority)

Example:
```python
# Code default: 30 minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Can be overridden by:
# 1. .env file: ACCESS_TOKEN_EXPIRE_MINUTES=60
# 2. System env: export ACCESS_TOKEN_EXPIRE_MINUTES=60
# 3. Render Dashboard: ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Troubleshooting

### Issue: "Missing environment variable"

**Solution:**
```bash
# Check variable is set
echo $VARIABLE_NAME

# Check .env file exists
cat .env

# Verify in Render Dashboard: Service → Environment
```

### Issue: "Database connection failed"

**Solution:**
```bash
# Test DATABASE_URL
psql $DATABASE_URL -c "SELECT 1"

# Verify variable in Render logs
# Check DATABASE_URL format is correct
```

### Issue: "CORS error - origin not allowed"

**Solution:**
```bash
# Update CORS_ORIGINS in backend environment
CORS_ORIGINS=https://kcd-frontend.onrender.com

# Restart backend service
```

### Issue: "JWT token invalid"

**Solution:**
```bash
# SECRET_KEY must match across restarts
# Don't change SECRET_KEY in production (invalidates all tokens)
# If changed, all users must re-login

# Verify SECRET_KEY in Render Dashboard
```

---

## Migration Guide

### Moving from Development to Production

```bash
# 1. Generate production keys
python -c "import secrets; print(secrets.token_urlsafe(32))"

# 2. Update Render environment variables with production values
#    (Via Render Dashboard)

# 3. Deploy production build
git push origin main

# 4. Verify with production URLs
curl https://kcd-api.onrender.com/api/v1/health
curl https://kcd-frontend.onrender.com
```

### Changing Environment Variables in Production

**Without downtime:**
```bash
# 1. Update variable in Render Dashboard
# 2. Click "Save"
# 3. Render auto-restarts service with new values
# 4. No downtime for most variables

# For DATABASE_URL changes:
# 1. Update DATABASE_URL
# 2. Service automatically uses new database
# 3. Ensure old database remains accessible during transition
```

---

## Environment Variable Checklist

### Before Deployment

- [ ] All required variables defined
- [ ] No hardcoded secrets in code
- [ ] SECRET_KEY is unique and secure
- [ ] DATABASE_URL is correct
- [ ] CORS_ORIGINS includes frontend URL
- [ ] API URLs use HTTPS in production
- [ ] Debug mode disabled in production
- [ ] Log level appropriate for environment

### After Deployment

- [ ] Health check endpoint responds
- [ ] Frontend loads without errors
- [ ] Backend API accessible
- [ ] Database connections work
- [ ] Authentication tokens valid
- [ ] CORS requests succeed
- [ ] Error logging works
- [ ] Performance acceptable

---

## Support

For issues:
1. Check Render logs: Service → Logs
2. Verify all variables in Render Dashboard
3. Test locally with same variables: `source .env && npm run dev`
4. Check variable format and syntax

---

**Environment Configuration Guide Complete**
**Last Updated: February 1, 2026**
