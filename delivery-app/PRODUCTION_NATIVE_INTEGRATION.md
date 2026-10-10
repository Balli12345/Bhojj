# BHOJJ Delivery — Production Native Integration

- Role: `delivery`
- Android applicationId: `com.bhojj.delivery`
- Runtime URL: `https://bhojj.com/delivery/`
- Central API: `https://bhojj.com/api/`
- Authentication: PHP session + CSRF (`credentials: include`, `X-CSRF-Token`)
- Single central MySQL database shared by all BHOJJ roles.

## Build
`npm install`
`npm run android:build`

## Release
Set `BHOJJ_KEYSTORE_PATH`, `BHOJJ_KEYSTORE_PASSWORD`, `BHOJJ_KEY_ALIAS`, `BHOJJ_KEY_PASSWORD`, then run `npm run android:release`.

## Production prerequisites
- Hostinger must serve the matching role route and `/api/`.
- Firebase/FCM credentials are required before push notifications can be enabled.
- Test on physical Android devices for GPS, notification permissions, back navigation and network loss.

## Central API deployment contract

- Set `VITE_BHOJJ_API_URL=https://bhojj.com/api` before building.
- Host the PHP API at `public_html/api/index.php`; root `.htaccess` must route `/api/*` to that file before any SPA fallback.
- The backend `.env` must be configured with Hostinger MySQL credentials. Never ship production credentials in this app ZIP.
- Authentication currently uses PHP session cookies + CSRF. Verify cookies, CORS, login/logout, role restrictions and session persistence on a real Android device.
- Do not treat a successful Vite build as proof that all API routes/business flows work; run the integration checklist against the deployed database.
