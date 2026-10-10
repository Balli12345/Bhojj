# BHOJJ Customer v2.0.0

- Capacitor Android project retained.
- Role UI is bundled locally into the APK/AAB (no remote `server.url` dependency).
- Central backend/API: https://bhojj.com/api
- HTTPS-only network access.
- Role entry: `customer.html`.
- Debug APK: `npm run android:build`
- Release AAB: `npm run android:release` after release keystore environment variables are configured.

Hostinger hosts the PHP backend/web endpoints; Android apps are distributed separately.
