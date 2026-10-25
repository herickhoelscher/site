import type { Content } from '@/content'

type Props = { t: Content }

export function ChessCard({ t }: Props) {
  const { xadrez } = t.ladob

  return (
    <article className="relative min-w-0 border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm zine:p-6">
      <span aria-hidden="true" className="absolute top-3 left-4 h-4 w-4 rounded-full border-2 border-ink bg-red shadow-[2px_2px_0_#141414]" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3 pl-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{xadrez.kicker}</p>
          <h3 className="text-[clamp(1.35rem,3vw,1.75rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{xadrez.titulo}</h3>
        </div>
        <span className="bg-yellow-300 px-2 py-1 text-[10px] font-bold text-ink" style={{ fontFamily: 'var(--font-mono)' }}>{xadrez.modo}</span>
      </header>
      <div className="mb-4 rounded border-2 border-ink p-3 text-paper shadow-zine-sm" style={{ backgroundColor: '#48316d' }}>
        <p className="text-[10px] font-bold tracking-wider text-paper/80" style={{ fontFamily: 'var(--font-mono)' }}>{xadrez.statusLabel}</p>
        <p className="mt-1 text-lg leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{xadrez.rating}</p>
      </div>
      <div className="flex flex-col items-center gap-4 border-2 border-ink bg-white p-3 shadow-zine-sm zine:flex-row">
        <div aria-hidden="true" className="grid aspect-square w-36 shrink-0 grid-cols-8 grid-rows-8 border-2 border-ink shadow-zine-sm">
          {Array.from({ length: 64 }, (_, index) => (
            <span key={index} className={`relative flex items-center justify-center ${(Math.floor(index / 8) + index % 8) % 2 ? 'bg-zinc-800' : 'bg-paper'}`}>
              {index === 35 ? <span className="text-xl text-red">♟</span> : null}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <svg aria-hidden="true" viewBox="0 0 50 60" className="h-14 w-12 shrink-0">
              <path d="M11 36 10 22l9 7a17 17 0 0 1 12 0l9-7-1 14a15 15 0 1 1-28 0Z" fill="#EFE9DA" stroke="#141414" strokeWidth="2" />
              <ellipse cx="25" cy="39" rx="8" ry="6" fill="#6B4F3B" />
              <circle cx="21" cy="36" r="2" fill="#3B82F6" /><circle cx="29" cy="36" r="2" fill="#3B82F6" />
              <path d="M7 26 25 4l18 22Z" fill="#765BA7" stroke="#141414" strokeWidth="2" />
              <ellipse cx="25" cy="26" rx="18" ry="3" fill="#765BA7" stroke="#141414" strokeWidth="1.5" />
              <circle cx="25" cy="15" r="1.5" fill="#F9D423" />
            </svg>
            <div className="min-w-0">
              <p className="text-sm leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{xadrez.nome}</p>
              <p className="text-[9px] font-bold leading-snug text-ink/60" style={{ fontFamily: 'var(--font-mono)' }}>{xadrez.desc}</p>
            </div>
          </div>
          <div className="mt-2 border border-dashed border-ink/35 bg-zinc-100 p-2">
            <p className="text-xs leading-tight text-red" style={{ fontFamily: 'var(--font-marker)' }}>{xadrez.notaTitulo}</p>
            <p className="mt-1 text-[10px] leading-snug text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{xadrez.notaTexto}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
