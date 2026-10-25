import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/** Lado A e Lado B. Qualquer outra rota não dispara a virada. */
function sideOf(pathname: string): 'a' | 'b' | null {
  if (/\/lado-b$/.test(pathname)) return 'b'
  if (pathname === '/' || pathname === '/en') return 'a'
  return null
}

/**
 * Transição do disco entre o Lado A e o Lado B (§ 0 e § 6).
 *
 * Só dispara quando a navegação realmente troca de lado — ir para uma página de
 * projeto não gira nada. É puramente decorativa e `pointer-events-none`, então
 * nunca engole um clique; e com prefers-reduced-motion não existe.
 */
export function RecordTransition() {
  const { pathname } = useLocation()
  const reduced = usePrefersReducedMotion()
  const [spinning, setSpinning] = useState(false)
  const prevSide = useRef(sideOf(pathname))

  useEffect(() => {
    const side = sideOf(pathname)
    const before = prevSide.current
    prevSide.current = side

    if (reduced || !side || !before || side === before) return

    setSpinning(true)
    const t = window.setTimeout(() => setSpinning(false), 700)
    return () => window.clearTimeout(t)
  }, [pathname, reduced])

  if (!spinning) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
      style={{ animation: 'record-fade .7s ease-out forwards' }}
    >
      <div className="absolute inset-0 bg-ink/70" />
      <div
        className="relative h-[52vmin] w-[52vmin] rounded-full"
        style={{
          background:
            'repeating-radial-gradient(circle, #141414 0 5px, #1e1e1e 5px 7px) , #141414',
          animation: 'record-flip .7s cubic-bezier(.5,0,.3,1) forwards',
        }}
      >
        <span className="absolute inset-0 m-auto h-[16%] w-[16%] rounded-full bg-red" />
        <span className="absolute inset-0 m-auto h-[3%] w-[3%] rounded-full bg-paper" />
      </div>

      <style>{`
        @keyframes record-flip {
          from { transform: rotateY(0deg) scale(.6); }
          to   { transform: rotateY(180deg) scale(1); }
        }
        @keyframes record-fade {
          0%   { opacity: 0; }
          25%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
