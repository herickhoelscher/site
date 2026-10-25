import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'
import { useMeasure } from '@/lib/useMeasure'

type Props = {
  seed: string | number
  color?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * Respingo de tinta. Porte de `splats()` do zine.js.
 *
 * São 4 aglomerados, cada um com um círculo grande e 26 gotas espalhadas em
 * volta a até 4,2× o raio. Essa densidade é o que dá cara de tinta jogada em
 * vez de bolha isolada.
 *
 * O elemento se mede sozinho e preenche o espaço que o pai der: no protótipo o
 * respingo é posicionado com left/top/width/height soltos sobre a seção.
 */
export function Splat({ seed, color = '#E8432E', className = '', style }: Props) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  const circles = useMemo(() => {
    if (!width || !height) return []
    const r = makeRng(hashSeed(seed))
    const out: Array<{ cx: number; cy: number; r: number }> = []

    for (let k = 0; k < 4; k++) {
      const cx = width * (0.25 + r.next() * 0.5)
      const cy = height * (0.25 + r.next() * 0.5)
      const R = 8 + r.next() * 22
      out.push({ cx, cy, r: R })
      for (let n = 0; n < 26; n++) {
        const a = r.next() * 6.283
        const dist = R * (1 + r.next() * 3.2)
        out.push({
          cx: cx + Math.cos(a) * dist,
          cy: cy + Math.sin(a) * dist,
          r: 1 + r.next() * R * 0.22,
        })
      }
    }
    return out
  }, [seed, width, height])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={style}
    >
      <svg width={width} height={height} fill={color} className="overflow-visible">
        {circles.map((c, i) => (
          <circle key={i} cx={c.cx.toFixed(1)} cy={c.cy.toFixed(1)} r={c.r.toFixed(1)} />
        ))}
      </svg>
    </div>
  )
}
