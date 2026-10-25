import { Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '@/components/ScrollToTop'
import { RecordTransition } from '@/components/RecordTransition'
import { EasterEggs } from '@/components/EasterEggs'
import LadoA from '@/pages/LadoA'
import LadoB from '@/pages/LadoB'
import ProjectPage from '@/pages/ProjectPage'
import NotFound from '@/pages/NotFound'
import Kit from '@/pages/Kit'

/**
 * Rotas em PT e EN.
 *
 * O idioma não é estado: ele sai do próprio caminho (`useContent` lê a URL).
 * Por isso cada página aparece duas vezes aqui, sem provider nem contexto no
 * meio — e o link de troca de idioma é um `<Link>` normal, indexável.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <RecordTransition />
      <EasterEggs />
      <Routes>
        {/* PT */}
        <Route path="/" element={<LadoA />} />
        <Route path="/issues/:slug" element={<ProjectPage />} />
        <Route path="/lado-b" element={<LadoB />} />

        {/* EN */}
        <Route path="/en" element={<LadoA />} />
        <Route path="/en/issues/:slug" element={<ProjectPage />} />
        <Route path="/en/lado-b" element={<LadoB />} />

        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
