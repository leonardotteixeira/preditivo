/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './market.html',
    './profile.html',
    './kyc.html',
    './suitability.html',
    './admin.html',
    './about.html',
    './how-it-works.html',
    './terms.html',
    './privacidade.html',
    './protecao-investidor.html',
    './offline.html',
    './src/**/*.{js,html}'
  ],
  theme: {
    extend: {
      colors: {
        bubuya: {
          void:     '#080c14',   /* deep navy-black — replaces zinc-950 */
          surface:  '#0d1221',   /* card background  */
          raised:   '#121929',   /* hover / elevated state */
          border:   '#1a2538',   /* subtle blue-tinted border */
          line:     '#1e2d42',   /* dividers */
          muted:    '#94a3b8',   /* secondary text (slate-400) */
          subtle:   '#64748b',   /* tertiary text (slate-500) */
          accent:   '#60a5fa',   /* blue-400 — focus rings & highlights */
          positive: '#16a34a',
          negative: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 1px 3px rgba(0,0,0,0.5)',
        lift:  '0 6px 20px rgba(0,0,0,0.45), 0 0 0 1px rgba(96,165,250,0.06) inset'
      },
      borderRadius: {
        inherit: 'inherit'
      }
    }
  },
  plugins: []
};
