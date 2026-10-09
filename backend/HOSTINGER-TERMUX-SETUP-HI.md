# BHOJJ — Hostinger + Termux Setup (Hindi/Hinglish)

## Important reality check
- `bhojj.com` par upload karne se pehle Hostinger account, domain DNS/SSL aur MySQL database ka access aapke paas hona chahiye.
- Frontend source ZIP ko directly `public_html` mein extract karne se React/Vite app ready nahi hota. Pehle `npm run build` se `dist/` banani hai; `dist/` ke contents web root mein upload honge.
- PHP API ko `public_html/api/` mein rakhein. SQL schema ko Hostinger phpMyAdmin se import karna hota hai. DB credentials `.env.example` mein kabhi production credentials ke roop mein use na karein.
- Ye package source + deployment instructions hai, prebuilt APK nahi. Live production readiness tabhi confirm hogi jab live database/API aur role workflows test hon.

## A. Hostinger par API deploy karna
1. hPanel → Websites → `bhojj.com` → Manage → Files → File Manager.
2. `public_html` ka backup download karein. Existing live website ko bina backup overwrite na karein.
3. `public_html/api/` folder banayein (agar pehle se API hai to pehle compare/backup karein).
4. Backend ZIP ke `api/` folder ke contents `public_html/api/` mein upload karein. `api/.htaccess` bhi upload karein.
5. hPanel → Databases → Management mein MySQL database aur user create karein; credentials note karein.
6. phpMyAdmin → us database ko select karein → Import → `database/schema.sql` import karein. Seed data ko tabhi import karein jab review kar liya ho; production mein demo credentials/data na rakhein.
7. Backend PHP entrypoint ke DB config/env setup ko apne Hostinger DB details ke mutabiq set karein. Password chat ya public file mein share na karein.
8. SSL enable karein. API health/route ko browser/curl se check karein; expected JSON/route response verify karein. Agar 500 aaye to Hostinger PHP error log dekhein.

## B. Customer web UI deploy karna (Termux se build)
1. Termux (F-Droid source) open karein:
   ```sh
   pkg update && pkg upgrade -y
   pkg install nodejs-lts git unzip python -y
   termux-setup-storage
   ```
2. ZIP ko Android `Download` folder mein rakhein. File name ke mutabiq command update karein:
   ```sh
   mkdir -p ~/bhojj-customer
   unzip -o ~/storage/downloads/BHOJJ-CUSTOMER-APP-v2.0.1-BUILD-FIX.zip -d ~/bhojj-customer
   cd ~/bhojj-customer/BHOJJ-CUSTOMER-NATIVE-PRODUCTION-FIXED
   ```
3. Check Node/npm and scripts:
   ```sh
   node -v
   npm -v
   npm run
   ```
4. Dependencies install karein. Agar `package-lock.json` ho to:
   ```sh
   npm ci
   ```
   Agar `npm ci` lockfile error de, us error ko pehle review karein; blind delete/replace na karein. Phir zarurat par `npm install` try karein.
5. Build and type check:
   ```sh
   npm run build
   npm run lint
   ```
   `npm run build` successful hone ke baad `dist/` folder aur `dist/index.html` check karein:
   ```sh
   test -s dist/index.html && echo 'BUILD OUTPUT OK'
   find dist -maxdepth 2 -type f | head -50
   ```
6. `dist/` ke andar ke files/folders ko Hostinger `public_html/` mein upload karein — `dist/` folder ko nested `public_html/dist/` na chhodein. Existing production site ka backup rakhein.
7. API base URL ko source/config mein `https://bhojj.com/api` par set/verify karein, build dobara karein, aur phir upload karein. CORS allow-origin mein sirf real Bhojj domains rakhein.
8. Browser test: home/menu, item detail, cart, checkout, login/register, order status. API + DB connection ke bina order/auth ko production working na maanein.

## C. Termux se Android assets sync
Termux mein Node build/sync chal sakta hai, lekin APK compile karne ke liye Android SDK + Gradle + compatible JDK ka setup alag se chahiye aur phone storage/RAM ki wajah se fail ho sakta hai. Pehle:
```sh
npm run sync:android:customer
find android/app/src/main/assets/public -name index.html -ls
```
`index.html` milna sirf asset sync test hai, APK build ya Play Store readiness ka proof nahi.

APK build ke liye Android SDK/Gradle environment available ho tab:
```sh
cd android
chmod +x gradlew
./gradlew assembleDebug
```
Output usually `android/app/build/outputs/apk/debug/app-debug.apk` hota hai. Agar SDK/Gradle missing error aaye, Termux ko force karne ke bajaye Android Studio/CI Linux runner use karein.

## D. Production smoke-test checklist
- [ ] HTTPS opens without certificate warning
- [ ] `/api/` returns API JSON, not a PHP source download or HTML error
- [ ] DB schema imported; no default/demo admin password left in production
- [ ] Customer can register/login and session persists securely
- [ ] Menu data comes from API/database
- [ ] Order creation works once; refresh/retry doesn't duplicate it
- [ ] Restaurant can update order through allowed statuses
- [ ] Rider assignment respects availability and ownership
- [ ] Rider location/OTP/delivery completion validated server-side
- [ ] Admin routes reject non-admin accounts
- [ ] No secrets, `.env`, SQL dumps or setup scripts publicly accessible
- [ ] Error logs checked; backups and rollback plan ready

## What has been checked in this delivery
The backend PHP entrypoints passed `php -l` syntax checks in the packaging environment. A full `npm ci` attempt did not finish within the available test window, and no Hostinger account/live DB credentials were available; therefore live end-to-end testing and Android APK compilation are NOT claimed as passed.
