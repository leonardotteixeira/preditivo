# CLAUDE.md — guia para agentes de IA

Frontend da Bubuya (mercados de previsão). Site multi-página em HTML + JavaScript (ES modules) + Tailwind 3, empacotado pelo Vite. **Sem framework** — não introduza React/Vue aqui sem combinar; a migração para React está no roadmap e será feita por página.

## Comandos

```bash
npm run dev       # http://localhost:5173 (precisa do backend em :3000 para dados)
npm run build     # obrigatório passar antes de commitar — a Vercel roda isso
```

## Como o código está organizado

- Cada `*.html` na raiz é uma página e um entry point em `vite.config.js`. Página nova = HTML na raiz + entrada em `rollupOptions.input` + JS em `src/`.
- `src/js/ui/components.js` e `primitives.js` renderizam cards, barras de probabilidade e botões a partir de objetos da API. **Reutilize** em vez de montar HTML na mão.
- Estilos: `src/styles/app.css` define tokens e classes de componente em `@layer`. Páginas têm CSS próprio em `src/styles/pages/`. Não use `style=""` inline — foi um refactor grande tirar isso.
- `public/config.js` expõe `window.PREDITIVO_CONFIG` (URL da API, nome do app). Nunca hardcode a URL do Railway em outro lugar.
- Auth: JWT no `localStorage`, enviado em `Authorization: Bearer`. Helpers em `src/main.js`.
- `scripts/` são utilitários de build/patch usados uma vez ou raramente; não dependa deles em runtime.

## Convenções

- Commits em português ou inglês, prefixo `feat:`, `fix:`, `build:`, `docs:`, `refactor:`.
- Textos de interface em pt-BR. Valores em BRL com `Intl.NumberFormat('pt-BR')`.
- Probabilidade sempre exibida como inteiro (`42%`), nunca com decimais.
- Encoding: todos os arquivos em UTF-8 sem BOM (já tivemos bug de `Ã©` em produção — ver `scripts/fix-index-encoding.js`).

## O que NÃO fazer

- Não commitar `dist/`, `node_modules/`, `.env*`, logs ou pastas `.tmp-*`.
- Não colocar o backend dentro deste repositório — ele vive em `preditivo-backend`.
- Não expor chaves em `public/` (tudo ali vai pro browser). A chave PIX em `config.js` é **de recebimento** e pública por natureza.
- Não mudar `security.js` sem revisar CSP no `index.html`.

## Fluxo esperado

1. Entender a página afetada e o componente em `src/js/ui/` antes de editar.
2. Mudança mínima; se tocar em estilo, usar classes do design system.
3. `npm run build` limpo. Testar no mobile (a maioria dos usuários é celular).
