import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'

type Props = {
  /** Legenda em texto real embaixo das barras. Opcional. */
  code?: string
  seed?: string | number
  width?: number
  height?: number
  color?: string
  className?: string
}

/**
 * Código de barras decorativo. Porte de `barcodes()` do zine.js.
 *
 * O que o original faz e um laço ingênuo não faz: a cada passo sorteia a
 * largura da barra (1 a 4px), **pula** a barra em 35% das vezes e deixa um
 * vão variável. É daí que vem o ritmo irregular de código de barras de verdade.
 *
 * As barras são decorativas; a legenda é texto real (§ 9).
 */
export function Barcode({
  code,
  seed = code ?? 'barcode',
  width = 150,
  height = 40,
  color = '#141414',
  className = '',
}: Props) {
  const bars = useMemo(() => {
    const r = makeRng(hashSeed(seed))
    const out: Array<{ x: number; w: number }> = []
    let x = 0
    while (x < width) {
      const bw = 1 + Math.floor(r.next() * 4)
      if (r.next() > 0.35) out.push({ x, w: bw })
      x += bw + 1 + Math.floor(r.next() * 2)
    }
    return out
  }, [seed, width])

  return (
    <span className={`inline-flex flex-col items-start gap-1 ${className}`}>
      <svg width={width} height={height} fill={color} aria-hidden="true" role="presentation">
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y="0" width={b.w} height={height} />
        ))}
      </svg>
      {code ? (
        <span
          className="text-[11px] font-bold tracking-[0.1em] uppercase"
          style={{ fontFamily: 'var(--font-mono)', color }}
        >
          {code}
        </span>
      ) : null}
    </span>
  )
}
