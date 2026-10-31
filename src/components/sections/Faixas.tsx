/**
 * Fitas de texto correndo, como faixa de show colada na parede.
 *
 * A lista aparece duas vezes em sequência e a trilha anda metade da própria
 * largura (classe fx-marquee em theme.css), então o laço não tem emenda. A
 * segunda cópia é aria-hidden: o leitor de tela lê cada item uma vez só.
 */
type FitaProps = {
  itens: string[]
  /** Classes de posição, giro e cor. */
  className?: string
  /** Anda para o outro lado. */
  reverso?: boolean
  /** Cor do ✱ entre os itens (numa fita vermelha, o vermelho some). */
  marca?: string
}

export function Fita({ itens, className = '', reverso = false, marca = 'text-red' }: FitaProps) {
  // repete para a trilha ser sempre mais larga que a tela
  const lista = [...itens, ...itens]
  return (
    <div className={`absolute left-[-6%] w-[112%] overflow-hidden border-y-[3px] border-ink py-1.5 shadow-zine-sm zine:py-2 ${className}`}>
      <div className={`fx-marquee flex w-max ${reverso ? 'fx-marquee-rev' : ''}`}>
        {[0, 1].map((copia) => (
          <ul key={copia} aria-hidden={copia === 1 ? true : undefined} className="flex shrink-0 items-center">
            {lista.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex items-center gap-4 pr-4 text-[clamp(1rem,2.1vw,1.7rem)] leading-none whitespace-nowrap uppercase"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item}
                <span aria-hidden="true" className={`text-[0.8em] ${marca}`}>
                  ✱
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/** Duas fitas cruzadas: uma preta com o que o Herick faz, uma creme com a stack. */
export function Faixas({ a, b, className = '' }: { a: string[]; b: string[]; className?: string }) {
  return (
    <div className={`relative h-[112px] overflow-hidden zine:h-[136px] ${className}`}>
      <Fita itens={a} className="top-[18px] -rotate-2 bg-ink text-paper" />
      <Fita itens={b} reverso className="top-[60px] rotate-[1.5deg] bg-paper text-ink zine:top-[72px]" />
    </div>
  )
}
