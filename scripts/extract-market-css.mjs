import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'market.html'), 'utf8');
const m = html.match(/<style>\r?\n([\s\S]*?)\r?\n<\/style>/);
if (!m) throw new Error('no style block in market.html');
let css = m[1];

css = css.replace(/\* \{ margin:0[^}]+\}\r?\n/, '');

css = css.replace(
  /:root \{[\s\S]*?^}\r?\n/m,
  `:root {
  --gold: #d97706;
  --green-dim: rgba(22, 163, 74, 0.12);
  --red-dim: rgba(220, 38, 38, 0.12);
}

`
);

css = css.replace(/\nbody \{[\s\S]*?^}\r?\n/m, '\n');
css = css.replace(/\n\/\* Noise[\s\S]*?^\.glow-4 \{[^}]+\}\r?\n/m, '\n');

css = css.replace(
  /\/\* HEADER \*\/\r?\nheader \{[\s\S]*?\.header-right \{[^}]+\}\r?\n/,
  '/* Header shell from app.css; market-specific controls below */\n'
);

css = css.replace(/\/\* MODAL \*\/[\s\S]*?\.toast\.show \{[^}]+\}\r?\n\r?\n/, '');
css = css.replace(/\/\* FOOTER \*\/[\s\S]*$/, '');
css = css.replace(/\r?\n  \/\* Footer \*\/\r?\n  footer \{[^}]+\}\r?\n/, '\n');

css = css.replace(/'DM Mono', monospace/g, "'IBM Plex Mono', ui-monospace, monospace");
css = css.replace(/'Inter', sans-serif/g, 'inherit');
css = css.replace(/font-family:Inter,sans-serif/g, 'font-family:inherit');

css = css.replace(/top: 92px/, 'top: 5.5rem');

const outDir = path.join(root, 'src/styles/pages');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'market.css'), '/* Market detail — after app.css */\n' + css);
console.log('Wrote market.css', fs.statSync(path.join(outDir, 'market.css')).size, 'bytes');
