#!/bin/bash

# Git Push Script with GITHUB_TOKEN Authentication
# This script loads GITHUB_TOKEN from .env and uses it for remote repository pushes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables from .env file
if [ -f .env ]; then
    echo -e "${BLUE}Loading environment variables from .env...${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${RED}Error: .env file not found in the project root${NC}"
    exit 1
fi

# Verify GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "YOUR_GITHUB_TOKEN_HERE" ]; then
    echo -e "${RED}Error: GITHUB_TOKEN is not configured in .env${NC}"
    echo -e "${YELLOW}Please set your GitHub Personal Access Token:${NC}"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Generate a new token with 'repo' scope"
    echo "3. Update GITHUB_TOKEN in .env file"
    exit 1
fi

# Get git remote origin URL
REMOTE_URL=$(git config --get remote.origin.url)
echo -e "${BLUE}Current remote URL: ${REMOTE_URL}${NC}"

# Check if it's HTTPS or SSH format
if [[ $REMOTE_URL == https* ]]; then
    # Extract repository info from HTTPS URL
    REPO_URL=$(echo $REMOTE_URL | sed 's|https://github.com/||' | sed 's|\.git||')
    echo -e "${BLUE}Repository: ${REPO_URL}${NC}"
    
    # Create authenticated URL with token
    AUTH_URL="https://oauth2:${GITHUB_TOKEN}@github.com/${REPO_URL}.git"
    
    # Temporarily set the remote with authentication
    git remote set-url origin "$AUTH_URL"
    echo -e "${GREEN}Configured git with authentication token${NC}"
else
    echo -e "${YELLOW}SSH remote detected. No token needed for SSH.${NC}"
    echo -e "${YELLOW}Ensure your SSH key is configured with GitHub.${NC}"
fi

# Get branch name if not provided
BRANCH=${1:-$(git rev-parse --abbrev-ref HEAD)}
COMMIT_MSG=${2:-"Auto-commit from self-healing engine"}

echo -e "${BLUE}Branch: ${BRANCH}${NC}"
echo -e "${BLUE}Commit message: ${COMMIT_MSG}${NC}"

# Add all changes
echo -e "${YELLOW}Adding changes...${NC}"
git add -A

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit${NC}"
else
    # Commit changes
    echo -e "${YELLOW}Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"
    
    # Push to remote
    echo -e "${YELLOW}Pushing to remote...${NC}"
    if git push origin "$BRANCH" 2>&1; then
        echo -e "${GREEN}Successfully pushed to origin/${BRANCH}${NC}"
    else
        echo -e "${RED}Error pushing to remote${NC}"
        exit 1
    fi
fi

# Restore original remote URL if it was HTTPS (remove token)
if [[ $REMOTE_URL == https* ]]; then
    git remote set-url origin "$REMOTE_URL"
    echo -e "${GREEN}Restored original remote URL (token removed)${NC}"
fi

echo -e "${GREEN}Git push completed successfully!${NC}"
