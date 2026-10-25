import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'

/** Os cinco tipos do zine.js. */
export type DoodleKind = 'star' | 'crown' | 'arrow' | 'swirl' | 'lines'

type Props = {
  kind: DoodleKind
  seed?: string | number
  size?: number
  color?: string
  className?: string
  /** Se vier, o rabisco deixa de ser decorativo e ganha nome acessível. */
  label?: string
}

/**
 * Rabiscos de marginália. Porte de `doodle()` do zine.js.
 *
 * O detalhe que faz parecer caneta: são DOIS traços. O principal, e um fantasma
 * por cima com todos os números deslocados em ±1.1px, com 45% da espessura e
 * 80% de opacidade — como quem passou a caneta duas vezes e não acertou.
 */
function buildPath(kind: DoodleKind, s: number, j: (a: number) => number): string {
  if (kind === 'star') {
    const c = s / 2
    const R = s * 0.44
    const pts: Array<[number, number]> = []
    for (let i = 0; i <= 5; i++) {
      const a = ((-90 + i * 144) * Math.PI) / 180
      pts.push([c + R * Math.cos(a) + j(s * 0.07), c + R * Math.sin(a) + j(s * 0.07)])
    }
    // fecha passando de novo perto do começo, como o traço contínuo do original
    pts.push([pts[1][0] * 0.7 + pts[0][0] * 0.3, pts[1][1] * 0.7 + pts[0][1] * 0.3])
    return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')
  }

  if (kind === 'crown') {
    const w = s
    const h = s * 0.75
    const y0 = h * 0.22
    const p: Array<[number, number]> = [
      [w * 0.06, h * 0.9],
      [w * 0.02, y0 + j(4)],
      [w * 0.28, h * 0.55],
      [w * 0.5, y0 - 4 + j(4)],
      [w * 0.72, h * 0.55],
      [w * 0.98, y0 + j(4)],
      [w * 0.94, h * 0.9],
      [w * 0.04, h * 0.92],
    ]
    return 'M' + p.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L')
  }

  if (kind === 'arrow') {
    return `M${s * 0.05} ${s * 0.2} C ${s * 0.45} ${s * 0.05}, ${s * 0.75} ${s * 0.4}, ${
      s * 0.85
    } ${s * 0.85} M${s * 0.62} ${s * 0.7} L${s * 0.86} ${s * 0.88} L${s * 0.95} ${s * 0.6}`
  }

  if (kind === 'swirl') {
    return `M${s * 0.1} ${s * 0.6} C ${s * 0.2} ${s * 0.1}, ${s * 0.45} ${s * 0.1}, ${
      s * 0.4
    } ${s * 0.5} S ${s * 0.65} ${s * 0.9}, ${s * 0.75} ${s * 0.4} S ${s * 0.95} ${s * 0.2}, ${
      s * 0.92
    } ${s * 0.55}`
  }

  return `M${s * 0.15} ${s * 0.75} L${s * 0.35} ${s * 0.15} M${s * 0.45} ${s * 0.8} L${
    s * 0.62
  } ${s * 0.22} M${s * 0.72} ${s * 0.82} L${s * 0.88} ${s * 0.3}`
}

export function Doodle({
  kind,
  seed = kind,
  size = 50,
  color = '#E8432E',
  className = '',
  label,
}: Props) {
  const { d, ghost, stroke } = useMemo(() => {
    const r = makeRng(hashSeed(seed))
    const j = (a: number) => r.jitter(a)
    const d = buildPath(kind, size, j)
    // o fantasma: mesmo path com cada número deslocado
    const ghost = d.replace(/-?\d+(\.\d+)?/g, (v) => (parseFloat(v) + r.jitter(2.2)).toFixed(1))
    return { d, ghost, stroke: Math.max(2.5, size / 22) }
  }, [kind, seed, size])

  const decorative = !label

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`pointer-events-none overflow-visible ${className}`}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-label={label}
    >
      {label ? <title>{label}</title> : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={ghost}
        fill="none"
        stroke={color}
        strokeWidth={stroke * 0.45}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  )
}
