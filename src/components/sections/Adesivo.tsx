import { Rabisco, type RabiscoTipo } from './Rabisco'

/** Contorno creme de adesivo recortado + sombra dura, só com drop-shadow. */
const RECORTE =
  'drop-shadow(2.5px 0 0 #F6F2E8) drop-shadow(-2.5px 0 0 #F6F2E8) drop-shadow(0 2.5px 0 #F6F2E8) drop-shadow(0 -2.5px 0 #F6F2E8) drop-shadow(4px 5px 0 rgba(20,20,20,.45))'

type Props = {
  tipo: RabiscoTipo
  /** Posição e tamanho (classes absolutas do Tailwind). */
  className?: string
  /** Inclinação em graus. Vai na propriedade `rotate`, separada do transform das animações. */
  giro?: number
  /** Animação contínua: flutuar, balançar ou girar. */
  mexe?: 'float' | 'float-2' | 'swing' | 'spin'
}

/**
 * Adesivo decorativo espalhado pelo Lado B, desenhado a partir dos temas que
 * mais aparecem no Pinterest do Herick. É enfeite: aria-hidden e sem clique.
 */
export function Adesivo({ tipo, className = '', giro = 0, mexe = 'float' }: Props) {
  const anim = { float: 'fx-float', 'float-2': 'fx-float-2', swing: 'fx-swing', spin: 'fx-spin-slow' }[mexe]
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-[3] block ${className}`} style={{ rotate: `${giro}deg` }}>
      <span className={`block h-full w-full ${anim}`} style={{ filter: RECORTE }}>
        <Rabisco tipo={tipo} className="block h-full w-full" />
      </span>
    </span>
  )
}
