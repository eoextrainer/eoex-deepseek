#!/usr/bin/env python3
"""
Verification script for GITHUB_TOKEN implementation.
Tests all components and confirms everything is set up correctly.
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

class TokenVerifier:
    """Verifies GITHUB_TOKEN implementation."""
    
    def __init__(self, workspace_root='.'):
        self.workspace_root = Path(workspace_root)
        self.checks_passed = 0
        self.checks_failed = 0
    
    def log(self, message, status='ℹ️ '):
        """Log a message with status."""
        print(f"{status} {message}")
    
    def check_passed(self, message):
        """Log a passed check."""
        self.checks_passed += 1
        self.log(message, "✅")
    
    def check_failed(self, message):
        """Log a failed check."""
        self.checks_failed += 1
        self.log(message, "❌")
    
    def check_info(self, message):
        """Log info."""
        self.log(message, "ℹ️ ")
    
    def section(self, title):
        """Print a section header."""
        print(f"\n{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}\n")
    
    def verify(self):
        """Run all verification checks."""
        self.section("GITHUB_TOKEN IMPLEMENTATION VERIFICATION")
        
        # Check 1: .env file exists
        self.section("1. Environment Configuration")
        env_path = self.workspace_root / '.env'
        if env_path.exists():
            self.check_passed(f".env file exists at {env_path}")
        else:
            self.check_failed(f".env file not found at {env_path}")
            return self.report()
        
        # Check 2: Load environment variables
        load_dotenv(env_path)
        github_token = os.getenv('GITHUB_TOKEN')
        github_repo = os.getenv('GITHUB_REPO')
        
        if github_token:
            if github_token == 'YOUR_GITHUB_TOKEN_HERE':
                self.check_failed("GITHUB_TOKEN placeholder not replaced with actual token")
            else:
                self.check_passed(f"GITHUB_TOKEN is configured (length: {len(github_token)} chars)")
        else:
            self.check_failed("GITHUB_TOKEN not found in .env")
        
        if github_repo:
            self.check_passed(f"GITHUB_REPO configured: {github_repo}")
        else:
            self.check_failed("GITHUB_REPO not configured in .env")
        
        # Check 3: Script files exist
        self.section("2. Script Files")
        scripts = [
            'scripts/git-push-with-token.sh',
            'scripts/git_token_helper.py'
        ]
        
        for script in scripts:
            script_path = self.workspace_root / script
            if script_path.exists():
                self.check_passed(f"Script exists: {script}")
                # Check if executable (for bash)
                if script.endswith('.sh'):
                    if os.access(script_path, os.X_OK):
                        self.check_passed(f"Script is executable: {script}")
                    else:
                        self.check_failed(f"Script is not executable: {script}")
            else:
                self.check_failed(f"Script missing: {script}")
        
        # Check 4: Documentation files exist
        self.section("3. Documentation")
        docs = [
            'GITHUB_TOKEN_QUICK_START.md',
            'GIT_TOKEN_SETUP.md',
            'GITHUB_TOKEN_INTEGRATION.md',
            'README_GITHUB_TOKEN.md',
            'IMPLEMENTATION_COMPLETE.md'
        ]
        
        for doc in docs:
            doc_path = self.workspace_root / doc
            if doc_path.exists():
                size = doc_path.stat().st_size / 1024  # KB
                self.check_passed(f"Documentation: {doc} ({size:.1f} KB)")
            else:
                self.check_failed(f"Documentation missing: {doc}")
        
        # Check 5: Orchestrator integration
        self.section("4. Orchestrator Integration")
        orchestrate_path = self.workspace_root / 'orchestrate.py'
        if orchestrate_path.exists():
            content = orchestrate_path.read_text()
            
            if 'push_to_remote' in content:
                self.check_passed("Orchestrator has push_to_remote method")
            else:
                self.check_failed("push_to_remote method not found in orchestrator")
            
            if 'GITHUB_TOKEN' in content:
                self.check_passed("Orchestrator loads GITHUB_TOKEN from environment")
            else:
                self.check_failed("Orchestrator doesn't load GITHUB_TOKEN")
            
            if 'load_dotenv' in content:
                self.check_passed("Orchestrator loads environment variables")
            else:
                self.check_failed("Orchestrator doesn't load environment")
        else:
            self.check_failed("orchestrate.py not found")
        
        # Check 6: .env template
        self.section("5. Configuration Templates")
        env_example = self.workspace_root / '.env.example'
        if env_example.exists():
            content = env_example.read_text()
            if 'GITHUB_TOKEN' in content:
                self.check_passed(".env.example has GITHUB_TOKEN template")
            else:
                self.check_failed(".env.example missing GITHUB_TOKEN template")
        else:
            self.check_failed(".env.example not found")
        
        # Check 7: Git integration
        self.section("6. Git Integration")
        try:
            git_root = subprocess.run(
                ['git', 'rev-parse', '--show-toplevel'],
                capture_output=True,
                text=True,
                cwd=self.workspace_root,
                timeout=5
            )
            
            if git_root.returncode == 0:
                self.check_passed("Repository is a valid git repository")
                
                # Check .gitignore has .env
                gitignore = self.workspace_root / '.gitignore'
                if gitignore.exists():
                    if '.env' in gitignore.read_text():
                        self.check_passed(".env is in .gitignore (secure)")
                    else:
                        self.check_failed(".env not in .gitignore (security risk!)")
                else:
                    self.check_failed(".gitignore not found")
            else:
                self.check_failed("Not a valid git repository")
        except Exception as e:
            self.check_failed(f"Could not check git: {str(e)}")
        
        # Check 8: Python dependencies
        self.section("7. Python Dependencies")
        try:
            import dotenv
            self.check_passed("python-dotenv package is installed")
        except ImportError:
            self.check_failed("python-dotenv not installed (required)")
            self.check_info("Install with: pip install python-dotenv")
        
        try:
            import psutil
            self.check_passed("psutil package is installed")
        except ImportError:
            self.check_info("psutil not installed (optional, for port management)")
        
        # Check 9: Token validity (if configured)
        self.section("8. Token Validation")
        if github_token and github_token != 'YOUR_GITHUB_TOKEN_HERE':
            if github_token.startswith('ghp_'):
                self.check_passed("Token format looks valid (starts with ghp_)")
            else:
                self.check_failed("Token format looks invalid (should start with ghp_)")
            
            token_len = len(github_token)
            if token_len > 30:
                self.check_passed(f"Token length reasonable ({token_len} chars)")
            else:
                self.check_failed(f"Token suspiciously short ({token_len} chars)")
        else:
            self.check_info("Token not yet configured - this is expected")
        
        return self.report()
    
    def report(self):
        """Print final report."""
        self.section("VERIFICATION REPORT")
        
        total = self.checks_passed + self.checks_failed
        percentage = (self.checks_passed / total * 100) if total > 0 else 0
        
        print(f"✅ Passed: {self.checks_passed}")
        print(f"❌ Failed: {self.checks_failed}")
        print(f"📊 Total:  {total}")
        print(f"📈 Score:  {percentage:.1f}%\n")
        
        if self.checks_failed == 0:
            print("🎉 ALL CHECKS PASSED!")
            print("\nYour GITHUB_TOKEN implementation is complete and ready to use.")
            print("\nNext steps:")
            print("1. Generate token: https://github.com/settings/tokens/new")
            print("2. Add to .env:   GITHUB_TOKEN=ghp_your_token_here")
            print("3. Test:          python3 scripts/git_token_helper.py status")
            print("4. Use:           python3 orchestrate.py")
            return True
        else:
            print("⚠️  SOME CHECKS FAILED")
            print("\nPlease fix the issues above and run this script again.")
            return False


def main():
    """Main entry point."""
    workspace = Path.cwd()
    if len(sys.argv) > 1:
        workspace = Path(sys.argv[1])
    
    verifier = TokenVerifier(workspace)
    success = verifier.verify()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
