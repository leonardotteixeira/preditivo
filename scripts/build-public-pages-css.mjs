/**
 * Extrai <style> de terms.html e gera public-pages.css com seletores prefixados .public-root
 * e .public-head, para conviver com app.css (.section = hidden na home).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const termsPath = path.join(root, 'terms.html');
const html = fs.readFileSync(termsPath, 'utf8');
const m = html.match(/<style>\r?\n([\s\S]*?)\r?\n<\/style>/);
if (!m) throw new Error('no style in terms.html');

let css = m[1];

// Remove layout that we replace (glow, bare header, footer in bundle — use app footer)
css = css.replace(/\s*\/\* GLOW[\s\S]*?\.glow-4 \{[^}]+\}\r?\n/, '\n');
css = css.replace(/\s*\/\* HEADER \*\/[\s\S]*?\.back-btn:hover \{[^}]+\}\r?\n/, '\n');
css = css.replace(/\s*\/\* LAYOUT \*\/\r?\n  \.page \{[^}]+\}\r?\n/, '\n');

// Remove footer block from extracted slice (we use index footer + app.css)
css = css.replace(/\s*\/\* FOOTER \*\/[\s\S]*?\.footer-disclaimer \{[^}]+\}\r?\n/, '\n');

// Prefix remaining rules (single class or compound at start of line)
const lines = css.split(/\n/);
const out = [];
const skipPrefixes = ['@media', '@keyframes', '  }', '  .', '    ', '}'];

function shouldPrefix(line) {
  const t = line.trim();
  if (!t || t.startsWith('/*')) return false;
  if (t.startsWith('@')) return false;
  if (t === '}') return false;
  // selector lines typically start with two spaces + dot
  return /^\s+\.[a-zA-Z]/.test(line);
}

let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (line.trim().startsWith('@media')) {
    out.push(line);
    i++;
    while (i < lines.length && lines[i].trim() !== '}') {
      const inner = lines[i];
      if (shouldPrefix(inner)) {
        const prefixed = inner.replace(/^(\s+)(\.)/, '$1.public-root $2');
        out.push(prefixed);
      } else {
        out.push(inner);
      }
      i++;
    }
    if (i < lines.length) out.push(lines[i]);
    i++;
    continue;
  }
  if (shouldPrefix(line)) {
    out.push(line.replace(/^(\s+)(\.)/, '$1.public-root $2'));
  } else {
    out.push(line);
  }
  i++;
}

css = out.join('\n');

const headerCss = `
/* Páginas institucionais / legais — use com <div class="public-root"> ao redor do conteúdo */
.public-root .section,
.public-root .section.active {
  display: block !important;
  visibility: visible !important;
}

.public-head {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4rem;
  padding: 0 1.25rem;
  border-bottom: 1px solid var(--border);
  background: rgba(24, 24, 27, 0.92);
  backdrop-filter: blur(8px);
}
.public-head-brand {
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  text-decoration: none;
}
.public-head-brand:hover {
  color: #fafafa;
}
.public-head-back {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  border: 1px solid var(--border);
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  transition: border-color 0.2s, color 0.2s;
}
.public-head-back:hover {
  color: var(--text);
  border-color: #52525b;
}

.public-root .page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 5rem;
}
`;

css = headerCss + '\n' + css;

css = css.replace(/'DM Mono'/g, "'IBM Plex Mono', ui-monospace, monospace");
css = css.replace(/'Space Grotesk'/g, 'inherit');
css = css.replace(/font-family:'Space Grotesk', sans-serif/g, 'font-family: inherit');

const outPath = path.join(root, 'src/styles/pages/public-pages.css');
fs.writeFileSync(
  outPath,
  `/* Auto-built from terms.html + header; scope .public-root — run: node scripts/build-public-pages-css.mjs */\n${css}\n`
);
console.log('Wrote', outPath, fs.statSync(outPath).size);
