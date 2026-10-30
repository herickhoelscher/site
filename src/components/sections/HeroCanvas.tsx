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

type Fundo = string | CanvasPattern
/** Cores de um quadro: fundo de cada lado da linha e a letra de cada lado. */
type Paleta = { fundo: Fundo; topo: Fundo; letraTopo: string; letraFundo: string }

const carregaImagem = (src: string) =>
  new Promise<HTMLImageElement | null>((ok) => {
    const img = new Image()
    img.onload = () => ok(img)
    img.onerror = () => ok(null)
    img.src = src
  })

/** Relógio de desenho animado: 24 quadros por segundo, poses seguradas por 2 quadros. */
const QUADRO = 1000 / 24
const POSE = QUADRO * 2

/** Quanto da letra a retícula cobre em cada pose da entrada, antes de fechar. */
const COBERTURA = [0.3, 0.46, 0.6, 0.7]
/** Queda de cada letra, em frações da altura de queda, pose a pose (com um repique no fim). */
const QUEDA = [1.14, 0.74, 0.38, 0.1, -0.05, 0.015, 0]
const ENTRE_LETRAS = 42

/** Anel de choque: raio e espessura por pose, em frações da diagonal da tela. */
const ANEL_R = [0.08, 0.17, 0.3, 0.45, 0.62, 0.8, 0.98]
const ANEL_E = [1, 0.3, 0.22, 0.16, 0.11, 0.08, 0.05]

/** Tremida de registro: deslocamento das fatias, pose a pose. */
const TREMIDA = [16, -10, 6, -3, 1]

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
  va: number // giro por quadro
  forma: number // 0 ponto, 1 quadrado, 2 cruz, 3 triângulo, 4 asterisco
  tom: number // índice em TONS_TOPO / TONS_FUNDO
  z: number // profundidade: mais perto, maior e mais rápida
  vida: number // 1 → 0; a poeira do fundo fica sempre em 1
  queda: number // gravidade por quadro
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
 * Abertura do hero em canvas 2D.
 *
 * Composição: o nome inteiro inclinado (-7°) e cortado por uma linha paralela
 * a ele, que passa pelo meio das letras. Acima da linha o fundo é roxo e a
 * letra creme; abaixo, papel creme e letra preta. As cores e as texturas são
 * as mesmas das seções do site.
 *
 * Tudo o que é tinta (manchas, anel de choque, halo da plaquinha, gotas da
 * linha) é pintado numa máscara. O quadro é desenhado duas vezes, normal e na
 * paleta da tinta (vermelho com a letra creme), e a segunda versão só aparece
 * onde a máscara tem tinta. Assim a tinta é vermelha dos dois lados da linha e,
 * sobre uma letra preta, a letra vira creme.
 *
 * Linha do tempo (no relógio de poses de 83 ms):
 *   1. as letras caem uma a uma, com fantasmas, em retícula que fecha até sólida;
 *   2. a plaquinha entra;
 *   3. o asterisco bate: o quadro do impacto congela uma pose (hit-stop), sai o
 *      anel de choque e a tinta nasce por onde o anel passa;
 *   4. tremida de registro (fatias deslocadas) por 5 poses;
 *   5. repouso: a linha ondula, solta gotas, a tinta anda e o mouse junta.
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
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 1.5)
    const novoCanvas = () => {
      const c = document.createElement('canvas')
      c.width = Math.round(W * dpr)
      c.height = Math.round(H * dpr)
      return c
    }
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    // quadro com as cores trocadas e a máscara de inversão
    const inv = novoCanvas()
    const invCtx = inv.getContext('2d')!
    const masc = novoCanvas()
    const mascCtx = masc.getContext('2d')!

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

    const yLinha = (x: number, comDente = true) => {
      const f = Math.max(0, Math.min(NOS - 1, (x / W) * (NOS - 1)))
      const i = Math.min(NOS - 2, Math.floor(f))
      const t = f - i
      const m = desl[i] + (desl[i + 1] - desl[i]) * t
      const dn = comDente ? dente[Math.min(DEGRAUS - 1, Math.floor((x / W) * DEGRAUS))] : 0
      return yBase(x) + m + dn
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
    const passoLinha = () => {
      mare += 1
      for (let i = 1; i < NOS - 1; i++) {
        vel[i] += ((desl[i - 1] + desl[i + 1]) / 2 - desl[i]) * 0.5 - desl[i] * 0.02
        vel[i] *= 0.88
      }
      for (let i = 1; i < NOS - 1; i++) {
        // maré: uma onda lenta que anda para a direita
        desl[i] += vel[i] + Math.sin(mare * 0.11 - i * 0.35) * 0.06
      }
    }

    /** Pontos do contorno da linha, da direita para a esquerda, com os degraus. */
    const contornoLinha = (c: CanvasRenderingContext2D, daDireita: boolean) => {
      const passo = W / DEGRAUS
      const pts: Array<[number, number]> = []
      for (let s = 0; s < DEGRAUS; s++) {
        const x0 = s * passo
        for (let j = 0; j <= 4; j++) {
          const x = x0 + (passo * j) / 4
          pts.push([x, yBase(x) + molaEm(x) + dente[s]])
        }
      }
      if (daDireita) pts.reverse()
      for (const [x, y] of pts) c.lineTo(x, y)
    }
    /** Região escura: acima da linha. */
    const caminhoEscuro = (c: CanvasRenderingContext2D) => {
      c.beginPath()
      c.moveTo(0, -2)
      c.lineTo(W, -2)
      contornoLinha(c, true)
      c.closePath()
    }
    /** Região clara: abaixo da linha. */
    const caminhoClaro = (c: CanvasRenderingContext2D) => {
      c.beginPath()
      c.moveTo(0, H + 2)
      contornoLinha(c, false)
      c.lineTo(W, H + 2)
      c.closePath()
    }
    const molaEm = (x: number) => {
      const f = Math.max(0, Math.min(NOS - 1, (x / W) * (NOS - 1)))
      const i = Math.min(NOS - 2, Math.floor(f))
      const t = f - i
      return desl[i] + (desl[i + 1] - desl[i]) * t
    }

    // ===================== retícula =====================
    const PASSO = Math.max(4, Math.round(Math.min(W, 1600) * (isMobile ? 0.012 : 0.0062)))
    /** Ladrilho com pontos a 45° (cantos + centro) que cobre `cob` da área. */
    const ladrilho = (cor: string, cob: number) => {
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
      return ctx.createPattern(c, 'repeat')!
    }
    const NIVEIS = [0.16, ...COBERTURA]
    const padroes = {
      [INK]: NIVEIS.map((c) => ladrilho(INK, c)),
      [PAPER]: NIVEIS.map((c) => ladrilho(PAPER, c)),
    } as Record<string, CanvasPattern[]>

    // ===================== paletas =====================
    // começam lisas; viram textura quando as imagens carregam (em comecar)
    let NORMAL: Paleta = { fundo: PAPER, topo: ROXO, letraTopo: PAPER, letraFundo: INK }
    let TINTA: Paleta = { fundo: RED, topo: RED, letraTopo: PAPER, letraFundo: PAPER }
    const textura = (img: HTMLImageElement | null, cor: string): Fundo => {
      if (!img) return cor
      const p = ctx.createPattern(img, 'repeat')
      if (!p) return cor
      p.setTransform(new DOMMatrix().scale(TEX_PX / img.width))
      return p
    }

    // ===================== linha do tempo =====================
    const T_LETRAS = 180
    const fimLetras = () => T_LETRAS + (glifos.length - 1) * ENTRE_LETRAS + 4 * POSE
    const T_PLACA = () => fimLetras() + POSE
    const T_ASTER = () => T_PLACA() + 3 * POSE
    const T_IMPACTO = () => T_ASTER() + 3 * POSE
    const T_FIM = () => T_IMPACTO() + 12 * POSE

    /** Pose de uma letra: <0 ainda não entrou; 0..3 caindo em retícula; >=4 pousada. */
    const poseLetra = (i: number, t: number) => Math.floor((t - T_LETRAS - i * ENTRE_LETRAS) / POSE)

    // ===================== desenho do nome =====================
    const ENGROSSA = 0.024 // traço da mesma cor em volta da letra: Anton fica mais pesada

    const letra = (c: CanvasRenderingContext2D, g: Glifo, dy: number, estilo: string | CanvasPattern) => {
      c.fillStyle = estilo
      c.strokeStyle = estilo
      c.fillText(g.ch, g.x, capa / 2 + dy)
      c.strokeText(g.ch, g.x, capa / 2 + dy)
    }

    const desenhaNome = (c: CanvasRenderingContext2D, cor: string, t: number) => {
      c.save()
      c.translate(CX, CY)
      c.rotate(ANG)
      c.scale(1, SY)
      c.font = fonte(S)
      c.textBaseline = 'alphabetic'
      c.lineJoin = 'round'
      c.lineWidth = S * ENGROSSA
      const queda = capa * 0.3
      glifos.forEach((g, i) => {
        const k = poseLetra(i, t)
        if (k < 0) return
        if (k >= 4) {
          letra(c, g, -(QUEDA[Math.min(k, QUEDA.length - 1)] || 0) * queda, cor)
          return
        }
        // fantasmas das duas poses anteriores, mais ralos
        for (const atras of [2, 1]) {
          const kk = k - atras
          if (kk < 0) continue
          letra(c, g, -QUEDA[kk] * queda, padroes[cor][atras === 2 ? 0 : Math.max(0, kk)])
        }
        letra(c, g, -QUEDA[k] * queda, padroes[cor][k + 1])
      })
      c.restore()
    }

    /** Quadro base: papel embaixo, roxo acima da linha, a letra de cada lado na sua cor. */
    const desenhaBase = (c: CanvasRenderingContext2D, pal: Paleta, t: number) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.globalCompositeOperation = 'source-over'
      c.globalAlpha = 1
      c.fillStyle = pal.fundo
      c.fillRect(0, 0, W, H)
      caminhoEscuro(c)
      c.fillStyle = pal.topo
      c.fill()

      c.save()
      caminhoEscuro(c)
      c.clip()
      desenhaNome(c, pal.letraTopo, t)
      c.restore()

      c.save()
      caminhoClaro(c)
      c.clip()
      desenhaNome(c, pal.letraFundo, t)
      c.restore()
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

    /** Halo de retícula em volta da plaquinha (vai para a máscara). */
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
    const desenhaAsterisco = (c: CanvasRenderingContext2D, escala: number) => {
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
      c.rotate(ANG)
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
      // respingo fixo em volta do asterisco e no começo do nome
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

    /** Quando cada mancha nasce: quando o anel de choque passa por ela. */
    const marcaNascimentos = () => {
      const a = asteriscoPos()
      const t0 = T_IMPACTO()
      for (const m of manchas) {
        const x = m.u * W
        const y = yBase(x) + m.d
        const dist = Math.hypot(x - a.x, y - a.y) / diag
        let j = ANEL_R.findIndex((r) => r >= dist)
        if (j < 0) j = ANEL_R.length - 1
        m.nasce = t0 + j * POSE
      }
    }

    const gotas: Gota[] = []
    const mouse = { x: -9999, y: -9999 }

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
      c.save()
      c.translate(p.x, p.y)
      c.rotate(p.ang)
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
          c.lineCap = 'round'
          c.beginPath()
          for (let k = 0; k < 3; k++) {
            const a = (k * Math.PI) / 3
            c.moveTo(-Math.cos(a) * s * 1.3, -Math.sin(a) * s * 1.3)
            c.lineTo(Math.cos(a) * s * 1.3, Math.sin(a) * s * 1.3)
          }
          c.stroke()
      }
      c.restore()
    }

    const desenhaParticulas = (t: number) => {
      // a poeira aparece junto com a tinta, depois do impacto
      const k = Math.max(0, Math.min(1, (t - T_IMPACTO()) / (8 * POSE)))
      if (k > 0) for (const p of poeira) desenhaParticula(ctx, p, k * (0.65 + 0.35 * p.z))
      for (const f of faiscas) desenhaParticula(ctx, f, Math.min(1, f.vida * 1.6))
      ctx.globalAlpha = 1
    }

    // ===================== pintura de um quadro =====================
    const pintaMascara = (t: number, tp: number) => {
      const c = mascCtx
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.globalCompositeOperation = 'source-over'
      c.clearRect(0, 0, W, H)
      c.fillStyle = '#000'

      // tinta
      for (const m of manchas) {
        if (t < m.nasce) continue
        const idade = (t - m.nasce) / POSE
        const cresce = idade < 1 ? 0.45 : idade < 2 ? 1.25 : 1
        const respira = 1 + Math.sin(t * 0.0012 + m.fase) * 0.06
        const x = m.u * W + m.ox
        const y = yLinha(m.u * W, false) + m.d + m.oy
        c.beginPath()
        c.arc(x, y, m.r * cresce * respira, 0, Math.PI * 2)
        c.fill()
      }

      // halo da plaquinha
      const tPl = tp - T_PLACA()
      if (tPl >= 0) {
        const k = Math.min(1, (tPl / POSE + 1) / 4)
        const p = placaCentro()
        c.save()
        c.translate(p.x, p.y)
        c.rotate(ANG)
        for (const d of halo) {
          c.beginPath()
          c.arc(d.x, d.y, d.r * k, 0, Math.PI * 2)
          c.fill()
        }
        c.restore()
      }

      // gotas da linha
      for (const g of gotas) {
        c.beginPath()
        c.arc(g.x, g.y, g.r * Math.max(0.2, g.vida), 0, Math.PI * 2)
        c.fill()
      }

      // anel de choque
      const kA = Math.floor((tp - T_IMPACTO()) / POSE)
      if (kA >= 0 && kA < ANEL_R.length) {
        const a = asteriscoPos()
        const r = ANEL_R[kA] * diag
        const e = Math.min(r, ANEL_E[kA] * diag * 0.12)
        c.beginPath()
        c.arc(a.x, a.y, r, 0, Math.PI * 2)
        if (r - e > 0) c.arc(a.x, a.y, r - e, 0, Math.PI * 2, true)
        c.fill('evenodd')
        // rastro em retícula logo atrás do anel
        const passo = Math.max(5, PASSO * 1.4)
        for (let j = 1; j <= 3; j++) {
          const rr = r - e - j * passo * 1.2
          if (rr <= 0) break
          const n = Math.floor((2 * Math.PI * rr) / passo)
          const pr = passo * 0.42 * (1 - j / 4)
          for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2 + j * 0.3
            c.beginPath()
            c.arc(a.x + Math.cos(ang) * rr, a.y + Math.sin(ang) * rr, pr, 0, Math.PI * 2)
            c.fill()
          }
        }
      }
    }

    const pinta = (t: number, poseTremida: number) => {
      const tp = Math.floor(t / POSE) * POSE // poses seguram 2 quadros

      desenhaBase(ctx, NORMAL, tp)
      desenhaBase(invCtx, TINTA, tp)
      pintaMascara(t, tp)

      // a versão trocada só onde a máscara tem tinta
      invCtx.setTransform(1, 0, 0, 1, 0, 0)
      invCtx.globalCompositeOperation = 'destination-in'
      invCtx.drawImage(masc, 0, 0)
      invCtx.globalCompositeOperation = 'source-over'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(inv, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // partículas por cima do nome e embaixo da plaquinha e do asterisco
      desenhaParticulas(t)

      // plaquinha
      const kP = Math.floor((tp - T_PLACA()) / POSE)
      if (kP >= 0) desenhaPlaca(ctx, [1.4, 1.12, 0.96][kP] ?? 1)

      // asterisco: cai grande e bate
      const kS = Math.floor((tp - T_ASTER()) / POSE)
      if (kS >= 0) desenhaAsterisco(ctx, [2.6, 1.6, 0.9][kS] ?? 1)

      // tremida de registro: fatias do quadro deslocadas para os lados
      if (poseTremida >= 0 && poseTremida < TREMIDA.length) {
        const amp = TREMIDA[poseTremida] * Math.min(1.4, W / 1100)
        mascCtx.setTransform(1, 0, 0, 1, 0, 0)
        mascCtx.globalCompositeOperation = 'copy'
        mascCtx.drawImage(canvas, 0, 0)
        mascCtx.globalCompositeOperation = 'source-over'
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        const fr = makeRng(300 + poseTremida)
        const faixas = 6
        const topoN = (CY - capa * SY * 0.9) * dpr
        const altN = capa * SY * 1.8 * dpr
        for (let f = 0; f < faixas; f++) {
          if (fr.next() < 0.35) continue
          const y0 = topoN + (altN * f) / faixas + fr.jitter(altN * 0.05)
          const h0 = (altN / faixas) * fr.range(0.4, 1)
          const dx = amp * dpr * (f % 2 ? 1 : -1) * fr.range(0.5, 1)
          ctx.drawImage(masc, 0, y0, masc.width, h0, dx, y0, masc.width, h0)
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      // granulado
      if (grao) {
        ctx.save()
        ctx.globalAlpha = 0.06
        ctx.globalCompositeOperation = 'overlay'
        ctx.fillStyle = grao
        ctx.translate((Math.floor(t / QUADRO) * 37) % 128, (Math.floor(t / QUADRO) * 53) % 128)
        ctx.fillRect(-128, -128, W + 256, H + 256)
        ctx.restore()
      }
    }

    // granulado: um ruído só, reaproveitado
    const ruido = document.createElement('canvas')
    ruido.width = ruido.height = 128
    {
      const rc = ruido.getContext('2d')!
      const img = rc.createImageData(128, 128)
      const nr = makeRng(5)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 90 + nr.next() * 165
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      rc.putImageData(img, 0, 0)
    }
    const grao = ctx.createPattern(ruido, 'repeat')

    // ===================== simulação de um quadro (24 fps) =====================
    const passoSim = (t: number) => {
      passoLinha()

      // tranco na linha quando cada letra pousa
      glifos.forEach((g, i) => {
        const k = poseLetra(i, t)
        if (k === 4 && !pousou[i]) {
          pousou[i] = true
          const p = paraTela(g.x + g.w / 2, capa / 2)
          empurra(p.x / W, 4.5)
          // poeira levantando do pé da letra
          estoura(p.x, p.y, isMobile ? 7 : 14, 4.5, 0.2)
        }
      })

      // impacto do asterisco
      if (!impactou && t >= T_IMPACTO()) {
        impactou = true
        congela = POSE // hit-stop: o quadro do impacto segura uma pose
        empurra(asteriscoPos().x / W, -16)
        empurra(0.5, 7)
        const a = asteriscoPos()
        estoura(a.x, a.y, isMobile ? 70 : 150, 20, 0.34)
      }

      // gotas que saem da linha
      if (t > T_IMPACTO() + 6 * POSE && rngSim.next() < 0.32) {
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
        g.y += g.vy
        g.x += 0.6
        g.vida -= 0.035
        if (g.vida <= 0) gotas.splice(i, 1)
      }

      // poeira do fundo: anda na direção da linha, ondula e foge do ponteiro
      const solta = t > T_IMPACTO()
      for (const p of poeira) {
        if (solta) {
          p.x += p.vx
          p.y += p.vy + Math.sin(t * 0.0021 + p.ang) * 0.3 * p.z
          p.ang += p.va
        }
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 140 * 140 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = ((140 - d) / 140) * 3.2
          p.x += (dx / d) * f
          p.y += (dy / d) * f
        }
        if (p.x > W + 12) {
          p.x = -12
          p.y = yBase(0) + (rngSim.next() - 0.5) * H * 0.8
        }
        if (p.y < -12) p.y = H + 12
        else if (p.y > H + 12) p.y = -12
      }
      // faíscas: freiam, caem e somem
      for (let i = faiscas.length - 1; i >= 0; i--) {
        const f = faiscas[i]
        f.vx *= 0.94
        f.vy = f.vy * 0.94 + f.queda
        f.x += f.vx
        f.y += f.vy
        f.ang += f.va
        f.vida -= 0.028
        if (f.vida <= 0) faiscas.splice(i, 1)
      }

      // a tinta anda para a direita e o mouse junta
      for (const m of manchas) {
        if (!m.ancora && t > m.nasce) {
          m.u += m.vx
          if (m.u > 1.03) m.u -= 1.06
        }
        const x = m.u * W
        const y = yLinha(x, false) + m.d
        const dx = mouse.x - x
        const dy = mouse.y - y
        const perto = dx * dx + dy * dy < 160 * 160
        const alvoX = perto ? dx * 0.45 : 0
        const alvoY = perto ? dy * 0.45 : 0
        m.ox += (alvoX - m.ox) * 0.12
        m.oy += (alvoY - m.oy) * 0.12
      }
    }

    // ===================== laço =====================
    const pousou: boolean[] = []
    let impactou = false
    let congela = 0
    let relogio = 0
    let anterior = 0
    let ultimoQuadro = -1
    let avisou = false
    let visivel = true
    const rngSim = makeRng(77)

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
      const dt = Math.min(100, agora - anterior)
      anterior = agora

      if (congela > 0) {
        congela -= dt
        return // hit-stop: nada anda, o quadro do impacto fica na tela
      }
      relogio += dt
      const q = Math.floor(relogio / QUADRO)
      if (q === ultimoQuadro) return // 24 fps
      ultimoQuadro = q

      passoSim(relogio)
      const poseTremida = Math.floor((relogio - T_IMPACTO()) / POSE) - 1
      pinta(relogio, poseTremida)

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
    const comecar = () => {
      if (cancelado) return
      medir()
      atualizaLinha()
      medirPlaca()
      montaHalo()
      montaTinta()
      marcaNascimentos()
      montaPoeira()

      if (reduced) {
        // parado: só o quadro final, sem tremida
        const t = T_FIM() + 1000
        glifos.forEach((_, i) => (pousou[i] = true))
        pinta(t, -1)
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
      window.addEventListener('pointermove', mover, { passive: true })
      window.addEventListener('pointerleave', sair)
      raf = requestAnimationFrame(quadro)
    }

    Promise.all([
      carregaImagem(TEXTURAS.creme),
      carregaImagem(TEXTURAS.roxa),
      carregaImagem(TEXTURAS.vermelha),
      document.fonts?.load?.(`400 100px Anton`),
      document.fonts?.load?.(`400 40px "Permanent Marker"`),
    ]).then(([creme, roxa, vermelha]) => {
      const tRed = textura(vermelha, RED)
      NORMAL = { ...NORMAL, fundo: textura(creme, PAPER), topo: textura(roxa, ROXO) }
      TINTA = { ...TINTA, fundo: tRed, topo: tRed }
      comecar()
    }, comecar)

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
