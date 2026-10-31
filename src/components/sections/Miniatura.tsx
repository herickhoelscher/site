import { useState } from 'react'
import { miniatura } from '@/lib/youtube'

type Props = {
  yt: string
  alt: string
  className?: string
  /** Texto que aparece no lugar da imagem se o YouTube não responder. */
  reserva: string
  eager?: boolean
}

/**
 * Miniatura oficial do trailer. Tenta a de alta resolução; se o vídeo não tiver,
 * cai para a hqdefault (4:3 com tarjas, que o object-cover corta); se nem essa
 * carregar, mostra o nome em letra grande, no estilo do site.
 */
export function Miniatura({ yt, alt, className = '', reserva, eager }: Props) {
  const [etapa, setEtapa] = useState<0 | 1 | 2>(0)

  if (etapa === 2) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`tex-halftone flex items-center justify-center bg-ink p-3 text-center text-[clamp(1rem,2.4vw,1.6rem)] leading-none text-paper ${className}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {reserva}
      </span>
    )
  }

  return (
    <img
      src={miniatura(yt, etapa === 0 ? 'maxresdefault' : 'hqdefault')}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setEtapa((e) => (e === 0 ? 1 : 2))}
      className={`object-cover ${className}`}
    />
  )
}
