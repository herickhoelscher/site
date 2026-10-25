import { useState } from 'react'
import { seededTilt } from '@/lib/rng'

type Props = {
  src: string
  /** Obrigatório: o briefing pede alt em todas as imagens (§ 9). */
  alt: string
  seed?: string | number
  width?: number | string
  height?: number | string
  /** Adesivo die-cut, recorte reto, ou imagem solta com sombra dura. */
  variant?: 'sticker' | 'cutout' | 'plain'
  /** Texto do placeholder quando o arquivo ainda não existe. */
  placeholder?: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Imagem recortada, com placeholder embutido.
 *
 * Os prints de projeto (public/prints/[slug]-1.jpg etc.) ainda não existem. Em
 * vez de quebrar o layout com imagem morta, o componente troca para uma moldura
 * tracejada rotulada assim que o src falha, que é o comportamento pedido no
 * briefing para os prints.
 */
export function StickerImg({
  src,
  alt,
  seed = src,
  width = '100%',
  height = 'auto',
  variant = 'sticker',
  placeholder,
  className = '',
  loading = 'lazy',
}: Props) {
  const [failed, setFailed] = useState(false)
  const rotate = seededTilt(`sticker:${seed}`, 2.5)

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`tex-halftone flex items-center justify-center bg-ink/60 px-3 py-6 text-center ${className}`}
        style={{
          width,
          height,
          minHeight: 120,
          transform: `rotate(${rotate}deg)`,
          border: '2px dashed var(--color-paper)',
        }}
      >
        <span
          className="text-[11px] font-bold tracking-[0.1em] text-paper uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {placeholder ?? '[ imagem pendente ]'}
        </span>
      </span>
    )
  }

  const frame =
    variant === 'sticker'
      ? { border: '2px solid var(--color-ink)', outline: '3px solid var(--color-white)' }
      : variant === 'cutout'
        ? { border: '2px solid var(--color-ink)' }
        : {}

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={`block object-cover ${variant !== 'plain' ? 'shadow-zine-sm' : ''} ${className}`}
      style={{ width, height, transform: `rotate(${rotate}deg)`, ...frame }}
    />
  )
}
