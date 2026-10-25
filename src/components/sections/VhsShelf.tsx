import { useState } from 'react'
import type { Content } from '@/content'
import type { Tape } from '@/content/types'

type Props = { t: Content }

const MOOD: Record<Tape['mood'], { stripe: string; title: string; wash: string }> = {
  red: { stripe: 'bg-red', title: 'text-paper', wash: '#f0d2c8' },
  lav: { stripe: 'bg-lav', title: 'text-lav', wash: '#e5dbef' },
  neon: { stripe: 'bg-yellow-400', title: 'text-yellow-300', wash: '#d8e9de' },
}

export function VhsShelf({ t }: Props) {
  const { vhs } = t.ladob
  const [mood, setMood] = useState<Tape['mood'] | null>(null)

  return (
    <article data-mood={mood ?? 'none'} className="relative min-w-0 border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm transition-colors zine:p-6" style={{ backgroundColor: mood ? MOOD[mood].wash : undefined }}>
      <span aria-hidden="true" className="absolute top-3 right-4 h-4 w-4 rounded-full border-2 border-ink bg-red shadow-[2px_2px_0_#141414]" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3 pr-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{vhs.kicker}</p>
          <h3 className="text-[clamp(1.35rem,3vw,1.75rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{vhs.titulo}</h3>
        </div>
        <span className="bg-red px-2 py-1 text-[10px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>{vhs.modo}</span>
      </header>
      <p className="mb-4 text-xs leading-relaxed text-ink/75">{vhs.texto}</p>
      <ul className="space-y-3">
        {vhs.fitas.map((fita) => (
          <li key={fita.vol}>
            <button type="button" onMouseEnter={() => setMood(fita.mood)} onFocus={() => setMood(fita.mood)} onMouseLeave={() => setMood(null)} onBlur={() => setMood(null)} onClick={() => setMood(fita.mood)} className="relative flex w-full min-w-0 items-center justify-between gap-2 border-[3px] border-ink bg-zinc-900 p-3 text-left text-paper shadow-zine-sm transition-transform hover:-translate-y-0.5">
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-2.5 ${MOOD[fita.mood].stripe}`} />
              <span className="min-w-0 pl-2">
                <span className="block break-words text-[9px] tracking-widest text-zinc-300" style={{ fontFamily: 'var(--font-mono)' }}>{fita.vol}</span>
                <span className={`block break-words text-xl tracking-wide ${MOOD[fita.mood].title}`} style={{ fontFamily: 'var(--font-display)' }}>{fita.nome}</span>
              </span>
              <span className="shrink-0 -rotate-2 bg-paper px-2 py-0.5 text-[9px] text-ink" style={{ fontFamily: 'var(--font-marker)' }}>{fita.selo}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-right text-xs text-red" style={{ fontFamily: 'var(--font-marker)' }}>{vhs.nota}</p>
    </article>
  )
}
