# GitHub Token Setup & Git Push Automation

This document explains how to configure and use the GITHUB_TOKEN for automated repository pushes.

## Quick Setup

### 1. Generate GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens/new
2. Create a new token with these settings:
   - **Token name**: `EOEX-Deepseek-Auto-Push`
   - **Expiration**: 90 days (or as needed)
   - **Scopes**: 
     - ✅ `repo` (full control of private repositories)
     - ✅ `workflow` (ability to trigger workflows)
3. Click "Generate token"
4. **Copy the token immediately** (you won't see it again!)

### 2. Configure Local Environment

Add your token to `.env` file:

```bash
GITHUB_TOKEN=ghp_your_token_here_from_step_1
GITHUB_REPO=eoextrainer/eoex-deepseek
```

**Important**: Never commit the `.env` file with your actual token to the repository!

### 3. Using Git Push with Token

#### Option A: Using Bash Script

```bash
# Push to current branch
./scripts/git-push-with-token.sh

# Push to specific branch
./scripts/git-push-with-token.sh main "Fix: Update components"

# Push with custom message
./scripts/git-push-with-token.sh develop "Feature: Add new API endpoint"
```

#### Option B: Using Python Helper

```bash
# Push to main branch
python3 scripts/git_token_helper.py push main "Auto-commit"

# Push to develop branch
python3 scripts/git_token_helper.py push develop "Self-healing engine fix"

# Pull from remote
python3 scripts/git_token_helper.py pull

# Check git status
python3 scripts/git_token_helper.py status
```

#### Option C: Using Python Script Directly

```python
from scripts.git_token_helper import GitTokenHelper

helper = GitTokenHelper()
helper.push(branch='main', message='My commit message')
```

## Automated Integration

The self-healing engine automatically uses the token when pushing test results and fixes:

```python
# In orchestrate.py or test files
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Load token
load_dotenv()
github_token = os.getenv('GITHUB_TOKEN')

# Use in git operations
if github_token:
    # Automatically configured for HTTPS URLs
    subprocess.run(['python3', 'scripts/git_token_helper.py', 'push', 'main', message])
```

## Security Best Practices

1. **Never commit your actual token** to the repository
2. **Use token in .env file only** (which is in .gitignore)
3. **Regenerate token if compromised**:
   - Go to: https://github.com/settings/tokens
   - Delete the old token
   - Create a new one
   - Update .env

4. **Set expiration dates** on tokens for security
5. **Use minimal scopes** - only check the permissions you need

## Troubleshooting

### "GITHUB_TOKEN is not configured"
- Check that `.env` file exists in project root
- Verify `GITHUB_TOKEN=` line is present and not empty
- Ensure you're running scripts from project root

### "Could not get git remote URL"
- Verify you're in a git repository
- Check that remote origin is configured: `git remote -v`

### "Error pushing to remote"
- Verify the token has `repo` scope
- Check that the token hasn't expired
- Try pulling first to ensure you have latest changes: `python3 scripts/git_token_helper.py pull`

### SSH Alternative
If you prefer SSH keys instead of tokens:
```bash
# Change remote to SSH
git remote set-url origin git@github.com:eoextrainer/eoex-deepseek.git

# Ensure SSH key is configured
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-add ~/.ssh/id_ed25519
```

## Token Scope Meanings

| Scope | Purpose |
|-------|---------|
| `repo` | Full control of private repositories |
| `workflow` | Ability to trigger GitHub Actions workflows |
| `gist` | Create/manage gists |
| `user` | User profile data |
| `admin:repo_hook` | Access to repository webhooks |

## Monitoring Token Usage

1. Go to: https://github.com/settings/tokens
2. Click on any token to see:
   - Last used date/time
   - Access logs
   - Creation date

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_TOKEN` | Personal access token for authentication | `ghp_xxxxx` |
| `GITHUB_REPO` | Repository path | `eoextrainer/eoex-deepseek` |

## Integration with CI/CD

For GitHub Actions workflows, use secrets instead:

```yaml
# .github/workflows/auto-fix.yml
- name: Push fixes with token
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: python3 scripts/git_token_helper.py push main "CI: Auto-fix"
```

## References

- [GitHub Personal Access Tokens](https://github.com/settings/tokens)
- [GitHub REST API Authentication](https://docs.github.com/en/rest/authentication)
- [Git Credential Storage](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
