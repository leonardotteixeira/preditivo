import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/* ── market.html ── */
let market = fs.readFileSync(path.join(root, 'market.html'), 'utf8');

market = market.replace(
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js@4\.4\.0\/dist\/chart\.umd\.min\.js"><\/script>\r?\n<style>[\s\S]*?<\/style>/,
  `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>`
);

market = market.replace(
  /<body>\s*\n\n<div class="glow-container"[\s\S]*?<\/div>\s*\n\n<header>/,
  `<body class="min-h-screen bg-bubuya-void text-zinc-100 antialiased">
<a href="#pageContent" class="skip-link">Ir para o conteúdo</a>

<header>`
);

market = market.replace(
  /<div class="modal-overlay" id="loginModal">[\s\S]*?<\/div>\s*\n<\/div>\s*\n\n<div class="toast"/,
  `<div class="modal-overlay" id="loginModal">
  <div class="modal">
    <h3 class="modal-title">Entrar</h3>
    <p class="modal-sub">Acesse sua conta para apostar</p>
    <input class="modal-input" type="email" placeholder="Email" id="loginEmail"
      onkeydown="if(event.key==='Enter')document.getElementById('loginPass').focus()">
    <input class="modal-input" type="password" placeholder="Senha" id="loginPass"
      onkeydown="if(event.key==='Enter')doLogin()">
    <button type="button" class="btn-primary w-full justify-center" onclick="doLogin()">Acessar Conta</button>
    <button type="button" class="btn-outline mt-3 w-full justify-center" onclick="closeModal('loginModal')">Cancelar</button>
    <p class="mt-4 text-center text-sm text-zinc-500">
      <a href="/?forgot=1" class="text-zinc-500 underline hover:text-zinc-300">Esqueceu a senha?</a>
    </p>
  </div>
</div>

<div class="toast"`
);

market = market.replace(
  /<div class="toast" id="toast"><\/div>/,
  `<div class="toast" id="toast" role="status" aria-live="polite">
  <span class="font-mono text-zinc-500" aria-hidden="true">•</span>
  <span id="toastMsg" class="text-sm text-zinc-200"></span>
</div>`
);

market = market.replace(
  /function showToast\(msg\) \{\s*var t = document\.getElementById\('toast'\);\s*t\.textContent = msg;/,
  `function showToast(msg) {
  var t = document.getElementById('toastMsg');
  if (!t) return;
  t.textContent = msg;`
);

market = market.replace(
  /t\.classList\.add\('show'\);\s*setTimeout\(function\(\)\{ t\.classList\.remove\('show'\); \}, 3200\);/,
  `document.getElementById('toast').classList.add('show');
  setTimeout(function(){ document.getElementById('toast').classList.remove('show'); }, 3200);`
);

market = market.replace(
  /font-family:DM Mono,monospace/g,
  'font-family:IBM Plex Mono,ui-monospace,monospace'
);

market = market.replace(
  /class="btn-secondary" onclick="closeModal\('aboutModal'\)"/g,
  'type="button" class="btn-outline mt-4 w-full justify-center" onclick="closeModal(\'aboutModal\')"'
);
market = market.replace(
  /class="btn-secondary" onclick="closeModal\('howToBetModal'\)"/g,
  'type="button" class="btn-outline mt-4 w-full justify-center" onclick="closeModal(\'howToBetModal\')"'
);

market = market.replace(/src="\.\/config\.js"/, 'src="/config.js"');
market = market.replace(
  /src="\.\/security\.js\?v=20260322"/,
  'src="/security.js?v=20260322"'
);
market = market.replace(
  /<script type="module" src="\/src\/styles-only\.js"><\/script>/,
  '<script type="module" src="/src/market.js"></script>'
);

fs.writeFileSync(path.join(root, 'market.html'), market);
console.log('patched market.html');

/* ── profile.html ── */
let profile = fs.readFileSync(path.join(root, 'profile.html'), 'utf8');

profile = profile.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Space\+Grotesk[^>]+>/,
  `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">`
);

profile = profile.replace(/<style>[\s\S]*?<\/style>\r?\n<\/head>/, '</head>');

profile = profile.replace(
  /<body>\s*\n\n<!-- Fundo glow[\s\S]*?<\/div>\s*\n\n<header>/,
  `<body class="profile-page min-h-screen bg-bubuya-void text-zinc-100 antialiased">
<a href="#pageContent" class="skip-link">Ir para o conteúdo</a>

<header>`
);

profile = profile.replace(
  /<div class="modal-overlay" id="loginModal">[\s\S]*?<\/div>\s*\n<\/div>\s*\n\n<div class="toast"/,
  `<div class="modal-overlay" id="loginModal">
  <div class="modal">
    <div id="loginStep1">
      <h3 class="modal-title">Entrar na Bubuya</h3>
      <p class="modal-sub">Acesse sua conta para ver o perfil</p>
      <input class="modal-input" type="email" placeholder="Email" id="loginEmail">
      <input class="modal-input" type="password" placeholder="Senha" id="loginPass" onkeydown="if(event.key==='Enter')doLogin()">
      <button type="button" class="btn-primary w-full justify-center" onclick="doLogin()">Entrar</button>
      <button type="button" class="btn-outline mt-3 w-full justify-center" onclick="window.location.href='/'">Voltar ao início</button>
    </div>
    <div id="loginStep2" style="display:none">
      <h3 class="modal-title">Verificação em 2 etapas</h3>
      <p class="modal-sub">Código enviado para seu email.</p>
      <input class="modal-input" type="text" placeholder="Código de 6 dígitos" id="login2faCode" maxlength="6" inputmode="numeric" autocomplete="one-time-code" onkeydown="if(event.key==='Enter')doLogin2fa()">
      <button type="button" class="btn-primary w-full justify-center" onclick="doLogin2fa()">Verificar</button>
      <button type="button" class="btn-outline mt-3 w-full justify-center" onclick="document.getElementById('loginStep1').style.display='';document.getElementById('loginStep2').style.display='none'">← Voltar</button>
    </div>
  </div>
</div>

<div class="toast"`
);

profile = profile.replace(
  /<div class="toast" id="toast"><\/div>/,
  `<div class="toast" id="toast" role="status" aria-live="polite">
  <span class="font-mono text-zinc-500" aria-hidden="true">•</span>
  <span id="toastMsg" class="text-sm text-zinc-200"></span>
</div>`
);

profile = profile.replace(
  /function showToast\(msg\) \{\s*var t = document\.getElementById\('toast'\);\s*t\.textContent = msg;/,
  `function showToast(msg) {
  var t = document.getElementById('toastMsg');
  if (!t) return;
  t.textContent = msg;`
);
profile = profile.replace(
  /t\.classList\.add\('show'\);\s*setTimeout\(function\(\)\{ t\.classList\.remove\('show'\); \}, 3200\);/,
  `document.getElementById('toast').classList.add('show');
  setTimeout(function(){ document.getElementById('toast').classList.remove('show'); }, 3200);`
);

profile = profile.replace(/src="\.\/config\.js[^"]*"/, 'src="/config.js"');
profile = profile.replace(
  /src="\.\/security\.js\?v=20260322"/,
  'src="/security.js?v=20260322"'
);
profile = profile.replace(
  /<script type="module" src="\/src\/styles-only\.js"><\/script>/,
  '<script type="module" src="/src/profile.js"></script>'
);

fs.writeFileSync(path.join(root, 'profile.html'), profile);
console.log('patched profile.html');
