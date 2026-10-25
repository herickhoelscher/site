# Portfólio Herick Hoelscher · Especificação de desenvolvimento

Referência visual: as imagens em `wireframes/` e o protótipo em `prototipo/` (abra `index.html` com um servidor local, por exemplo `npx serve prototipo`).
Conteúdo completo em PT e EN: `CONTEUDO.md`.

---

## 0. Atualização (24/10): estrutura em Lado A e Lado B

Decidido depois da rodada no Google Stitch. Vale por cima do resto deste documento.

- **Lado A** (`/`, profissional): Hero → Quem é esse cara → Issues → Setlist → Virar o disco → Contato.
- **Projeto** (`/issues/[slug]`): uma página para cada uma das 6 issues, aberta pelo botão "VER MAIS →" do card. Mesmo layout da página do Leitor RCO.
- **Lado B** (`/lado-b`, pessoal): página separada com mixtape, animes, jogos, xadrez, os verdadeiros gerentes (Mike e Missi) e o mural do Pinterest. Abre pelo botão "LADO B ↻" da navegação e pela seção "Virar o disco". Volta pelo botão "VIRAR O DISCO DE NOVO → LADO A".
- **Visual:** Hero, Quem é esse cara, Setlist e página de projeto seguem o protótipo; Issues, Lado B e Contato seguem as telas do Stitch.
- **Navegação:** "01 QUEM · 02 ISSUES · 03 SETLIST · 04 CONTATO" + "LADO B ↻" + "PT / EN".
- **Transição Lado A ↔ Lado B:** o disco gira e vira (animação curta, desligada com `prefers-reduced-motion`).

---

## 1. Conceito

Portfólio como uma zine punk / mural de lambe-lambe. Tudo parece colado à mão: papel rasgado, fita adesiva, carimbos, rabiscos, halftone.

- **Fio condutor:** um cabo de rede preto atravessa o site inteiro. Sai de trás do nome no hero, desce pela lateral de todas as seções e termina com o par de tênis pendurado no contato. Representa a história "da infra pro código".
- **Mascotes:** Mike (cachorro preto, fone vermelho) e Missi (siamesa, chapéu de mago roxo). Aparecem em todas as seções, como animais de verdade, com expressões diferentes.
- **Regra de layout:** nada alinhado em grade perfeita. Elementos girados entre -3° e 3°, sobrepostos, presos com fita. Mas o texto sempre legível e reto o suficiente para ler.

## 2. Design tokens

```css
--ink:    #141414;  /* preto */
--paper:  #EFE9DA;  /* creme */
--white:  #F6F2E8;  /* creme claro (adesivos, contornos) */
--red:    #E8432E;  /* vermelho coral, destaque */
--purple: #765BA7;  /* roxo, fundo do Lado B */
--lav:    #A68BE6;  /* lavanda, texto/tags sobre preto */
```

| Uso | Fonte (Google Fonts / Fontsource, todas grátis) |
|---|---|
| Títulos e nome gigante | Anton |
| Título spray (ISSUES) | Rubik Wet Paint |
| Setlist e Lado B (marcador) | Permanent Marker |
| Anotações manuscritas | Caveat Brush |
| Microtexto, tags, navegação | Space Mono |
| Texto corrido | Space Grotesk |

Sombras sempre "duras" (sem desfoque): `drop-shadow(10px 12px 0 rgba(0,0,0,.3))`. Use `drop-shadow` em vez de `box-shadow` em tudo que tem borda rasgada, para a sombra acompanhar o recorte.

Texturas (em `assets/`): `textura-creme.webp`, `textura-preta.webp`, `textura-vermelha.webp`, `textura-roxa.webp`, todas emendáveis (repetem sem costura).

## 3. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | você já usa no QTAL, Maqcenter e e-commerce |
| Estilo | Tailwind CSS v4 com os tokens acima em `@theme` + CSS módulo para os efeitos de colagem | |
| Animação | GSAP + ScrollTrigger (cabo, entradas, Setlist), Framer Motion só se preferir para hover | |
| Scroll suave | Lenis (opcional) | |
| Conteúdo | `content/pt.json`, `content/en.json` e `content/issues/*.mdx` | sem CMS, tudo versionado |
| Idiomas | rotas `/` (PT) e `/en`, com `next-intl` ou dicionário simples | espaço pra `/de` depois |
| Imagens | `next/image`, WebP/AVIF | |
| Hospedagem | Vercel ou Cloudflare Pages | você já tem conta nas duas |
| Analytics | Vercel Analytics ou Plausible (sem cookies) | |

## 4. Estrutura de páginas

```
/                 Lado A (Hero, Quem, Issues, Setlist, Virar o disco, Contato)
/issues/[slug]    página de projeto (leitor-rco, agrovision, portal, maqcenter, ecommerce, clientes)
/lado-b           Lado B (pessoal)
/en, /en/issues/[slug], /en/lado-b
/404              Missi derrubou a página
/cv-herick-pt.pdf, /cv-herick-en.pdf
```

Componentes sugeridos: `Hero`, `NetworkCable`, `TornPaper`, `Tape`, `Stamp`, `Doodle`, `Splat`, `RansomTitle`, `StickerImg`, `PosterCard`, `SetlistTrack`, `SpotifyTrack`, `VhsChips`, `Badge`, `PinterestMural`, `Ticket`, `LangToggle`.

O arquivo `prototipo/zine.js` já tem a lógica pronta (determinística, com seed) de: borda rasgada (`clip-path` gerado), corte diagonal do hero, título em letras recortadas, rabiscos SVG (estrela, coroa, seta, espiral), respingos, código de barras e o cabo de rede. Dá pra portar direto para hooks/componentes React.

## 5. Seções

### 00 · Hero
- 100svh. Fundo dividido por uma diagonal rasgada: preto em cima, creme embaixo.
- "HERICK" em Anton ocupando ~94% da largura. Duas camadas do mesmo texto: creme recortado pela área preta, preto recortado pela área creme (efeito de cor invertida). Máscara de grunge por cima.
- Adesivo vermelho "*HERICK HOELSCHER" girado -5°.
- `pets-espiando.png` apoiado em cima das letras (use `mix-blend-mode: lighten` ou recorte o fundo preto).
- Rodapé do hero: frase manuscrita à esquerda, links à direita.
- **Celular:** nome quebra em duas linhas (HER / ICK), pets centralizados em cima, links empilhados.

### 01 · Quem é esse cara?
- Fundo vermelho texturizado.
- Esquerda: `herick-xerox.png` (ou `herick-roxo.png`) com Missi brava no ombro e Mike no canto, cercados de adesivos redondos de stack.
- Direita: título em letras recortadas + bio em papel rasgado com fita.
- **Celular:** retrato em cima, texto embaixo, anotações manuscritas do retrato escondidas.

### 02 · Issues
- Fundo preto. Título "ISSUES" em Rubik Wet Paint vermelho.
- Desktop: grid de 12 colunas. ISSUE 001 ocupa 6 colunas e 2 linhas; 002 a 005 ocupam 3 colunas cada; 006 é uma faixa larga com a lista de clientes.
- Cada pôster: capa halftone, nº da edição, nome do repositório, título, gancho manuscrito, resumo, tags, carimbo de status e link "LER A ISSUE →".
- **Celular:** carrossel horizontal com `scroll-snap`, um pôster por vez (84vw), indicação "arraste →".

### 03 · Setlist
- Fundo preto com feixe de luz de palco.
- Folha de setlist pautada, presa com silver tape. 7 faixas; clicar abre o detalhe (acordeão, uma aberta por vez é opcional).
- Ao lado: Mike no palco, Missi em cima do amplificador "HH", palheta.
- **Celular:** folha em largura total, palco embaixo.

### 04 · Lado B
- Fundo roxo texturizado. Título "LADO B" em marcador num bloco preto.
- **Mixtape:** Mike dormindo sobre a fita + 3 faixas com player oficial do Spotify (embed compacto de 80px) e nota manuscrita embaixo de cada uma.
- **Animes:** fitas VHS + chips. Hover/toque num chip muda o clima da seção (`data-mood`): Attack on Titan = vermelho e fumaça, Frieren = lavanda e brilhos, Edgerunners = glitch neon.
- **Jogos:** cartuchos + "e qualquer coop que tiver vaga".
- **Xadrez:** cena da Missi + ficha "CHESS PLAYER · RATING: DEPENDE DO CAFÉ".
- **Equipe:** crachás com as fotos reais em halftone (`cracha-mike.jpg`, `cracha-missi.jpg`), cordão e clipe. Balançam no hover.
- **Mural:** widget oficial do Pinterest (`pinit.js`, board widget) da pasta "referências", dentro de um papel creme.
- **Celular:** tudo em uma coluna; crachás lado a lado; mural em 3 colunas.

### 05 · Contato
- Fundo creme. Ingresso grande "BORA CONVERSAR" com recortes semicirculares, canhoto picotado e código de barras.
- Botões: "ESCREVER UM EMAIL" (mailto) e "BAIXAR CV" (PDF por idioma).
- Tênis pendurados no fim do cabo. Mike surpreso e Missi rindo.
- Rodapé preto com a frase e o copyright.

### Página de case (`/issues/[slug]`)
Capa + título + gancho → faixa de metadados (tipo, stack, status, código) → O problema / O que eu fiz (passos numerados) → fluxo em blocos → 3 prints reais → resultado em letras gigantes → próxima issue.

## 6. Animações e interações

| Onde | O quê |
|---|---|
| Hero (carregamento) | letras batem no lugar uma a uma (stagger), adesivo cai girando, respingos aparecem, pets sobem de trás do papel |
| Cabo de rede | `stroke-dashoffset` ligado ao scroll (ScrollTrigger scrub): o cabo vai se desenhando conforme a pessoa desce |
| Entrada das seções | papéis entram com leve rotação e "assentam" (y: 40 → 0, rotate: ±6° → valor final) |
| Pôsteres das Issues | hover: canto descola (rotateX/rotateY leve + sombra maior), carimbo pisca |
| Setlist | clique abre a faixa; número da faixa vira vermelho; som de clique de fita opcional (desligado por padrão) |
| Mixtape | hover: as engrenagens da fita giram |
| Animes | troca de clima da seção (cor e partículas) |
| Crachás | balanço tipo pêndulo no hover |
| Missi | 5 cliques: ela empurra um elemento da página, que cai com física (gravidade simples) |
| Konami (↑↑↓↓←→←→BA) | Mike atravessa a tela correndo |
| Cursor | estrela; cada clique deixa uma estrela rabiscada que some em 1,5 s (só em desktop) |
| Carregamento | Missi na caixa de papelão |
| 404 | Missi gritando, "A Missi derrubou essa página da mesa." |

`prefers-reduced-motion`: desligar scrub, quedas, cursor e easter eggs de física; manter só fades.

## 7. Integrações

| Serviço | Uso | Chave |
|---|---|---|
| Spotify | 3 embeds oficiais de faixa | não |
| Pinterest | widget oficial da pasta "referências" | não |
| GitHub | opcional: data do último commit em cada Issue, via API pública com cache de 1 h | não |

Os embeds de Spotify e Pinterest carregam só quando a seção entra na tela (`IntersectionObserver`), para não pesar o carregamento inicial.

## 8. Responsivo

- Breakpoint principal: 760px. Testar em 390px (celular) e 1440px (desktop).
- Sem rolagem horizontal na página (o carrossel das Issues rola dentro do próprio bloco).
- Rotação máxima de 2° no celular para manter o texto legível.
- Anotações manuscritas decorativas somem no celular quando colidem com conteúdo.

## 9. Acessibilidade e SEO

- Todo texto é texto de verdade (não imagem). O nome do hero é um `<h1>`; a camada duplicada fica com `aria-hidden`.
- `alt` em todas as imagens (já estão no protótipo).
- Contraste: creme sobre preto e preto sobre creme passam AA; evite texto lavanda pequeno sobre roxo.
- Foco visível nos links e botões (contorno vermelho tracejado).
- Metadados por idioma, `hreflang`, sitemap, imagem de compartilhamento 1200×630 (hero com o nome e os pets).
- Meta: LCP < 2,5 s. O hero usa só CSS e uma imagem pequena; carregue as fontes com `font-display: swap` e pré-carregue Anton.

## 10. Assets

Já prontos em `prototipo/assets/`:

| Arquivo | Uso |
|---|---|
| herick-xerox.png, herick-roxo.png | retrato |
| pets-espiando.png | hero |
| missi-brava, missi-rindo, mike-feliz, mike-surpreso (.png) | adesivos com contorno |
| mike-corpo, missi-sentada (.png) | Setlist |
| mike-discos, mixtape, vhs, cartuchos (.png) | Lado B |
| missi-xadrez.jpg | Lado B |
| cracha-mike.jpg, cracha-missi.jpg | crachás (fotos reais em halftone) |
| tenis.png | contato |
| issue-*.jpg | capas das 6 Issues |
| textura-*.webp, grunge-mask.png | fundos e desgaste |

Recortados dos frames do ChatGPT, então a resolução é limitada. Para a versão final, vale gerar as versões grandes e com fundo transparente (os prompts já estão na conversa).

**Ainda faltam (só você tem):**
- Prints reais de cada projeto (3 por case). No Leitor RCO, use o modo apresentação para anonimizar.
- CV em PDF, PT e EN.
- Autorização dos clientes para nome e prints (QTAL, Maqcenter, SIPH, Dr. Adriano, Dra. Vanessa, Boss Finance, Begônia).
- Domínio.

## 11. Ordem de construção

1. Projeto Next.js + tokens + fontes + texturas.
2. Componentes de colagem (TornPaper, Tape, Stamp, Doodle, Splat, RansomTitle) portando o `zine.js`.
3. Seções na ordem: Hero → Issues → Contato → Quem → Setlist → Lado B.
4. Página de case com MDX e as 6 Issues.
5. Celular.
6. Animações (cabo primeiro).
7. Idioma EN.
8. Easter eggs, 404, carregamento.
9. SEO, performance, deploy.

## 12. Prompt para o Claude Code

Ver `PROMPT-CLAUDE-CODE.md` (versão de 24/10, com Lado A, páginas de projeto e Lado B).
