import { useEffect, useRef } from 'react'
import { makeRng } from '@/lib/rng'

type Props = {
  /** O nome, uma linha por item. No celular vem quebrado em duas. */
  linhas: string[]
  /** Texto do adesivo vermelho. */
  adesivo: string
  width: number
  height: number
  isMobile: boolean
  /** Chamado quando a entrada termina, para o pai subir o Mike e a Missi. */
  onEntradaFim?: () => void
}

const INK = '#141414'
const PAPER = '#EFE9DA'
const RED = '#E8432E'
const CIANO = '#00E5FF'

/** 24 fps, e cada pose segura 2 quadros. */
const QUADRO = 1000 / 24
const POSE = QUADRO * 2

const LETRA_MS = 400
const ENTRE_LETRAS = 40
const QUEDA_MS = 250
const TREMIDA_POSES = 5
const ANEL_MS = 520

/** Nós da corda que desenha a diagonal. */
const NOS = 72

type Gota = { x: number; y: number; vy: number; vida: number; sobe: boolean }
type Faisca = { x: number; y: number; vx: number; vy: number; forte: boolean }
type Anel = { x: number; y: number; nasceu: number }

/**
 * Abertura do hero em canvas 2D.
 *
 * O desenho é todo próprio. A ideia emprestada da referência é o conceito — um
 * nome gigante partido por uma diagonal onde a cor inverte, com granulado e
 * tinta. Retícula que fecha, mola na linha, hit-stop e tremida de placas são
 * implementação daqui.
 *
 * Três decisões que valem explicação:
 *
 * 1. Nada de easing contínuo. Tudo é amostrado num relógio de POSE (83 ms), que
 *    é a cadência dura de stop-motion pedida. O requestAnimationFrame existe só
 *    para acertar o passo: o estado só anda quando a pose vira.
 *
 * 2. A inversão de cor não é truque de cor: o nome é desenhado duas vezes, uma
 *    em creme recortada pela área escura e outra em preto recortada pela área
 *    clara, com `clip()`. Mesmo princípio da versão em CSS.
 *
 * 3. O h1 de verdade continua no HTML do pai. Este canvas é `aria-hidden`, não
 *    carrega texto acessível e pode sumir sem perda de conteúdo.
 */
export function HeroCanvas({ linhas, adesivo, width, height, isMobile, onEntradaFim }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fimRef = useRef(onEntradaFim)
  fimRef.current = onEntradaFim

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !width || !height) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const rng = makeRng(42)
    let rodando = true
    let raf = 0

    // ---- granulado: um ruído só, reaproveitado ----------------------------
    const ruido = document.createElement('canvas')
    ruido.width = ruido.height = 128
    {
      const rc = ruido.getContext('2d')!
      const img = rc.createImageData(128, 128)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 110 + rng.next() * 145
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v
        img.data[i + 3] = 255
      }
      rc.putImageData(img, 0, 0)
    }
    const grao = ctx.createPattern(ruido, 'repeat')

    // ---- a corda que faz a diagonal ---------------------------------------
    const yEsq = height * (isMobile ? 0.6 : 0.63)
    const yDir = height * (isMobile ? 0.4 : 0.36)
    const base = (i: number) => yEsq + (yDir - yEsq) * (i / (NOS - 1))

    const desl = new Float32Array(NOS)
    const vel = new Float32Array(NOS)

    const empurra = (xNorm: number, forca: number) => {
      const c = Math.round(xNorm * (NOS - 1))
      for (let i = -6; i <= 6; i++) {
        const k = c + i
        if (k < 1 || k >= NOS - 1) continue
        vel[k] += forca * Math.exp(-(i * i) / 10)
      }
    }

    /** Um passo da mola: cada nó persegue a média dos vizinhos. */
    const passoCorda = (pose: number) => {
      for (let i = 1; i < NOS - 1; i++) {
        vel[i] += ((desl[i - 1] + desl[i + 1]) / 2 - desl[i]) * 0.42
        vel[i] *= 0.9
      }
      for (let i = 1; i < NOS - 1; i++) {
        // ondulação lenta de fundo, para a linha nunca ficar morta
        desl[i] += vel[i] + Math.sin(pose * 0.09 + i * 0.26) * 0.22
      }
    }

    const yEm = (x: number) => {
      const f = Math.max(0, Math.min(NOS - 1, (x / width) * (NOS - 1)))
      const i = Math.min(NOS - 2, Math.floor(f))
      const t = f - i
      const a = base(i) + desl[i]
      const b = base(i + 1) + desl[i + 1]
      return a + (b - a) * t
    }

    /** Área acima da linha (o preto) e área abaixo (o creme). */
    const caminhoEscuro = () => {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(width, 0)
      ctx.lineTo(width, yEm(width))
      for (let x = width; x >= 0; x -= width / (NOS - 1)) ctx.lineTo(x, yEm(x))
      ctx.closePath()
    }
    const caminhoClaro = () => {
      ctx.beginPath()
      ctx.moveTo(0, height)
      ctx.lineTo(0, yEm(0))
      for (let x = 0; x <= width; x += width / (NOS - 1)) ctx.lineTo(x, yEm(x))
      ctx.lineTo(width, height)
      ctx.closePath()
    }

    // ---- tipografia e glifos ----------------------------------------------
    type Glifo = { ch: string; x: number; y: number; w: number; ordem: number }
    let glifos: Glifo[] = []
    let tamanho = 100
    let alturaLinha = 100
    let topo = 0

    const fonte = (px: number) => `${px}px Anton, "Arial Narrow", sans-serif`

    const medir = () => {
      ctx.font = fonte(100)
      const maior = Math.max(...linhas.map((l) => ctx.measureText(l).width))
      tamanho = (100 * (width * (isMobile ? 0.92 : 0.94))) / maior
      alturaLinha = tamanho * 0.82
      topo = height / 2 - (alturaLinha * linhas.length) / 2

      ctx.font = fonte(tamanho)
      ctx.textBaseline = 'alphabetic'
      glifos = []
      let ordem = 0
      linhas.forEach((linha, li) => {
        let x = (width - ctx.measureText(linha).width) / 2
        const y = topo + alturaLinha * (li + 1)
        for (const ch of linha) {
          const w = ctx.measureText(ch).width
          glifos.push({ ch, x, y, w, ordem: ordem++ })
          x += w
        }
      })
    }

    /*
      Canvas auxiliar da retícula. Não dá para usar clip() com a forma de uma
      letra, então os pontos são pintados aqui e depois cortados pela silhueta
      com 'destination-in'. É isso que faz a grade aparecer só dentro do glifo.
    */
    const aux = document.createElement('canvas')
    const auxCtx = aux.getContext('2d')!

    const desenhaLetraEmRetícula = (g: Glifo, p: number, cor: string) => {
      const padX = tamanho * 0.2
      const padY = alturaLinha * 0.35
      const bw = Math.ceil(g.w + padX * 2)
      const bh = Math.ceil(alturaLinha + padY * 2)
      if (aux.width !== bw || aux.height !== bh) {
        aux.width = bw
        aux.height = bh
      }
      auxCtx.setTransform(1, 0, 0, 1, 0, 0)
      auxCtx.clearRect(0, 0, bw, bh)

      // 1. a grade de pontos, crescendo
      const celula = Math.max(4, tamanho * 0.05)
      const raio = celula * 0.72 * p
      auxCtx.fillStyle = cor
      for (let yy = 0; yy < bh + celula; yy += celula) {
        for (let xx = 0; xx < bw + celula; xx += celula) {
          auxCtx.beginPath()
          auxCtx.arc(xx, yy, raio, 0, Math.PI * 2)
          auxCtx.fill()
        }
      }

      // 2. corta pela silhueta da letra
      auxCtx.globalCompositeOperation = 'destination-in'
      auxCtx.font = fonte(tamanho)
      auxCtx.textBaseline = 'alphabetic'
      auxCtx.fillStyle = '#000'
      auxCtx.fillText(g.ch, padX, padY + alturaLinha * 0.84)
      auxCtx.globalCompositeOperation = 'source-over'

      ctx.drawImage(aux, g.x - padX, g.y - alturaLinha * 0.84 - padY)
    }

    const desenhaNome = (t: number, cor: string, dx = 0, dy = 0) => {
      ctx.save()
      ctx.translate(dx, dy)
      ctx.font = fonte(tamanho)
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = cor
      for (const g of glifos) {
        const p = Math.max(0, Math.min(1, (t - g.ordem * ENTRE_LETRAS) / LETRA_MS))
        if (p <= 0) continue
        if (p >= 1) ctx.fillText(g.ch, g.x, g.y)
        else desenhaLetraEmRetícula(g, p, cor)
      }
      ctx.restore()
    }

    const desenhaAdesivo = (p: number) => {
      if (p <= 0) return
      const q = Math.min(1, p)
      const x = width * (isMobile ? 0.3 : 0.2)
      const yFim = topo + alturaLinha * linhas.length + tamanho * 0.2
      const y = yFim - (1 - q) * height * 0.3
      const giro = (1 - q) * -0.8 - 0.09

      const px = Math.max(14, tamanho * 0.16)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(giro)
      ctx.font = fonte(px)
      ctx.textBaseline = 'alphabetic'
      const w = ctx.measureText(adesivo).width
      ctx.fillStyle = RED
      ctx.fillRect(-px * 0.5, -px * 1.05, w + px, px * 1.45)
      ctx.fillStyle = INK
      ctx.fillText(adesivo, 0, 0)
      ctx.restore()
    }

    // ---- partículas --------------------------------------------------------
    const QTD = isMobile ? 75 : 150
    const faiscas: Faisca[] = Array.from({ length: QTD }, () => {
      const x = rng.range(0, width)
      return {
        x,
        y: base(Math.round((x / width) * (NOS - 1))) + rng.jitter(110),
        vx: rng.range(0.6, 2.2),
        vy: rng.jitter(0.25),
        forte: rng.next() > 0.5,
      }
    })
    const gotas: Gota[] = []
    const aneis: Anel[] = []

    const mouse = { x: -9999, y: -9999 }
    const moveu = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    window.addEventListener('pointermove', moveu, { passive: true })

    // ---- linha do tempo ----------------------------------------------------
    const entradaFim = () => (glifos.length - 1) * ENTRE_LETRAS + LETRA_MS
    let relogio = 0 // tempo da animação, só avança quando a pose vira
    let anterior = 0
    let congela = 0
    let ultimaPousada = -1
    let avisou = false
    let pose = 0

    const quadro = (agora: number) => {
      if (!rodando) return
      raf = requestAnimationFrame(quadro)
      if (document.hidden) {
        anterior = agora // aba escondida: congela sem acumular salto
        return
      }
      if (!anterior) anterior = agora
      const dt = agora - anterior
      anterior = agora

      if (congela > 0) {
        congela -= dt // hit-stop: o quadro do impacto segura
        return
      }

      relogio += dt
      const novaPose = Math.floor(relogio / POSE)
      if (novaPose === pose) return
      pose = novaPose
      const t = pose * POSE

      passoCorda(pose)

      // tranco na linha a cada letra que pousa
      const pousadas = Math.floor((t - LETRA_MS) / ENTRE_LETRAS)
      if (pousadas > ultimaPousada && pousadas >= 0 && pousadas < glifos.length) {
        ultimaPousada = pousadas
        const g = glifos[pousadas]
        empurra((g.x + g.w / 2) / width, 5.5)
        for (let i = 0; i < 3; i++) {
          const gx = g.x + rng.range(0, g.w)
          gotas.push({ x: gx, y: yEm(gx), vy: rng.range(0.7, 2.2), vida: 1, sobe: rng.next() > 0.5 })
        }
      }

      const quedaIni = entradaFim() + 60
      const queda = (t - quedaIni) / QUEDA_MS
      const impacto = quedaIni + QUEDA_MS

      if (t >= impacto && aneis.length === 0) {
        congela = POSE
        const ax = width * (isMobile ? 0.3 : 0.2)
        const ay = topo + alturaLinha * linhas.length
        for (let i = 0; i < 3; i++) aneis.push({ x: ax, y: ay, nasceu: t + i * POSE })
        empurra(ax / width, 18)
      }

      const posesPos = Math.floor((t - impacto - POSE) / POSE)
      const tremendo = posesPos >= 0 && posesPos < TREMIDA_POSES
      const desvio = tremendo ? (TREMIDA_POSES - posesPos) * 3.4 : 0
      const sinal = posesPos % 2 === 0 ? 1 : -1

      if (!avisou && t > impacto + TREMIDA_POSES * POSE) {
        avisou = true
        fimRef.current?.()
      }

      // ===================== pintura =====================
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = PAPER
      ctx.fillRect(0, 0, width, height)
      caminhoEscuro()
      ctx.fillStyle = INK
      ctx.fill()

      // placas desalinhadas da tremida
      if (tremendo) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        desenhaNome(t, CIANO, -desvio * sinal, 0)
        desenhaNome(t, RED, desvio * sinal, 0)
        ctx.restore()
      }

      ctx.save()
      caminhoEscuro()
      ctx.clip()
      desenhaNome(t, PAPER)
      ctx.restore()

      ctx.save()
      caminhoClaro()
      ctx.clip()
      desenhaNome(t, INK)
      ctx.restore()

      desenhaAdesivo(queda)

      // anéis de choque, invertendo o que estiver embaixo
      if (aneis.length) {
        ctx.save()
        ctx.globalCompositeOperation = 'difference'
        ctx.strokeStyle = '#ffffff'
        for (const a of aneis) {
          const idade = t - a.nasceu
          if (idade < 0 || idade > ANEL_MS) continue
          ctx.lineWidth = Math.max(1, 14 * (1 - idade / ANEL_MS))
          ctx.beginPath()
          ctx.arc(a.x, a.y, (idade / ANEL_MS) * Math.max(width, height) * 0.55, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.restore()
      }

      // faíscas andando para a direita, atraídas pelo mouse
      for (const f of faiscas) {
        f.x += f.vx
        f.y += (yEm(f.x) - f.y) * 0.04 + f.vy
        const dx = mouse.x - f.x
        const dy = mouse.y - f.y
        if (dx * dx + dy * dy < 170 * 170) {
          f.x += dx * 0.035
          f.y += dy * 0.035
        }
        if (f.x > width + 10) {
          f.x = -10
          f.y = yEm(0) + rng.jitter(110)
        }
        // a cor segue o lado: claro no escuro, escuro no claro
        ctx.fillStyle = f.y < yEm(f.x) ? PAPER : INK
        ctx.globalAlpha = f.forte ? 0.8 : 0.45
        ctx.fillRect(Math.round(f.x), Math.round(f.y), 2, 2)
      }
      ctx.globalAlpha = 1

      // gotas saindo da linha
      for (let i = gotas.length - 1; i >= 0; i--) {
        const g = gotas[i]
        g.y += g.sobe ? -g.vy : g.vy
        g.vida -= 0.045
        if (g.vida <= 0) {
          gotas.splice(i, 1)
          continue
        }
        ctx.globalAlpha = g.vida
        ctx.fillStyle = g.sobe ? PAPER : INK
        ctx.beginPath()
        ctx.arc(g.x, g.y, 1.6 + g.vida * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // granulado por cima
      if (grao) {
        ctx.save()
        ctx.globalAlpha = 0.07
        ctx.globalCompositeOperation = 'overlay'
        ctx.fillStyle = grao
        // desloca o padrão a cada pose, senão o grão parece congelado
        ctx.translate((pose * 7) % 128, (pose * 11) % 128)
        ctx.fillRect(-128, -128, width + 256, height + 256)
        ctx.restore()
      }
    }

    // espera a Anton: medir antes dá a métrica da fonte substituta
    let cancelado = false
    const comecar = () => {
      if (cancelado) return
      medir()
      raf = requestAnimationFrame(quadro)
    }
    if (document.fonts?.load) document.fonts.load('400 100px Anton').then(comecar, comecar)
    else comecar()

    return () => {
      rodando = false
      cancelado = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', moveu)
    }
  }, [linhas, adesivo, width, height, isMobile])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ width, height }}
    />
  )
}
