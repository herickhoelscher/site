import type { Content } from '@/content'
import { LazyEmbed } from './LazyEmbed'

type Props = { t: Content }

export function Mixtape({ t }: Props) {
  const { mixtape, musicas } = t.ladob

  return (
    <article className="relative min-w-0 border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm zine:p-6">
      <span aria-hidden="true" className="absolute -top-3 left-1/3 h-5 w-28 -rotate-2 border-x-2 border-dashed border-ink/20 bg-paper/85" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>{mixtape.kicker}</p>
          <h3 className="text-[clamp(1.35rem,3vw,1.75rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{mixtape.titulo}</h3>
        </div>
        <span className="bg-ink px-2 py-1 text-[10px] font-bold text-paper" style={{ fontFamily: 'var(--font-mono)' }}>{mixtape.tipo}</span>
      </header>

      <div className="relative mb-5 rounded-lg border-4 border-ink bg-zinc-800 p-3 shadow-zine-sm zine:p-4" aria-label={mixtape.titulo}>
        {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((position) => (
          <span key={position} aria-hidden="true" className={`absolute h-2 w-2 rounded-full border border-ink bg-zinc-400 ${position}`} />
        ))}
        <div className="rounded border-2 border-ink bg-paper p-3 text-center">
          <div className="flex justify-between gap-2 border-b border-dashed border-ink/35 pb-1 text-[9px] font-bold zine:text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="text-red">{mixtape.side}</span><span>{mixtape.dolby}</span>
          </div>
          <div aria-hidden="true" className="my-2 flex items-center justify-around gap-2 rounded-full border-2 border-zinc-500 bg-zinc-950 px-2 py-2 zine:px-4">
            {[0, 1].map((reel) => <span key={reel} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-400 ${reel === 1 ? 'order-3' : ''}`}><span className="h-2.5 w-2.5 rounded-full bg-zinc-200" /></span>)}
            <span className="h-4 min-w-0 flex-1 rounded border border-zinc-600 bg-amber-950" />
          </div>
          <p className="text-xs" style={{ fontFamily: 'var(--font-marker)' }}>{mixtape.nota}</p>
        </div>
      </div>

      <ol className="space-y-2.5">
        {musicas.map((musica, index) => {
          const spotifyId = musica.spotifyId.trim()
          return (
            <li key={`${musica.titulo}-${index}`} className="min-w-0 border-2 border-ink bg-white p-2 shadow-zine-sm">
              <div className="flex min-w-0 items-center gap-2 text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-ink font-bold text-white">{index + 1}</span>
                <span className="min-w-0 flex-1 leading-snug"><strong className="block break-words">{musica.titulo}</strong><span className="block break-words text-ink/65">{musica.artista}</span></span>
                <span className="shrink-0 text-[10px] text-ink/55">{musica.duracao}</span>
              </div>
              {spotifyId ? (
                <LazyEmbed height={80} className="mt-2">
                  <iframe title={`${musica.titulo} · ${musica.artista}`} src={`https://open.spotify.com/embed/track/${encodeURIComponent(spotifyId)}`} width="100%" height="80" loading="lazy" allow="encrypted-media" className="block border-0" />
                </LazyEmbed>
              ) : (
                <div aria-hidden="true" className="mt-2 h-5 border border-dashed border-ink/30 bg-ink/5" />
              )}
            </li>
          )
        })}
      </ol>
    </article>
  )
}
