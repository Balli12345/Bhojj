# BHOJJ Admin Native Android App

- Package ID: com.bhojj.admin
- Version: 2.0.1
- Central API: https://bhojj.com/api
- Frontend content is bundled into the Android package; the backend stays on Hostinger.
- Build: `npm ci` then `npm run android:build`
- Play Store bundle: configure a release keystore, then `npm run android:release`

This is Capacitor Android source, not a prebuilt APK/AAB. Test authentication and every role workflow against the live API before production release.
