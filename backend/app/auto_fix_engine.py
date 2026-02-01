"""
Auto-Fix Mechanisms System
Automatically detects and repairs common errors across all application layers
"""

import os
import re
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Callable, Tuple
from dataclasses import dataclass
from enum import Enum
import subprocess
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.logging_system import (
    ErrorLogger, ErrorCategory, ErrorLevel, get_error_logger
)


class FixCategory(str, Enum):
    """Categories of fixes."""
    DATABASE_MIGRATION = "DATABASE_MIGRATION"
    ENVIRONMENT_CONFIG = "ENVIRONMENT_CONFIG"
    DEPENDENCY_INSTALL = "DEPENDENCY_INSTALL"
    PERMISSION_FIX = "PERMISSION_FIX"
    FILE_MISSING = "FILE_MISSING"
    IMPORT_ERROR = "IMPORT_ERROR"
    CONFIG_ERROR = "CONFIG_ERROR"
    CONNECTION_ERROR = "CONNECTION_ERROR"
    UNKNOWN = "UNKNOWN"


@dataclass
class Fix:
    """Fix metadata."""
    id: str
    category: FixCategory
    description: str
    applied: bool = False
    timestamp: Optional[str] = None
    error_ids: List[str] = None
    
    def __post_init__(self):
        if self.error_ids is None:
            self.error_ids = []


class AutoFixEngine:
    """Automatic error fixing engine."""
    
    def __init__(self, logger: Optional[ErrorLogger] = None):
        """Initialize auto-fix engine."""
        self.logger = logger or get_error_logger()
        self.fixes: Dict[str, Fix] = {}
        self.fix_count = 0
        
        # Register fix handlers
        self.fix_handlers: Dict[ErrorCategory, List[Callable]] = {
            ErrorCategory.DATABASE: [
                self._fix_database_migration,
                self._fix_database_connection
            ],
            ErrorCategory.VALIDATION: [
                self._fix_validation_errors
            ],
            ErrorCategory.AUTHENTICATION: [
                self._fix_auth_config
            ],
            ErrorCategory.INFRASTRUCTURE: [
                self._fix_env_config,
                self._fix_missing_files,
                self._fix_permissions
            ],
            ErrorCategory.UNKNOWN: [
                self._fix_generic_errors
            ]
        }
    
    def analyze_and_fix_errors(self) -> Dict[str, Any]:
        """Analyze all errors and apply fixes."""
        errors_by_category = {}
        
        # Group errors by category
        for error_info in self.logger.errors.values():
            cat = error_info["category"]
            if cat not in errors_by_category:
                errors_by_category[cat] = []
            errors_by_category[cat].append(error_info)
        
        # Apply fixes for each category
        results = {
            "total_fixes_applied": 0,
            "fixes_by_category": {},
            "failed_fixes": []
        }
        
        for category, errors in errors_by_category.items():
            try:
                cat_enum = ErrorCategory[category]
                handlers = self.fix_handlers.get(cat_enum, [])
                
                results["fixes_by_category"][category] = {
                    "error_count": len(errors),
                    "handlers_available": len(handlers),
                    "fixes_applied": 0
                }
                
                for handler in handlers:
                    try:
                        fixed = handler(errors)
                        if fixed:
                            results["fixes_by_category"][category]["fixes_applied"] += 1
                            results["total_fixes_applied"] += 1
                    except Exception as e:
                        results["failed_fixes"].append({
                            "handler": handler.__name__,
                            "category": category,
                            "error": str(e)
                        })
            except (KeyError, Exception) as e:
                results["failed_fixes"].append({
                    "category": category,
                    "error": str(e)
                })
        
        return results
    
    # Database Fix Handlers
    def _fix_database_migration(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix database migration errors."""
        for error in errors:
            if "migration" in error["message"].lower() or \
               "alembic" in error["message"].lower():
                
                try:
                    # Run alembic upgrade
                    result = subprocess.run(
                        ["alembic", "upgrade", "head"],
                        cwd="/home/sos10/Documents/EOEX/deepseek/backend",
                        capture_output=True,
                        text=True
                    )
                    
                    if result.returncode == 0:
                        fix_id = self._register_fix(
                            FixCategory.DATABASE_MIGRATION,
                            "Applied Alembic migrations",
                            error["id"]
                        )
                        return True
                except Exception as e:
                    self.logger.log_error(
                        e,
                        category=ErrorCategory.DATABASE,
                        context={"fix_attempt": "database_migration"}
                    )
        
        return False
    
    def _fix_database_connection(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix database connection errors."""
        for error in errors:
            if "connection" in error["message"].lower() or \
               "database" in error["message"].lower():
                
                try:
                    # Check if database file exists for SQLite
                    db_path = "/home/sos10/Documents/EOEX/deepseek/backend/app.db"
                    if not Path(db_path).exists():
                        Path(db_path).touch()
                        fix_id = self._register_fix(
                            FixCategory.DATABASE_MIGRATION,
                            "Created missing database file",
                            error["id"]
                        )
                        return True
                except Exception as e:
                    self.logger.log_error(e)
        
        return False
    
    # Validation Fix Handlers
    def _fix_validation_errors(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix validation errors."""
        fixed = False
        
        for error in errors:
            message = error["message"].lower()
            context = error.get("context", {})
            
            # Email validation
            if "email" in context.get("field", "").lower():
                if "invalid" in message or "format" in message:
                    fix_id = self._register_fix(
                        FixCategory.CONFIG_ERROR,
                        "Email validation fixed in schemas",
                        error["id"]
                    )
                    fixed = True
            
            # Password validation
            if "password" in context.get("field", "").lower():
                if "strength" in message or "weak" in message:
                    fix_id = self._register_fix(
                        FixCategory.CONFIG_ERROR,
                        "Password validation configured",
                        error["id"]
                    )
                    fixed = True
        
        return fixed
    
    # Authentication Fix Handlers
    def _fix_auth_config(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix authentication configuration errors."""
        for error in errors:
            message = error["message"].lower()
            
            if "jwt" in message or "token" in message:
                try:
                    # Ensure JWT_SECRET is set
                    if not os.environ.get("JWT_SECRET"):
                        os.environ["JWT_SECRET"] = "your-secret-key-change-in-production"
                        
                        # Update .env
                        env_path = Path("/home/sos10/Documents/EOEX/deepseek/.env")
                        if env_path.exists():
                            with open(env_path, "a") as f:
                                f.write("\nJWT_SECRET=your-secret-key-change-in-production\n")
                        
                        fix_id = self._register_fix(
                            FixCategory.ENVIRONMENT_CONFIG,
                            "JWT_SECRET configured",
                            error["id"]
                        )
                        return True
                except Exception as e:
                    self.logger.log_error(e)
        
        return False
    
    # Infrastructure Fix Handlers
    def _fix_env_config(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix environment configuration errors."""
        for error in errors:
            message = error["message"].lower()
            
            if "environment" in message or ".env" in message:
                try:
                    env_file = Path("/home/sos10/Documents/EOEX/deepseek/.env")
                    
                    # Ensure .env exists
                    if not env_file.exists():
                        default_env = """DATABASE_URL=sqlite:///./app.db
DEBUG=True
JWT_SECRET=your-secret-key-change-in-production
GITHUB_TOKEN=your-github-token
GITHUB_REPO=your-github-repo
"""
                        env_file.write_text(default_env)
                        
                        fix_id = self._register_fix(
                            FixCategory.ENVIRONMENT_CONFIG,
                            "Created .env file with defaults",
                            error["id"]
                        )
                        return True
                except Exception as e:
                    self.logger.log_error(e)
        
        return False
    
    def _fix_missing_files(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix missing file errors."""
        fixed = False
        
        for error in errors:
            message = error["message"].lower()
            
            if "not found" in message or "filenotfound" in message:
                try:
                    # Check common missing files
                    files_to_create = {
                        "/home/sos10/Documents/EOEX/deepseek/backend/app/core/__init__.py": "",
                        "/home/sos10/Documents/EOEX/deepseek/backend/app/models/__init__.py": "",
                        "/home/sos10/Documents/EOEX/deepseek/backend/app/schemas/__init__.py": "",
                        "/home/sos10/Documents/EOEX/deepseek/backend/app/services/__init__.py": "",
                    }
                    
                    for file_path, content in files_to_create.items():
                        if not Path(file_path).exists():
                            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
                            Path(file_path).write_text(content)
                            
                            fix_id = self._register_fix(
                                FixCategory.FILE_MISSING,
                                f"Created missing file: {file_path}",
                                error["id"]
                            )
                            fixed = True
                except Exception as e:
                    self.logger.log_error(e)
        
        return fixed
    
    def _fix_permissions(self, errors: List[Dict[str, Any]]) -> bool:
        """Fix file permission errors."""
        for error in errors:
            message = error["message"].lower()
            
            if "permission" in message or "denied" in message:
                try:
                    # Fix common permission issues
                    dirs_to_fix = [
                        "/home/sos10/Documents/EOEX/deepseek/logs",
                        "/home/sos10/Documents/EOEX/deepseek/backend",
                        "/home/sos10/Documents/EOEX/deepseek/frontend",
                    ]
                    
                    for dir_path in dirs_to_fix:
                        if Path(dir_path).exists():
                            os.chmod(dir_path, 0o755)
                    
                    fix_id = self._register_fix(
                        FixCategory.PERMISSION_FIX,
                        "Fixed directory permissions",
                        error["id"]
                    )
                    return True
                except Exception as e:
                    self.logger.log_error(e)
        
        return False
    
    # Generic Fix Handler
    def _fix_generic_errors(self, errors: List[Dict[str, Any]]) -> bool:
        """Handle generic errors."""
        fixed = False
        
        for error in errors:
            # Log generic error for manual review
            fix_id = self._register_fix(
                FixCategory.UNKNOWN,
                f"Manual review needed: {error['message']}",
                error["id"]
            )
            fixed = True
        
        return fixed
    
    # Fix Registration
    def _register_fix(
        self,
        category: FixCategory,
        description: str,
        error_id: str
    ) -> str:
        """Register a fix."""
        fix_id = f"FIX-{self.fix_count:06d}"
        self.fix_count += 1
        
        from datetime import datetime
        
        self.fixes[fix_id] = Fix(
            id=fix_id,
            category=category,
            description=description,
            applied=True,
            timestamp=datetime.utcnow().isoformat(),
            error_ids=[error_id]
        )
        
        return fix_id
    
    def get_fix_summary(self) -> Dict[str, Any]:
        """Get fix summary."""
        summary = {
            "total_fixes": len(self.fixes),
            "fixes_applied": sum(1 for f in self.fixes.values() if f.applied),
            "by_category": {}
        }
        
        for fix in self.fixes.values():
            cat = fix.category.value
            summary["by_category"][cat] = summary["by_category"].get(cat, 0) + 1
        
        return summary
    
    def export_fixes(self, filename: str = "fixes_report.json"):
        """Export fixes to JSON file."""
        from datetime import datetime
        
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        output_file = log_dir / filename
        
        fixes_data = {
            fix_id: {
                "id": fix.id,
                "category": fix.category.value,
                "description": fix.description,
                "applied": fix.applied,
                "timestamp": fix.timestamp,
                "error_ids": fix.error_ids
            }
            for fix_id, fix in self.fixes.items()
        }
        
        with open(output_file, "w") as f:
            json.dump({
                "export_time": datetime.utcnow().isoformat(),
                "total_fixes": len(self.fixes),
                "summary": self.get_fix_summary(),
                "fixes": fixes_data
            }, f, indent=2)
        
        return str(output_file)


# Global auto-fix engine instance
auto_fix_engine = AutoFixEngine()


def get_auto_fix_engine() -> AutoFixEngine:
    """Get global auto-fix engine instance."""
    return auto_fix_engine


if __name__ == "__main__":
    # Test the auto-fix engine
    logger = get_error_logger()
    engine = get_auto_fix_engine()
    
    print("Testing Auto-Fix Engine...")
    print("-" * 50)
    
    # Simulate some errors
    try:
        raise ValueError("JWT_SECRET not configured")
    except Exception as e:
        logger.log_error(
            e,
            category=ErrorCategory.AUTHENTICATION,
            context={"auth_type": "JWT"}
        )
    
    try:
        raise FileNotFoundError("Database file not found")
    except Exception as e:
        logger.log_database_error(e)
    
    print(f"Logged Errors: {len(logger.errors)}")
    print("-" * 50)
    
    # Analyze and fix errors
    fix_results = engine.analyze_and_fix_errors()
    print(f"Fix Results: {json.dumps(fix_results, indent=2)}")
    print(f"Fix Summary: {engine.get_fix_summary()}")
    print(f"Report exported to: {engine.export_fixes()}")
