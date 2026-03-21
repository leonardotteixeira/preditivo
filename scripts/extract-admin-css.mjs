import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'admin.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/<style>\r?\n([\s\S]*?)\r?\n<\/style>/);
if (!m) throw new Error('No <style> in admin.html');

let css = m[1];

css = css.replace(/\* \{ margin:0; padding:0; box-sizing:border-box; \}\r?\n/, '');

css = css.replace(
  /:root \{[\s\S]*?^}\r?\n/m,
  `:root {
  --gold: #d97706;
  --green-dim: rgba(22, 163, 74, 0.12);
  --red-dim: rgba(220, 38, 38, 0.12);
}

`
);

css = css.replace(/\.section \{/g, '.admin-panel {');
css = css.replace(/\.section\.active/g, '.admin-panel.active');
css = css.replace(/\.section-title \{/g, '.admin-section-title {');

css = css.replace(/'Inter',sans-serif/g, 'inherit');
css = css.replace(/'Inter', sans-serif/g, 'inherit');
css = css.replace(/'Space Grotesk',sans-serif/g, 'inherit');
css = css.replace(/'Space Grotesk', sans-serif/g, 'inherit');
css = css.replace(/'DM Mono',monospace/g, "'IBM Plex Mono', ui-monospace, monospace");

css = css.replace(
  /box-shadow:0 40px 120px rgba\(0,0,0,0\.8\)/,
  'box-shadow: 0 24px 64px rgba(0,0,0,0.5)'
);
css = css.replace(
  /box-shadow:0 40px 100px rgba\(0,0,0,0\.9\)/,
  'box-shadow: 0 20px 48px rgba(0,0,0,0.55)'
);
css = css.replace(
  /box-shadow:-40px 0 80px rgba\(0,0,0,0\.6\)/,
  'box-shadow: -12px 0 40px rgba(0,0,0,0.45)'
);

const outDir = path.join(root, 'src/styles/pages');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'admin.css'),
  `/* Admin dashboard — after app.css. Panels use .admin-panel (not .section) to avoid clash with home. */\n${css}`
);
console.log('Wrote admin.css', fs.statSync(path.join(outDir, 'admin.css')).size, 'bytes');
