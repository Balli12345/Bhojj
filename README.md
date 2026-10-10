# Bhojj

Pure-satvik food delivery platform: four role apps plus a central PHP/MySQL API.

| Folder | What it is |
| --- | --- |
| `customer-app/` | Customer app (React + Vite, Capacitor Android) |
| `restaurant-app/` | Restaurant / kitchen app |
| `delivery-app/` | Delivery partner (rider) app |
| `admin-app/` | Platform admin app |
| `backend/` | Central API (`backend/api/index.php`), MySQL schema and seed data, Hostinger deployment notes |

## Run locally

1. **Database**: create a MySQL/MariaDB database, then import `backend/database/schema.sql` and `backend/database/seed.sql`.
2. **API**: copy `backend/api/config.local.php.example` to `backend/api/config.local.php` and fill in the DB credentials (set `APP_ENV` to `development` for detailed errors). Serve `backend/api/` with Apache/LiteSpeed (uses `api/.htaccess`) or any PHP 8.1+ server that rewrites all requests under `/api` to `api/index.php`.
3. **Apps**: in each `*-app/` folder run `npm install`, set `VITE_BHOJJ_API_URL` in `.env.local` to your API URL, then run `npm run dev`. The API's session cookie is `Secure`, so serve the apps and the API from the same origin (for example through a Vite `/api` proxy) or over HTTPS.

Seeded demo accounts all use the password `password`: `priya@bhojj.in` (customer), `chef.vikram@royalrasoi.in` (restaurant), `rajesh.rider@bhojj.in` (delivery), `admin@bhojj.in` (admin). Change them before going to production.

See `backend/README_HOSTINGER_SETUP.txt` and `backend/DEPLOYMENT_CHECKLIST.txt` for production deployment.
