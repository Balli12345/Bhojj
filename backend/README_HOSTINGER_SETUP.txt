BHOJJ CENTRAL API — HOSTINGER DEPLOYMENT

1. Back up the existing live site before replacing files.
2. Upload the contents of this folder's api/ directory into public_html/api/.
3. In hPanel create a MySQL database and user. Import database/schema.sql using phpMyAdmin.
4. Copy api/config.local.php.example to api/config.local.php, then enter the actual DB_HOST, DB_NAME, DB_USER, DB_PASSWORD. Keep config.local.php private; .htaccess denies web access to it.
5. Upload api/.htaccess. Enable SSL/HTTPS.
6. Test https://bhojj.com/api/ and inspect Hostinger PHP error logs if it returns HTTP 500.
7. Import seed.sql only after reviewing it; don't use demo users/passwords for production.

This package passed PHP syntax checks for api/index.php and setup.php. That does not verify a live MySQL connection, permissions, role workflows, payment gateway, or production uptime. Run the smoke tests in HOSTINGER-TERMUX-SETUP-HI.md before launch.
