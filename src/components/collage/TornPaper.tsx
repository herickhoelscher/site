import type { CSSProperties, ReactNode } from 'react'
import { useMemo } from 'react'
import { makeRng, hashSeed, seededTilt } from '@/lib/rng'
import { useMeasure } from '@/lib/useMeasure'

/** 't' topo, 'r' direita, 'b' base, 'l' esquerda — igual ao data-sides do zine.js. */
type Sides = string

type Props = {
  children?: ReactNode
  seed: string | number
  /** Lados rasgados. Padrão 'trbl', todos. */
  sides?: Sides
  /** Amplitude do rasgo em pixels (data-torn do zine.js, padrão 6). */
  amp?: number
  tilt?: number | false
  shadow?: boolean
  /** Classes do elemento recortado (fundo, padding, layout interno). */
  className?: string
  /**
   * Classes do wrapper que carrega a sombra e a rotação. É ele que ocupa a
   * caixa no layout do pai, então `h-full` numa grade vai aqui.
   */
  wrapperClassName?: string
  style?: CSSProperties
  as?: 'div' | 'article' | 'section' | 'aside' | 'li' | 'figure'
}

/**
 * Porte de `tornPolygon` do zine.js:
 *
 *   const pts = [], step = () => 7 + r() * 9, j = on => on ? r() * amp : 0;
 *   for (let x = 0; x < w; x += step()) pts.push([x, j(t)]);          // topo
 *   for (let y = 0; y < h; y += step()) pts.push([w - j(r), y]);      // direita
 *   for (let x = w; x > 0; x -= step()) pts.push([x, h - j(b)]);      // base
 *   for (let y = h; y > 0; y -= step()) pts.push([j(l), y]);          // esquerda
 *
 * O passo e a profundidade são em pixels, então o dente tem o mesmo tamanho
 * em qualquer card. Precisa medir o elemento, por isso o useMeasure.
 */
export function TornPaper({
  children,
  seed,
  sides = 'trbl',
  amp = 6,
  tilt,
  shadow = true,
  className = '',
  wrapperClassName = '',
  style,
  as: Tag = 'div',
}: Props) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()

  const clipPath = useMemo(() => {
    if (!width || !height) return undefined

    const r = makeRng(hashSeed(seed))
    const step = () => 7 + r.next() * 9
    const j = (on: boolean) => (on ? r.next() * amp : 0)
    const t = sides.includes('t')
    const rt = sides.includes('r')
    const b = sides.includes('b')
    const l = sides.includes('l')

    const pts: Array<[number, number]> = []
    for (let x = 0; x < width; x += step()) pts.push([x, j(t)])
    for (let y = 0; y < height; y += step()) pts.push([width - j(rt), y])
    for (let x = width; x > 0; x -= step()) pts.push([x, height - j(b)])
    for (let y = height; y > 0; y -= step()) pts.push([j(l), y])

    return `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})`
  }, [seed, sides, amp, width, height])

  const rotation = tilt === false ? 0 : (tilt ?? seededTilt(seed))

  /*
    A sombra vai no wrapper, não no elemento recortado — é o .torn-wrap do
    protótipo. O navegador aplica clip-path depois do filter no mesmo elemento,
    então uma sombra aplicada junto do recorte seria cortada fora junto com ele.
  */
  return (
    <div
      className={`${shadow ? 'shadow-zine' : ''} ${wrapperClassName}`}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      <Tag ref={ref as never} className={`relative ${className}`} style={{ clipPath, ...style }}>
        {children}
      </Tag>
    </div>
  )
}
