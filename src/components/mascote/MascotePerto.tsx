import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import type { MascoteProps } from './Mascote'

const Mascote = lazy(() => import('./Mascote'))

/**
 * Mascote fora do hero: só monta (e só baixa o three.js e o modelo) quando a
 * caixa chega perto da tela, para cada cópia não custar um WebGL desde o início.
 */
export function MascotePerto({ className, ...rest }: Omit<MascoteProps, 'reduced'>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setPerto(true); io.disconnect() }
    }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {perto && (
        <Suspense fallback={null}>
          <Mascote reduced={reduced} className="h-full w-full" {...rest} />
        </Suspense>
      )}
    </div>
  )
}
