# GitHub Push Instructions

## Quick Start (5 minutes)

```bash
# 1. Verify your changes
git status

# 2. Stage all changes
git add .

# 3. Commit with meaningful message
git commit -m "Deploy: Add Render configuration and deployment documentation"

# 4. Push to GitHub
git push origin main

# 5. Verify successful push
git log --oneline -5
```

---

## Step-by-Step Guide

### Step 1: Check Current Status

```bash
cd /home/sos10/Documents/EOEX/kcd

# See what files have changed
git status

# You should see:
# On branch main
# Changes not staged for commit:
#   (use "git add <file>..." to include in what will be committed)
#
#   new file:   render.yaml
#   new file:   render-build-frontend.sh
#   new file:   render-build-backend.sh
#   new file:   RENDER_DEPLOYMENT_GUIDE.md
#   new file:   ENVIRONMENT_CONFIGURATION.md
#   new file:   GIT_PUSH_INSTRUCTIONS.md (this file)
```

### Step 2: Review Changes (Optional but Recommended)

```bash
# See what will be committed
git diff --stat

# Review specific file changes
git diff render.yaml
git diff RENDER_DEPLOYMENT_GUIDE.md

# Or use visual diff
git difftool
```

### Step 3: Add Files to Staging Area

**Option A: Add all changes**
```bash
git add .
```

**Option B: Add specific files**
```bash
git add render.yaml
git add render-build-frontend.sh
git add render-build-backend.sh
git add RENDER_DEPLOYMENT_GUIDE.md
git add ENVIRONMENT_CONFIGURATION.md
```

**Option C: Add files interactively**
```bash
git add -i
# Then select files to stage
```

### Step 4: Verify Staging

```bash
# See staged changes
git status

# You should see:
# On branch main
# Changes to be committed:
#   (use "git restore --cached <file>..." to unstage)
#
#   new file:   render.yaml
#   new file:   render-build-frontend.sh
#   ...
```

### Step 5: Create Commit Message

```bash
# Commit with message
git commit -m "Deploy: Add Render configuration and deployment documentation

- Add render.yaml for frontend static site configuration
- Add render-build-frontend.sh build script
- Add render-build-backend.sh build script
- Add RENDER_DEPLOYMENT_GUIDE.md with step-by-step instructions
- Add ENVIRONMENT_CONFIGURATION.md with env variable definitions
- Add GIT_PUSH_INSTRUCTIONS.md for deployment workflow

This commit includes all necessary configuration for deploying to Render.com
with PostgreSQL database, automatic builds, and production monitoring."
```

### Step 6: Push to GitHub

```bash
# Push to main branch
git push origin main

# If it's your first push or branch doesn't exist:
git push -u origin main

# If you get authentication error, see troubleshooting below
```

### Step 7: Verify Push Success

```bash
# Check if push was successful
git log --oneline -5

# You should see your commit at the top with "origin/main" indicator

# Alternatively, verify on GitHub:
# Open https://github.com/eoextrainer/kcd
# Check that commits appear in commit history
```

---

## Understanding Git Workflow

### Local Git Workflow

```
Working Directory ──add──> Staging Area ──commit──> Local Repository
                                           push────> Remote Repository
```

### Example Workflow

```bash
# 1. Create/modify files in Working Directory
# 2. Stage changes
git add file.txt

# 3. Commit to Local Repository
git commit -m "Add feature"

# 4. Push to Remote (GitHub)
git push origin main

# 5. Changes are now on GitHub
```

---

## Advanced Commit Options

### Commit with Multiple Paragraphs

```bash
git commit -m "Deploy: Add Render configuration

This commit prepares the KCD application for deployment on Render.com.

Technical Changes:
- render.yaml: Render platform configuration
- render-build-frontend.sh: Frontend build automation
- render-build-backend.sh: Backend build automation

Documentation:
- RENDER_DEPLOYMENT_GUIDE.md: Complete deployment instructions
- ENVIRONMENT_CONFIGURATION.md: Environment variables reference

These changes enable automated builds and deployments on Render platform."
```

### Amend Last Commit (if needed)

```bash
# If you forgot to add a file:
git add forgotten_file.txt
git commit --amend --no-edit

# If you want to change commit message:
git commit --amend -m "New message"
```

### Revert Commit (if needed)

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

---

## Troubleshooting

### Issue 1: "Authentication failed"

**Error:** `fatal: could not read Username for 'https://github.com': Terminal prompts disabled`

**Solution A: Use GitHub Token**
```bash
# Create GitHub Personal Access Token:
# 1. Go to https://github.com/settings/tokens
# 2. Click "Generate new token"
# 3. Select scopes: repo, workflow
# 4. Copy token

# Use token as password
git push origin main
# When prompted for password, paste your token

# Or use in URL:
git remote set-url origin https://YOUR_TOKEN@github.com/eoextrainer/kcd.git
git push origin main
```

**Solution B: Use SSH Keys**
```bash
# Generate SSH key (if not already done)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add key to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to GitHub
cat ~/.ssh/id_ed25519.pub
# Go to https://github.com/settings/keys
# Click "New SSH key"
# Paste key content

# Update remote to use SSH
git remote set-url origin git@github.com:eoextrainer/kcd.git

# Push
git push origin main
```

### Issue 2: "Nothing to commit"

**Error:** `nothing to commit, working tree clean`

**Solution:**
```bash
# Check if files are already committed
git log --oneline | head

# Create new files if needed
# Or make changes to existing files

# Then commit and push
git add .
git commit -m "Update: Description of changes"
git push origin main
```

### Issue 3: "Rejection due to pre-receive hook"

**Error:** `updates were rejected because the remote repository changed`

**Solution:**
```bash
# Pull latest changes first
git pull origin main

# If there are conflicts, resolve them
# Then commit and push
git add .
git commit -m "Merge: Resolve conflicts"
git push origin main
```

### Issue 4: "Large files rejected"

**Error:** `File is too large (size: XXX MB, max: 100 MB)`

**Solution:**
```bash
# Remove large file from git history
git rm --cached large_file.bin

# Add to .gitignore
echo "large_file.bin" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "Remove: Large file, add to gitignore"
git push origin main
```

### Issue 5: "Remote repository not found"

**Error:** `fatal: repository 'https://github.com/eoextrainer/kcd.git' not found`

**Solution:**
```bash
# Verify remote URL
git remote -v

# Update if incorrect
git remote set-url origin https://github.com/eoextrainer/kcd.git

# Verify URL is correct:
# - No typos
# - Has .git suffix
# - Correct owner name (eoextrainer)
# - Correct repo name (kcd)

# Push
git push origin main
```

---

## Verification Checklist

After pushing, verify:

- [ ] No error messages from `git push`
- [ ] Output shows `main -> main`
- [ ] Commit appears in GitHub commit history
- [ ] Files visible on GitHub website
- [ ] Render receives webhook (optional)
- [ ] Render starts auto-deployment (optional)

**Check GitHub:**
```bash
# View commits
git log --oneline -5

# Or visit in browser:
# https://github.com/eoextrainer/kcd/commits/main
```

---

## Git Commands Reference

### Viewing Changes

```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --cached

# Show all changes with stats
git diff --stat

# Show commits
git log --oneline

# Show commits with changes
git log -p

# Show current status
git status
```

### Staging Changes

```bash
# Stage all changes
git add .

# Stage specific file
git add filename

# Stage files matching pattern
git add *.js

# Stage interactively
git add -i

# Unstage file
git reset filename

# Unstage all
git reset
```

### Committing

```bash
# Commit staged changes
git commit -m "Message"

# Commit with detailed message
git commit

# Stage and commit (tracked files only)
git commit -am "Message"

# Amend last commit
git commit --amend

# Change commit message only
git commit --amend --no-edit
```

### Pushing

```bash
# Push current branch
git push

# Push specific branch
git push origin main

# Push and set upstream
git push -u origin main

# Force push (use with caution!)
git push -f origin main

# Push all branches
git push --all

# Push with tags
git push --tags
```

---

## Best Practices

### Good Commit Messages

✅ **Good:**
```
Deploy: Add Render configuration and documentation

- Add render.yaml for platform configuration
- Add build scripts for automated deploys
- Add deployment documentation
```

❌ **Bad:**
```
update
fix stuff
changes
```

### Commit Frequency

✅ **Good:**
- Commit often (multiple times per day)
- Each commit represents one logical change
- Small commits are easier to review and revert

❌ **Bad:**
- One massive commit with many unrelated changes
- Waiting days before committing

### Branch Strategy

✅ **Good:**
```bash
# Feature branches
git checkout -b feature/new-component
git push origin feature/new-component

# Create pull request on GitHub for review
```

❌ **Bad:**
```bash
# Committing everything to main
# No code review process
```

---

## Post-Push Actions

### Option 1: Automatic Render Deployment

If Render webhook is configured:
1. Render detects push
2. Render starts automatic build
3. Check Render Dashboard for progress

### Option 2: Manual Trigger in Render

```
Render Dashboard → Service → Manual Deploy → Deploy
```

### Option 3: Verify Deployment

```bash
# Check frontend is live
curl https://kcd-frontend.onrender.com

# Check backend is live
curl https://kcd-api.onrender.com/api/v1/health

# View Render logs
# Render Dashboard → Logs
```

---

## Undoing Changes

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Undo File Changes

```bash
git restore filename
# or
git checkout filename
```

### Undo Staged Changes

```bash
git restore --staged filename
# or
git reset filename
```

---

## Syncing with Remote

### Pull Latest Changes

```bash
git pull origin main
```

### Fetch Without Merging

```bash
git fetch origin
```

### Check Status vs Remote

```bash
git status
# Shows if local is ahead/behind remote
```

---

## Complete Example Workflow

```bash
# 1. Start in project directory
cd /home/sos10/Documents/EOEX/kcd

# 2. Create new feature branch (optional)
git checkout -b deploy/render

# 3. Make changes and create files
# (already done: render.yaml, scripts, docs)

# 4. Check what changed
git status

# 5. Stage everything
git add .

# 6. Commit with message
git commit -m "Deploy: Add Render configuration and documentation"

# 7. Push to GitHub
git push origin main  # or your branch name

# 8. Verify on GitHub
# Visit https://github.com/eoextrainer/kcd/commits/main

# 9. Create pull request (optional, for code review)
# GitHub will show "Compare & pull request" button

# 10. Merge to main (if using PR)
# Or changes are already in main if pushing directly
```

---

## CI/CD Integration

### Render Auto-Deploy

Render automatically deploys when:
1. Changes pushed to configured branch (main)
2. Webhook triggered
3. Build completes successfully
4. Tests pass (if configured)

**No additional action needed** - Render handles it!

### GitHub Actions (Optional)

For more control, add GitHub Actions:
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Summary

```bash
# Quick reference - 4 commands to push
git add .
git commit -m "Your message"
git push origin main
git log --oneline -5  # Verify
```

**That's it! Your code is now on GitHub and deploying to Render!**

---

## Support

If you encounter issues:

1. Check error message carefully
2. Run `git status` to see current state
3. Review "Troubleshooting" section above
4. Check Git documentation: https://git-scm.com/doc
5. Check GitHub documentation: https://docs.github.com

---

**GitHub Push Instructions Complete**
**Ready to Deploy**
**Date: February 1, 2026**
