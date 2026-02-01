#!/usr/bin/env python3
"""
Verification Script: Complete Testing Framework
Verifies all testing infrastructure is in place and ready to execute
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

def print_header(text):
    """Print formatted header."""
    print(f"\n{'='*70}")
    print(f"{text}")
    print(f"{'='*70}\n")

def print_section(text):
    """Print formatted section."""
    print(f"\n{text}")
    print(f"{'-'*70}")

def check_file_exists(filepath: str) -> bool:
    """Check if file exists."""
    exists = Path(filepath).exists()
    status = "✓" if exists else "✗"
    print(f"  {status} {filepath}")
    return exists

def check_directory_exists(dirpath: str) -> bool:
    """Check if directory exists."""
    exists = Path(dirpath).exists()
    status = "✓" if exists else "✗"
    print(f"  {status} {dirpath}/")
    return exists

def main():
    """Run verification checks."""
    print_header("TESTING FRAMEWORK VERIFICATION")
    
    base_path = "/home/sos10/Documents/EOEX/deepseek"
    
    # Change to base directory
    os.chdir(base_path)
    
    verification_results = {
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {},
        "summary": {
            "total_checks": 0,
            "passed_checks": 0,
            "failed_checks": 0,
            "ready_to_test": False
        }
    }
    
    # Check 1: Test Files
    print_section("1. CHECKING TEST FILES")
    test_files = {
        "Database Tests": "backend/tests/test_database_comprehensive.py",
        "API Endpoint Tests": "backend/tests/test_api_endpoints.py",
        "Backend Service Tests": "backend/tests/test_services.py",
        "E2E Journey Tests": "backend/tests/test_e2e_journeys.py",
        "Test Orchestrator": "backend/tests/test_orchestrator.py",
    }
    
    test_files_ok = True
    for name, filepath in test_files.items():
        exists = check_file_exists(filepath)
        test_files_ok = test_files_ok and exists
        verification_results["checks"][f"test_file_{name.lower().replace(' ', '_')}"] = exists
    
    # Check 2: Infrastructure Files
    print_section("2. CHECKING INFRASTRUCTURE FILES")
    infra_files = {
        "Logging System": "backend/app/logging_system.py",
        "Auto-Fix Engine": "backend/app/auto_fix_engine.py",
        "Frontend Tests": "frontend/src/tests/components.test.jsx",
    }
    
    infra_files_ok = True
    for name, filepath in infra_files.items():
        exists = check_file_exists(filepath)
        infra_files_ok = infra_files_ok and exists
        verification_results["checks"][f"infra_{name.lower().replace(' ', '_')}"] = exists
    
    # Check 3: Documentation Files
    print_section("3. CHECKING DOCUMENTATION FILES")
    doc_files = {
        "Comprehensive Testing Guide": "COMPREHENSIVE_TESTING_GUIDE.md",
        "Quick Start Guide": "TESTING_QUICK_START.md",
    }
    
    doc_files_ok = True
    for name, filepath in doc_files.items():
        exists = check_file_exists(filepath)
        doc_files_ok = doc_files_ok and exists
        verification_results["checks"][f"doc_{name.lower().replace(' ', '_')}"] = exists
    
    # Check 4: Project Structure
    print_section("4. CHECKING PROJECT STRUCTURE")
    directories = {
        "Backend App": "backend/app",
        "Backend Tests": "backend/tests",
        "Frontend": "frontend",
        "Frontend Tests": "frontend/src/tests",
        "Scripts": "scripts",
        "Logs": "logs",
    }
    
    dirs_ok = True
    for name, dirpath in directories.items():
        exists = check_directory_exists(dirpath)
        dirs_ok = dirs_ok and exists
        verification_results["checks"][f"dir_{name.lower().replace(' ', '_')}"] = exists
    
    # Check 5: Dependencies
    print_section("5. CHECKING DEPENDENCIES")
    dependencies = {
        "Python >= 3.8": sys.version_info >= (3, 8),
        "pytest installed": check_module("pytest"),
        "FastAPI installed": check_module("fastapi"),
        "SQLAlchemy installed": check_module("sqlalchemy"),
        "Selenium installed": check_module("selenium"),
    }
    
    deps_ok = True
    for name, installed in dependencies.items():
        status = "✓" if installed else "✗"
        print(f"  {status} {name}")
        verification_results["checks"][f"dep_{name.lower().replace(' ', '_')}"] = installed
        deps_ok = deps_ok and installed
    
    # Check 6: File Contents
    print_section("6. CHECKING FILE CONTENTS")
    
    # Check orchestrator has test runner
    orch_path = Path("backend/tests/test_orchestrator.py")
    has_orchestrator = orch_path.exists() and "run_full_test_suite" in orch_path.read_text()
    status = "✓" if has_orchestrator else "✗"
    print(f"  {status} Orchestrator has run_full_test_suite() method")
    verification_results["checks"]["orch_run_method"] = has_orchestrator
    
    # Check logging system has error types
    log_path = Path("backend/app/logging_system.py")
    has_logging = log_path.exists() and "ErrorCategory" in log_path.read_text()
    status = "✓" if has_logging else "✗"
    print(f"  {status} Logging system has ErrorCategory enum")
    verification_results["checks"]["logging_categories"] = has_logging
    
    # Check auto-fix has handlers
    fix_path = Path("backend/app/auto_fix_engine.py")
    has_fixes = fix_path.exists() and "_fix_database_migration" in fix_path.read_text()
    status = "✓" if has_fixes else "✗"
    print(f"  {status} Auto-fix engine has fix handlers")
    verification_results["checks"]["autofix_handlers"] = has_fixes
    
    # Summary
    print_section("TEST FRAMEWORK STATUS")
    
    all_checks = list(verification_results["checks"].values())
    passed = sum(1 for v in all_checks if v)
    failed = len(all_checks) - passed
    
    verification_results["summary"]["total_checks"] = len(all_checks)
    verification_results["summary"]["passed_checks"] = passed
    verification_results["summary"]["failed_checks"] = failed
    verification_results["summary"]["ready_to_test"] = all(all_checks)
    
    print(f"Total Checks: {len(all_checks)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Coverage: {(passed/len(all_checks)*100):.1f}%")
    
    if verification_results["summary"]["ready_to_test"]:
        print_header("✓ TESTING FRAMEWORK READY")
        print("All components verified successfully!")
        print("\nNext Steps:")
        print("1. Run the full test suite:")
        print("   python backend/tests/test_orchestrator.py")
        print("\n2. Or run specific test phases:")
        print("   python backend/tests/test_orchestrator.py --phase database")
        print("   python backend/tests/test_orchestrator.py --phase api")
        print("   python backend/tests/test_orchestrator.py --phase services")
        print("   python backend/tests/test_orchestrator.py --phase frontend")
        print("   python backend/tests/test_orchestrator.py --phase e2e")
        print("\n3. Review generated reports in logs/:")
        print("   - error_report.json")
        print("   - fixes_report.json")
        print("   - test_results.json")
        print("\n4. Check documentation:")
        print("   - COMPREHENSIVE_TESTING_GUIDE.md")
        print("   - TESTING_QUICK_START.md")
    else:
        print_header("✗ TESTING FRAMEWORK INCOMPLETE")
        print("Missing components:")
        for check, result in verification_results["checks"].items():
            if not result:
                print(f"  - {check}")
    
    # Save verification report
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    with open(log_dir / "framework_verification.json", "w") as f:
        json.dump(verification_results, f, indent=2)
    
    print(f"\nVerification report saved to: logs/framework_verification.json")
    print()
    
    return 0 if verification_results["summary"]["ready_to_test"] else 1


def check_module(module_name: str) -> bool:
    """Check if a Python module is installed."""
    try:
        __import__(module_name)
        return True
    except ImportError:
        return False


if __name__ == "__main__":
    sys.exit(main())
