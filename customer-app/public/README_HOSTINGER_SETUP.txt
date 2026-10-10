BHOJJ HOSTINGER NOTE

This is the React/Vite source project, not a ready-to-extract static production build. Build it first with npm ci && npm run build; upload the CONTENTS of dist/ to the correct Hostinger web root. Do not deploy this source ZIP as if it were the compiled site.

For the central PHP API, deploy the separate BHOJJ-CENTRAL-BACKEND-HOSTINGER-READY.zip into public_html/api/ and configure api/config.local.php from its example. Import database/schema.sql into a Hostinger MySQL database. Read HOSTINGER-TERMUX-SETUP-HI.md for detailed steps.

Do not use demo/default credentials. Never overwrite an existing live site without a backup.
