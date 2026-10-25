import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Lê prefers-reduced-motion e reage a mudanças em tempo real.
 *
 * O briefing manda desligar scrub, quedas, cursor e easter eggs de física
 * quando o usuário pede menos movimento — então esse hook é o portão único
 * usado por todas as animações.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
