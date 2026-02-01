#!/usr/bin/env python3
"""
Git operations helper with GITHUB_TOKEN authentication
Loads GITHUB_TOKEN from .env and uses it for remote repository operations
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv
import re

class GitTokenHelper:
    """Helper class for git operations with token authentication"""
    
    def __init__(self, env_path='.env'):
        """Initialize git helper and load environment variables"""
        self.env_path = Path(env_path)
        self.github_token = None
        self.github_repo = None
        self.original_remote = None
        
        self._load_env()
    
    def _load_env(self):
        """Load environment variables from .env file"""
        if self.env_path.exists():
            load_dotenv(self.env_path)
            self.github_token = os.getenv('GITHUB_TOKEN')
            self.github_repo = os.getenv('GITHUB_REPO')
        else:
            print(f"⚠️  Warning: {self.env_path} not found")
    
    def _validate_token(self):
        """Validate that GITHUB_TOKEN is properly configured"""
        if not self.github_token or self.github_token == 'YOUR_GITHUB_TOKEN_HERE':
            print("❌ Error: GITHUB_TOKEN is not configured in .env")
            print("\nTo set up:")
            print("1. Go to: https://github.com/settings/tokens")
            print("2. Generate a new token with 'repo' scope")
            print("3. Update GITHUB_TOKEN in .env file")
            sys.exit(1)
    
    def _get_remote_url(self):
        """Get the current git remote origin URL"""
        try:
            result = subprocess.run(
                ['git', 'config', '--get', 'remote.origin.url'],
                capture_output=True,
                text=True,
                check=True
            )
            return result.stdout.strip()
        except subprocess.CalledProcessError:
            print("❌ Error: Could not get git remote URL")
            sys.exit(1)
    
    def _create_auth_url(self, remote_url):
        """Create authenticated URL with token"""
        if remote_url.startswith('https://'):
            # Extract repo path from HTTPS URL
            match = re.search(r'github\.com/(.*?)(?:\.git)?$', remote_url)
            if match:
                repo_path = match.group(1)
                return f"https://oauth2:{self.github_token}@github.com/{repo_path}.git"
        return remote_url
    
    def _set_remote(self, url):
        """Set git remote URL"""
        try:
            subprocess.run(
                ['git', 'remote', 'set-url', 'origin', url],
                check=True,
                capture_output=True
            )
        except subprocess.CalledProcessError as e:
            print(f"❌ Error setting remote: {e}")
            sys.exit(1)
    
    def push(self, branch='main', message='Auto-commit'):
        """Push to remote with token authentication"""
        self._validate_token()
        
        remote_url = self._get_remote_url()
        print(f"📍 Current remote: {remote_url}")
        
        # Store original remote
        self.original_remote = remote_url
        
        # Check if HTTPS (needs token)
        if remote_url.startswith('https://'):
            auth_url = self._create_auth_url(remote_url)
            print("🔐 Setting up authenticated remote...")
            self._set_remote(auth_url)
        else:
            print("🔑 SSH remote detected - using SSH key authentication")
        
        # Add changes
        print("📝 Adding changes...")
        try:
            subprocess.run(['git', 'add', '-A'], check=True)
        except subprocess.CalledProcessError:
            print("❌ Error adding files")
            return False
        
        # Check if there are changes
        result = subprocess.run(
            ['git', 'diff', '--cached', '--quiet'],
            capture_output=True
        )
        
        if result.returncode == 0:
            print("⚠️  No changes to commit")
            return True
        
        # Commit
        print(f"💾 Committing: {message}")
        try:
            subprocess.run(['git', 'commit', '-m', message], check=True)
        except subprocess.CalledProcessError:
            print("❌ Error committing changes")
            return False
        
        # Push
        print(f"🚀 Pushing to origin/{branch}...")
        try:
            subprocess.run(['git', 'push', 'origin', branch], check=True)
            print(f"✅ Successfully pushed to origin/{branch}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error pushing: {e}")
            return False
        finally:
            # Restore original remote if it was HTTPS
            if self.original_remote and self.original_remote.startswith('https://'):
                print("🔓 Restoring original remote URL...")
                self._set_remote(self.original_remote)
        
        return True
    
    def pull(self):
        """Pull from remote with token authentication"""
        self._validate_token()
        
        remote_url = self._get_remote_url()
        self.original_remote = remote_url
        
        if remote_url.startswith('https://'):
            auth_url = self._create_auth_url(remote_url)
            self._set_remote(auth_url)
        
        print("📥 Pulling from remote...")
        try:
            subprocess.run(['git', 'pull', 'origin'], check=True)
            print("✅ Successfully pulled from remote")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Error pulling: {e}")
            return False
        finally:
            if self.original_remote and self.original_remote.startswith('https://'):
                self._set_remote(self.original_remote)
    
    def status(self):
        """Show git status"""
        print("📊 Git status:")
        subprocess.run(['git', 'status'])


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python3 git_token_helper.py <command> [options]")
        print("\nCommands:")
        print("  push [branch] [message]  - Push to remote with token auth")
        print("  pull                     - Pull from remote with token auth")
        print("  status                   - Show git status")
        sys.exit(1)
    
    command = sys.argv[1]
    helper = GitTokenHelper()
    
    if command == 'push':
        branch = sys.argv[2] if len(sys.argv) > 2 else 'main'
        message = sys.argv[3] if len(sys.argv) > 3 else 'Auto-commit'
        helper.push(branch, message)
    elif command == 'pull':
        helper.pull()
    elif command == 'status':
        helper.status()
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == '__main__':
    main()
