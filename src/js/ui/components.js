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

// Repair common Portuguese mojibake: ♦ (U+2666) replacing special chars
function fixEncoding(str) {
  if (!str || !str.includes('\u2666')) return str;
  return str
    // ordinal indicator after digit: "2♦ " → "2º "
    .replace(/(\d)\u2666(\s)/g, '$1\u00ba$2')
    .replace(/(\d)\u2666$/g, '$1\u00ba')
    // common -ção/-ções endings
    .replace(/ei\u2666\u2666es/g, 'eições')
    .replace(/ei\u2666\u2666o\b/g, 'eição')
    .replace(/a\u2666\u2666es/g, 'ações')
    .replace(/a\u2666\u2666o\b/g, 'ação')
    .replace(/iza\u2666\u2666o/g, 'ização')
    .replace(/olu\u2666\u2666o/g, 'olução')
    .replace(/osi\u2666\u2666o/g, 'osição')
    .replace(/\u2666\u2666es\b/g, 'ões')
    .replace(/\u2666\u2666o\b/g, 'ão')
    .replace(/\u2666\u2666/g, 'çõ')
    // single ♦ — most common single missing char is ã
    .replace(/\u2666/g, 'ã');
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

const CAT_CLASS = { politica: 'cat-p', economia: 'cat-e', futebol: 'cat-s', esportes: 'cat-s', tech: 'cat-t' };
const CAT_LABEL = { politica: 'Política', economia: 'Economia', futebol: 'Esportes', esportes: 'Esportes', tech: 'Tecnologia', geral: 'Geral' };

/**
 * Card de mercado — design system 2026 (.mcard)
 */
export function buildMarketCard(m) {
  const total = (parseFloat(m.q_yes) + parseFloat(m.q_no)) || 100;
  const yes = Math.round((parseFloat(m.q_yes) / total) * 100);
  const no  = 100 - yes;
  const cat = (m.category || 'geral').toLowerCase();
  const catClass = CAT_CLASS[cat] || '';
  const catLabel = escapeHtml(CAT_LABEL[cat] || (m.category || 'Geral'));
  const title = escapeHtml(fixEncoding(m.title));
  const vol = (parseFloat(m.volume) || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  const id  = escapeHtml(m.id);
  const q   = encodeURIComponent(m.id);

  return `
    <article class="mcard ${catClass}" data-market-id="${id}" onclick="window.location.href='market.html?id=${q}'" role="button" tabindex="0">
      <div class="mcard-cat">${catLabel}</div>
      <div class="mcard-q">${title}</div>
      <div class="mcard-bar">
        <div class="mcard-bar-y" style="width:${yes}%"></div>
        <div class="mcard-bar-n"></div>
      </div>
      <div class="mcard-footer">
        <div class="mcard-vol">Vol <span>R$${vol}</span></div>
        <div class="mcard-badges">
          <span class="badge badge-y">${yes}%</span>
          <span class="badge badge-n">${no}%</span>
        </div>
      </div>
    </article>`;
}

export function emptyMarketsHtml(isSearching) {
  const msg = isSearching ? 'Nenhum mercado encontrado' : 'Nenhum mercado ativo';
  const sub = isSearching ? 'Tente outra categoria ou ajuste a busca.' : 'Novos mercados em breve.';
  return `<div class="mcard-empty"><p style="color:var(--t2);font-weight:600;margin-bottom:4px">${msg}</p><p>${sub}</p></div>`;
}
