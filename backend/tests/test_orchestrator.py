"""
Comprehensive Test Orchestrator
Runs all tests, logs errors, applies fixes, and reports results
"""

import sys
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.logging_system import get_error_logger, ErrorLogger, ErrorCategory
from app.auto_fix_engine import get_auto_fix_engine, AutoFixEngine


class TestPhase(str, Enum):
    """Test phases."""
    DATABASE = "DATABASE"
    API = "API"
    SERVICES = "SERVICES"
    FRONTEND = "FRONTEND"
    E2E = "E2E"


class TestOrchestrator:
    """Orchestrate all tests, logging, and auto-fixes."""
    
    def __init__(self):
        """Initialize orchestrator."""
        self.logger = get_error_logger()
        self.auto_fixer = get_auto_fix_engine()
        
        self.test_results: Dict[str, Any] = {}
        self.phase_results: Dict[TestPhase, Dict[str, Any]] = {}
        self.start_time: Optional[datetime] = None
        self.end_time: Optional[datetime] = None
    
    def run_full_test_suite(self) -> Dict[str, Any]:
        """Run complete test suite with all phases."""
        self.start_time = datetime.utcnow()
        
        print("\n" + "="*70)
        print("STARTING COMPREHENSIVE TEST SUITE")
        print("="*70 + "\n")
        
        results = {
            "start_time": self.start_time.isoformat(),
            "phases": {},
            "summary": {
                "total_phases": 0,
                "passed_phases": 0,
                "failed_phases": 0,
                "total_errors": 0,
                "total_fixes": 0
            },
            "timeline": []
        }
        
        # Phase 1: Database Tests
        print("\n[PHASE 1/5] Running Database Tests...")
        print("-" * 70)
        db_result = self.run_database_tests()
        results["phases"][TestPhase.DATABASE.value] = db_result
        results["timeline"].append({
            "phase": TestPhase.DATABASE.value,
            "status": db_result.get("status", "unknown"),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Phase 2: API Endpoint Tests
        print("\n[PHASE 2/5] Running API Endpoint Tests...")
        print("-" * 70)
        api_result = self.run_api_tests()
        results["phases"][TestPhase.API.value] = api_result
        results["timeline"].append({
            "phase": TestPhase.API.value,
            "status": api_result.get("status", "unknown"),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Phase 3: Backend Service Tests
        print("\n[PHASE 3/5] Running Backend Service Tests...")
        print("-" * 70)
        service_result = self.run_service_tests()
        results["phases"][TestPhase.SERVICES.value] = service_result
        results["timeline"].append({
            "phase": TestPhase.SERVICES.value,
            "status": service_result.get("status", "unknown"),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Phase 4: Frontend Component Tests
        print("\n[PHASE 4/5] Running Frontend Component Tests...")
        print("-" * 70)
        frontend_result = self.run_frontend_tests()
        results["phases"][TestPhase.FRONTEND.value] = frontend_result
        results["timeline"].append({
            "phase": TestPhase.FRONTEND.value,
            "status": frontend_result.get("status", "unknown"),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Phase 5: E2E User Journey Tests
        print("\n[PHASE 5/5] Running E2E User Journey Tests...")
        print("-" * 70)
        e2e_result = self.run_e2e_tests()
        results["phases"][TestPhase.E2E.value] = e2e_result
        results["timeline"].append({
            "phase": TestPhase.E2E.value,
            "status": e2e_result.get("status", "unknown"),
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Summary
        self.end_time = datetime.utcnow()
        duration = (self.end_time - self.start_time).total_seconds()
        
        results["end_time"] = self.end_time.isoformat()
        results["duration_seconds"] = duration
        
        # Calculate summary
        for phase_name, phase_result in results["phases"].items():
            results["summary"]["total_phases"] += 1
            if phase_result.get("status") == "PASSED":
                results["summary"]["passed_phases"] += 1
            else:
                results["summary"]["failed_phases"] += 1
        
        results["summary"]["total_errors"] = len(self.logger.errors)
        results["summary"]["error_summary"] = self.logger.get_error_summary()
        
        # Auto-fix errors
        print("\n[AUTO-FIX] Analyzing and fixing errors...")
        print("-" * 70)
        fix_results = self.auto_fixer.analyze_and_fix_errors()
        results["auto_fix"] = fix_results
        results["summary"]["total_fixes"] = fix_results.get("total_fixes_applied", 0)
        
        # Export reports
        print("\n[EXPORT] Generating reports...")
        print("-" * 70)
        error_report = self.logger.export_errors()
        fix_report = self.auto_fixer.export_fixes()
        
        results["reports"] = {
            "errors": error_report,
            "fixes": fix_report
        }
        
        # Print summary
        self._print_summary(results)
        
        return results
    
    def run_database_tests(self) -> Dict[str, Any]:
        """Run database layer tests."""
        result = {
            "phase": TestPhase.DATABASE.value,
            "test_file": "backend/tests/test_database_comprehensive.py",
            "command": ["pytest", "backend/tests/test_database_comprehensive.py", "-v"],
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "status": "UNKNOWN"
        }
        
        try:
            cmd_result = subprocess.run(
                result["command"],
                cwd="/home/sos10/Documents/EOEX/deepseek",
                capture_output=True,
                text=True,
                timeout=60
            )
            
            output = cmd_result.stdout + cmd_result.stderr
            result["output"] = output
            result["return_code"] = cmd_result.returncode
            
            # Parse results
            if cmd_result.returncode == 0:
                result["status"] = "PASSED"
                result["tests_passed"] = self._count_passed(output)
            else:
                result["status"] = "FAILED"
                result["tests_failed"] = self._count_failed(output)
                
                # Log errors
                self.logger.log_error(
                    Exception("Database tests failed"),
                    category=ErrorCategory.DATABASE,
                    context={
                        "phase": TestPhase.DATABASE.value,
                        "output": output[-500:]  # Last 500 chars
                    }
                )
            
            print(f"✓ Database Tests: {result['status']}")
            
        except subprocess.TimeoutExpired:
            result["status"] = "TIMEOUT"
            result["error"] = "Database tests timed out"
            self.logger.log_error(
                Exception("Database tests timeout"),
                category=ErrorCategory.DATABASE
            )
            print("✗ Database Tests: TIMEOUT")
        
        except Exception as e:
            result["status"] = "ERROR"
            result["error"] = str(e)
            self.logger.log_error(
                e,
                category=ErrorCategory.DATABASE
            )
            print(f"✗ Database Tests: ERROR - {str(e)}")
        
        return result
    
    def run_api_tests(self) -> Dict[str, Any]:
        """Run API endpoint tests."""
        result = {
            "phase": TestPhase.API.value,
            "test_file": "backend/tests/test_api_endpoints.py",
            "command": ["pytest", "backend/tests/test_api_endpoints.py", "-v"],
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "status": "UNKNOWN"
        }
        
        try:
            cmd_result = subprocess.run(
                result["command"],
                cwd="/home/sos10/Documents/EOEX/deepseek",
                capture_output=True,
                text=True,
                timeout=60
            )
            
            output = cmd_result.stdout + cmd_result.stderr
            result["output"] = output
            result["return_code"] = cmd_result.returncode
            
            if cmd_result.returncode == 0:
                result["status"] = "PASSED"
                result["tests_passed"] = self._count_passed(output)
            else:
                result["status"] = "FAILED"
                result["tests_failed"] = self._count_failed(output)
                self.logger.log_error(
                    Exception("API tests failed"),
                    category=ErrorCategory.API,
                    context={
                        "phase": TestPhase.API.value,
                        "output": output[-500:]
                    }
                )
            
            print(f"✓ API Tests: {result['status']}")
            
        except Exception as e:
            result["status"] = "ERROR"
            result["error"] = str(e)
            self.logger.log_error(e, category=ErrorCategory.API)
            print(f"✗ API Tests: ERROR - {str(e)}")
        
        return result
    
    def run_service_tests(self) -> Dict[str, Any]:
        """Run backend service tests."""
        result = {
            "phase": TestPhase.SERVICES.value,
            "test_file": "backend/tests/test_services.py",
            "command": ["pytest", "backend/tests/test_services.py", "-v"],
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "status": "UNKNOWN"
        }
        
        try:
            cmd_result = subprocess.run(
                result["command"],
                cwd="/home/sos10/Documents/EOEX/deepseek",
                capture_output=True,
                text=True,
                timeout=60
            )
            
            output = cmd_result.stdout + cmd_result.stderr
            result["output"] = output
            result["return_code"] = cmd_result.returncode
            
            if cmd_result.returncode == 0:
                result["status"] = "PASSED"
                result["tests_passed"] = self._count_passed(output)
            else:
                result["status"] = "FAILED"
                result["tests_failed"] = self._count_failed(output)
                self.logger.log_error(
                    Exception("Service tests failed"),
                    category=ErrorCategory.SERVICE,
                    context={
                        "phase": TestPhase.SERVICES.value,
                        "output": output[-500:]
                    }
                )
            
            print(f"✓ Service Tests: {result['status']}")
            
        except Exception as e:
            result["status"] = "ERROR"
            result["error"] = str(e)
            self.logger.log_error(e, category=ErrorCategory.SERVICE)
            print(f"✗ Service Tests: ERROR - {str(e)}")
        
        return result
    
    def run_frontend_tests(self) -> Dict[str, Any]:
        """Run frontend component tests."""
        result = {
            "phase": TestPhase.FRONTEND.value,
            "test_file": "frontend/src/tests/components.test.jsx",
            "command": ["npm", "test", "--", "components.test.jsx"],
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "status": "UNKNOWN"
        }
        
        try:
            cmd_result = subprocess.run(
                result["command"],
                cwd="/home/sos10/Documents/EOEX/deepseek/frontend",
                capture_output=True,
                text=True,
                timeout=120
            )
            
            output = cmd_result.stdout + cmd_result.stderr
            result["output"] = output
            result["return_code"] = cmd_result.returncode
            
            if cmd_result.returncode == 0:
                result["status"] = "PASSED"
                result["tests_passed"] = self._count_passed(output)
            else:
                result["status"] = "FAILED"
                result["tests_failed"] = self._count_failed(output)
                self.logger.log_frontend_error(
                    "Frontend tests failed",
                    error_type="TEST_FAILURE",
                    component="TestSuite"
                )
            
            print(f"✓ Frontend Tests: {result['status']}")
            
        except Exception as e:
            result["status"] = "ERROR"
            result["error"] = str(e)
            self.logger.log_frontend_error(
                str(e),
                error_type="EXECUTION_ERROR",
                component="FrontendTestRunner"
            )
            print(f"✗ Frontend Tests: ERROR - {str(e)}")
        
        return result
    
    def run_e2e_tests(self) -> Dict[str, Any]:
        """Run E2E user journey tests."""
        result = {
            "phase": TestPhase.E2E.value,
            "test_file": "backend/tests/test_e2e_journeys.py",
            "command": ["pytest", "backend/tests/test_e2e_journeys.py", "-v"],
            "tests_run": 0,
            "tests_passed": 0,
            "tests_failed": 0,
            "status": "UNKNOWN"
        }
        
        try:
            cmd_result = subprocess.run(
                result["command"],
                cwd="/home/sos10/Documents/EOEX/deepseek",
                capture_output=True,
                text=True,
                timeout=300  # E2E tests may take longer
            )
            
            output = cmd_result.stdout + cmd_result.stderr
            result["output"] = output
            result["return_code"] = cmd_result.returncode
            
            if cmd_result.returncode == 0:
                result["status"] = "PASSED"
                result["tests_passed"] = self._count_passed(output)
            else:
                result["status"] = "FAILED"
                result["tests_failed"] = self._count_failed(output)
                self.logger.log_error(
                    Exception("E2E tests failed"),
                    category=ErrorCategory.UNKNOWN,
                    context={
                        "phase": TestPhase.E2E.value,
                        "output": output[-500:]
                    }
                )
            
            print(f"✓ E2E Tests: {result['status']}")
            
        except Exception as e:
            result["status"] = "ERROR"
            result["error"] = str(e)
            self.logger.log_error(e, category=ErrorCategory.UNKNOWN)
            print(f"✗ E2E Tests: ERROR - {str(e)}")
        
        return result
    
    def _count_passed(self, output: str) -> int:
        """Count passed tests from output."""
        import re
        match = re.search(r'(\d+)\s+passed', output)
        return int(match.group(1)) if match else 0
    
    def _count_failed(self, output: str) -> int:
        """Count failed tests from output."""
        import re
        match = re.search(r'(\d+)\s+failed', output)
        return int(match.group(1)) if match else 0
    
    def _print_summary(self, results: Dict[str, Any]):
        """Print test summary."""
        summary = results["summary"]
        
        print("\n" + "="*70)
        print("TEST EXECUTION SUMMARY")
        print("="*70)
        print(f"Total Phases: {summary['total_phases']}")
        print(f"Passed: {summary['passed_phases']}")
        print(f"Failed: {summary['failed_phases']}")
        print(f"Duration: {results['duration_seconds']:.2f} seconds")
        print()
        print("Error Summary:")
        for category, count in summary.get('error_summary', {}).get('by_category', {}).items():
            print(f"  - {category}: {count}")
        print()
        print("Auto-Fix Summary:")
        print(f"  - Total Fixes Applied: {summary['total_fixes']}")
        print()
        print("Reports Generated:")
        print(f"  - Error Report: {results.get('reports', {}).get('errors', 'N/A')}")
        print(f"  - Fix Report: {results.get('reports', {}).get('fixes', 'N/A')}")
        print("="*70 + "\n")
    
    def export_results(self, filename: str = "test_results.json") -> str:
        """Export test results."""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        output_file = log_dir / filename
        
        with open(output_file, "w") as f:
            json.dump(self.test_results, f, indent=2)
        
        return str(output_file)


# Global orchestrator instance
orchestrator = TestOrchestrator()


def get_orchestrator() -> TestOrchestrator:
    """Get global orchestrator instance."""
    return orchestrator


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Run comprehensive test suite")
    parser.add_argument(
        "--phase",
        choices=[p.value.lower() for p in TestPhase],
        help="Run specific test phase"
    )
    parser.add_argument(
        "--auto-fix",
        action="store_true",
        help="Auto-fix errors found during testing"
    )
    
    args = parser.parse_args()
    
    orchestrator = get_orchestrator()
    
    if args.phase:
        # Run specific phase
        phase = TestPhase[args.phase.upper()]
        print(f"Running {phase.value} tests...")
        
        if phase == TestPhase.DATABASE:
            result = orchestrator.run_database_tests()
        elif phase == TestPhase.API:
            result = orchestrator.run_api_tests()
        elif phase == TestPhase.SERVICES:
            result = orchestrator.run_service_tests()
        elif phase == TestPhase.FRONTEND:
            result = orchestrator.run_frontend_tests()
        elif phase == TestPhase.E2E:
            result = orchestrator.run_e2e_tests()
        
        print(json.dumps(result, indent=2))
    else:
        # Run full suite
        results = orchestrator.run_full_test_suite()
        orchestrator.test_results = results
        
        # Export results
        export_file = orchestrator.export_results()
        print(f"\nResults exported to: {export_file}")
