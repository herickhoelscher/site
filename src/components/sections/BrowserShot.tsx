import { useState } from 'react'
import { seededTilt } from '@/lib/rng'

type Props = {
  src: string
  alt: string
  /** Texto da barra de endereço: o domínio do site ou o caminho do repositório. */
  url?: string | null
  /** Altura fixa da imagem. Sem ela, a imagem fica em 16:10. */
  height?: number
  seed: string
  /** Inclinação máxima, em graus. */
  tilt?: number
  className?: string
}

const rotulo = (url?: string | null) => {
  if (!url) return null
  try {
    const u = new URL(url)
    const caminho = u.hostname === 'github.com' ? u.pathname.replace(/\/$/, '') : ''
    return u.hostname.replace(/^www\./, '') + caminho
  } catch {
    return url
  }
}

/**
 * Print de um projeto dentro de uma janela de navegador desenhada no estilo do
 * site: barra preta com as três bolinhas nas cores da paleta e o endereço em
 * mono. O print fica preso pelo topo, que é onde está o cabeçalho do site.
 */
export function BrowserShot({ src, alt, url, height, seed, tilt = 1.2, className = '' }: Props) {
  const [falhou, setFalhou] = useState(false)
  const rot = seededTilt(`shot:${seed}`, tilt)
  const endereco = rotulo(url)

  return (
    <figure
      className={`min-w-0 overflow-hidden border-2 border-ink bg-ink shadow-zine-sm ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <div aria-hidden="true" className="flex items-center gap-1.5 px-2 py-[5px]">
        <span className="size-2 shrink-0 rounded-full bg-red" />
        <span className="size-2 shrink-0 rounded-full bg-lav" />
        <span className="size-2 shrink-0 rounded-full bg-paper" />
        {endereco ? (
          <span
            className="ml-1.5 min-w-0 truncate text-[9px] tracking-[0.05em] text-paper/75"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {endereco}
          </span>
        ) : null}
      </div>
      {falhou ? (
        <div
          role="img"
          aria-label={alt}
          className={`tex-halftone grid place-items-center bg-paper/10 ${height ? '' : 'aspect-[16/10]'}`}
          style={height ? { height } : undefined}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFalhou(true)}
          className={`block w-full bg-paper object-cover object-top ${height ? '' : 'aspect-[16/10]'}`}
          style={height ? { height } : undefined}
        />
      )}
    </figure>
  )
}
