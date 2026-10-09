# BHOJJ Customer — Production Native Integration

- Role: `customer`
- Android applicationId: `com.bhojj.customer`
- Runtime URL: `https://bhojj.com/`
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
