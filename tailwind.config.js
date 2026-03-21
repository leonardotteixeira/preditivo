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
          void: '#09090b',
          surface: '#18181b',
          raised: '#1f1f23',
          border: '#27272a',
          line: '#3f3f46',
          muted: '#a1a1aa',
          subtle: '#71717a',
          accent: '#5b9bd5',
          positive: '#16a34a',
          negative: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 1px 2px rgba(0,0,0,0.45)',
        lift: '0 4px 12px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        inherit: 'inherit'
      }
    }
  },
  plugins: []
};
