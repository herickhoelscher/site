import type { Content } from '@/content'

type Props = { t: Content }

const LABELS = ['bg-red', 'bg-emerald-700', 'bg-blue-700', 'bg-amber-600']

export function Cartridges({ t }: Props) {
  const { jogos } = t.ladob

  return (
    <article className="relative min-w-0 border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm zine:p-6">
      <span aria-hidden="true" className="absolute -top-3 right-8 h-5 w-28 rotate-2 border-x-2 border-dashed border-ink/20 bg-paper/85" />
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{jogos.kicker}</p>
          <h3 className="text-[clamp(1.35rem,3vw,1.75rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{jogos.titulo}</h3>
        </div>
        <span className="bg-ink px-2 py-1 text-[10px] font-bold text-paper" style={{ fontFamily: 'var(--font-mono)' }}>{jogos.slot}</span>
      </header>
      <p className="mb-4 text-xs leading-relaxed text-ink/75">{jogos.texto}</p>
      <ul className="grid grid-cols-2 gap-2 zine:gap-3">
        {jogos.cartuchos.map((cartucho, index) => (
          <li key={cartucho.cart} className="min-w-0 rounded-t-lg border-[3px] border-ink bg-zinc-300 p-2 shadow-zine-sm">
            <div aria-hidden="true" className="mb-2 h-2 rounded-t border-b border-zinc-500 bg-zinc-400" />
            <div className={`flex min-h-16 flex-col items-center justify-center border-2 border-ink p-1.5 text-center text-white ${LABELS[index % LABELS.length]}`}>
              <span className="text-[8px] tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>{cartucho.genero}</span>
              <span className="block break-words text-sm leading-tight zine:text-base" style={{ fontFamily: 'var(--font-display)' }}>{cartucho.nome}</span>
            </div>
            <p className="mt-1 text-center text-[8px] font-bold text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{cartucho.cart}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink/20 pt-2 text-[10px]">
        <span className="font-bold text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{jogos.rodape}</span>
        <span className="text-purple" style={{ fontFamily: 'var(--font-marker)' }}>{jogos.nota}</span>
      </div>
    </article>
  )
}
