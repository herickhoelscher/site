import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMeasure } from '@/lib/useMeasure'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useIsMobile } from '@/lib/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  /** Pontos normalizados "x,y;x,y;..." com x e y de 0 a 1 sobre a seção. */
  path: string
  /** Traçado alternativo no celular (<= 760px). */
  pathMobile?: string
  /** Desenhar conforme o scroll. O hero não precisa: ele já está na tela. */
  scrub?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Converte os pontos em curva suave (Catmull-Rom -> Bézier cúbica), exatamente
 * como `cables()` do zine.js.
 */
function toBezier(pts: Array<[number, number]>): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)},${c2[0].toFixed(1)} ${c2[1].toFixed(
      1,
    )},${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

/**
 * O cabo de rede que atravessa o site (§ 1: "o fio condutor").
 *
 * Diferente do que parece, não é um elemento fixo na lateral: cada seção tem o
 * seu trecho, com pontos próprios, e os trechos se encontram nas bordas
 * (a maioria vai de y=-0.02 a y=1.02, por isso emendam sem degrau).
 *
 * São três traços sobrepostos, como no protótipo: halo creme mais grosso para
 * destacar o cabo de qualquer fundo, núcleo preto, e um brilho fino deslocado
 * em -2,-2 que dá o volume do plástico.
 */
export function NetworkCable({ path, pathMobile, scrub = true, className = '', style }: Props) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const groupRef = useRef<SVGGElement>(null)

  const { d, stroke } = useMemo(() => {
    const raw = isMobile && pathMobile ? pathMobile : path
    if (!width || !height) return { d: '', stroke: 10 }
    const pts = raw
      .split(';')
      .map((p) => p.split(',').map(Number))
      .map(([x, y]) => [x * width, y * height] as [number, number])
    return { d: toBezier(pts), stroke: isMobile ? 7 : 10 }
  }, [path, pathMobile, isMobile, width, height])

  useEffect(() => {
    const group = groupRef.current
    const core = group?.querySelector<SVGPathElement>('[data-core]')
    if (!group || !core || !d) return

    if (!scrub || reduced) {
      gsap.set(group.querySelectorAll('path'), { strokeDasharray: 'none', strokeDashoffset: 0 })
      return
    }

    const len = core.getTotalLength()
    const paths = group.querySelectorAll('path')
    gsap.set(paths, { strokeDasharray: len, strokeDashoffset: len })

    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: group.closest('section') ?? group,
        start: 'top 85%',
        end: 'bottom 60%',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [d, scrub, reduced])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={style}
    >
      {d ? (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <g ref={groupRef}>
            <path d={d} fill="none" stroke="#F6F2E8" strokeWidth={stroke + 6} strokeLinecap="round" />
            <path data-core d={d} fill="none" stroke="#141414" strokeWidth={stroke} strokeLinecap="round" />
            <path
              d={d}
              fill="none"
              stroke="rgba(255,255,255,.22)"
              strokeWidth="2"
              strokeLinecap="round"
              transform="translate(-2,-2)"
            />
          </g>
        </svg>
      ) : null}
    </div>
  )
}
