import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const role = process.argv[2];
if (!role) throw new Error('Usage: node scripts/prepare-native.mjs <customer|restaurant|delivery|admin>');
const src = path.resolve('dist', `${role}.html`);
const target = path.resolve('dist', 'index.html');
if (!fs.existsSync(src)) throw new Error(`Missing role build: ${src}`);
fs.copyFileSync(src, target);
execFileSync('npx', ['cap', 'sync', 'android'], { stdio: 'inherit', shell: process.platform === 'win32' });
