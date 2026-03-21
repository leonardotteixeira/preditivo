# Bubuya — Frontend

Stack: **Vite 6** + **Tailwind CSS 3** + HTML/JS (multi-página).

## Desenvolvimento

```bash
npm install
npm run dev
```

Abre o servidor local (porta padrão Vite). A API continua em `PREDITIVO_CONFIG.API_BASE` (`public/config.js`).

## Build de produção

```bash
npm run build
```

Saída em `dist/`. Na Vercel, `vercel.json` já aponta `outputDirectory` para `dist`.

## Design system

- Tokens e componentes visuais: `src/styles/app.css` (`@layer` base/components).
- Componentes JS reutilizáveis (card de mercado, barra de probabilidade): `src/js/ui/components.js`.
- Entrada Tailwind só CSS: `src/styles-only.js` (páginas secundárias).
- Home (lógica + `BubuyaComponents`): `src/main.js`.

## Assets estáticos

Arquivos em `public/` são copiados para a raiz do `dist/` (`/config.js`, `/security.js`, `manifest.json`, etc.).
