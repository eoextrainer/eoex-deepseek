#!/usr/bin/env python3
"""
Orchestration Script - Runs self-healing engine and starts servers.
Automates the entire testing, fixing, and application startup process.
"""
import os
import sys
import logging
import subprocess
import time
import signal
from typing import List, Tuple
import psutil
from pathlib import Path
from dotenv import load_dotenv
import re

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AppOrchestrator:
    """Orchestrates testing, healing, and server startup."""
    
    def __init__(self, workspace_root: str):
        self.workspace_root = workspace_root
        self.backend_root = os.path.join(workspace_root, 'backend')
        self.frontend_root = os.path.join(workspace_root, 'frontend')
        
        self.backend_process = None
        self.frontend_process = None
        self.processes = []
        
        # Load environment variables
        env_path = os.path.join(workspace_root, '.env')
        if os.path.exists(env_path):
            load_dotenv(env_path)
        self.github_token = os.getenv('GITHUB_TOKEN')
        self.github_repo = os.getenv('GITHUB_REPO')
    
    def log_section(self, title: str):
        """Log a formatted section."""
        print("\n" + "=" * 80)
        print(f"  {title}")
        print("=" * 80 + "\n")
    
    def run_command(self, cmd: List[str], cwd: str, name: str, timeout: int = 60) -> Tuple[bool, str]:
        """
        Run a command and return success status and output.
        """
        logger.info(f"Running: {' '.join(cmd)}")
        try:
            result = subprocess.run(
                cmd,
                cwd=cwd,
                timeout=timeout,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info(f"✓ {name} completed successfully")
                return True, result.stdout
            else:
                logger.error(f"✗ {name} failed with code {result.returncode}")
                logger.error(result.stderr)
                return False, result.stderr
        except subprocess.TimeoutExpired:
            logger.warning(f"⚠ {name} timed out after {timeout}s")
            return False, f"Timeout after {timeout}s"
        except Exception as e:
            logger.error(f"✗ {name} error: {str(e)}")
            return False, str(e)
    
    def stage_1_run_healing_engine(self):
        """Stage 1: Run self-healing engine."""
        self.log_section("STAGE 1: RUNNING SELF-HEALING ENGINE")
        
        logger.info("Starting comprehensive test suite with automatic fixing...")
        
        try:
            import sys
            sys.path.insert(0, os.path.join(self.backend_root, '..'))
            
            from backend.tests.self_healing_engine import SelfHealingEngine
            
            engine = SelfHealingEngine(self.workspace_root)
            result = engine.start_healing()
            
            logger.info(f"\n✓ Healing Engine Complete:")
            logger.info(f"  - Total Iterations: {result['total_iterations']}")
            logger.info(f"  - Errors: {result['total_errors']}")
            logger.info(f"  - Passes: {result['total_passes']}")
            logger.info(f"  - Success: {result['success']}")
            
            return result
        except Exception as e:
            logger.error(f"✗ Healing engine error: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def stage_2_setup_backend_env(self):
        """Stage 2: Setup backend environment."""
        self.log_section("STAGE 2: SETTING UP BACKEND ENVIRONMENT")
        
        logger.info("Creating .env file for backend...")
        env_file = os.path.join(self.backend_root, '.env')
        
        env_content = """# Backend Environment Variables
DATABASE_URL=sqlite:///./eoex.db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
"""
        
        try:
            with open(env_file, 'w') as f:
                f.write(env_content)
            logger.info(f"✓ Created .env file at {env_file}")
            return True
        except Exception as e:
            logger.error(f"✗ Failed to create .env file: {str(e)}")
            return False
    
    def stage_3_setup_frontend_env(self):
        """Stage 3: Setup frontend environment."""
        self.log_section("STAGE 3: SETTING UP FRONTEND ENVIRONMENT")
        
        logger.info("Creating .env file for frontend...")
        env_file = os.path.join(self.frontend_root, '.env')
        
        env_content = """# Frontend Environment Variables
VITE_API_URL=http://localhost:8000
"""
        
        try:
            with open(env_file, 'w') as f:
                f.write(env_content)
            logger.info(f"✓ Created .env file at {env_file}")
            return True
        except Exception as e:
            logger.error(f"✗ Failed to create .env file: {str(e)}")
            return False
    
    def stage_4_start_backend_server(self):
        """Stage 4: Start backend server."""
        self.log_section("STAGE 4: STARTING BACKEND SERVER")
        
        logger.info("Starting FastAPI backend server...")
        
        try:
            # Check if port 8000 is already in use
            if self.is_port_in_use(8000):
                logger.warning("⚠ Port 8000 already in use, killing existing process...")
                self.kill_port(8000)
                time.sleep(1)
            
            # Start backend server
            cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
            
            self.backend_process = subprocess.Popen(
                cmd,
                cwd=self.backend_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.processes.append(self.backend_process)
            logger.info(f"✓ Backend server starting on http://localhost:8000")
            logger.info(f"  Process ID: {self.backend_process.pid}")
            
            # Wait for server to start
            time.sleep(3)
            
            # Verify server is responding
            import requests
            try:
                response = requests.get("http://localhost:8000/health", timeout=5)
                if response.status_code == 200:
                    logger.info("✓ Backend server is responding to requests")
                    return True
            except:
                logger.warning("⚠ Backend server may not be fully ready yet, continuing...")
                return True
            
        except Exception as e:
            logger.error(f"✗ Failed to start backend server: {str(e)}")
            return False
    
    def stage_5_start_frontend_server(self):
        """Stage 5: Start frontend development server."""
        self.log_section("STAGE 5: STARTING FRONTEND SERVER")
        
        logger.info("Starting Vite frontend development server...")
        
        try:
            # Check if port 3000 is already in use
            if self.is_port_in_use(3000):
                logger.warning("⚠ Port 3000 already in use, killing existing process...")
                self.kill_port(3000)
                time.sleep(1)
            
            # First ensure dependencies are installed
            logger.info("Installing frontend dependencies...")
            subprocess.run(
                ["npm", "install", "--legacy-peer-deps"],
                cwd=self.frontend_root,
                timeout=120,
                capture_output=True
            )
            
            # Start frontend server
            cmd = ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
            
            self.frontend_process = subprocess.Popen(
                cmd,
                cwd=self.frontend_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.processes.append(self.frontend_process)
            logger.info(f"✓ Frontend server starting on http://localhost:3000")
            logger.info(f"  Process ID: {self.frontend_process.pid}")
            
            # Wait for server to start
            time.sleep(3)
            
            # Verify server is responding
            import requests
            try:
                response = requests.get("http://localhost:3000", timeout=5)
                if response.status_code == 200:
                    logger.info("✓ Frontend server is responding to requests")
                    return True
            except:
                logger.warning("⚠ Frontend server may not be fully ready yet, continuing...")
                return True
            
        except Exception as e:
            logger.error(f"✗ Failed to start frontend server: {str(e)}")
            return False
    
    def stage_6_launch_browser(self):
        """Stage 6: Launch application in browser."""
        self.log_section("STAGE 6: LAUNCHING APPLICATION IN BROWSER")
        
        logger.info("Opening application in browser...")
        
        try:
            import webbrowser
            
            # Try to open the application
            url = "http://localhost:3000"
            success = webbrowser.open(url)
            
            if success:
                logger.info(f"✓ Browser opened to {url}")
            else:
                logger.warning(f"⚠ Could not open browser automatically. Visit {url} manually.")
            
            return True
        except Exception as e:
            logger.warning(f"⚠ Browser launch not available: {str(e)}")
            logger.info("Please visit http://localhost:3000 in your browser")
            return True
    
    def is_port_in_use(self, port: int) -> bool:
        """Check if a port is in use."""
        try:
            for conn in psutil.net_connections():
                if conn.laddr.port == port:
                    return True
            return False
        except:
            return False
    
    def kill_port(self, port: int):
        """Kill process using a specific port."""
        try:
            for proc in psutil.process_iter(['pid', 'name']):
                try:
                    for conn in proc.net_connections():
                        if conn.laddr.port == port:
                            proc.kill()
                            logger.info(f"✓ Killed process on port {port}")
                            return
                except:
                    continue
        except:
            pass
    
    def cleanup_on_exit(self):
        """Cleanup processes on exit."""
        logger.info("\n\nCleaning up processes...")
        for proc in self.processes:
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except:
                try:
                    proc.kill()
                except:
                    pass
    
    def push_to_remote(self, branch: str = 'main', message: str = 'Auto-commit from self-healing engine'):
        """Push changes to remote repository with GITHUB_TOKEN authentication."""
        if not self.github_token or self.github_token == 'YOUR_GITHUB_TOKEN_HERE':
            logger.warning("⚠ GITHUB_TOKEN not configured, skipping remote push")
            return False
        
        try:
            logger.info(f"Pushing to remote ({branch}) with GITHUB_TOKEN...")
            
            # Run git push using the helper script
            cmd = [
                sys.executable,
                'scripts/git_token_helper.py',
                'push',
                branch,
                message
            ]
            
            result = subprocess.run(
                cmd,
                cwd=self.workspace_root,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                logger.info(f"✓ Successfully pushed to origin/{branch}")
                return True
            else:
                logger.warning(f"⚠ Push failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.warning(f"⚠ Error pushing to remote: {str(e)}")
            return False
    
    def run_orchestration(self):
        """Run complete orchestration."""
        self.log_section("EOEX PLATFORM - SELF-HEALING & LAUNCH ORCHESTRATION")
        
        try:
            # Stage 1: Run healing engine
            healing_result = self.stage_1_run_healing_engine()
            
            if not healing_result.get('success', False):
                logger.warning("⚠ Healing engine did not resolve all issues, but continuing...")
            
            # Push results to remote if healing found issues
            if healing_result.get('issues_found', 0) > 0:
                logger.info(f"Pushing {healing_result.get('issues_found', 0)} fixes to remote...")
                self.push_to_remote(message=f"Fix: {healing_result.get('issues_found', 0)} issues fixed by self-healing engine")
            
            # Stage 2-3: Setup environments
            if not self.stage_2_setup_backend_env():
                return False
            
            if not self.stage_3_setup_frontend_env():
                return False
            
            # Stage 4-5: Start servers
            if not self.stage_4_start_backend_server():
                logger.error("✗ Failed to start backend server")
                return False
            
            if not self.stage_5_start_frontend_server():
                logger.error("✗ Failed to start frontend server")
                return False
            
            # Stage 6: Launch browser
            self.stage_6_launch_browser()
            
            # Success!
            self.log_section("APPLICATION SUCCESSFULLY LAUNCHED")
            logger.info("✓ All systems operational!")
            logger.info(f"✓ Backend: http://localhost:8000")
            logger.info(f"✓ Frontend: http://localhost:3000")
            logger.info(f"✓ API Docs: http://localhost:8000/docs")
            
            logger.info("\nPress Ctrl+C to stop servers...")
            
            # Keep running until interrupted
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                logger.info("\nShutting down...")
                self.cleanup_on_exit()
            
            return True
            
        except Exception as e:
            logger.error(f"✗ Orchestration failed: {str(e)}")
            self.cleanup_on_exit()
            return False


def main():
    """Main entry point."""
    workspace_root = "/home/sos10/Documents/EOEX/deepseek"
    
    orchestrator = AppOrchestrator(workspace_root)
    
    try:
        success = orchestrator.run_orchestration()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        orchestrator.cleanup_on_exit()
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error: {str(e)}")
        orchestrator.cleanup_on_exit()
        sys.exit(1)


if __name__ == "__main__":
    main()
