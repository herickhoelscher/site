import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type Props = {
  /** MP4 (H.264): Safari, Chrome, Edge, celulares. */
  src: string
  /** WebM (VP9): para navegador sem H.264, como alguns Chromium de Linux. */
  webm?: string
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
export function VideoFundo({ src, webm, poster, className = '' }: Props) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [fonte, setFonte] = useState<string>()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const escolhida = webm && !el.canPlayType('video/mp4; codecs="avc1.42E01E"') ? webm : src
    if (typeof IntersectionObserver === 'undefined') {
      setFonte(escolhida)
      return
    }
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setFonte(escolhida)
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, src, webm])

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
      src={fonte}
      className={`object-cover ${className}`}
    />
  )
}
