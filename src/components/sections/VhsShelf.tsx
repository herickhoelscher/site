import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Content } from '@/content'

type Props = { t: Content }

type Mood = 'red' | 'lav' | 'neon'

type MoodStyle = {
  /** Camada que tinge o painel. Fica sempre montada para o fade funcionar. */
  wash: CSSProperties
  /** Realce do chip ativo. */
  chip: string
}

const MOODS: Record<Mood, MoodStyle> = {
  red: {
    wash: { backgroundColor: 'rgba(232, 67, 46, 0.6)' },
    chip: 'bg-red text-ink',
  },
  lav: {
    wash: { backgroundColor: 'rgba(166, 139, 230, 0.55)' },
    chip: 'bg-lav text-ink',
  },
  // gradiente não faz transição de cor, por isso cada clima é uma camada com fade de opacity
  neon: {
    wash: {
      backgroundImage:
        'linear-gradient(135deg, rgba(0, 240, 255, 0.5), rgba(255, 0, 170, 0.5))',
    },
    chip: 'bg-ink text-[#00f0ff]',
  },
}

/*
  O clima é por TÍTULO, como pede a especificação (§ 5). PT e EN usam os mesmos
  três nomes em t.ladob.animes.lista, então um mapa só serve aos dois idiomas.
*/
const MOOD_BY_TITLE: Record<string, Mood> = {
  'Attack on Titan': 'red',
  Frieren: 'lav',
  'Cyberpunk: Edgerunners': 'neon',
}

/**
 * Animes (§ 5): fitas VHS + chips. Passar o mouse ou focar um chip troca o
 * clima do painel (`data-mood`): vermelho, lavanda ou neon.
 *
 * Os chips são <button>, não <span>, para receberem foco pelo teclado. O
 * clique também liga o clima, porque no celular não existe hover.
 */
export function VhsShelf({ t }: Props) {
  const { lista, nota } = t.ladob.animes
  const [mood, setMood] = useState<Mood | null>(null)

  return (
    <div
      data-mood={mood ?? 'none'}
      className="relative isolate px-3 pt-3 pb-4"
      style={{ border: '2px solid transparent' }}
    >
      {(Object.keys(MOODS) as Mood[]).map((m) => (
        <span
          key={m}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
          style={{ ...MOODS[m].wash, opacity: mood === m ? 1 : 0 }}
        />
      ))}

      {/* decorativa: os títulos estão nos chips logo abaixo */}
      <img
        src="/assets/vhs.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="mx-auto block w-full max-w-[420px]"
        style={{ filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.3))' }}
      />

      <ul className="mt-3 flex flex-wrap gap-2">
        {lista.map((titulo) => {
          const m = MOOD_BY_TITLE[titulo]
          // o TS só estreita `m` dentro da própria condição, por isso a classe sai daqui
          const chip = m && mood === m ? MOODS[m].chip : 'bg-ink text-white'
          return (
            <li key={titulo}>
              <button
                type="button"
                onMouseEnter={() => setMood(m ?? null)}
                onFocus={() => setMood(m ?? null)}
                onClick={() => setMood(m ?? null)}
                onMouseLeave={() => setMood(null)}
                onBlur={() => setMood(null)}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase transition-colors ${chip}`}
                style={{ fontFamily: 'var(--font-mono)', border: '2px solid var(--color-ink)' }}
              >
                {titulo}
              </button>
            </li>
          )
        })}
      </ul>

      {/* fundo escuro garante contraste em qualquer clima, inclusive lavanda */}
      <p
        className="mt-3 inline-block bg-ink px-2 py-0.5 text-[1.1rem] leading-tight text-white"
        style={{ fontFamily: 'var(--font-hand)' }}
      >
        {nota}
      </p>
    </div>
  )
}
