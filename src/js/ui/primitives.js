/**
 * Classes Tailwind reutilizáveis (padrão institucional).
 * Use em templates ou ao montar DOM com className.
 */

export const btnPrimary =
  'inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bubuya-accent';

export const btnSecondary =
  'inline-flex items-center justify-center rounded-md border border-bubuya-line bg-transparent px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-bubuya-raised';

export const btnPositive =
  'inline-flex items-center justify-center rounded-md border border-emerald-900/40 bg-emerald-950/25 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-950/40';

export const btnDanger =
  'inline-flex items-center justify-center rounded-md border border-rose-900/40 bg-rose-950/20 px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-950/35';

export const cardShell =
  'rounded-lg border border-bubuya-line bg-bubuya-surface p-5 shadow-panel';

export const badgeNeutral =
  'inline-flex items-center rounded border border-bubuya-line bg-bubuya-void px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500';

export const badgePositive =
  'inline-flex items-center rounded border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400';

export const badgeNegative =
  'inline-flex items-center rounded border border-rose-900/50 bg-rose-950/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-400';

/** Container de barra de progresso (use fill interno com width %) */
export const progressTrack =
  'flex h-2 overflow-hidden rounded-sm border border-bubuya-line bg-bubuya-void';

export const progressFillYes = 'h-full bg-emerald-600 transition-[width] duration-500 ease-out';

export const progressFillNo = 'h-full bg-rose-700 transition-[width] duration-500 ease-out';
