import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const p = path.join(root, 'admin.html');
let h = fs.readFileSync(p, 'utf8');

h = h.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^>]+>\r?\n<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js@4\.4\.0\/dist\/chart\.umd\.min\.js"><\/script>\r?\n<style>[\s\S]*?<\/style>/,
  `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>`
);

h = h.replace('<body>', `<body class="admin-page min-h-screen bg-bubuya-void text-zinc-100 antialiased">
<a href="#dashboard" class="skip-link">Ir para o painel</a>
`);

h = h.replace(/class="section active"/g, 'class="admin-panel active"');
h = h.replace(/class="section"/g, 'class="admin-panel"');
h = h.replace(/class="section-title"/g, 'class="admin-section-title"');
h = h.replace(/class="section-title /g, 'class="admin-section-title ');

h = h.replace(
  /document\.querySelectorAll\('\.section'\)/g,
  "document.querySelectorAll('.admin-panel')"
);

h = h.replace(
  /html \+= '<div class="section-title"/g,
  `html += '<div class="admin-section-title"`
);

h = h.replace(
  /function showToast\(msg\) \{\s*var t = document\.getElementById\('toast'\);\s*t\.textContent = msg;\s*t\.classList\.add\('show'\);\s*setTimeout\(function\(\)\{ t\.classList\.remove\('show'\); \}, 3000\);\s*\}/,
  `function showToast(msg) {
  var el = document.getElementById('toastMsg');
  if (!el) return;
  el.textContent = msg;
  document.getElementById('toast').classList.add('show');
  setTimeout(function(){ document.getElementById('toast').classList.remove('show'); }, 3000);
}`
);

h = h.replace(
  /<div id="toast" class="toast"><\/div>/,
  `<div id="toast" class="toast" role="status" aria-live="polite">
  <span class="font-mono text-zinc-500" aria-hidden="true">•</span>
  <span id="toastMsg" class="text-sm text-zinc-200"></span>
</div>`
);

h = h.replace(/src="\.\/config\.js[^"]*"/, 'src="/config.js"');
h = h.replace(/src="\.\/security\.js[^"]*"/, 'src="/security.js?v=20260322"');
h = h.replace(
  /src="\.\/admin-enhancements\.js[^"]*"/,
  'src="/admin-enhancements.js?v=20260317"'
);

h = h.replace(
  /<script type="module" src="\/src\/styles-only\.js"><\/script>/,
  '<script type="module" src="/src/admin.js"></script>'
);

fs.writeFileSync(p, h);
console.log('patched admin.html');
