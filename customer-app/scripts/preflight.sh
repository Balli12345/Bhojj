#!/data/data/com.termux/files/usr/bin/bash
set -eu
printf '\n== BHOJJ project preflight ==\n'
command -v node >/dev/null || { echo 'Missing Node.js: pkg install nodejs-lts'; exit 1; }
command -v npm >/dev/null || { echo 'Missing npm'; exit 1; }
test -f package.json || { echo 'Run from project root: package.json not found'; exit 1; }
node -e "const p=require('./package.json'); console.log('Project:',p.name||'(unnamed)'); console.log('Build script:',p.scripts?.build||'MISSING'); console.log('Android sync:',p.scripts?.['sync:android:customer']||'MISSING'); if(!p.scripts?.build) process.exit(2)"
printf '\nInstall dependencies with npm ci, then run npm run build and npm run lint.\n'
