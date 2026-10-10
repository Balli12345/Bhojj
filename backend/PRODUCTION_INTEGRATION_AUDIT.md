# BHOJJ Production Integration Audit

## Fixed in this package
- Four Android app IDs are distinct and correct.
- Customer runtime URL: https://bhojj.com/
- Restaurant runtime URL: https://bhojj.com/restaurant/
- Delivery runtime URL: https://bhojj.com/delivery/
- Admin runtime URL: https://bhojj.com/admin/
- All apps use the same central API: https://bhojj.com/api/
- Strict default CORS allow-list for Bhojj origins.
- Order creation now persists delivery/restaurant coordinates for rider matching.
- Idempotency-Key support prevents duplicate customer orders on retries.
- Manual rider assignment is transaction-protected against duplicate assignment races.
- Existing RBAC, CSRF, session security and order transition rules retained.

## Not verified in this environment
- Live DNS/Hostinger HTTP requests: blocked by environment DNS resolution.
- Android APK/AAB compilation: Gradle dependencies are unavailable in this environment.
- FCM push notifications: requires the production Firebase project/google-services.json.
- Real-device GPS/background behavior: requires physical Android device testing.
