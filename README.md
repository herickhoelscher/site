# Portfólio Herick Hoelscher

Portfólio pessoal em React, no estilo fanzine punk/indie. Duas faces: o **Lado A**
(profissional) e o **Lado B** (pessoal).

> **Estado: site completo.** Lado A, as 6 páginas de projeto, o Lado B e a 404, em PT e
> EN, com as animações e os easter eggs. Falta só o material listado no fim deste arquivo.

## Rodar

```bash
npm install
npm run dev     # http://localhost:5173/
npm run build   # gera dist/ (e o sitemap)
npm run preview # serve o dist/
```

Requer Node 20+.

## Stack

| Peça | Escolha |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Rotas | React Router 7 |
| Estilo | Tailwind CSS v4 (configuração CSS-first, sem `tailwind.config.js`) |
| Animação | GSAP + ScrollTrigger |
| `<head>` por página | react-helmet-async |
| Fontes | 5 woff2 auto-hospedadas em `public/fonts/`, sem CDN |

## Estrutura

```
src/
  styles/theme.css        tokens (§2 da especificação), fontes, texturas, base
  lib/rng.ts              xorshift32 portado do zine.js
  lib/useMeasure.ts       mede border-box para o clip-path do papel rasgado
  content/pt.ts, en.ts    todo o texto, tipado — fonte única
  components/collage/     componentes portados do zine.js
  components/sections/    Hero, IssuesWall, IssueCard
  pages/                  LadoA.tsx, Kit.tsx
public/
  fonts/                  as 5 woff2 (Anton pré-carregada no index.html)
  assets/                 retrato, Mike, Missi, capas, texturas, tênis...
  prints/                 prints de projeto: [slug]-1.jpg, -2.jpg, -3.jpg
referencias/              material de origem (não entra no build)
  docs/                   ESPECIFICACAO.md e CONTEUDO.md
  prototipo/              protótipo HTML/CSS/JS + assets + fontes
  stitch/                 export do Google Stitch
  wireframes/             capturas desktop 1440 e celular 390
```

## Por que a aleatoriedade é determinística

A colagem precisa de variação (papel rasgado, fita torta, letra recortada), mas nada pode
mudar a cada render — senão a página "treme" em toda re-renderização do React.

Por isso nenhum componente usa `Math.random`. Cada um recebe uma `seed` (string) e deriva
os números dela com um PRNG próprio:

```tsx
<TornPaper seed="issue-leitor-rco" sides="trbl" amp={7}>…</TornPaper>
```

A mesma `seed` desenha sempre o mesmo rasgo. Troque a string para mudar o desenho.

## Os componentes de colagem

| Componente | O que faz |
|---|---|
| `TornPaper` | folha com borda rasgada via `clip-path`; escolha quais lados rasgam |
| `Tape` | fita crepe que prende o elemento, com borda serrilhada e rótulo opcional |
| `RansomTitle` | título em letras recortadas — cada letra é texto real, legível por leitor de tela |
| `Doodle` | rabiscos: star, crown, arrow, swirl, lines — com traço duplo |
| `Splat` | respingo de tinta com gotas em volta |
| `Stamp` | carimbo de borracha; use sobre papel, não sobre fundo escuro |
| `Barcode` | código de barras com a legenda em texto real |
| `StickerImg` | imagem recortada que cai em placeholder quando o arquivo não existe |
| `NetworkCable` | o cabo, um trecho por seção, desenhado conforme o scroll |

Veja todos em `/kit`.

## Onde trocar as coisas

**Cores, fontes e espaçamento** → `src/styles/theme.css`, bloco `@theme`. Os tokens são os
da `referencias/docs/ESPECIFICACAO.md` § 2.

**Prints de projeto** → jogue os arquivos em `public/prints/` com o nome
`[slug]-1.jpg`, `[slug]-2.jpg`, `[slug]-3.jpg`. Enquanto não existirem, aparece a moldura
`[ print do projeto ]` — nenhum código precisa mudar.

**Currículo** → `public/cv-herick-pt.pdf` e `public/cv-herick-en.pdf`.

**Textos** → `src/content/pt.ts` e `src/content/en.ts`, tipados por `types.ts`. É a fonte
única: transcrição de `referencias/docs/CONTEUDO.md`, nada inventado.

## Acessibilidade e performance

- `prefers-reduced-motion` desliga o scrub do cabo (o ScrollTrigger nem é criado) e as
  animações. É o hook `usePrefersReducedMotion`, usado por toda animação.
- Texto é sempre texto: o `RansomTitle` monta letra por letra em `<span>`, então Ctrl+F e
  leitor de tela funcionam.
- Foco visível global em `:focus-visible`, contorno vermelho tracejado (§ 9).
- Sem rolagem horizontal em 390px (`overflow-x: clip` no body) — verificado com Playwright.
- Anton é auto-hospedada e pré-carregada, porque é a fonte do `h1` do hero e entra no LCP.
  As outras usam `font-display: swap`.

## Publicar

Saída estática em `dist/`. Como o app usa rotas de cliente, o host precisa devolver
`index.html` em qualquer caminho.

**Vercel** — `npm run build`, pasta de saída `dist`, e um `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Cloudflare Pages** — comando `npm run build`, diretório `dist`, e um arquivo
`public/_redirects` com:

```
/*  /index.html  200
```

## Roteiro

- [x] **1. Fundação** — setup, tokens, fontes, texturas, componentes de colagem, `/kit`
- [x] **2. Hero e Issues** — diagonal rasgada, nome em duas camadas, mural 12 colunas, carrossel
- [x] **3. Quem, Setlist, Virar o disco, Contato** — feito por um worker Codex
- [x] **4. Página de projeto** — feito por um worker Codex
- [x] **5. Lado B** — feito por um worker Claude
- [x] **6. Versão celular** — verificada em 390px em todas as páginas
- [x] **7. Cabo, animações e transição do disco**
- [x] **8. Inglês, 404, easter eggs, SEO e build**

## O que ainda falta de material

Tudo do `kit-claude-code.zip` chegou. Sobram só os itens que dependem de você (§ 10 da
especificação):

- **Prints reais de cada projeto**, 3 por case, em `public/prints/[slug]-1.jpg` etc. No
  Leitor RCO, use o modo apresentação para anonimizar. Enquanto não existirem, aparece a
  moldura `[ print do projeto ]`.
- **CV em PDF**, PT e EN, em `public/cv-herick-pt.pdf` e `public/cv-herick-en.pdf`.
- **Autorização dos clientes** para nome e prints (QTAL, Maqcenter, SIPH, Dr. Adriano,
  Dra. Vanessa, Boss Finance, Begônia). Os avisos estão no campo `autorizacao` de cada
  issue em `src/content/pt.ts`.
- **IDs das faixas do Spotify** para os 3 embeds do Lado B (campo `spotifyId`, hoje vazio).
- **Domínio.**
