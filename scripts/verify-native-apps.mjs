import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const roles = ['customer', 'restaurant', 'delivery', 'admin'];
const failures = [];
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

for (const role of roles) {
  const app = `${role}-app`;
  const ctx = read(`${app}/src/context/AppContext.tsx`);
  const regStart = ctx.indexOf('bhojjApi.register({');
  const regEnd = regStart < 0 ? -1 : ctx.indexOf('});', regStart);
  const payload = regStart < 0 || regEnd < 0 ? '' : ctx.slice(regStart, regEnd);
  if (!payload.includes('role,')) failures.push(`${app}: registration payload must include role`);

  const pkg = JSON.parse(read(`${app}/package.json`));
  if (!String(pkg.scripts?.['android:sync'] || '').includes(`prepare-native.mjs ${role}`)) {
    failures.push(`${app}: android:sync must prepare the ${role} role`);
  }

  const cap = read(`${app}/capacitor.config.ts`);
  if (!cap.includes(`com.bhojj.${role}`)) failures.push(`${app}: capacitor.config.ts appId does not match ${role}`);
  if (!cap.includes('webDir: \'dist\'')) failures.push(`${app}: Capacitor webDir must be dist`);

  const vite = read(`${app}/vite.config.ts`);
  for (const match of vite.matchAll(/path\\.resolve\\(__dirname, '([^']+\\.html)'\\)/g)) {
    if (!fs.existsSync(path.join(root, app, match[1]))) failures.push(`${app}: Vite references missing HTML entry ${match[1]}`);
  }

  const prep = read(`${app}/scripts/prepare-native.mjs`);
  if (!prep.includes('allowedRoles') || !prep.includes('capacitor.${role}.config.ts')) {
    failures.push(`${app}: native preparation must validate role and select its Capacitor config`);
  }

  const roleFile = read(`${app}/.bhojj-native-role`);
  if (!roleFile.includes(`BHOJJ_NATIVE_ROLE=${role}`)) failures.push(`${app}: native role marker mismatch`);
  if (!fs.existsSync(path.join(root, app, `${role}.html`))) failures.push(`${app}: missing ${role}.html entry`);
}

const customerAuth = read('customer-app/src/components/auth/CustomerAuth.tsx');
if (customerAuth.includes("useState('priya@bhojj.in')") || customerAuth.includes("useState('bhojj123')")) {
  failures.push('customer-app: production login form must not prefill demo credentials');
}

if (failures.length) {
  console.error('BHOJJ native-app checks failed:');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log('BHOJJ native-app static checks passed for all four apps.');
