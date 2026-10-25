import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Rola para o topo a cada troca de rota.
 *
 * Sem isso, abrir uma issue a partir do meio do mural deixa o leitor no meio da
 * página de projeto. Âncoras internas (#setlist) continuam funcionando porque
 * só agimos quando não há hash.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
