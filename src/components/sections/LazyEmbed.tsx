import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Altura da moldura em pixels. É a altura que o embed vai ocupar, para a página não pular. */
  height: number
  /** Margem de antecipação do observer: começa a carregar um pouco antes de aparecer. */
  rootMargin?: string
  className?: string
}

/**
 * Só monta os filhos quando o bloco entra na tela (§ 7).
 *
 * Spotify e Pinterest são scripts/iframes de terceiros e pesam no carregamento
 * inicial, então o embed nem existe no DOM até a pessoa chegar perto dele.
 * Antes disso fica uma moldura com a MESMA altura, senão o layout daria um
 * salto quando o player aparecesse.
 *
 * Depois que entrou, não desmonta mais: sair da tela e voltar não pode
 * recarregar o player no meio da música.
 */
export function LazyEmbed({ children, height, rootMargin = '200px', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    // navegador sem IntersectionObserver: melhor carregar já do que nunca
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible, rootMargin])

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {visible ? (
        children
      ) : (
        <div
          aria-hidden="true"
          className="tex-halftone w-full bg-ink/10"
          style={{ height, border: '2px dashed var(--color-ink)' }}
        />
      )}
    </div>
  )
}
