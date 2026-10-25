import type { Content } from '@/content'
import type { Pin } from '@/content/types'

type Props = { t: Content }

const TONES: Record<Pin['tom'], { surface: string; title: string; detail: string }> = {
  ink: { surface: 'bg-ink', title: 'text-paper', detail: 'text-paper/75' },
  red: { surface: 'bg-red', title: 'text-white', detail: 'text-ink' },
  paper: { surface: 'bg-paper', title: 'text-ink', detail: 'text-ink/70' },
  brown: { surface: 'bg-amber-950', title: 'text-amber-100', detail: 'text-paper/80' },
}

const HEIGHTS = ['h-44', 'h-56', 'h-36', 'h-48']

export function PinterestMural({ t }: Props) {
  const { mural } = t.ladob

  return (
    <section className="relative rounded-xl border-4 border-ink p-4 text-ink shadow-zine zine:p-8" style={{ backgroundColor: '#d6ccb8', backgroundImage: 'radial-gradient(#9e8e75 1px, transparent 0)', backgroundSize: '12px 12px' }}>
      <header className="mb-8 text-center">
        <h2 className="inline-block -rotate-1 border-2 border-ink/50 bg-paper px-4 py-2 text-xl shadow-zine-sm zine:px-8 zine:text-2xl" style={{ fontFamily: 'var(--font-marker)' }}>{mural.titulo}</h2>
        <p className="mx-auto mt-4 max-w-3xl break-words text-[10px] font-bold leading-relaxed zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{mural.tags}</p>
      </header>
      {/*
        Os pins são conteúdo próprio, HTML puro: renderizam direto. O LazyEmbed
        existe para script de terceiro, e envolvê-los aqui deixava a seção vazia
        até a pessoa rolar até ela. Quando o widget real do Pinterest entrar,
        é ELE que vai dentro do LazyEmbed, não os cartões.
      */}
      <ul className="grid grid-cols-1 items-start gap-6 zine:grid-cols-2 xl:grid-cols-4">
          {mural.pins.map((pin, index) => {
            const tone = TONES[pin.tom]
            return (
              <li key={pin.pin} className="relative min-w-0 border-[3px] border-ink bg-white p-3 shadow-zine-sm transition-transform hover:-translate-y-1">
                <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-red shadow-[2px_2px_0_#141414]" />
                <div className={`flex ${HEIGHTS[index % HEIGHTS.length]} min-w-0 flex-col justify-between border border-ink p-3 text-center ${tone.surface}`}>
                  {pin.kicker ? <span className={`block break-words text-[10px] font-bold tracking-wider ${tone.detail}`} style={{ fontFamily: 'var(--font-mono)' }}>{pin.kicker}</span> : <span />}
                  <div className="min-w-0">
                    <p className={`break-words text-[clamp(1.25rem,3vw,2rem)] leading-tight ${tone.title}`} style={{ fontFamily: 'var(--font-display)' }}>{pin.titulo}</p>
                    <p className={`mt-1 break-words text-[9px] font-bold tracking-wider ${tone.detail}`} style={{ fontFamily: 'var(--font-mono)' }}>{pin.sub}</p>
                  </div>
                  {pin.extra ? <p className={`break-words border-t border-current/30 pt-1 text-[8px] ${tone.detail}`} style={{ fontFamily: 'var(--font-mono)' }}>{pin.extra}</p> : <span />}
                </div>
                <p className="mt-3 break-words text-[9px] font-bold text-ink/60" style={{ fontFamily: 'var(--font-mono)' }}>{pin.pin}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/85">{pin.texto}</p>
              </li>
            )
          })}
      </ul>
    </section>
  )
}
