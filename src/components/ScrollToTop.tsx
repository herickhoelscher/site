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
    /*
      'instant', não 'auto': o html tem `scroll-behavior: smooth` para as
      âncoras do menu, e 'auto' herda esse valor. O resultado era a página
      subindo rolando por quase um segundo ao abrir uma issue, mostrando o
      conteúdo antigo passando. 'instant' ignora a regra CSS.
    */
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
