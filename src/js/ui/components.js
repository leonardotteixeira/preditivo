/**
 * Componentes reutilizáveis — classes Tailwind + HTML semântico para cards de mercado.
 */

export function escapeHtml(str) {
  if (str == null) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Barra de probabilidade (SIM / NÃO) — visual tipo dashboard.
 */
export function probabilityBarHtml(yesPct) {
  const no = 100 - yesPct;
  return `
    <div class="mc-sentiment" role="img" aria-label="Probabilidade implícita: ${yesPct}% sim, ${no}% não">
      <div class="mc-sentiment-yes" style="width:${yesPct}%"></div>
      <div class="mc-sentiment-no" style="width:${no}%"></div>
    </div>`;
}

/**
 * Card de mercado na listagem — <article> com dados escapados.
 */
export function buildMarketCard(m, catColors) {
  const total = (parseFloat(m.q_yes) + parseFloat(m.q_no)) || 100;
  const yes = Math.round((parseFloat(m.q_yes) / total) * 100);
  const cat = (m.category || 'Geral').toLowerCase();
  const accent = catColors[cat] || catColors.geral || '#71717a';
  const title = escapeHtml(m.title);
  const category = escapeHtml(m.category || 'Geral');
  const vol = (parseFloat(m.volume) || 0).toLocaleString('pt-BR');
  const id = escapeHtml(m.id);

  const q = encodeURIComponent(m.id);
  return `
    <article class="market-card" style="border-left:3px solid ${accent}" data-market-id="${id}" onclick="window.location.href='market.html?id=${q}'">
      <div>
        <p class="mc-category">${category}</p>
        <h3 class="mc-title">${title}</h3>
      </div>
      ${probabilityBarHtml(yes)}
      <div class="mc-footer">
        <p class="mc-stat">Volume <strong>R$${vol}</strong></p>
        <div class="mc-odds" aria-label="Cotações">
          <span class="mc-odd yes">${yes}%</span>
          <span class="mc-odd no">${100 - yes}%</span>
        </div>
      </div>
    </article>`;
}

export function emptyMarketsHtml(isSearching) {
  if (isSearching) {
    return `
      <div class="col-span-full rounded-lg border border-bubuya-line bg-bubuya-surface px-6 py-16 text-center">
        <p class="mb-1 text-sm font-semibold text-zinc-200">Nenhum mercado encontrado</p>
        <p class="text-sm text-zinc-500">Tente outra categoria ou ajuste a busca.</p>
      </div>`;
  }
  return `
    <div class="col-span-full rounded-lg border border-bubuya-line bg-bubuya-surface px-6 py-16 text-center">
      <p class="mb-1 text-sm font-semibold text-zinc-200">Nenhum mercado ativo</p>
      <p class="text-sm text-zinc-500">Novos mercados em breve.</p>
    </div>`;
}
