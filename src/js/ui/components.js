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

// Repair Portuguese mojibake where U+FFFD (and similar) replace special chars.
// Process pairs (♦♦) before singles to preserve word context.
function fixEncoding(str) {
  if (!str) return str;
  // S matches any common encoding-artifact "diamond" character
  const S = '[\uFFFD\u2666\u25C6\u25CA\u25C7\u22C4\u2662]';
  const hasSuspect = new RegExp(S);
  if (!hasSuspect.test(str)) return str;
  return str
    // ordinal indicator after digit: "2♦" → "2º"
    .replace(new RegExp('(\\d)' + S, 'g'), '$1\u00ba')
    // specific double-artifact word patterns (must come before generic ♦♦ rule)
    .replace(new RegExp('ei' + S + S + 'es', 'g'), 'ei\u00e7\u00f5es')   // eleições
    .replace(new RegExp('ei' + S + S + 'o', 'g'),  'ei\u00e7\u00e3o')    // eleição
    .replace(new RegExp('ca' + S + S + 'o', 'g'),  'ca\u00e7\u00e3o')    // ação/aplicação
    .replace(new RegExp('ma' + S + S + 'o', 'g'),  'ma\u00e7\u00e3o')    // manifestação
    .replace(new RegExp('na' + S + S + 'o', 'g'),  'na\u00e7\u00e3o')    // nação
    .replace(new RegExp('iza' + S + S + 'o', 'g'), 'iza\u00e7\u00e3o')   // privatização
    .replace(new RegExp('olu' + S + S + 'o', 'g'), 'olu\u00e7\u00e3o')   // resolução
    .replace(new RegExp('osi' + S + S + 'o', 'g'), 'osi\u00e7\u00e3o')   // posição
    // generic double: "♦♦es" → "ões", "♦♦o" → "ão", "♦♦" → "çõ"
    .replace(new RegExp(S + S + 'es', 'g'), '\u00f5es')
    .replace(new RegExp(S + S + 'o',  'g'), '\u00e3o')
    .replace(new RegExp(S + S, 'g'), '\u00e7\u00f5')
    // single artifact → ã (most common single special char in PT)
    .replace(new RegExp(S, 'g'), '\u00e3');
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
  const href = m.slug
    ? '/mercado/' + encodeURIComponent(m.slug)
    : '/market.html?id=' + encodeURIComponent(m.id);

  return `
    <a href="${href}" class="mcard ${catClass}" data-market-id="${id}" style="text-decoration:none;color:inherit;display:block">
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
    </a>`;
}

export function emptyMarketsHtml(isSearching) {
  const msg = isSearching ? 'Nenhum mercado encontrado' : 'Nenhum mercado ativo';
  const sub = isSearching ? 'Tente outra categoria ou ajuste a busca.' : 'Novos mercados em breve.';
  return `<div class="mcard-empty"><p style="color:var(--t2);font-weight:600;margin-bottom:4px">${msg}</p><p>${sub}</p></div>`;
}
