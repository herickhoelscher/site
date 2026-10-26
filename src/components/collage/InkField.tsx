import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'

type Props = {
  seed: string | number
  width: number
  height: number
  /** Onde a tinta se concentra: a linha do rasgo, em y, por x normalizado. */
  lineAt: (xNorm: number) => number
  color: string
  /** Quantos aglomerados de tinta. */
  clusters?: number
  /** 0 a 1: quanto da animação de assentar já passou. */
  settled?: boolean
  className?: string
}

/**
 * Campo de respingos de tinta que acompanha a linha do rasgo.
 *
 * É o efeito líquido da referência (dotconor): a tinta não fica espalhada à toa,
 * ela se adensa em volta do corte diagonal, como se tivesse escorrido por ali.
 * Cada gota é um círculo; os borrões maiores são caminhos fechados irregulares,
 * que é o que separa "mancha de tinta" de "bolinha".
 *
 * O componente é desenhado DUAS vezes no hero, uma dentro de cada camada
 * recortada. Assim a tinta inverte de cor no corte junto com as letras, sem
 * nenhum cálculo extra: é o mesmo clip-path que já existe.
 */
export function InkField({
  seed,
  width,
  height,
  lineAt,
  color,
  clusters = 10,
  settled = true,
  className = '',
}: Props) {
  const { blobs, drops } = useMemo(() => {
    if (!width || !height) return { blobs: [], drops: [] }

    const r = makeRng(hashSeed(seed))
    const blobs: Array<{ d: string; delay: number }> = []
    const drops: Array<{ cx: number; cy: number; r: number; delay: number }> = []

    for (let c = 0; c < clusters; c++) {
      // posiciona o aglomerado ao longo do rasgo, com desvio vertical
      const xn = (c + 0.5) / clusters + r.jitter(0.1)
      const cx = Math.max(0, Math.min(1, xn)) * width
      const cy = lineAt(cx / width) + r.jitter(height * 0.3)
      const base = r.range(16, 46)
      const delay = c * 55

      // mancha central irregular, em coordenadas polares
      const steps = 13
      const pts: Array<[number, number]> = []
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2
        const rad = base * r.range(0.55, 1.35)
        pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad])
      }
      let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
      for (let i = 0; i < pts.length; i++) {
        const cur = pts[i]
        const nxt = pts[(i + 1) % pts.length]
        d += ` Q ${cur[0].toFixed(1)} ${cur[1].toFixed(1)} ${((cur[0] + nxt[0]) / 2).toFixed(
          1,
        )} ${((cur[1] + nxt[1]) / 2).toFixed(1)}`
      }
      blobs.push({ d: d + ' Z', delay })

      // as gotas em volta, mais longe quanto menores
      const n = r.int(22, 38)
      for (let i = 0; i < n; i++) {
        const a = r.range(0, Math.PI * 2)
        const dist = base * r.range(1.05, 4.6)
        drops.push({
          cx: cx + Math.cos(a) * dist,
          cy: cy + Math.sin(a) * dist * 0.75,
          r: r.range(1.4, base * 0.3),
          delay: delay + r.range(0, 260),
        })
      }
    }

    return { blobs, drops }
  }, [seed, width, height, lineAt, clusters])

  if (!width || !height) return null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
      role="presentation"
      fill={color}
    >
      {blobs.map((b, i) => (
        <path
          key={`b${i}`}
          d={b.d}
          style={{
            opacity: settled ? 1 : 0,
            transform: settled ? 'scale(1)' : 'scale(.2)',
            transformOrigin: 'center',
            transformBox: 'fill-box',
            transition: `opacity 320ms ease-out ${b.delay}ms, transform 520ms cubic-bezier(.34,1.4,.64,1) ${b.delay}ms`,
          }}
        />
      ))}
      {drops.map((d, i) => (
        <circle
          key={`d${i}`}
          cx={d.cx.toFixed(1)}
          cy={d.cy.toFixed(1)}
          r={d.r.toFixed(1)}
          style={{
            opacity: settled ? 1 : 0,
            transition: `opacity 260ms ease-out ${d.delay}ms`,
          }}
        />
      ))}
    </svg>
  )
}
