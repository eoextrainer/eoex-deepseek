
======================================================================
  SELF-HEALING ENGINE - COMPREHENSIVE TEST REPORT
======================================================================

Timestamp: 2026-01-31 22:40:50
Total Iterations: 6
Total Tests Run: 35
Passed: 0
Failed: 35
Success Rate: 0.0%

----------------------------------------------------------------------
DATABASE TEST RESULTS
----------------------------------------------------------------------
Passed: 6/6

----------------------------------------------------------------------
API TEST RESULTS
----------------------------------------------------------------------
Passed: 5/6

----------------------------------------------------------------------
FRONTEND TEST RESULTS
----------------------------------------------------------------------
Passed: 1/7

----------------------------------------------------------------------
ERRORS DETECTED
----------------------------------------------------------------------
  ✗ Get subscriptions failed: 405
  ✗ Home page load error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: / (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ Login page access error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: /login (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ Register page access error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: /register (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ CSS check error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: / (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ JavaScript check error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: / (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ Responsive design check error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: / (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ Get subscriptions failed: 405
  ✗ Home page load error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: / (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ✗ Login page access error: HTTPConnectionPool(host='localhost', port=3100): Max retries exceeded with url: /login (Caused by NewConnectionError("HTTPConnection(host='localhost', port=3100): Failed to establish a new connection: [Errno 111] Connection refused"))
  ... and 25 more errors

======================================================================
