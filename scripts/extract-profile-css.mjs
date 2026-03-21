import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'profile.html'), 'utf8');
const m = html.match(/<style>\r?\n([\s\S]*?)\r?\n<\/style>/);
if (!m) throw new Error('no style block in profile.html');
let css = m[1];

css = css.replace(/\*\{margin:0;padding:0;box-sizing:border-box\}\r?\n/, '');

css = css.replace(
  /:root\{[^}]+\}\r?\n/,
  `:root {
  --gold: #d97706;
  --green-dim: rgba(22, 163, 74, 0.12);
}

`
);

css = css.replace(/body\{[^}]+\}\r?\n/, '');
css = css.replace(/\/\* Noise[\s\S]*?\.glow-2\{[^}]+\}\r?\n/, '');

css = css.replace(
  /\/\* ── HEADER ── \*\/\r?\nheader\{[\s\S]*?\.btn-withdraw:hover\{[^}]+\}\r?\n/,
  `/* Profile: nav always visible (overrides index mobile-hide) */
body.profile-page nav {
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-left: 0.75rem;
}

`
);

css = css.replace(/\/\* ── MODAL ── \*\/[\s\S]*?\.toast\.show\{[^}]+\}\r?\n\r?\n/, '');
css = css.replace(/\/\* ── FOOTER ── \*\/[\s\S]*?(?=\/\* ── REFERRAL)/, '');

css = css.replace(/'DM Mono',monospace/g, "'IBM Plex Mono', ui-monospace, monospace");
css = css.replace(/'Space Grotesk',sans-serif/g, 'inherit');

const outDir = path.join(root, 'src/styles/pages');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'profile.css'), '/* Profile — after app.css */\n' + css);
console.log('Wrote profile.css', fs.statSync(path.join(outDir, 'profile.css')).size, 'bytes');
