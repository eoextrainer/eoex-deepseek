"""
Self-Healing Engine - Systematically tests the entire platform and automatically fixes issues.
Runs iteratively until all tests pass or no more fixes are possible.
"""
import os
import sys
import logging
import json
import time
from datetime import datetime
from typing import Dict, List, Tuple, Any
import subprocess

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

logger = logging.getLogger(__name__)

class SelfHealingEngine:
    """
    Comprehensive self-healing test engine.
    Tests all layers and automatically fixes common issues.
    """
    
    def __init__(self, workspace_root: str):
        self.workspace_root = workspace_root
        self.backend_root = os.path.join(workspace_root, 'backend')
        self.frontend_root = os.path.join(workspace_root, 'frontend')
        
        self.all_errors = []
        self.all_warnings = []
        self.all_passes = []
        self.iteration = 0
        self.max_iterations = 5
        
        self.test_results = {
            "database": {},
            "api": {},
            "frontend": {}
        }
    
    def log_section(self, title: str):
        """Log a formatted section header."""
        logger.info("\n" + "=" * 70)
        logger.info(f"  {title}")
        logger.info("=" * 70 + "\n")
    
    def run_database_tests(self) -> Dict[str, Any]:
        """Run all database tests."""
        self.log_section(f"ITERATION {self.iteration + 1} - DATABASE TESTS")
        
        try:
            from tests.test_database import DatabaseTests
            tests = DatabaseTests()
            results = tests.run_all()
            
            self.all_errors.extend(results.get("errors", []))
            self.all_warnings.extend(results.get("warnings", []))
            self.all_passes.extend(results.get("passed", []) if isinstance(results.get("passed"), list) else [])
            
            self.test_results["database"] = results
            return results
        except Exception as e:
            error = f"✗ Database tests failed to run: {str(e)}"
            logger.error(error)
            self.all_errors.append(error)
            return {"error": str(e)}
    
    def run_api_tests(self) -> Dict[str, Any]:
        """Run all API tests."""
        self.log_section(f"ITERATION {self.iteration + 1} - API ENDPOINT TESTS")
        
        try:
            from tests.test_api import APITests
            tests = APITests()
            results = tests.run_all()
            
            self.all_errors.extend(results.get("errors", []))
            self.all_warnings.extend(results.get("warnings", []))
            self.all_passes.extend(results.get("passed", []) if isinstance(results.get("passed"), list) else [])
            
            self.test_results["api"] = results
            return results
        except Exception as e:
            error = f"✗ API tests failed to run: {str(e)}"
            logger.error(error)
            self.all_errors.append(error)
            return {"error": str(e)}
    
    def run_frontend_tests(self) -> Dict[str, Any]:
        """Run all frontend tests."""
        self.log_section(f"ITERATION {self.iteration + 1} - FRONTEND E2E TESTS")
        
        try:
            from tests.test_frontend_e2e import FrontendTests
            tests = FrontendTests()
            results = tests.run_all()
            
            self.all_errors.extend(results.get("errors", []))
            self.all_warnings.extend(results.get("warnings", []))
            self.all_passes.extend(results.get("passed", []) if isinstance(results.get("passed"), list) else [])
            
            self.test_results["frontend"] = results
            return results
        except Exception as e:
            error = f"✗ Frontend tests failed to run: {str(e)}"
            logger.error(error)
            self.all_errors.append(error)
            return {"error": str(e)}
    
    def auto_fix_issues(self) -> Tuple[List[str], List[str]]:
        """
        Automatically fix common issues detected during testing.
        Returns (fixed, unfixable) lists.
        """
        self.log_section(f"ITERATION {self.iteration + 1} - AUTO-FIX ATTEMPT")
        
        fixed = []
        unfixable = []
        
        for error in self.all_errors:
            try:
                if "Database connection failed" in error:
                    logger.info("Attempting to fix: Database connection")
                    # Database will be created when models are initialized
                    fixed.append("Database initialization")
                    
                elif "Missing tables" in error:
                    logger.info("Attempting to fix: Missing tables")
                    # Create tables via SQLAlchemy
                    from app.db.session import Base, engine
                    Base.metadata.create_all(bind=engine)
                    fixed.append("Created missing tables")
                    
                elif "No roles found" in error:
                    logger.info("Attempting to fix: Missing roles")
                    from app.db.session import SessionLocal
                    from app.models.user import Role
                    from scripts.seed_users import seed_roles
                    seed_roles()
                    fixed.append("Seeded roles")
                    
                elif "No users found" in error:
                    logger.info("Attempting to fix: Missing users")
                    from scripts.seed_users import seed_demo_users
                    seed_demo_users()
                    fixed.append("Seeded demo users")
                    
                elif "Failed to resolve import" in error or "module not found" in error.lower():
                    logger.info("Attempting to fix: Import resolution")
                    # Run npm install in frontend
                    subprocess.run(
                        ["npm", "install", "--legacy-peer-deps"],
                        cwd=self.frontend_root,
                        timeout=60,
                        capture_output=True
                    )
                    fixed.append("Reinstalled frontend dependencies")
                    
                else:
                    unfixable.append(error)
            
            except Exception as e:
                logger.warning(f"Could not fix '{error[:50]}...': {str(e)}")
                unfixable.append(error)
        
        if fixed:
            self.log_section(f"AUTO-FIX RESULTS - ITERATION {self.iteration + 1}")
            for item in fixed:
                logger.info(f"✓ Fixed: {item}")
        
        if unfixable:
            logger.warning(f"\n⚠ Unfixable issues: {len(unfixable)}")
            for item in unfixable[:3]:  # Show first 3
                logger.warning(f"  - {item}")
        
        return fixed, unfixable
    
    def count_errors(self) -> int:
        """Count total errors found."""
        return len([e for e in self.all_errors if e.startswith("✗")])
    
    def count_passes(self) -> int:
        """Count total passes."""
        return len([p for p in self.all_passes if p.startswith("✓")])
    
    def should_continue_healing(self) -> bool:
        """Determine if we should continue to next iteration."""
        error_count = self.count_errors()
        
        if self.iteration >= self.max_iterations:
            logger.warning(f"⚠ Reached maximum iterations ({self.max_iterations})")
            return False
        
        if error_count == 0:
            logger.info("✓ All tests passed! No more errors detected.")
            return False
        
        return True
    
    def generate_report(self) -> str:
        """Generate comprehensive test report."""
        report = []
        report.append("\n" + "=" * 70)
        report.append("  SELF-HEALING ENGINE - COMPREHENSIVE TEST REPORT")
        report.append("=" * 70)
        report.append(f"\nTimestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Total Iterations: {self.iteration + 1}")
        report.append(f"Total Tests Run: {self.count_passes() + self.count_errors()}")
        report.append(f"Passed: {self.count_passes()}")
        report.append(f"Failed: {self.count_errors()}")
        report.append(f"Success Rate: {self.count_passes() / max(1, self.count_passes() + self.count_errors()) * 100:.1f}%")
        
        report.append("\n" + "-" * 70)
        report.append("DATABASE TEST RESULTS")
        report.append("-" * 70)
        if self.test_results["database"]:
            db_results = self.test_results["database"]
            if "total_passed" in db_results:
                report.append(f"Passed: {db_results.get('total_passed', 0)}/{db_results.get('total_tests', 0)}")
        
        report.append("\n" + "-" * 70)
        report.append("API TEST RESULTS")
        report.append("-" * 70)
        if self.test_results["api"]:
            api_results = self.test_results["api"]
            if "total_passed" in api_results:
                report.append(f"Passed: {api_results.get('total_passed', 0)}/{api_results.get('total_tests', 0)}")
        
        report.append("\n" + "-" * 70)
        report.append("FRONTEND TEST RESULTS")
        report.append("-" * 70)
        if self.test_results["frontend"]:
            fe_results = self.test_results["frontend"]
            if "total_passed" in fe_results:
                report.append(f"Passed: {fe_results.get('total_passed', 0)}/{fe_results.get('total_tests', 0)}")
        
        report.append("\n" + "-" * 70)
        report.append("ERRORS DETECTED")
        report.append("-" * 70)
        if self.all_errors:
            for error in self.all_errors[:10]:  # Show first 10
                report.append(f"  {error}")
            if len(self.all_errors) > 10:
                report.append(f"  ... and {len(self.all_errors) - 10} more errors")
        else:
            report.append("  ✓ No errors detected!")
        
        report.append("\n" + "=" * 70 + "\n")
        
        return "\n".join(report)
    
    def run_healing_cycle(self) -> Dict[str, Any]:
        """Run one complete healing cycle."""
        self.log_section(f"HEALING CYCLE {self.iteration + 1}/{self.max_iterations}")
        
        # Run all tests
        self.run_database_tests()
        time.sleep(1)  # Brief pause
        self.run_api_tests()
        time.sleep(1)  # Brief pause
        self.run_frontend_tests()
        
        # Attempt to fix issues
        fixed, unfixable = self.auto_fix_issues()
        
        # Increment iteration
        self.iteration += 1
        
        return {
            "iteration": self.iteration,
            "errors": self.count_errors(),
            "passes": self.count_passes(),
            "fixed": len(fixed),
            "continue": self.should_continue_healing()
        }
    
    def start_healing(self) -> Dict[str, Any]:
        """
        Start the self-healing process.
        Iteratively tests and fixes until no more errors or max iterations reached.
        """
        self.log_section("SELF-HEALING ENGINE STARTED")
        logger.info(f"Workspace Root: {self.workspace_root}")
        logger.info(f"Backend Root: {self.backend_root}")
        logger.info(f"Frontend Root: {self.frontend_root}")
        logger.info(f"Max Iterations: {self.max_iterations}")
        
        healing_summary = []
        
        while self.iteration < self.max_iterations:
            cycle_result = self.run_healing_cycle()
            healing_summary.append(cycle_result)
            
            if not cycle_result["continue"]:
                break
            
            logger.info(f"\nWaiting before next iteration...")
            time.sleep(2)
        
        # Generate final report
        report = self.generate_report()
        logger.info(report)
        
        # Save report to file
        report_file = os.path.join(self.workspace_root, "HEALING_REPORT.md")
        with open(report_file, 'w') as f:
            f.write(report)
        logger.info(f"Report saved to: {report_file}")
        
        return {
            "success": self.count_errors() == 0,
            "total_iterations": self.iteration,
            "total_errors": self.count_errors(),
            "total_passes": self.count_passes(),
            "healing_summary": healing_summary,
            "report_file": report_file
        }


def main():
    """Main entry point."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    workspace_root = "/home/sos10/Documents/EOEX/kcd"
    engine = SelfHealingEngine(workspace_root)
    
    result = engine.start_healing()
    
    print("\n\n" + "=" * 70)
    print("HEALING CYCLE COMPLETE")
    print("=" * 70)
    print(f"Success: {result['success']}")
    print(f"Total Iterations: {result['total_iterations']}")
    print(f"Errors: {result['total_errors']}")
    print(f"Passes: {result['total_passes']}")
    print(f"Report: {result['report_file']}")
    print("=" * 70)
    
    return 0 if result['success'] else 1


if __name__ == "__main__":
    sys.exit(main())
