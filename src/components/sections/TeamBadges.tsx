import { useState } from 'react'
import { Barcode } from '@/components/collage'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import type { Content } from '@/content'

type Props = { t: Content }

/** Cores do cordão e da borda por crachá: vermelho para o primeiro, lavanda para o segundo. */
const TONES = [
  { strap: 'var(--color-red)', border: 'var(--color-red)' },
  { strap: 'var(--color-lav)', border: 'var(--color-lav)' },
]

/** Rotação em repouso (máx. 2° para o texto continuar legível no celular, § 8). */
const REST = [-2, 2]

/**
 * Crachás dos verdadeiros gerentes (§ 5): foto em halftone, nome, cargo, frase,
 * cordão e clipe feitos em CSS.
 *
 * O balanço é uma rotação com origem no clipe e uma curva com overshoot, que
 * lembra o pêndulo sem precisar de keyframes. Com prefers-reduced-motion o
 * crachá fica parado.
 */
export function TeamBadges({ t }: Props) {
  const reduced = usePrefersReducedMotion()
  const [ativo, setAtivo] = useState<number | null>(null)

  return (
    <ul className="grid grid-cols-2 items-start gap-3 zine:gap-4">
      {t.ladob.gerentes.map((g, i) => {
        const tone = TONES[i % TONES.length]
        const rest = REST[i % REST.length]
        const swing = ativo === i && !reduced ? -rest * 3 : rest

        return (
          <li
            key={g.nome}
            onMouseEnter={() => setAtivo(i)}
            onMouseLeave={() => setAtivo(null)}
            className="flex flex-col items-center"
            style={{
              transform: `rotate(${swing}deg)`,
              transformOrigin: 'top center',
              transition: reduced ? 'none' : 'transform 0.9s cubic-bezier(0.3, 1.8, 0.5, 1)',
            }}
          >
            {/* cordão: duas tiras, uma na cor do crachá e outra preta */}
            <span aria-hidden="true" className="flex h-12 gap-1">
              <span className="block w-3" style={{ backgroundColor: tone.strap }} />
              <span className="block w-3 bg-ink" />
            </span>

            {/* clipe metálico */}
            <span
              aria-hidden="true"
              className="relative z-[2] -mb-2 block h-5 w-9 rounded-sm"
              style={{
                background: 'linear-gradient(180deg, #d9d9d9, #8c8c8c)',
                border: '2px solid var(--color-ink)',
              }}
            >
              <span
                className="absolute top-1/2 left-1/2 block h-1.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
              />
            </span>

            <article
              className="tex-creme shadow-zine-sm w-full px-2 pt-4 pb-3 text-ink"
              style={{ border: `3px solid ${tone.border}` }}
            >
              <div className="relative">
                <img
                  src={g.foto}
                  alt={`${g.nome}, ${g.cargo}`}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/5] w-full object-cover"
                  style={{ border: '2px solid var(--color-ink)' }}
                />
                {/* halftone por cima da foto, o "xerox" do crachá */}
                <span
                  aria-hidden="true"
                  className="tex-halftone pointer-events-none absolute inset-0 mix-blend-multiply"
                />
              </div>

              <h3
                className="mt-2 text-[1.6rem] leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {g.nome}
              </h3>
              <p
                className="mt-1 text-[10px] leading-tight font-bold tracking-[0.06em] uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {g.cargo}
              </p>
              <p
                className="mt-1.5 text-[1rem] leading-tight"
                style={{ fontFamily: 'var(--font-hand)' }}
              >
                {g.frase}
              </p>
              <Barcode seed={`cracha-${g.nome}`} width={90} height={22} className="mt-2" />
            </article>
          </li>
        )
      })}
    </ul>
  )
}
