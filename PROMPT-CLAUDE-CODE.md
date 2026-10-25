# Prompt para o Claude Code · Portfólio Herick (React)

## Como preparar a pasta

```
portfolio-herick/
  referencias/
    docs/         ESPECIFICACAO.md e CONTEUDO.md
    prototipo/    index.html, case.html, style.css, zine.js, assets/, fonts/
    wireframes/   imagens de cada seção (desktop à esquerda, celular à direita)
    stitch/       descompacte aqui o .zip exportado do Google Stitch
```

O `kit-claude-code.zip` já vem nessa estrutura. Falta só colocar o export do Stitch em `referencias/stitch/`.
Depois abra o Claude Code dentro de `portfolio-herick/` e cole o prompt abaixo.

## Prompt

```
Você vai construir meu portfólio pessoal em React. Tudo o que você precisa está em referencias/. Leia antes de escrever qualquer código:

1. referencias/docs/ESPECIFICACAO.md: stack, design tokens, layout, animações, acessibilidade. A seção "0. Atualização" vale por cima do resto do documento.
2. referencias/docs/CONTEUDO.md: todos os textos em PT e EN. É a única fonte de texto. Não invente funcionalidades, números nem descrições de projeto. Se faltar algum texto, me pergunte.
3. referencias/stitch/: export do Google Stitch, com o HTML + Tailwind e a imagem de cada tela.
4. referencias/prototipo/: protótipo em HTML/CSS/JS, com assets/ e fonts/. O zine.js tem a lógica das bordas rasgadas, do corte diagonal do hero, do título em letras recortadas, dos rabiscos (estrela, coroa, seta, espiral), dos respingos, do código de barras e do cabo de rede.
5. referencias/wireframes/: capturas de cada seção, desktop 1440 à esquerda e celular 390 à direita.

STACK
Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + GSAP com ScrollTrigger. Saída estática (output: "export"), sem backend, para publicar na Vercel ou na Cloudflare Pages.

PÁGINAS
- / → LADO A, o lado profissional: Hero → Quem é esse cara → Issues → Setlist → Virar o disco → Contato
- /issues/[slug] → uma página por projeto (leitor-rco, agrovision, portal, maqcenter, ecommerce, clientes), aberta pelo botão "VER MAIS →" de cada card
- /lado-b → LADO B, o lado pessoal: mixtape, animes, jogos, xadrez, os verdadeiros gerentes (Mike e Missi) e o mural do Pinterest
- /404
- As mesmas páginas em inglês: /en, /en/issues/[slug], /en/lado-b

REFERÊNCIA VISUAL DE CADA TELA
- Hero, Quem é esse cara, Setlist e página de projeto: siga o protótipo e os wireframes.
- Issues, Contato e Lado B: siga as telas do Stitch.
- Virar o disco: siga a tela do Stitch se ela existir; se não, monte com os textos e a descrição do CONTEUDO.md, no mesmo estilo.
- Se o texto do Stitch for diferente do CONTEUDO.md, vale o CONTEUDO.md. O Stitch inventou descrições erradas para alguns projetos.
- Não use as imagens de "print" geradas pelo Stitch: elas são falsas.

COMPONENTES E DADOS
- Porte a lógica do zine.js para componentes e hooks React determinísticos, com seed fixa, que não mudam a cada render: TornPaper, Tape, Stamp, Doodle, Splat, Barcode, RansomTitle, NetworkCable, StickerImg.
- Seções: Nav, Hero, About, IssuesWall, IssueCard, Setlist, FlipRecord, Contact, Footer, ProjectPage, BSideHeader, Mixtape, VhsShelf, Cartridges, ChessCard, TeamBadges, PinterestMural, LangToggle.
- Textos em content/pt.ts e content/en.ts, tipados. Os projetos num array com: slug, número, título, gancho, resumo do card, resumo longo, tipo, stack, status, repositório, problema, passos, fluxo, resultado e frase do resultado.

ASSETS
- Use os arquivos de prototipo/assets/ (retrato, Mike e Missi, capas das issues, texturas, tênis, cassete, VHS, cartuchos, crachás) e as fontes de prototipo/fonts/.
- Onde entra print real de projeto, deixe uma moldura "print do projeto" que lê de public/prints/[slug]-1.jpg, -2.jpg e -3.jpg e mostra o placeholder enquanto o arquivo não existir.
- CV em public/cv-herick-pt.pdf e public/cv-herick-en.pdf: deixe o link pronto mesmo sem o arquivo.

INTERAÇÕES
- Cabo de rede em SVG ligado ao scroll (ScrollTrigger com scrub). Ele desce pela lateral direita de todas as seções, nunca cobre texto e termina nos tênis do contato.
- Hero: letras entram em sequência, o adesivo cai girando, Mike e Missi sobem de trás do papel.
- Issues: no hover, o canto do card descola. No celular, vira carrossel com scroll-snap.
- Setlist: cada faixa abre e fecha (acordeão acessível, com button e aria-expanded).
- "LADO B ↻" e "VIRAR O DISCO": transição curta de um disco virando entre o Lado A e o Lado B, e o caminho de volta.
- Lado B: player oficial do Spotify nas 3 faixas e widget oficial do Pinterest, os dois carregando só quando aparecem na tela. Passar o mouse numa fita VHS muda o clima da seção. Os crachás balançam no hover.
- Easter eggs: 5 cliques na Missi derrubam um elemento da página com física simples; o código Konami faz o Mike atravessar a tela; cursor de estrela no desktop.
- prefers-reduced-motion desliga o scrub, as quedas, o cursor e os easter eggs de física, e deixa só fades.

REGRAS
- Sem rolagem horizontal da página em 390px. Breakpoint principal de 760px.
- Texto sempre como texto real. O nome do hero é um h1; a camada duplicada do efeito fica com aria-hidden.
- alt em todas as imagens, foco visível, contraste AA.
- Metadados por idioma, hreflang, sitemap e imagem de compartilhamento 1200x630.
- LCP abaixo de 2,5 s: fontes com font-display: swap e Anton pré-carregada.

COMO TRABALHAR
Trabalhe em etapas e pare no fim de cada uma para eu revisar:
1. Setup, tokens, fontes, texturas e componentes de colagem, com uma página /kit mostrando todos eles.
2. Hero e Issues.
3. Quem é esse cara, Setlist, Virar o disco e Contato.
4. Página de projeto com os 6 projetos.
5. Lado B.
6. Versão celular.
7. Cabo de rede, animações e transição do disco.
8. Inglês, 404, easter eggs, SEO e build de produção.
Em cada etapa, rode o projeto, tire screenshots em 1440 e 390 com o Playwright, compare com a referência daquela tela e corrija as diferenças antes de me mostrar.
No fim, escreva um README explicando como rodar, onde trocar textos e prints, e como publicar na Vercel.
```

## Se preferir React puro, sem Next.js

Troque o bloco STACK por:

```
STACK
React + Vite + TypeScript + React Router + Tailwind CSS v4 + GSAP com ScrollTrigger. Use react-helmet-async para os metadados de cada página e gere um build estático para a Vercel ou a Cloudflare Pages.
```
