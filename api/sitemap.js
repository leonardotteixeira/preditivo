/**
 * Vercel Serverless Function — /sitemap.xml
 *
 * Generates a dynamic XML sitemap with all open markets + static pages.
 */

const API = 'https://preditivo-backend-production.up.railway.app';
const SITE = 'https://futoro.com.br';

module.exports = async (req, res) => {
  let markets = [];

  try {
    const r = await fetch(`${API}/markets?limit=100&offset=0`);
    if (r.ok) {
      const data = await r.json();
      markets = Array.isArray(data) ? data : (data.markets || []);
    }
  } catch (_) {}

  // Fetch more pages if needed (up to 500 markets total)
  if (markets.length === 100) {
    try {
      const r2 = await fetch(`${API}/markets?limit=100&offset=100`);
      if (r2.ok) {
        const data2 = await r2.json();
        const page2 = Array.isArray(data2) ? data2 : (data2.markets || []);
        markets = markets.concat(page2);
      }
    } catch (_) {}
  }

  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE}/ranking`, priority: '0.6', changefreq: 'daily' },
  ];

  const marketUrls = markets
    .filter(m => m.slug && m.status === 'open')
    .map(m => {
      const lastmod = m.updated_at
        ? new Date(m.updated_at).toISOString().split('T')[0]
        : today;
      return `  <url>
    <loc>${SITE}/mercado/${encodeURIComponent(m.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

  const staticUrls = staticPages.map(p => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('\n')}
${marketUrls.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
};
