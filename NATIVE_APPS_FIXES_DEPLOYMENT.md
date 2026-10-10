# BHOJJ Native Apps — Fixes and Deployment Guide

## Included fixes

- Added the requested role to the registration API payload in all four app source trees so the PHP API can validate the intended account role.
- Removed prefilled seeded customer login credentials from the production customer login form.
- Standardized each app's Android preparation script: it validates the role, checks the role HTML and Capacitor config, temporarily selects the matching Capacitor config, runs `npx cap sync android`, and restores the original config.
- Added a four-app static verification script and GitHub Actions CI for TypeScript checks and production web builds.
- Updated API CORS defaults/config example for the exact Capacitor WebView origins (`https://localhost`, `http://localhost`, `capacitor://localhost`) and uses `SameSite=None; Secure` only for those native origins. Web origins retain `SameSite=Lax`.
- Changed CORS to fail closed: an empty allowlist no longer grants every origin access.

## Before deployment

1. Back up the current Hostinger files and MySQL database.
2. Confirm `bhojj.com` and `www.bhojj.com` use HTTPS.
3. Upload the `backend/` API files to the configured API location. Do not upload a real `config.local.php` to GitHub.
4. Copy `backend/api/config.local.php.example` to `backend/api/config.local.php` on the server and set the real database name, user, password, and exact allowed origins. Keep the file private and never commit it.
5. For the standard native WebView origins, the allowlist should include `https://bhojj.com,https://www.bhojj.com,https://localhost,http://localhost,capacitor://localhost`. Add other origins only if they are intentionally required.
6. Ensure `backend/database/schema.sql` and `backend/database/seed.sql` match the deployed API version. Import seed data only once. Change all seeded/demo passwords before going live.
7. Check `https://bhojj.com/api/health` and verify CORS preflight requests from the actual Android app. Do not consider login production-ready until the app can log in, refresh `/auth/me`, make an authenticated mutation with the CSRF header, and log out on a real device.

## Build each Android app

Use Node.js 22 and a supported Android SDK/JDK setup on a development computer. Run these commands separately from each app directory:

```bash
cd customer-app
npm ci
npm run lint
npm run build
npm run android:sync
cd android
./gradlew assembleDebug
```

Repeat from `restaurant-app`, `delivery-app`, and `admin-app`. The app-specific `android:sync` command chooses the matching role HTML and Capacitor app ID. Debug APKs are normally written to `android/app/build/outputs/apk/debug/`.

To create a Play Store bundle, configure the release signing credentials securely (do not commit keystores or passwords), then run the app's `npm run android:release` command and verify the generated AAB before distribution.

## Hostinger web deployment

- Build each web app with `npm ci && npm run lint && npm run build` from its app directory.
- Upload the contents of that app's `dist/` to the matching web root/path only if you intend to publish that portal as a web app. Do not upload the `dist` folder itself as an extra nested directory.
- Keep the central PHP API and database shared across all four portals; do not create a separate database per app.
- Set `VITE_BHOJJ_API_URL=https://bhojj.com/api` at build time if using a non-default API URL. Vite variables are compiled into the build, so rebuild after changing them.
- After deployment, test customer browse/cart/checkout, restaurant status transitions, rider assignment/location/OTP completion, and admin verification/user/order actions against real server data.

## Important verification limits

The CI workflow added here checks TypeScript and Vite production builds. A green web build does not prove Android APK signing, native cookie persistence, GPS permissions, push notifications, or live Hostinger/MySQL workflows. Those need a real Android device and the deployed backend. If native login does not persist across `/auth/me`, investigate Android WebView third-party-cookie settings or implement a native token exchange rather than loosening API authorization.

## Static validation

Run from the repository root:

```bash
node scripts/verify-native-apps.mjs
```
