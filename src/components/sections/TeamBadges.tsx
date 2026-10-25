import { useState } from 'react'
import type { Content } from '@/content'
import { StickerImg } from '@/components/collage'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

type Props = { t: Content }

export function TeamBadges({ t }: Props) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  return (
    <ul className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 zine:grid-cols-2 zine:gap-10">
      {t.ladob.gerentes.map((gerente, index) => {
        const resting = index % 2 ? 1 : -1
        const angle = active === index && !reduced ? resting * -3 : resting
        return (
          <li key={gerente.id} className="flex min-w-0 flex-col items-center" onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'top center', transition: reduced ? 'none' : 'transform .8s cubic-bezier(.3,1.7,.5,1)' }}>
            <span aria-hidden="true" className={`relative z-10 -mb-3 flex h-12 w-7 items-center justify-center rounded-t-sm border-2 border-ink shadow-zine-sm ${index % 2 ? 'bg-lav' : 'bg-red'}`}><span className="h-2 w-2 rounded-full border border-ink bg-paper" /></span>
            <article className="w-full border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm zine:p-6">
              <header className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-2 text-[10px] font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                <span className={`px-2 py-0.5 text-white ${index % 2 ? 'bg-red' : 'bg-ink'}`}>{gerente.passe}</span>
                <span className="text-ink/60">{gerente.id}</span>
              </header>
              <div className="mb-4 border-2 border-ink bg-white p-3 text-center shadow-zine-sm">
                <div className="flex h-44 items-center justify-center overflow-hidden border border-ink/30 bg-zinc-200">
                  <StickerImg src={gerente.foto} alt={gerente.nome} placeholder={gerente.fotoLabel} variant="plain" height={176} className="w-full object-cover" />
                </div>
                <p className="mt-2 text-[10px] text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{gerente.especie}</p>
                <h3 className="mt-1 text-sm" style={{ fontFamily: 'var(--font-marker)' }}>{gerente.nome}</h3>
              </div>
              <div className={`border border-ink px-3 py-2 ${index % 2 ? 'bg-lav/30' : 'bg-yellow-200/50'}`}>
                <p className="text-[9px] font-bold tracking-wider text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{gerente.cargoLabel}</p>
                <p className="text-sm leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{gerente.cargo}</p>
              </div>
              <blockquote className="mt-2 border-2 border-dashed border-ink/30 bg-white p-3 text-xs italic leading-relaxed">“{gerente.frase}”</blockquote>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink/20 pt-3 text-[9px] font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                <span className="text-ink/60">{gerente.status}</span>
                <span className={index % 2 ? 'text-red' : 'text-emerald-700'}>{gerente.selo}</span>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
