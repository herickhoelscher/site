import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'

type Spot = 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

type Props = {
  seed: string | number
  /** Onde a fita prende o elemento. */
  at?: Spot
  width?: number
  height?: number
  /** Fita de papel neutra (padrão) ou fita vermelha de rótulo. */
  tone?: 'neutral' | 'red'
  label?: string
  className?: string
}

/**
 * Posição e deslocamento de cada ponto de fixação.
 *
 * O translate fica aqui, e não em classe do Tailwind, porque a rotação é
 * calculada por seed e precisa entrar na MESMA propriedade `transform` —
 * senão uma sobrescreve a outra.
 */
const PLACEMENT: Record<Spot, { pos: string; shift: string }> = {
  top: { pos: 'top-0 left-1/2', shift: 'translate(-50%, -50%)' },
  'top-left': { pos: 'top-0 left-0', shift: 'translate(-33%, -50%)' },
  'top-right': { pos: 'top-0 right-0', shift: 'translate(33%, -50%)' },
  'bottom-left': { pos: 'bottom-0 left-0', shift: 'translate(-33%, 50%)' },
  'bottom-right': { pos: 'bottom-0 right-0', shift: 'translate(33%, 50%)' },
}

/**
 * Fita crepe que "prende" o elemento no fundo.
 *
 * DESIGN.md: retângulo semi-translúcido rgba(239,233,218,0.7), 60x18, levemente
 * angulado. A borda serrilhada vem de um clip-path com dentes só nas pontas —
 * é o que separa fita de simples retângulo.
 */
export function Tape({
  seed,
  at = 'top',
  width = 60,
  height = 18,
  tone = 'neutral',
  label,
  className = '',
}: Props) {
  const { clipPath, angle } = useMemo(() => {
    const rng = makeRng(hashSeed(`tape:${seed}`))
    const jag = () => rng.range(4, 13)
    const [a, b, c, d] = [jag(), jag(), jag(), jag()]
    return {
      clipPath: `polygon(${a.toFixed(1)}% 0%, ${(100 - b).toFixed(1)}% 0%, 100% ${c.toFixed(
        1,
      )}%, ${(100 - a).toFixed(1)}% 100%, ${b.toFixed(1)}% 100%, 0% ${(100 - d).toFixed(1)}%)`,
      angle: Number(rng.range(-5, 5).toFixed(2)),
    }
  }, [seed])

  const { pos, shift } = PLACEMENT[at]
  const isLabel = tone === 'red'

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 flex items-center justify-center ${pos} ${className}`}
      style={{
        width,
        height,
        clipPath,
        transform: `${shift} rotate(${angle}deg)`,
        backgroundColor: isLabel ? 'var(--color-red)' : 'rgba(239, 233, 218, 0.7)',
        boxShadow: 'inset 0 0 0 1px rgba(20, 20, 20, 0.12)',
      }}
    >
      {label ? (
        <span
          className="px-1 text-[11px] font-bold tracking-[0.1em] whitespace-nowrap uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            color: isLabel ? 'var(--color-white)' : 'rgba(20,20,20,0.55)',
          }}
        >
          {label}
        </span>
      ) : null}
    </span>
  )
}
