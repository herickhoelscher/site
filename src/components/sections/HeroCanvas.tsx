import { useEffect, useRef } from 'react'
import { makeRng } from '@/lib/rng'

type Props = {
  /** O nome, numa linha só. */
  nome: string
  /** Texto da plaquinha, ex. "*HERICK HOELSCHER". */
  placa: string
  width: number
  height: number
  isMobile: boolean
  /** Sem movimento: desenha só o quadro final, parado. */
  reduced: boolean
  /** Chamado quando a abertura termina. */
  onEntradaFim?: () => void
}

const INK = '#141414'
const PAPER = '#EFE9DA'
const RED = '#E8432E'
const ROXO = '#765BA7'
const LAV = '#A68BE6'

/**
 * Cores das partículas. A cor depende do lado da linha em que a partícula está
 * (o mesmo `tom` vira creme em cima e preto embaixo), então ela "troca de cor"
 * quando atravessa o corte, como as letras do nome.
 */
const TONS_TOPO = [PAPER, PAPER, RED, LAV]
const TONS_FUNDO = [INK, INK, RED, ROXO]
const TAU = Math.PI * 2

/** As mesmas texturas das seções (tex-creme, tex-roxa, tex-vermelha), no mesmo tamanho. */
const TEXTURAS = {
  creme: '/assets/textura-creme.webp',
  roxa: '/assets/textura-roxa.webp',
  vermelha: '/assets/textura-vermelha.webp',
}
const TEX_PX = 420

const carregaImagem = (src: string) =>
  new Promise<HTMLImageElement | null>((ok) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = () => ok(null)
    img.src = src
  })

/**
 * Unidade das velocidades da simulação. Os números (mola, tinta, partículas)
 * foram afinados para 24 passos por segundo; a cada quadro a simulação anda
 * dt / PASSO_MS desses passos, então roda igual a 60, 120 ou 144 Hz.
 */
const PASSO_MS = 1000 / 24

// ===================== linha do tempo, em ms =====================
const T_LETRAS = 140
const ENTRE_LETRAS = 55
const DUR_QUEDA = 520
const DUR_PLACA = 420
const DUR_ASTER = 300
const DUR_ANEL = 720
const DUR_TREMIDA = 420

/** Quanto da letra a retícula cobre enquanto cai, antes de fechar em sólida. */
const NIVEIS = [0.16, 0.3, 0.46, 0.6, 0.7]

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3
const easeInCubic = (x: number) => x * x * x
const easeOutBack = (x: number, s = 1.70158) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2
/** Altura da letra durante a queda: 1 no alto, passa um pouco do chão e assenta em 0. */
const quedaLetra = (p: number) => 1 - easeOutBack(clamp01(p), 2.2)

/** A abertura só toca uma vez por visita, mesmo se o componente remontar. */
let aberturaTocou = false

type Glifo = { ch: string; x: number; w: number }
/** Partícula solta: poeira do fundo, faísca do impacto, poeira das letras ou rastro do ponteiro. */
type Particula = {
  x: number
  y: number
  vx: number
  vy: number
  s: number // tamanho
  ang: number
  va: number // giro por passo
  forma: number // 0 ponto, 1 quadrado, 2 cruz, 3 triângulo, 4 asterisco
  tom: number // índice em TONS_TOPO / TONS_FUNDO
  z: number // profundidade: mais perto, maior e mais rápida
  vida: number // 1 → 0; a poeira do fundo fica sempre em 1
  queda: number // gravidade por passo
}
type Gota = { x: number; y: number; vy: number; r: number; vida: number }
type Mancha = {
  u: number // posição ao longo da largura (0..1)
  d: number // distância da linha, em px (negativo = acima)
  r: number
  vx: number
  fase: number
  ancora: boolean
  nasce: number // ms em que aparece
  ox: number // deslocamento atual (mouse)
  oy: number
}

/**
 * Abertura do hero em canvas 2D, a 60 quadros por segundo (ou o que a tela der).
 *
 * Composição: o nome inteiro inclinado (-7°) e cortado por uma linha paralela
 * a ele, que passa pelo meio das letras. Acima da linha o fundo é roxo e a
 * letra creme; abaixo, papel creme e letra preta. As cores e as texturas são
 * as mesmas das seções do site.
 *
 * Tudo o que é tinta (manchas, anel de choque, halo da plaquinha, gotas da
 * linha) vira um único caminho de recorte. Dentro dele o quadro é pintado de
 * novo na paleta da tinta: fundo vermelho e letra creme.
 *
 * Desempenho: os fundos com textura e o nome já pousado são desenhados uma vez
 * em telas fora da página e só copiados a cada quadro; o quadro todo são três
 * cópias, alguns recortes e as partículas.
 *
 * Linha do tempo:
 *   1. as letras caem uma a uma, com rastro, em retícula que fecha até sólida;
 *   2. a plaquinha entra crescendo;
 *   3. o asterisco cai e bate: sai o anel de choque, as faíscas, e a tinta
 *      nasce por onde o anel passa;
 *   4. tremida de registro que vai sumindo;
 *   5. repouso: a linha ondula, solta gotas, a tinta e a poeira andam e o mouse
 *      mexe em tudo.
 */
export function HeroCanvas({ nome, placa, width, height, isMobile, reduced, onEntradaFim }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fimRef = useRef(onEntradaFim)
  fimRef.current = onEntradaFim

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !width || !height) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = width
    const H = height
    // telas grandes em resolução um pouco menor: o custo cresce com a área
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : W * H > 1.1e6 ? 1.25 : 1.5)
    const PW = Math.round(W * dpr)
    const PH = Math.round(H * dpr)
    const novoCanvas = () => {
      const c = document.createElement('canvas')
      c.width = PW
      c.height = PH
      return c
    }
    canvas.width = PW
    canvas.height = PH

    // cópia do quadro, só para a tremida de registro
    const copia = novoCanvas()
    const copiaCtx = copia.getContext('2d')!

    const rng = makeRng(7)
    let rodando = true
    let raf = 0

    // ===================== geometria =====================
    const ANG = ((isMobile ? -6 : -7) * Math.PI) / 180
    const SY = isMobile ? 1.9 : 1 // no celular a letra é esticada na vertical
    const cos = Math.cos(ANG)
    const sin = Math.sin(ANG)
    const diag = Math.hypot(W, H)

    let S = 100 // corpo da fonte
    let capa = 70 // altura da maiúscula
    let glifos: Glifo[] = []
    let larguraNome = 0
    const fonte = (px: number) => `${px}px Anton, "Arial Narrow", sans-serif`
    const TRACK = -0.012 // letras quase encostando, como na referência

    const medir = () => {
      ctx.font = fonte(100)
      const capa100 = ctx.measureText('H').actualBoundingBoxAscent || 73
      const larg100 =
        [...nome].reduce((s, ch) => s + ctx.measureText(ch).width, 0) + TRACK * 100 * (nome.length - 1)
      // largura do nome girado ocupa ~94% da tela
      const alvoW = W * (isMobile ? 0.9 : 0.94)
      const k1 = alvoW / (larg100 * cos + capa100 * SY * Math.abs(sin))
      // e não passa de ~70% da altura (a referência chega a 75%)
      const k2 = (H * (isMobile ? 0.42 : 0.7)) / (larg100 * Math.abs(sin) + capa100 * SY * cos)
      const k = Math.min(k1, k2)
      S = 100 * k
      capa = capa100 * k
      ctx.font = fonte(S)
      glifos = []
      let x = 0
      for (const ch of nome) {
        const w = ctx.measureText(ch).width
        glifos.push({ ch, x, w })
        x += w + TRACK * S
      }
      larguraNome = x - TRACK * S
      for (const g of glifos) g.x -= larguraNome / 2
    }

    // centro do nome na tela
    const CX = W * 0.5
    const CY = H * (isMobile ? 0.45 : 0.48)
    /** Coordenadas do nome (x ao longo da palavra, y para baixo) para a tela. */
    const paraTela = (x: number, y: number) => ({
      x: CX + x * cos - y * SY * sin,
      y: CY + x * sin + y * SY * cos,
    })

    // ===================== a linha (mola + degraus) =====================
    const NOS = 80
    const desl = new Float32Array(NOS)
    const vel = new Float32Array(NOS)
    // degraus fixos: a linha é rasgada em dentes, não lisa
    const DEGRAUS = isMobile ? 18 : 34
    const dente = Array.from({ length: DEGRAUS }, () => rng.jitter(isMobile ? 5 : 7))

    /** y da linha sem a mola: paralela ao nome, a ~43% da altura da letra. */
    let linhaY0 = 0
    const atualizaLinha = () => {
      const p = paraTela(0, -capa / 2 + capa * 0.43)
      linhaY0 = p.y - p.x * Math.tan(ANG)
    }
    const yBase = (x: number) => linhaY0 + x * Math.tan(ANG)

    const molaEm = (x: number) => {
      const f = Math.max(0, Math.min(NOS - 1, (x / W) * (NOS - 1)))
      const i = Math.min(NOS - 2, Math.floor(f))
      const t = f - i
      return desl[i] + (desl[i + 1] - desl[i]) * t
    }
    const yLinha = (x: number, comDente = true) => {
      const dn = comDente ? dente[Math.min(DEGRAUS - 1, Math.max(0, Math.floor((x / W) * DEGRAUS)))] : 0
      return yBase(x) + molaEm(x) + dn
    }

    const empurra = (xn: number, forca: number) => {
      const c = Math.round(xn * (NOS - 1))
      for (let i = -7; i <= 7; i++) {
        const k = c + i
        if (k < 1 || k >= NOS - 1) continue
        vel[k] += forca * Math.exp(-(i * i) / 12)
      }
    }

    let mare = 0
    /** Um passo da mola, escalado: `f` = quantos passos de 24 Hz couberam no quadro. */
    const passoLinha = (f: number) => {
      mare += f
      const amortece = Math.pow(0.88, f)
      for (let i = 1; i < NOS - 1; i++) {
        vel[i] += (((desl[i - 1] + desl[i + 1]) / 2 - desl[i]) * 0.5 - desl[i] * 0.02) * f
        vel[i] *= amortece
      }
      for (let i = 1; i < NOS - 1; i++) {
        // maré: uma onda lenta que anda para a direita
        desl[i] += (vel[i] + Math.sin(mare * 0.11 - i * 0.35) * 0.06) * f
      }
    }

    /** Pontos do contorno da linha, com os degraus. */
    const contornoLinha = (c: CanvasRenderingContext2D, daDireita: boolean) => {
      const passo = W / DEGRAUS
      if (daDireita) {
        for (let s = DEGRAUS - 1; s >= 0; s--) {
          for (let j = 4; j >= 0; j--) {
            const x = s * passo + (passo * j) / 4
            c.lineTo(x, yBase(x) + molaEm(x) + dente[s])
          }
        }
      } else {
        for (let s = 0; s < DEGRAUS; s++) {
          for (let j = 0; j <= 4; j++) {
            const x = s * passo + (passo * j) / 4
            c.lineTo(x, yBase(x) + molaEm(x) + dente[s])
          }
        }
      }
    }
    /** Região de cima da linha. */
    const caminhoEscuro = (c: CanvasRenderingContext2D) => {
      c.beginPath()
      c.moveTo(0, -2)
      c.lineTo(W, -2)
      contornoLinha(c, true)
      c.closePath()
    }
    /** Região de baixo da linha. */
    const caminhoClaro = (c: CanvasRenderingContext2D) => {
      c.beginPath()
      c.moveTo(0, H + 2)
      contornoLinha(c, false)
      c.lineTo(W, H + 2)
      c.closePath()
    }

    // ===================== retícula =====================
    const PASSO = Math.max(4, Math.round(Math.min(W, 1600) * (isMobile ? 0.012 : 0.0062)))
    /** Ladrilho com pontos a 45° (cantos + centro) que cobre `cob` da área. */
    const ladrilho = (cor: string, cob: number): HTMLCanvasElement => {
      const c = document.createElement('canvas')
      c.width = c.height = PASSO * 2
      const g = c.getContext('2d')!
      const p = PASSO * 2
      const r = p * Math.sqrt(cob / (2 * Math.PI))
      g.fillStyle = cor
      for (const [x, y] of [
        [0, 0],
        [p, 0],
        [0, p],
        [p, p],
        [p / 2, p / 2],
      ]) {
        g.beginPath()
        g.arc(x, y, r, 0, Math.PI * 2)
        g.fill()
      }
      return c
    }
    const ladrilhos: Record<string, HTMLCanvasElement[]> = {
      [INK]: NIVEIS.map((c) => ladrilho(INK, c)),
      [PAPER]: NIVEIS.map((c) => ladrilho(PAPER, c)),
    }

    // ===================== linha do tempo =====================
    const fimLetras = () => T_LETRAS + (glifos.length - 1) * ENTRE_LETRAS + DUR_QUEDA
    // a plaquinha começa enquanto a última letra ainda assenta: sem pausa entre os atos
    const T_PLACA = () => fimLetras() - 140
    const T_ASTER = () => T_PLACA() + DUR_PLACA * 0.55
    const T_IMPACTO = () => T_ASTER() + DUR_ASTER
    const T_FIM = () => T_IMPACTO() + DUR_ANEL + 160

    /** Progresso da queda da letra i: <0 ainda não entrou, >=1 pousada. */
    const progLetra = (i: number, t: number) => (t - T_LETRAS - i * ENTRE_LETRAS) / DUR_QUEDA

    // ===================== desenho do nome =====================
    const ENGROSSA = 0.024 // traço da mesma cor em volta da letra: Anton fica mais pesada

    /*
     * Cada letra, em cada cor e em cada nível de retícula, é desenhada uma vez
     * numa tela pequena (sprite). Durante a queda o quadro só copia sprites:
     * escrever texto grande com contorno a cada quadro era o que travava a
     * entrada. Os sprites são descartados quando a última letra pousa.
     */
    const SOLIDO = NIVEIS.length
    let margem = 0 // folga em volta da letra, cobre o contorno
    let baseSprite = 0 // linha de base dentro do sprite
    let alturaSprite = 0 // altura do sprite no espaço da palavra (antes do SY)
    const sprites = new Map<string, HTMLCanvasElement>()
    const medirSprites = () => {
      margem = S * ENGROSSA + 6
      baseSprite = margem + capa * 1.25
      alturaSprite = baseSprite + capa * 0.25 + margem
    }
    const sprite = (i: number, cor: string, nivel: number) => {
      const chave = `${i}|${cor}|${nivel}`
      const pronto = sprites.get(chave)
      if (pronto) return pronto
      const g = glifos[i]
      // a letra caindo pode ser um pouco mais macia: 75% da resolução, metade da memória
      const k = dpr * 0.75
      const s = document.createElement('canvas')
      s.width = Math.ceil((g.w + margem * 2) * k)
      s.height = Math.ceil(alturaSprite * k * SY)
      const c = s.getContext('2d')!
      // já esticado no SY, para a cópia sair nítida no celular
      c.setTransform(k, 0, 0, k * SY, 0, 0)
      c.font = fonte(S)
      c.textBaseline = 'alphabetic'
      c.lineJoin = 'round'
      c.lineWidth = S * ENGROSSA
      const estilo = nivel >= SOLIDO ? cor : (c.createPattern(ladrilhos[cor][nivel], 'repeat') ?? cor)
      c.fillStyle = estilo
      c.strokeStyle = estilo
      c.fillText(g.ch, margem, baseSprite)
      c.strokeText(g.ch, margem, baseSprite)
      sprites.set(chave, s)
      return s
    }
    const preparaSprites = () => {
      for (let i = 0; i < glifos.length; i++)
        for (const cor of [PAPER, INK]) for (let n = 0; n <= SOLIDO; n++) sprite(i, cor, n)
    }

    const desenhaNome = (c: CanvasRenderingContext2D, cor: string, t: number) => {
      c.save()
      c.translate(CX, CY)
      c.rotate(ANG)
      c.scale(1, SY)
      const queda = capa * 0.3
      glifos.forEach((g, i) => {
        const p = progLetra(i, t)
        if (p < 0) return
        const poe = (dy: number, nivel: number) =>
          c.drawImage(sprite(i, cor, nivel), g.x - margem, capa / 2 + dy - baseSprite, g.w + margem * 2, alturaSprite)
        if (p >= 1) {
          poe(0, SOLIDO)
          return
        }
        // rastro: a mesma letra um pouco antes, em retícula rala
        const pg = p - 0.16
        if (pg >= 0) poe(-quedaLetra(pg) * queda, 0)
        // a retícula fecha enquanto cai e vira sólida no fim
        poe(-quedaLetra(p) * queda, Math.min(SOLIDO, Math.floor(p * 5) + 1))
      })
      c.restore()
    }

    // ===================== camadas prontas (desenhadas uma vez) =====================
    let fundoCreme: HTMLCanvasElement | null = null
    let fundoRoxo: HTMLCanvasElement | null = null
    let fundoVermelho: HTMLCanvasElement | null = null
    const nomePronto: Record<string, HTMLCanvasElement> = {}

    const camadaLisa = (desenha: (g: CanvasRenderingContext2D) => void) => {
      const c = novoCanvas()
      const g = c.getContext('2d')!
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      desenha(g)
      return c
    }
    const camadaTextura = (img: HTMLImageElement | null, cor: string) =>
      camadaLisa((g) => {
        g.fillStyle = cor
        g.fillRect(0, 0, W, H)
        if (!img) return
        const p = g.createPattern(img, 'repeat')
        if (!p) return
        p.setTransform(new DOMMatrix().scale(TEX_PX / img.width))
        g.fillStyle = p
        g.fillRect(0, 0, W, H)
      })
    const montaCamadas = (creme: HTMLImageElement | null, roxa: HTMLImageElement | null, vermelha: HTMLImageElement | null) => {
      fundoCreme = camadaTextura(creme, PAPER)
      fundoRoxo = camadaTextura(roxa, ROXO)
      fundoVermelho = camadaTextura(vermelha, RED)
      // o nome já pousado, nas duas cores, escrito direto (nítido, na resolução cheia)
      for (const cor of [PAPER, INK])
        nomePronto[cor] = camadaLisa((g) => {
          g.translate(CX, CY)
          g.rotate(ANG)
          g.scale(1, SY)
          g.font = fonte(S)
          g.textBaseline = 'alphabetic'
          g.lineJoin = 'round'
          g.lineWidth = S * ENGROSSA
          g.fillStyle = cor
          g.strokeStyle = cor
          for (const gl of glifos) {
            g.fillText(gl.ch, gl.x, capa / 2)
            g.strokeText(gl.ch, gl.x, capa / 2)
          }
        })
    }
    const cobre = (c: CanvasRenderingContext2D, camada: HTMLCanvasElement | null, cor: string) => {
      if (camada) c.drawImage(camada, 0, 0, W, H)
      else {
        c.fillStyle = cor
        c.fillRect(0, 0, W, H)
      }
    }
    const nome2 = (c: CanvasRenderingContext2D, cor: string, t: number) => {
      // depois que todas pousaram, só copia a camada pronta
      if (t >= fimLetras() && nomePronto[cor]) {
        if (sprites.size) sprites.clear()
        c.drawImage(nomePronto[cor], 0, 0, W, H)
      } else desenhaNome(c, cor, t)
    }

    // ===================== plaquinha =====================
    const fontePlaca = (px: number) => `${px}px "Permanent Marker", "Comic Sans MS", cursive`
    let placaW = 0
    let placaH = 0
    let placaFonte = 20
    const medirPlaca = () => {
      placaH = Math.max(28, capa * SY * (isMobile ? 0.15 : 0.2))
      placaFonte = placaH * 0.5
      ctx.font = fontePlaca(placaFonte)
      placaW = ctx.measureText(placa).width + placaH * 1.1
      // a plaquinha nunca fica mais larga que ~60% do nome
      const maxW = larguraNome * 0.62
      if (placaW > maxW) {
        const k = maxW / placaW
        placaH *= k
        placaFonte *= k
        placaW = maxW
      }
    }
    // centro da plaquinha: no meio do nome, em cima da linha
    const placaCentro = () => paraTela(0, -capa / 2 + capa * 0.43)

    /** Halo de retícula em volta da plaquinha (vira tinta). */
    let halo: Array<{ x: number; y: number; r: number }> = []
    const montaHalo = () => {
      halo = []
      const hr = makeRng(23)
      const passo = Math.max(4, placaH * 0.13)
      const e = placaH * 1.15
      const hw = placaW / 2
      const hh = placaH / 2
      for (let y = -hh - e; y <= hh + e; y += passo) {
        for (let x = -hw - e; x <= hw + e; x += passo) {
          const xx = x + ((Math.round(y / passo) % 2) * passo) / 2
          const dx = Math.max(0, Math.abs(xx) - hw)
          const dy = Math.max(0, Math.abs(y) - hh)
          const dist = Math.hypot(dx, dy)
          if (dist <= 0) continue
          const borda = e * (0.55 + 0.45 * Math.sin(xx * 0.03 + y * 0.05) * Math.cos(xx * 0.017))
          if (dist > borda) continue
          const q = 1 - dist / borda
          const r = passo * 0.55 * Math.pow(q, 0.9) * (0.75 + hr.next() * 0.5)
          if (r < 0.7) continue
          halo.push({ x: xx, y, r })
        }
      }
    }

    const desenhaPlaca = (c: CanvasRenderingContext2D, escala: number) => {
      const p = placaCentro()
      c.save()
      c.translate(p.x, p.y)
      c.rotate(ANG)
      c.scale(escala, escala)
      const w = placaW
      const h = placaH
      // sombra sólida vermelha, como os botões do site
      const sombra = Math.max(3, h * 0.13)
      c.fillStyle = RED
      c.fillRect(-w / 2 + sombra, -h / 2 + sombra, w, h)
      c.fillStyle = INK
      c.fillRect(-w / 2, -h / 2, w, h)
      c.strokeStyle = PAPER
      c.lineWidth = Math.max(1.5, h * 0.06)
      const m = h * 0.14
      c.strokeRect(-w / 2 + m, -h / 2 + m, w - m * 2, h - m * 2)
      c.strokeStyle = INK
      c.lineWidth = Math.max(1, h * 0.04)
      c.strokeRect(-w / 2, -h / 2, w, h)
      c.fillStyle = PAPER
      c.font = fontePlaca(placaFonte)
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText(placa, 0, h * 0.04)
      c.restore()
    }

    // ===================== asterisco =====================
    const asteriscoPos = () => {
      const ultimo = glifos[glifos.length - 1]
      return paraTela(ultimo.x + ultimo.w * 0.78, -capa / 2 + capa * 0.04)
    }
    const desenhaAsterisco = (c: CanvasRenderingContext2D, escala: number, giro: number) => {
      const a = asteriscoPos()
      const R = capa * SY * (isMobile ? 0.2 : 0.16) * escala
      const bracos = (cc: CanvasRenderingContext2D) => {
        cc.beginPath()
        for (let k = 0; k < 3; k++) {
          const ang = (k * Math.PI) / 3 + 0.3
          cc.moveTo(-Math.cos(ang) * R, -Math.sin(ang) * R)
          cc.lineTo(Math.cos(ang) * R, Math.sin(ang) * R)
        }
      }
      c.save()
      c.translate(a.x, a.y)
      c.rotate(ANG + giro)
      c.lineCap = 'round'
      // sombra dura
      c.save()
      c.translate(R * 0.14, R * 0.16)
      bracos(c)
      c.strokeStyle = INK
      c.lineWidth = R * 0.78
      c.stroke()
      c.restore()
      // contorno preto e miolo vermelho
      bracos(c)
      c.strokeStyle = INK
      c.lineWidth = R * 0.78
      c.stroke()
      bracos(c)
      c.strokeStyle = RED
      c.lineWidth = R * 0.5
      c.stroke()
      c.restore()
    }

    // ===================== tinta (manchas que andam na linha) =====================
    const manchas: Mancha[] = []
    const escalaTinta = Math.min(1.25, Math.max(0.6, W / 1300))
    const montaTinta = () => {
      manchas.length = 0
      const tr = makeRng(91)
      const N = isMobile ? 110 : 230
      const gauss = () => {
        let u = 0
        while (!u) u = tr.next()
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * tr.next())
      }
      const nova = (u: number, d: number, r: number, ancora: boolean) =>
        manchas.push({ u, d, r, vx: tr.range(0.00025, 0.0011), fase: tr.next() * 6.28, ancora, nasce: 0, ox: 0, oy: 0 })

      for (let i = 0; i < N; i++) {
        const u = tr.next()
        const d = gauss() * H * 0.06
        const sorteio = tr.next()
        const r =
          (sorteio < 0.62 ? tr.range(1, 2.6) : sorteio < 0.88 ? tr.range(3, 6) : tr.range(7, 13)) * escalaTinta
        nova(u, d, r, false)
        // massas grandes têm satélites
        if (r > 6.5 * escalaTinta) {
          const n = tr.int(2, 5)
          for (let j = 0; j < n; j++) {
            const ang = tr.next() * 6.28
            const dist = r * tr.range(1.4, 2.7)
            nova(u + (Math.cos(ang) * dist) / W, d + Math.sin(ang) * dist, r * tr.range(0.22, 0.45), false)
          }
        }
      }
      // respingo fixo em volta do asterisco e ao longo do nome
      const a = asteriscoPos()
      const focos = [
        { x: a.x, y: a.y, n: isMobile ? 16 : 28, raio: capa * SY * 0.55 },
        { x: W * 0.09, y: yBase(W * 0.09), n: isMobile ? 10 : 16, raio: capa * SY * 0.4 },
        { x: W * 0.62, y: yBase(W * 0.62), n: isMobile ? 6 : 10, raio: capa * SY * 0.3 },
        { x: W * 0.35, y: yBase(W * 0.35), n: isMobile ? 5 : 9, raio: capa * SY * 0.25 },
      ]
      for (const f of focos) {
        for (let i = 0; i < f.n; i++) {
          const ang = tr.next() * 6.28
          const dist = Math.pow(tr.next(), 0.7) * f.raio
          const x = f.x + Math.cos(ang) * dist
          const y = f.y + Math.sin(ang) * dist
          const r = (tr.next() < 0.3 ? tr.range(5, 11) : tr.range(1.5, 4)) * escalaTinta
          nova(x / W, y - yBase(x), r, true)
        }
      }
    }

    /** Raio do anel de choque, em frações da diagonal, no progresso q (0..1). */
    const raioAnel = (q: number) => 0.05 + 0.95 * easeOutCubic(q)
    /** Cada mancha nasce quando o anel de choque passa por ela. */
    const marcaNascimentos = () => {
      const a = asteriscoPos()
      const t0 = T_IMPACTO()
      for (const m of manchas) {
        const x = m.u * W
        const y = yBase(x) + m.d
        const dist = Math.hypot(x - a.x, y - a.y) / diag
        // inverso de raioAnel: em que momento o anel chega nessa distância
        const v = clamp01((dist - 0.05) / 0.95)
        const q = 1 - Math.cbrt(1 - v)
        m.nasce = t0 + q * DUR_ANEL
      }
    }

    const gotas: Gota[] = []
    const mouse = { x: -9999, y: -9999 }

    let haloPronto: Path2D | null = null
    /** Tudo o que é tinta neste instante, num caminho só, para recortar. */
    const caminhoTinta = (t: number) => {
      const p = new Path2D()
      let tem = false
      const circulo = (x: number, y: number, r: number) => {
        if (r <= 0.25) return
        p.moveTo(x + r, y)
        p.arc(x, y, r, 0, TAU)
        tem = true
      }

      for (const m of manchas) {
        const idade = t - m.nasce
        if (idade < 0) continue
        const cresce = idade >= 260 ? 1 : easeOutBack(idade / 260, 2.4)
        const respira = 1 + Math.sin(t * 0.0012 + m.fase) * 0.06
        circulo(m.u * W + m.ox, yLinha(m.u * W, false) + m.d + m.oy, m.r * cresce * respira)
      }

      // halo da plaquinha (depois de crescer ele não muda: vira um caminho pronto)
      if (t >= T_PLACA()) {
        const k = easeOutCubic(clamp01((t - T_PLACA()) / DUR_PLACA))
        if (k >= 1) {
          if (!haloPronto) {
            haloPronto = new Path2D()
            const c = placaCentro()
            for (const d of halo) {
              const x = c.x + d.x * cos - d.y * sin
              const y = c.y + d.x * sin + d.y * cos
              haloPronto.moveTo(x + d.r, y)
              haloPronto.arc(x, y, d.r, 0, TAU)
            }
          }
          p.addPath(haloPronto)
          tem = true
        } else {
          const c = placaCentro()
          for (const d of halo) circulo(c.x + d.x * cos - d.y * sin, c.y + d.x * sin + d.y * cos, d.r * k)
        }
      }

      // gotas da linha
      for (const g of gotas) circulo(g.x, g.y, g.r * Math.max(0.2, g.vida))

      // anel de choque, com um rastro de retícula logo atrás
      const dA = t - T_IMPACTO()
      if (dA >= 0 && dA < DUR_ANEL) {
        const q = dA / DUR_ANEL
        const a = asteriscoPos()
        const r = raioAnel(q) * diag
        const e = Math.min(r, diag * 0.12 * (q < 0.05 ? 1 : 0.3 * (1 - q) + 0.03))
        p.moveTo(a.x + r, a.y)
        p.arc(a.x, a.y, r, 0, TAU)
        if (r - e > 0) {
          // volta ao contrário: vira furo
          p.moveTo(a.x + r - e, a.y)
          p.arc(a.x, a.y, r - e, 0, TAU, true)
        }
        tem = true
        const passo = Math.max(5, PASSO * 1.4)
        for (let j = 1; j <= 3; j++) {
          const rr = r - e - j * passo * 1.2
          if (rr <= 0) break
          const n = Math.min(260, Math.floor((TAU * rr) / passo))
          const pr = passo * 0.42 * (1 - j / 4)
          for (let i = 0; i < n; i++) {
            const ang = (i / n) * TAU + j * 0.3
            circulo(a.x + Math.cos(ang) * rr, a.y + Math.sin(ang) * rr, pr)
          }
        }
      }
      return tem ? p : null
    }

    // ===================== partículas =====================
    const poeira: Particula[] = []
    const faiscas: Particula[] = []
    const rngP = makeRng(131)
    const MAX_FAISCAS = isMobile ? 220 : 480

    /** Poeira do fundo: mais densa perto da linha, anda junto com a tinta. */
    const montaPoeira = () => {
      poeira.length = 0
      const N = isMobile ? 120 : 260
      for (let i = 0; i < N; i++) {
        const x = rngP.range(0, W)
        const z = rngP.range(0.45, 1)
        const vx = rngP.range(0.25, 1.1) * z * escalaTinta
        const espalha = rngP.next() < 0.6 ? 0.35 : 0.95
        poeira.push({
          x,
          y: yBase(x) + (rngP.next() - 0.5) * H * espalha,
          vx,
          vy: vx * Math.tan(ANG),
          s: rngP.range(2, 6.5) * z * escalaTinta,
          ang: rngP.next() * TAU,
          va: rngP.range(-0.08, 0.08),
          forma: Math.floor(rngP.next() * 5),
          tom: Math.floor(rngP.next() * 4),
          z,
          vida: 1,
          queda: 0,
        })
      }
    }

    /** Solta `n` faíscas de um ponto, em todas as direções. */
    const estoura = (x: number, y: number, n: number, forca: number, queda: number) => {
      for (let i = 0; i < n; i++) {
        const a = rngP.next() * TAU
        const v = rngP.range(0.3, 1) * forca
        faiscas.push({
          x,
          y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - forca * 0.15,
          s: rngP.range(2, 6.5) * escalaTinta,
          ang: a,
          va: rngP.range(-0.3, 0.3),
          forma: Math.floor(rngP.next() * 5),
          tom: Math.floor(rngP.next() * 4),
          z: 1,
          vida: 1,
          queda,
        })
      }
      if (faiscas.length > MAX_FAISCAS) faiscas.splice(0, faiscas.length - MAX_FAISCAS)
    }

    const desenhaParticula = (c: CanvasRenderingContext2D, p: Particula, alfa: number) => {
      const cor = (p.y < yLinha(p.x) ? TONS_TOPO : TONS_FUNDO)[p.tom]
      const s = p.s
      c.globalAlpha = alfa
      c.fillStyle = cor
      c.strokeStyle = cor
      // posição e giro numa matriz só, sem save/restore por partícula
      const co = Math.cos(p.ang) * dpr
      const si = Math.sin(p.ang) * dpr
      c.setTransform(co, si, -si, co, p.x * dpr, p.y * dpr)
      switch (p.forma) {
        case 0:
          c.beginPath()
          c.arc(0, 0, s, 0, TAU)
          c.fill()
          break
        case 1:
          c.fillRect(-s * 0.85, -s * 0.85, s * 1.7, s * 1.7)
          break
        case 2:
          c.lineWidth = Math.max(1.2, s * 0.55)
          c.beginPath()
          c.moveTo(-s * 1.3, 0)
          c.lineTo(s * 1.3, 0)
          c.moveTo(0, -s * 1.3)
          c.lineTo(0, s * 1.3)
          c.stroke()
          break
        case 3:
          c.beginPath()
          c.moveTo(0, -s * 1.3)
          c.lineTo(s * 1.15, s * 0.8)
          c.lineTo(-s * 1.15, s * 0.8)
          c.closePath()
          c.fill()
          break
        default:
          // asterisco pequeno, eco do grande
          c.lineWidth = Math.max(1.1, s * 0.45)
          c.beginPath()
          for (let k = 0; k < 3; k++) {
            const a = (k * Math.PI) / 3
            c.moveTo(-Math.cos(a) * s * 1.3, -Math.sin(a) * s * 1.3)
            c.lineTo(Math.cos(a) * s * 1.3, Math.sin(a) * s * 1.3)
          }
          c.stroke()
      }
    }

    const desenhaParticulas = (t: number) => {
      ctx.lineCap = 'round'
      // a poeira aparece junto com a tinta, depois do impacto
      const k = clamp01((t - T_IMPACTO()) / 600)
      if (k > 0) for (const p of poeira) desenhaParticula(ctx, p, k * (0.65 + 0.35 * p.z))
      for (const f of faiscas) desenhaParticula(ctx, f, Math.min(1, f.vida * 1.6))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalAlpha = 1
    }

    // ===================== pintura de um quadro =====================
    const tremidaRng = makeRng(300)
    const fatias = Array.from({ length: 6 }, () => ({
      pula: tremidaRng.next() < 0.3,
      jit: tremidaRng.next(),
      alt: tremidaRng.range(0.4, 1),
      fase: tremidaRng.next() * TAU,
    }))

    const pinta = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1

      // papel embaixo, roxo em cima, a letra de cada lado na sua cor
      cobre(ctx, fundoCreme, PAPER)
      ctx.save()
      caminhoEscuro(ctx)
      ctx.clip()
      cobre(ctx, fundoRoxo, ROXO)
      nome2(ctx, PAPER, t)
      ctx.restore()
      ctx.save()
      caminhoClaro(ctx)
      ctx.clip()
      nome2(ctx, INK, t)
      ctx.restore()

      // tinta: vermelho com a letra creme, só dentro do recorte
      const tinta = caminhoTinta(t)
      if (tinta) {
        ctx.save()
        ctx.clip(tinta)
        cobre(ctx, fundoVermelho, RED)
        nome2(ctx, PAPER, t)
        ctx.restore()
      }

      // partículas por cima do nome e embaixo da plaquinha e do asterisco
      desenhaParticulas(t)

      // plaquinha: entra grande e assenta com um repique
      if (t >= T_PLACA()) {
        const q = clamp01((t - T_PLACA()) / DUR_PLACA)
        desenhaPlaca(ctx, 1.45 - 0.45 * easeOutBack(q, 2))
      }

      // asterisco: cai grande girando, bate e balança
      if (t >= T_ASTER()) {
        const dI = t - T_IMPACTO()
        if (dI < 0) {
          const q = clamp01((t - T_ASTER()) / DUR_ASTER)
          desenhaAsterisco(ctx, 2.6 - 1.6 * easeInCubic(q), (1 - q) * 0.7)
        } else {
          desenhaAsterisco(ctx, 1 + 0.2 * Math.exp(-dI / 110) * Math.cos(dI / 38), 0)
        }
      }

      // tremida de registro: fatias do quadro deslocadas, sumindo aos poucos
      const dT = t - T_IMPACTO()
      if (dT > 0 && dT < DUR_TREMIDA) {
        const amp = 16 * Math.min(1.4, W / 1100) * Math.exp(-dT / 120)
        if (amp > 0.6) {
          copiaCtx.setTransform(1, 0, 0, 1, 0, 0)
          copiaCtx.globalCompositeOperation = 'copy'
          copiaCtx.drawImage(canvas, 0, 0)
          copiaCtx.globalCompositeOperation = 'source-over'
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          const topoN = (CY - capa * SY * 0.9) * dpr
          const altN = capa * SY * 1.8 * dpr
          fatias.forEach((f, i) => {
            if (f.pula) return
            const y0 = topoN + (altN * i) / fatias.length + (f.jit - 0.5) * altN * 0.1
            const h0 = (altN / fatias.length) * f.alt
            const dx = amp * dpr * Math.sin(dT / 26 + f.fase) * (i % 2 ? 1 : -1)
            ctx.drawImage(copia, 0, y0, PW, h0, dx, y0, PW, h0)
          })
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        }
      }
    }

    // ===================== simulação (escalada pelo tempo do quadro) =====================
    const pousou: boolean[] = []
    let impactou = false
    const rngSim = makeRng(77)

    const passoSim = (t: number, f: number) => {
      passoLinha(f)

      // tranco na linha e poeira quando cada letra pousa
      glifos.forEach((g, i) => {
        if (!pousou[i] && progLetra(i, t) >= 1) {
          pousou[i] = true
          const p = paraTela(g.x + g.w / 2, capa / 2)
          empurra(p.x / W, 4.5)
          estoura(p.x, p.y, isMobile ? 7 : 14, 4.5, 0.2)
        }
      })

      // impacto do asterisco
      if (!impactou && t >= T_IMPACTO()) {
        impactou = true
        const a = asteriscoPos()
        empurra(a.x / W, -16)
        empurra(0.5, 7)
        estoura(a.x, a.y, isMobile ? 70 : 150, 20, 0.34)
      }

      // gotas que saem da linha
      if (t > T_IMPACTO() + 500 && rngSim.next() < 0.32 * f) {
        const x = rngSim.range(0, W)
        const sobe = rngSim.next() < 0.5
        gotas.push({
          x,
          y: yLinha(x) + (sobe ? -2 : 2),
          vy: (sobe ? -1 : 1) * rngSim.range(0.5, 1.6),
          r: rngSim.range(1.5, 4.2) * escalaTinta,
          vida: 1,
        })
      }
      for (let i = gotas.length - 1; i >= 0; i--) {
        const g = gotas[i]
        g.y += g.vy * f
        g.x += 0.6 * f
        g.vida -= 0.035 * f
        if (g.vida <= 0) gotas.splice(i, 1)
      }

      // poeira do fundo: anda na direção da linha, ondula e foge do ponteiro
      const solta = t > T_IMPACTO()
      for (const p of poeira) {
        if (solta) {
          p.x += p.vx * f
          p.y += (p.vy + Math.sin(t * 0.0021 + p.ang) * 0.3 * p.z) * f
          p.ang += p.va * f
        }
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 140 * 140 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const fo = ((140 - d) / 140) * 3.2 * f
          p.x += (dx / d) * fo
          p.y += (dy / d) * fo
        }
        if (p.x > W + 12) {
          p.x = -12
          p.y = yBase(0) + (rngSim.next() - 0.5) * H * 0.8
        }
        if (p.y < -12) p.y = H + 12
        else if (p.y > H + 12) p.y = -12
      }
      // faíscas: freiam, caem e somem
      const freio = Math.pow(0.94, f)
      for (let i = faiscas.length - 1; i >= 0; i--) {
        const s = faiscas[i]
        s.vx *= freio
        s.vy = s.vy * freio + s.queda * f
        s.x += s.vx * f
        s.y += s.vy * f
        s.ang += s.va * f
        s.vida -= 0.028 * f
        if (s.vida <= 0) faiscas.splice(i, 1)
      }

      // a tinta anda para a direita e o mouse junta
      const segue = 1 - Math.pow(0.88, f)
      for (const m of manchas) {
        if (!m.ancora && t > m.nasce) {
          m.u += m.vx * f
          if (m.u > 1.03) m.u -= 1.06
        }
        const x = m.u * W
        const y = yLinha(x, false) + m.d
        const dx = mouse.x - x
        const dy = mouse.y - y
        const perto = dx * dx + dy * dy < 160 * 160
        m.ox += ((perto ? dx * 0.45 : 0) - m.ox) * segue
        m.oy += ((perto ? dy * 0.45 : 0) - m.oy) * segue
      }
    }

    // ===================== laço =====================
    let relogio = 0
    let anterior = 0
    let avisou = false
    let visivel = true

    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
    })
    io.observe(canvas)

    const quadro = (agora: number) => {
      if (!rodando) return
      raf = requestAnimationFrame(quadro)
      if (document.hidden || !visivel) {
        anterior = agora
        return
      }
      if (!anterior) anterior = agora
      // teto de 50 ms: uma aba que travou não faz tudo pular de uma vez
      const dt = Math.min(50, agora - anterior)
      anterior = agora
      relogio += dt
      passoSim(relogio, dt / PASSO_MS)
      pinta(relogio)

      if (!avisou && relogio > T_FIM()) {
        avisou = true
        aberturaTocou = true
        fimRef.current?.()
      }
    }

    let ultimoRastro = 0
    const mover = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      // rastro: o ponteiro solta faíscas pequenas enquanto anda pelo hero
      const agora = performance.now()
      if (agora - ultimoRastro > 45 && mouse.y >= 0 && mouse.y <= H) {
        ultimoRastro = agora
        estoura(mouse.x, mouse.y, 3, 2.6, 0.06)
      }
    }
    const sair = () => {
      mouse.x = mouse.y = -9999
    }

    let cancelado = false
    let comecou = false
    const comecar = (creme: HTMLImageElement | null, roxa: HTMLImageElement | null, vermelha: HTMLImageElement | null) => {
      if (cancelado || comecou) return
      comecou = true
      medir()
      medirSprites()
      atualizaLinha()
      medirPlaca()
      montaHalo()
      montaTinta()
      marcaNascimentos()
      montaPoeira()
      preparaSprites()
      montaCamadas(creme, roxa, vermelha)

      if (reduced) {
        // parado: só o quadro final, sem tremida
        const t = T_FIM() + 1000
        glifos.forEach((_, i) => (pousou[i] = true))
        pinta(t)
        fimRef.current?.()
        return
      }
      if (aberturaTocou) {
        // já tocou nesta visita (ex.: redimensionou): começa em repouso
        relogio = T_FIM()
        impactou = true
        avisou = true
        glifos.forEach((_, i) => (pousou[i] = true))
        for (const m of manchas) m.nasce = 0
      }
      pinta(relogio)
      window.addEventListener('pointermove', mover, { passive: true })
      window.addEventListener('pointerleave', sair)
      raf = requestAnimationFrame(quadro)
    }

    // As fontes são obrigatórias (o nome é medido com elas). As texturas não:
    // se demorarem mais que 450 ms, a abertura começa com as cores lisas e as
    // texturas entram quando chegarem.
    const texturas = Promise.all([
      carregaImagem(TEXTURAS.creme),
      carregaImagem(TEXTURAS.roxa),
      carregaImagem(TEXTURAS.vermelha),
    ])
    const fontes = Promise.all([
      document.fonts?.load?.(`400 100px Anton`),
      document.fonts?.load?.(`400 40px "Permanent Marker"`),
    ]).catch(() => null)
    const limite = new Promise<null>((ok) => window.setTimeout(() => ok(null), 450))
    fontes.then(() => Promise.race([texturas, limite])).then((imgs) => {
      if (imgs) comecar(...imgs)
      else {
        comecar(null, null, null)
        texturas.then(([creme, roxa, vermelha]) => {
          if (cancelado) return
          fundoCreme = camadaTextura(creme, PAPER)
          fundoRoxo = camadaTextura(roxa, ROXO)
          fundoVermelho = camadaTextura(vermelha, RED)
          if (reduced) pinta(T_FIM() + 1000)
        })
      }
    })

    return () => {
      rodando = false
      cancelado = true
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerleave', sair)
    }
  }, [nome, placa, width, height, isMobile, reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ width, height }}
    />
  )
}
