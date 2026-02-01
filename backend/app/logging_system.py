"""
Comprehensive Error Logging System
Captures, logs, and reports all errors from database, API, services, and frontend
"""

import logging
import json
import traceback
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
from enum import Enum
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))


class ErrorLevel(str, Enum):
    """Error severity levels."""
    CRITICAL = "CRITICAL"
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"
    DEBUG = "DEBUG"


class ErrorCategory(str, Enum):
    """Error categories."""
    DATABASE = "DATABASE"
    API = "API"
    VALIDATION = "VALIDATION"
    AUTHENTICATION = "AUTHENTICATION"
    AUTHORIZATION = "AUTHORIZATION"
    SERVICE = "SERVICE"
    EXTERNAL_API = "EXTERNAL_API"
    FRONTEND = "FRONTEND"
    INFRASTRUCTURE = "INFRASTRUCTURE"
    UNKNOWN = "UNKNOWN"


class ErrorLogger:
    """Comprehensive error logging system."""
    
    def __init__(self, log_dir: str = "logs"):
        """Initialize error logger."""
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        
        # Setup logging
        self.logger = logging.getLogger("ErrorLogger")
        self.logger.setLevel(logging.DEBUG)
        
        # File handler for all errors
        fh = logging.FileHandler(self.log_dir / "errors.log")
        fh.setLevel(logging.DEBUG)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s'
        )
        fh.setFormatter(formatter)
        self.logger.addHandler(fh)
        
        # Error registry
        self.errors: Dict[str, Any] = {}
        self.error_count = 0
    
    def log_error(
        self,
        error: Exception,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        level: ErrorLevel = ErrorLevel.ERROR,
        context: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None,
        endpoint: Optional[str] = None
    ) -> str:
        """
        Log an error with full context.
        
        Args:
            error: The exception to log
            category: Error category
            level: Error level
            context: Additional context
            user_id: User ID if applicable
            endpoint: API endpoint if applicable
        
        Returns:
            Error ID for tracking
        """
        error_id = f"ERR-{self.error_count:06d}"
        self.error_count += 1
        
        error_info = {
            "id": error_id,
            "timestamp": datetime.utcnow().isoformat(),
            "error_type": type(error).__name__,
            "message": str(error),
            "category": category.value,
            "level": level.value,
            "traceback": traceback.format_exc(),
            "context": context or {},
            "user_id": user_id,
            "endpoint": endpoint
        }
        
        # Store in registry
        self.errors[error_id] = error_info
        
        # Log to file
        log_msg = json.dumps(error_info, indent=2)
        getattr(self.logger, level.value.lower())(log_msg)
        
        return error_id
    
    def log_database_error(
        self,
        error: Exception,
        query: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Log database error."""
        ctx = context or {}
        ctx["query"] = query
        
        return self.log_error(
            error,
            category=ErrorCategory.DATABASE,
            level=ErrorLevel.ERROR,
            context=ctx
        )
    
    def log_api_error(
        self,
        error: Exception,
        endpoint: str,
        method: str = "GET",
        status_code: Optional[int] = None,
        request_data: Optional[Dict[str, Any]] = None,
        user_id: Optional[int] = None
    ) -> str:
        """Log API error."""
        context = {
            "method": method,
            "status_code": status_code,
            "request_data": request_data
        }
        
        return self.log_error(
            error,
            category=ErrorCategory.API,
            level=ErrorLevel.ERROR,
            context=context,
            user_id=user_id,
            endpoint=endpoint
        )
    
    def log_validation_error(
        self,
        error: Exception,
        field: str,
        value: Any,
        rule: str
    ) -> str:
        """Log validation error."""
        context = {
            "field": field,
            "value": value,
            "rule": rule
        }
        
        return self.log_error(
            error,
            category=ErrorCategory.VALIDATION,
            level=ErrorLevel.WARNING,
            context=context
        )
    
    def log_auth_error(
        self,
        error: Exception,
        auth_type: str,
        user_id: Optional[int] = None
    ) -> str:
        """Log authentication error."""
        context = {"auth_type": auth_type}
        
        return self.log_error(
            error,
            category=ErrorCategory.AUTHENTICATION,
            level=ErrorLevel.WARNING,
            context=context,
            user_id=user_id
        )
    
    def log_service_error(
        self,
        error: Exception,
        service_name: str,
        operation: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Log service layer error."""
        ctx = context or {}
        ctx["service"] = service_name
        ctx["operation"] = operation
        
        return self.log_error(
            error,
            category=ErrorCategory.SERVICE,
            level=ErrorLevel.ERROR,
            context=ctx
        )
    
    def log_external_api_error(
        self,
        error: Exception,
        api_name: str,
        endpoint: str,
        status_code: Optional[int] = None
    ) -> str:
        """Log external API error."""
        context = {
            "api_name": api_name,
            "endpoint": endpoint,
            "status_code": status_code
        }
        
        return self.log_error(
            error,
            category=ErrorCategory.EXTERNAL_API,
            level=ErrorLevel.ERROR,
            context=context
        )
    
    def log_frontend_error(
        self,
        error_message: str,
        error_type: str = "Unknown",
        component: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> str:
        """Log frontend error."""
        error = Exception(error_message)
        context = {"component": component}
        
        return self.log_error(
            error,
            category=ErrorCategory.FRONTEND,
            level=ErrorLevel.ERROR,
            context=context,
            user_id=user_id
        )
    
    def get_error_report(self, error_id: str) -> Optional[Dict[str, Any]]:
        """Get error report by ID."""
        return self.errors.get(error_id)
    
    def get_errors_by_category(self, category: ErrorCategory) -> Dict[str, Any]:
        """Get all errors in a category."""
        return {
            err_id: err_info
            for err_id, err_info in self.errors.items()
            if err_info["category"] == category.value
        }
    
    def get_errors_by_level(self, level: ErrorLevel) -> Dict[str, Any]:
        """Get all errors of a severity level."""
        return {
            err_id: err_info
            for err_id, err_info in self.errors.items()
            if err_info["level"] == level.value
        }
    
    def get_recent_errors(self, limit: int = 10) -> Dict[str, Any]:
        """Get recent errors."""
        sorted_errors = sorted(
            self.errors.items(),
            key=lambda x: x[1]["timestamp"],
            reverse=True
        )
        return dict(sorted_errors[:limit])
    
    def get_error_summary(self) -> Dict[str, Any]:
        """Get error summary statistics."""
        summary = {
            "total_errors": len(self.errors),
            "by_category": {},
            "by_level": {},
            "by_type": {}
        }
        
        for error_info in self.errors.values():
            # Count by category
            cat = error_info["category"]
            summary["by_category"][cat] = summary["by_category"].get(cat, 0) + 1
            
            # Count by level
            lvl = error_info["level"]
            summary["by_level"][lvl] = summary["by_level"].get(lvl, 0) + 1
            
            # Count by type
            err_type = error_info["error_type"]
            summary["by_type"][err_type] = summary["by_type"].get(err_type, 0) + 1
        
        return summary
    
    def clear_errors(self):
        """Clear all logged errors."""
        self.errors.clear()
        self.error_count = 0
    
    def export_errors(self, filename: str = "error_report.json"):
        """Export errors to JSON file."""
        output_file = self.log_dir / filename
        
        with open(output_file, "w") as f:
            json.dump({
                "export_time": datetime.utcnow().isoformat(),
                "total_errors": len(self.errors),
                "summary": self.get_error_summary(),
                "errors": self.errors
            }, f, indent=2)
        
        return str(output_file)


# Global error logger instance
error_logger = ErrorLogger(log_dir="logs")


def get_error_logger() -> ErrorLogger:
    """Get global error logger instance."""
    return error_logger


# Example usage and decorators
def handle_errors(category: ErrorCategory = ErrorCategory.UNKNOWN):
    """Decorator for error handling."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logger = get_error_logger()
                logger.log_error(e, category=category)
                raise
        return wrapper
    return decorator


def handle_database_errors(func):
    """Decorator for database error handling."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger = get_error_logger()
            logger.log_database_error(e)
            raise
    return wrapper


def handle_api_errors(endpoint: str):
    """Decorator for API error handling."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logger = get_error_logger()
                logger.log_api_error(e, endpoint=endpoint)
                raise
        return wrapper
    return decorator


if __name__ == "__main__":
    # Test the error logging system
    logger = get_error_logger()
    
    print("Testing Error Logging System...")
    print("-" * 50)
    
    # Test database error
    try:
        raise ValueError("Invalid database column")
    except Exception as e:
        err_id = logger.log_database_error(e, query="SELECT * FROM users")
        print(f"Database Error ID: {err_id}")
    
    # Test API error
    try:
        raise RuntimeError("API request timeout")
    except Exception as e:
        err_id = logger.log_api_error(
            e,
            endpoint="/api/users",
            method="GET",
            status_code=500
        )
        print(f"API Error ID: {err_id}")
    
    # Test validation error
    try:
        raise ValueError("Email format invalid")
    except Exception as e:
        err_id = logger.log_validation_error(
            e,
            field="email",
            value="invalid-email",
            rule="valid email format"
        )
        print(f"Validation Error ID: {err_id}")
    
    print("-" * 50)
    print(f"Total Errors: {len(logger.errors)}")
    print(f"Summary: {logger.get_error_summary()}")
    print(f"Report exported to: {logger.export_errors()}")
