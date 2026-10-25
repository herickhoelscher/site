import { Route, Routes } from 'react-router-dom'
import LadoA from '@/pages/LadoA'
import Kit from '@/pages/Kit'

/**
 * Rotas. O Lado A já existe em PT e EN; as páginas de projeto, o Lado B e a
 * 404 entram nas próximas etapas.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LadoA />} />
      <Route path="/en" element={<LadoA />} />
      <Route path="/kit" element={<Kit />} />
      <Route path="*" element={<LadoA />} />
    </Routes>
  )
}
