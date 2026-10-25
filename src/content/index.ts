import { useLocation } from 'react-router-dom'
import { pt } from './pt'
import { en } from './en'
import type { Content, Issue, IssueSlug } from './types'

export type { Content, Issue, IssueSlug }
export { pt, en }

export const LOCALES = { pt, en } as const
export type Locale = keyof typeof LOCALES

/** O idioma vem do caminho: tudo sob /en é inglês, o resto é português. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt'
}

/** Prefixo de rota do idioma: '' para PT, '/en' para EN. */
export function localePrefix(locale: Locale): string {
  return locale === 'en' ? '/en' : ''
}

/** Mesma página, no outro idioma. */
export function swapLocalePath(pathname: string): string {
  if (localeFromPath(pathname) === 'en') {
    const rest = pathname.replace(/^\/en/, '')
    return rest || '/'
  }
  return pathname === '/' ? '/en' : `/en${pathname}`
}

export function useContent(): { t: Content; locale: Locale; prefix: string } {
  const { pathname } = useLocation()
  const locale = localeFromPath(pathname)
  return { t: LOCALES[locale], locale, prefix: localePrefix(locale) }
}

export function findIssue(t: Content, slug: string): Issue | undefined {
  return t.issues.lista.find((i) => i.slug === slug)
}
