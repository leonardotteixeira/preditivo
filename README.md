# Bubuya — Frontend

> Plataforma brasileira de **mercados de previsão** (estilo Polymarket/Kalshi): contratos SIM/NÃO sobre eventos reais, precificados por um AMM. Este repositório é a interface web; a API está em [`preditivo-backend`](https://github.com/leonardotteixeira/preditivo-backend).

[![CI](https://github.com/leonardotteixeira/preditivo/actions/workflows/ci.yml/badge.svg)](https://github.com/leonardotteixeira/preditivo/actions/workflows/ci.yml)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-offline--ready-5A0FC8)

**Status:** experimental / domínio atualmente inativo — o domínio `bubuya.com.br` não está ativo no momento. Deploy configurado na Vercel · API no Railway.

---

## O que o usuário faz aqui

- **Explora mercados** por categoria, vê a probabilidade atual (barra SIM/NÃO), volume e prazo.
- **Negocia** contratos SIM/NÃO com preço dinâmico (AMM), acompanha o order book ao vivo e o gráfico de histórico de probabilidade.
- **Deposita via PIX** (checkout InfinitePay com confirmação por webhook) e **saca via PIX** com dupla confirmação por e-mail.
- **Acompanha o perfil**: posições abertas, histórico de apostas, P&L, ranking.
- **Passa por KYC e suitability** antes de operar — páginas dedicadas com fluxo guiado.
- Lê as páginas institucionais (como funciona, termos, privacidade, proteção ao investidor) e os documentos de compliance em `docs/`.

Painel **admin** (`admin.html`): gestão de mercados, depósitos, saques, usuários, resolução de eventos e simulador de bots de liquidez.

## Decisões técnicas

| Decisão | Por quê |
|---|---|
| **Multi-página em HTML + JS moderno, sem framework** | O produto nasceu como MVP para validar demanda rápido; cada página é um entry point do Vite e carrega só o JS que precisa. Time-to-interactive baixo em celular 3G. |
| **Tailwind com design system em `@layer`** | Tokens (cores, radius, sombras) e componentes (`.btn`, `.card`, `.prob-bar`) em `src/styles/app.css`; páginas secundárias usam uma entrada "só CSS" (`src/styles-only.js`). |
| **Componentes JS reutilizáveis** | `src/js/ui/components.js` gera card de mercado, barra de probabilidade e primitives (`src/js/ui/primitives.js`) a partir de dados da API — um único lugar para mudar o visual. |
| **PWA** | `manifest.json` + `sw.js` com página `offline.html`; instalável no celular. |
| **Segurança no cliente** | `public/security.js` aplica hardening básico (CSP em meta, bloqueio de iframe); autenticação por JWT emitido pela API, com logout real via blacklist. |
| **SEO/OG dinâmico** | `api/og.js` e `api/sitemap.js` (serverless na Vercel) geram Open Graph por mercado e sitemap. |

## Arquitetura

```
Browser ──▶ Vercel (este repo: HTML/JS/CSS estáticos + funções OG/sitemap)
               │  fetch JSON (JWT no header)
               ▼
           Railway ── preditivo-backend (Express) ── PostgreSQL (Supabase)
                          │
                          ├─ InfinitePay (PIX checkout + webhook)
                          └─ Resend (e-mails transacionais)
```

A URL da API é resolvida em `public/config.js` (`localhost:3000` em dev, Railway em produção).

## Rodando localmente

```bash
git clone https://github.com/leonardotteixeira/preditivo.git
cd preditivo
npm install
npm run dev        # http://localhost:5173
```

Para ter dados, suba também o backend (`preditivo-backend`, porta 3000).

| Comando | Descrição |
|---|---|
| `npm run dev` | servidor Vite com hot reload |
| `npm run build` | build multi-página em `dist/` (é o que a Vercel roda) |
| `npm run preview` | serve o build local |
| `npm run build:public-css` | recompila o CSS das páginas institucionais |

## Estrutura

```
index.html, market.html, profile.html, kyc.html, admin.html, …   entradas (uma por página)
src/
├── main.js            home: lista de mercados, filtros, auth
├── market.js          detalhe do mercado: negociação, order book, gráfico
├── profile.js         perfil, posições, saques
├── admin.js           painel administrativo
├── js/ui/             componentes e primitives reutilizáveis
└── styles/            app.css (design system) + CSS por página
public/                config.js, security.js, manifest, service worker, ícones
api/                   funções serverless da Vercel (OG image, sitemap)
scripts/               utilitários de build (extração de CSS, patches de HTML)
docs/                  políticas de compliance (PLD/FT, proteção ao investidor)
```

## Roadmap

- Migrar as páginas de maior interação (mercado, perfil) para React + TypeScript, reaproveitando o design system.
- Testes end-to-end do fluxo de negociação com Playwright.
- Mercados com resolução automática por fonte de dados (câmeras/APIs públicas) — protótipo em andamento.

Este roadmap reflete ideias exploradas durante o desenvolvimento, não um plano de produto em execução — o projeto está parado no estágio atual.

## Status

Experimental / domínio atualmente inativo. O projeto foi desenvolvido como uma exploração de produto e tecnologia (mercados de previsão, precificação via AMM, KYC/PIX) e permanece como parte do meu portfólio. O domínio `bubuya.com.br` não está atualmente ativo.

## Licença

Código-fonte disponível para fins de portfólio. Todos os direitos reservados © Leonardo Teixeira.
