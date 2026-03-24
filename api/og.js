/**
 * Vercel Serverless Function — /api/og?id=MARKET_ID or /api/og?slug=SLUG
 *
 * Returns a lightweight HTML page with Open Graph / Twitter Card meta tags
 * populated from real market data. Bots (WhatsApp, Twitter, Telegram, etc.)
 * read the meta tags and stop. Real browsers are redirected instantly to
 * the full market page.
 */

const API = 'https://preditivo-backend-production.up.railway.app';
const SITE = 'https://futoro.com.br';
const DEFAULT_IMAGE = `${SITE}/icons/icon-512.png`;

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmt(n) {
  return parseFloat(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

module.exports = async (req, res) => {
  const id   = req.query.id;
  const slug = req.query.slug;

  if (!id && !slug) {
    res.setHeader('Location', '/');
    return res.status(302).end();
  }

  let market = null;
  let endpoint = id
    ? `${API}/markets/${encodeURIComponent(id)}`
    : `${API}/markets/by-slug/${encodeURIComponent(slug)}`;

  try {
    const r = await fetch(endpoint);
    if (r.ok) market = await r.json();
  } catch (_) {}

  // Build the redirect target for real browsers
  let target;
  if (market && !market.error) {
    // Prefer pretty slug URL for the redirect
    const marketSlug = market.slug || null;
    target = marketSlug
      ? `/market.html?slug=${encodeURIComponent(marketSlug)}`
      : `/market.html?id=${encodeURIComponent(market.id || id)}`;
  } else {
    target = id
      ? `/market.html?id=${encodeURIComponent(id)}`
      : `/market.html?slug=${encodeURIComponent(slug)}`;
  }

  if (!market || market.error) {
    res.setHeader('Location', target);
    return res.status(302).end();
  }

  const total   = (parseFloat(market.q_yes) + parseFloat(market.q_no)) || 100;
  const probYes = Math.round((parseFloat(market.q_yes) / total) * 100);
  const probNo  = 100 - probYes;
  const volume  = Math.max(0, total - 200);
  const title   = esc(market.title);
  const desc    = `SIM ${probYes}% · NÃO ${probNo}% · Volume R$${fmt(volume)} — Opere agora na Futoro`;
  const image   = market.image_url ? esc(market.image_url) : DEFAULT_IMAGE;
  // Canonical URL uses slug if available
  const canonicalPath = market.slug
    ? `/mercado/${encodeURIComponent(market.slug)}`
    : `/m/${encodeURIComponent(market.id || id)}`;
  const url = `${SITE}${canonicalPath}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
  res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${title} — Futoro</title>

<!-- Open Graph (WhatsApp, Facebook, Telegram) -->
<meta property="og:type"        content="website">
<meta property="og:site_name"   content="Futoro">
<meta property="og:url"         content="${url}">
<meta property="og:title"       content="${title}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image"       content="${image}">
<meta property="og:image:width"  content="512">
<meta property="og:image:height" content="512">
<meta property="og:locale"      content="pt_BR">

<!-- Twitter Card (X) -->
<meta name="twitter:card"        content="summary">
<meta name="twitter:site"        content="@futoro_br">
<meta name="twitter:title"       content="${title}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image"       content="${image}">

<!-- Canonical + redirect -->
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<script>window.location.replace('${target}');</script>
<p><a href="${target}">Ver mercado: ${title}</a></p>
</body>
</html>`);
};
