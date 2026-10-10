import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const role = process.argv[2] || 'customer';
const allowedRoles = new Set(['customer', 'restaurant', 'delivery']);
if (!allowedRoles.has(role)) {
  throw new Error(`Unsupported role "${role}". Expected customer, restaurant, or delivery.`);
}
const root = process.cwd();
if (!fs.existsSync(path.join(root, 'package.json'))) {
  throw new Error(`Run this script from the project root (package.json not found): ${root}`);
}
const dist = path.join(root, 'dist');
const roleHtml = path.join(dist, `${role}.html`);
const indexHtml = path.join(dist, 'index.html');
if (!fs.existsSync(roleHtml)) {
  throw new Error(`Missing ${roleHtml}. Run "npm run build" from the project root first.`);
}
const html = fs.readFileSync(roleHtml, 'utf8');
if (!html.includes('<div id="root"></div>') && !html.includes("id=\"root\"")) {
  console.warn(`Warning: ${role}.html does not contain the expected React root marker; inspect the generated HTML.`);
}
fs.copyFileSync(roleHtml, indexHtml);
const config = `capacitor.${role}.config.ts`;
if (!fs.existsSync(path.join(root, config))) {
  throw new Error(`Missing Capacitor config: ${config}`);
}
console.log(`Project root: ${root}`);
console.log(`Role HTML: ${roleHtml}`);
console.log(`Prepared entry: ${indexHtml}`);
console.log(`Syncing Android assets using ${config}...`);
// The Capacitor CLI has no --config flag; swap the role config into capacitor.config.ts for the sync.
const defaultConfig = path.join(root, 'capacitor.config.ts');
const original = fs.existsSync(defaultConfig) ? fs.readFileSync(defaultConfig) : null;
fs.copyFileSync(path.join(root, config), defaultConfig);
try {
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['cap', 'sync', 'android'], {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
} finally {
  if (original) fs.writeFileSync(defaultConfig, original);
}
const androidIndex = path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public', 'index.html');
if (!fs.existsSync(androidIndex)) throw new Error(`Capacitor sync did not create ${androidIndex}`);
const synced = fs.readFileSync(androidIndex, 'utf8');
if (!synced.includes('assets/')) {
  console.warn('Warning: synced index.html does not visibly reference generated assets; inspect the Vite output and Capacitor webDir.');
}
console.log(`Android entry synced: ${androidIndex}`);
