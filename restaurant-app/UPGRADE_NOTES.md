# BHOJJ RESTAURANT App v1.1.0
- Synced with the central-API web app: added src/services/bhojjApi.ts (https://bhojj.com/api, CSRF + Idempotency-Key, cookies).
- Updated AppContext, auth screens and dashboards to use the central backend (async login).
- Fixed broken firebase-applet-config.json import path.
- Android versionCode 2 / versionName 1.1.0. Set VITE_BHOJJ_API_URL in .env to override API.
- Build: npm install && npm run android:build (release: npm run android:release with BHOJJ_KEYSTORE_* env vars).
