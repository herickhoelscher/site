import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type Props = {
  src: string
  /** Quadro parado: aparece antes do vídeo carregar e no lugar dele com movimento reduzido. */
  poster: string
  className?: string
}

/**
 * Vídeo de fundo, mudo e em loop.
 *
 * Só baixa quando o bloco chega perto da tela e pausa quando sai, para não
 * gastar dados nem bateria à toa. Com prefers-reduced-motion fica só o quadro
 * parado. É decoração: aria-hidden e sem controles.
 */
export function VideoFundo({ src, poster, className = '' }: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [perto, setPerto] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (typeof IntersectionObserver === 'undefined') {
      setPerto(true)
      return
    }
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setPerto(true)
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  if (reduced) {
    return <img src={poster} alt="" aria-hidden="true" className={`object-cover ${className}`} />
  }

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      poster={poster}
      src={perto ? src : undefined}
      className={`object-cover ${className}`}
    />
  )
}
