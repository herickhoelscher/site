import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Barra vermelha fina no topo da tela, que enche conforme a página rola.
 * Atualiza no máximo uma vez por quadro e só mexe em transform (não pesa).
 */
export function Progresso() {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    let raf = 0
    const atualiza = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const pede = () => {
      if (!raf) raf = requestAnimationFrame(atualiza)
    }
    atualiza()
    window.addEventListener('scroll', pede, { passive: true })
    window.addEventListener('resize', pede)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', pede)
      window.removeEventListener('resize', pede)
    }
  }, [pathname])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[4px] origin-left bg-red"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}
