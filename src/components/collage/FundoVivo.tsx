import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { rngFrom } from '@/lib/rng'

type Tom = 'escuro' | 'claro' | 'roxo'

const CORES: Record<Tom, { pecas: string[]; manchas: string[] }> = {
  escuro: { pecas: ['#E8432E', '#A68BE6', '#EFE9DA'], manchas: ['#765BA7', '#E8432E'] },
  claro: { pecas: ['#141414', '#E8432E', '#765BA7'], manchas: ['#E8432E', '#765BA7'] },
  roxo: { pecas: ['#EFE9DA', '#141414', '#A68BE6'], manchas: ['#141414', '#E8432E'] },
}

type Peca = {
  x: number
  y: number
  /** 0.25 (lá no fundo) a 1 (na frente): define tamanho, velocidade e parallax. */
  z: number
  tipo: 'ponto' | 'estrela' | 'cruz' | 'anel'
  cor: string
  r: number
  fase: number
  giro: number
}

type Mancha = { x: number; y: number; r: number; cor: string; fase: number; sprite?: HTMLCanvasElement }

/** Mancha de retícula: círculo de pontos que diminuem até a borda, desenhado uma vez. */
function retícula(r: number, cor: string) {
  const c = document.createElement('canvas')
  c.width = c.height = Math.ceil(r * 2)
  const g = c.getContext('2d')!
  g.fillStyle = cor
  const passo = Math.max(7, r / 11)
  for (let y = passo / 2; y < r * 2; y += passo) {
    for (let x = passo / 2; x < r * 2; x += passo) {
      const d = Math.hypot(x - r, y - r) / r
      if (d >= 1) continue
      const raio = (passo / 2) * (1 - d) ** 1.2
      g.beginPath()
      g.arc(x, y, raio, 0, Math.PI * 2)
      g.fill()
    }
  }
  return c
}

function estrela(g: CanvasRenderingContext2D, r: number) {
  g.beginPath()
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    const rr = k % 2 ? r * 0.3 : r
    g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
  }
  g.closePath()
  g.fill()
}

/**
 * Fundo vivo das seções: pontos, estrelas, cruzes e anéis no estilo zine,
 * mais umas manchas grandes de retícula, tudo derivando devagar e com
 * parallax pela rolagem (o que está "na frente" anda mais).
 *
 * Só anima com a seção na tela, a 30 quadros por segundo. Com movimento
 * reduzido, desenha uma vez e fica parado. É decoração: aria-hidden.
 */
export function FundoVivo({ tom = 'escuro', seed = 'fundo', className = '' }: { tom?: Tom; seed?: string; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const cv = canvas.current
    const pai = cv?.parentElement
    if (!cv || !pai) return
    const g = cv.getContext('2d')
    if (!g) return
    const cores = CORES[tom]
    let W = 0
    let H = 0
    let pecas: Peca[] = []
    let manchas: Mancha[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const monta = () => {
      W = pai.clientWidth
      H = pai.clientHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      const rng = rngFrom(`${seed}:${W > 760 ? 'd' : 'm'}`)
      const n = Math.max(22, Math.min(90, Math.round((W * H) / 16000)))
      const tipos: Peca['tipo'][] = ['ponto', 'ponto', 'estrela', 'cruz', 'anel']
      pecas = Array.from({ length: n }, () => ({
        x: rng.next(),
        y: rng.next(),
        z: 0.25 + rng.next() * 0.75,
        tipo: tipos[Math.floor(rng.next() * tipos.length)],
        cor: cores.pecas[Math.floor(rng.next() * cores.pecas.length)],
        r: 1.5 + rng.next() * 4.5,
        fase: rng.next() * Math.PI * 2,
        giro: rng.next() * Math.PI,
      }))
      manchas = Array.from({ length: W > 760 ? 3 : 2 }, (_, i) => {
        const r = (W > 760 ? 150 : 90) + rng.next() * 110
        const cor = cores.manchas[i % cores.manchas.length]
        return { x: rng.next(), y: 0.15 + rng.next() * 0.7, r, cor, fase: rng.next() * Math.PI * 2, sprite: retícula(r, cor) }
      })
    }

    const desenha = (t: number) => {
      const rect = pai.getBoundingClientRect()
      // quanto a seção já subiu na tela: base do parallax
      const sobe = -rect.top
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, W, H)

      g.globalAlpha = tom === 'claro' ? 0.1 : 0.2
      for (const m of manchas) {
        const x = m.x * W + Math.sin(t * 0.00012 + m.fase) * 40
        const y = m.y * H + Math.cos(t * 0.0001 + m.fase) * 30 - sobe * 0.12
        if (m.sprite) g.drawImage(m.sprite, x - m.r, y - m.r)
      }

      for (const p of pecas) {
        const deriva = (t * 0.008 * p.z) % (H + 40)
        let y = p.y * H - deriva - sobe * 0.22 * p.z
        y = ((y % (H + 40)) + H + 40) % (H + 40) - 20
        const x = p.x * W + Math.sin(t * 0.0005 * p.z + p.fase) * 14 * p.z
        const brilho = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.0018 + p.fase))
        g.globalAlpha = (tom === 'claro' ? 0.35 : 0.55) * brilho * (0.4 + p.z * 0.6)
        g.fillStyle = p.cor
        g.strokeStyle = p.cor
        const r = p.r * (0.6 + p.z * 0.7)
        g.setTransform(dpr, 0, 0, dpr, x * dpr, y * dpr)
        g.rotate(p.giro + t * 0.0004 * p.z)
        if (p.tipo === 'ponto') {
          g.beginPath()
          g.arc(0, 0, r, 0, Math.PI * 2)
          g.fill()
        } else if (p.tipo === 'estrela') {
          estrela(g, r * 2.2)
        } else if (p.tipo === 'cruz') {
          g.lineWidth = Math.max(1.5, r * 0.5)
          g.beginPath()
          g.moveTo(-r * 1.6, 0)
          g.lineTo(r * 1.6, 0)
          g.moveTo(0, -r * 1.6)
          g.lineTo(0, r * 1.6)
          g.stroke()
        } else {
          g.lineWidth = Math.max(1.2, r * 0.35)
          g.beginPath()
          g.arc(0, 0, r * 1.5, 0, Math.PI * 2)
          g.stroke()
        }
      }
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.globalAlpha = 1
    }

    monta()
    desenha(0)
    if (reduced) {
      const ro = new ResizeObserver(() => {
        monta()
        desenha(0)
      })
      ro.observe(pai)
      return () => ro.disconnect()
    }

    let raf = 0
    let ultimo = 0
    let visivel = false
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - ultimo < 33) return
      ultimo = t
      desenha(t)
    }
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visivel) raf = requestAnimationFrame(loop)
    })
    io.observe(pai)
    let espera = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(espera)
      espera = window.setTimeout(() => {
        monta()
        desenha(performance.now())
      }, 120)
    })
    ro.observe(pai)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(espera)
      io.disconnect()
      ro.disconnect()
    }
  }, [tom, seed, reduced])

  return <canvas ref={canvas} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}
