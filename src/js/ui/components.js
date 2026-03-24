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

// Repair Portuguese mojibake: any "suspect" non-Latin character replacing special chars.
// Covers U+2666 ♦, U+FFFD ?, U+25C6 ◆, U+25CA ◊ and similar encoding artifacts.
const _SUSPECT = /[\u2666\uFFFD\u25C6\u25CA\u25C7\u22C4\u2662\u25A0\u25AA\u2022]/g;
function fixEncoding(str) {
  if (!str) return str;
  _SUSPECT.lastIndex = 0;
  if (!_SUSPECT.test(str)) return str;
  _SUSPECT.lastIndex = 0;
  return str.replace(_SUSPECT, function(ch, pos, s) {
    const prev = s.slice(Math.max(0, pos - 4), pos);
    const next = s.slice(pos + 1, pos + 6);
    const nextCh = next.charAt(0);

    // After digit → ordinal indicator º
    if (/\d$/.test(prev)) return 'º';

    // Previous suspect char just before: double-artifact → handle pair
    // Detect context for common word endings:
    if (/ei$/.test(prev) && _SUSPECT.test(nextCh)) return 'ç'; // eleições (first of ♦♦)
    if (/[çÇ]$/.test(prev)) return 'õ'; // second char of ç+õ pair
    if (/ei$/.test(prev)) return 'ç';
    if (/a$/.test(prev) && /^[oe]/.test(next)) return 'ç'; // ação/ações
    if (/uni$/.test(prev)) return 'ã'; // União
    if (/m$/.test(prev)) return 'ã'; // manifestação
    if (/nci$/.test(prev)) return 'a'; // financiação fallback

    // Generic: most common single-char artifact in PT is ã
    return 'ã';
  });
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
