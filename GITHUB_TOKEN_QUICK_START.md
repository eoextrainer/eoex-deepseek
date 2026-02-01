# 🔐 Quick Setup: Adding GITHUB_TOKEN

## 1️⃣ Generate Your Token (1 minute)

**Go to GitHub Token Settings:**
```
https://github.com/settings/tokens/new
```

**Create new token with:**
- Name: `EOEX-Auto-Push`
- Expiration: 90 days
- Scopes: Check ✅ `repo` and ✅ `workflow`

**Copy your token immediately!** (You won't see it again)

## 2️⃣ Add Token to .env (30 seconds)

Open `.env` in your editor and replace:

```env
GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
```

with your actual token:

```env
GITHUB_TOKEN=ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o
```

## 3️⃣ Done! ✅

Your token is now ready to use for:
- Automated git pushes from the healing engine
- CI/CD workflows
- Manual pushes via scripts

## Usage Examples

### Bash Script
```bash
./scripts/git-push-with-token.sh main "Auto-fix: Updated components"
```

### Python Helper
```bash
python3 scripts/git_token_helper.py push main "Feature: Added API endpoint"
```

### In Python Code
```python
from orchestrate import AppOrchestrator
orchestrator = AppOrchestrator('/path/to/eoex-deepseek')
orchestrator.push_to_remote(branch='main', message='Auto-commit')
```

## ⚠️ Security Notes

✅ **DO:**
- Keep token in `.env` (which is in `.gitignore`)
- Regenerate token if exposed
- Use minimal permissions (repo + workflow)
- Set token expiration dates

❌ **DON'T:**
- Commit `.env` to repository
- Share token in messages or slack
- Use forever tokens
- Commit token anywhere

## Troubleshooting

**"Token not configured"**
→ Check `.env` file exists and has valid token

**"Push failed"**
→ Token may have expired, regenerate at: https://github.com/settings/tokens

**"No changes to commit"**
→ All tests passed, nothing to push!

---

**Need help?** See [GIT_TOKEN_SETUP.md](GIT_TOKEN_SETUP.md) for detailed documentation.
