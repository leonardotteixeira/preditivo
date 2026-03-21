import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const HEAD_TAIL = `</head>`;

const FONT_BLOCK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
${HEAD_TAIL}`;

const BODY_START = `<body class="min-h-screen bg-bubuya-void text-zinc-100 antialiased">
<a href="#main-doc" class="skip-link">Ir para o conteúdo</a>
<header class="public-head">
  <a href="/" class="public-head-brand">Bubuya.</a>
  <a href="/" class="public-head-back">← Voltar ao site</a>
</header>
<div class="public-root" id="main-doc">
`;

const FOOTER_HTML = `<footer>
  <div class="footer-inner">
    <div class="footer-col footer-brand">
      <p class="footer-wordmark">Bubuya.</p>
      <p class="footer-tagline">A principal plataforma brasileira de mercados de previsão.</p>
      <p class="footer-contact">
        <a href="mailto:suporte@bubuya.com.br">suporte@bubuya.com.br</a>
      </p>
    </div>
    <div class="footer-col">
      <h4>Navegar</h4>
      <ul>
        <li><a href="/">Explorar mercados</a></li>
        <li><a href="/#section-portfolio">Portfólio</a></li>
        <li><a href="/#section-ranking">Ranking</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Institucional</h4>
      <ul>
        <li><a href="/about.html">Quem somos</a></li>
        <li><a href="/how-it-works.html">Como funciona</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacidade.html">Política de privacidade</a></li>
        <li><a href="/terms.html">Termos de uso</a></li>
        <li><a href="/protecao-investidor.html">Proteção ao investidor</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-legal">
    <div class="footer-disclaimer">
      <strong>Aviso legal importante:</strong>
      A Bubuya é uma plataforma de tecnologia de mercados de previsão. Não constitui recomendação financeira. Operações envolvem risco de perda.
    </div>
    <p class="footer-copyright">&copy; 2026 Bubuya · Todos os direitos reservados.</p>
  </div>
</footer>`;

function stripOldHead(html) {
  return html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[\s\S]*?<\/style>\s*<\/head>/, FONT_BLOCK);
}

function stripGlowAndHeader(html) {
  return html.replace(
    /<body>[\s\S]*?<div class="page">/,
    `${BODY_START}<div class="page">`
  );
}

/** Insere fechamento de .public-root após o último </div> antes de <footer> */
function closePublicRootBeforeFooter(html) {
  const idx = html.lastIndexOf('<footer>');
  if (idx === -1) return html;
  let before = html.slice(0, idx);
  const after = html.slice(idx);
  before = before.replace(/[\s\r\n]+$/, '');
  if (!before.endsWith('</div>')) return html;
  const nl = html.includes('\r\n') ? '\r\n' : '\n';
  return before + nl + '</div>' + nl + nl + after;
}

function replaceFooter(html) {
  return html.replace(/<footer>[\s\S]*?<\/footer>/, FOOTER_HTML);
}

function usePublicPagesBundle(html) {
  return html.replace(
    /<script type="module" src="\/src\/styles-only\.js"><\/script>/g,
    '<script type="module" src="/src/public-pages.js"></script>'
  );
}

function patchFile(name) {
  const p = path.join(root, name);
  let html = fs.readFileSync(p, 'utf8');
  html = stripOldHead(html);
  html = stripGlowAndHeader(html);
  html = closePublicRootBeforeFooter(html);
  html = replaceFooter(html);
  html = usePublicPagesBundle(html);
  fs.writeFileSync(p, html);
  console.log('patched', name);
}

for (const f of ['terms.html', 'protecao-investidor.html', 'about.html', 'how-it-works.html']) {
  patchFile(f);
}

const priv = path.join(root, 'privacidade.html');
let ph = fs.readFileSync(priv, 'utf8');
const nlPriv = ph.includes('\r\n') ? '\r\n' : '\n';
ph = ph.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[\s\S]*?<\/style>\s*<\/head>/, FONT_BLOCK);
ph = ph.replace(
  /<body>\s*<header class="site-header">[\s\S]*?<\/header>\s*<main class="page-wrap">/,
  `${BODY_START}<main class="page-wrap">`
);
ph = ph.replace(
  /<\/main>\s*<footer class="site-footer">[\s\S]*?<\/footer>/,
  `</main>${nlPriv}</div>${nlPriv}${nlPriv}${FOOTER_HTML}`
);
ph = usePublicPagesBundle(ph);
fs.writeFileSync(priv, ph);
console.log('patched privacidade.html');
