import { Link, useLocation } from 'react-router-dom'
import { swapLocalePath, useContent } from '@/content'

type Props = { className?: string }

/**
 * Troca de idioma preservando a página atual.
 *
 * É um <Link> de verdade, não um botão com onClick: assim o buscador segue o
 * par PT/EN e o usuário pode abrir em outra aba.
 */
export function LangToggle({ className = '' }: Props) {
  const { pathname } = useLocation()
  const { t, locale } = useContent()
  const target = swapLocalePath(pathname)

  return (
    <Link
      to={target}
      hrefLang={locale === 'pt' ? 'en' : 'pt-BR'}
      aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para português'}
      className={`rounded-full border-2 border-current px-4 py-1 text-[13px] font-bold transition-colors hover:text-red ${className}`}
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <span aria-hidden="true">{t.nav.lang}</span>
    </Link>
  )
}
