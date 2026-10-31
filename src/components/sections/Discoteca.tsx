import { useMemo, useState } from 'react'
import type { Content } from '@/content'
import { LazyEmbed } from './LazyEmbed'

/** Cor do rótulo de cada disco, alternando as do site. */
const ROTULOS = ['bg-red', 'bg-lav', 'bg-paper']

/**
 * Discoteca de cabeceira: a vitrola vermelha, as gavetas por gênero com as
 * capas oficiais dos álbuns (servidas pelo Spotify) e o player oficial do
 * Spotify tocando a faixa escolhida. Clicar numa capa puxa o disco para cima.
 */
export function Discoteca({ t }: { t: Content }) {
  const { discoteca, musicas } = t.ladob
  const gavetas = useMemo(() => [...new Set(musicas.map((m) => m.genero))], [musicas])
  const [gaveta, setGaveta] = useState(gavetas[0])
  const [ativa, setAtiva] = useState(0)
  const atual = musicas[ativa]
  const naGaveta = musicas.map((m, i) => ({ m, i })).filter(({ m }) => m.genero === gaveta)

  return (
    <section className="relative mb-20 grid min-w-0 items-start gap-12 zine:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] zine:gap-14">
      <figure data-fx="slide-l" className="relative mx-auto w-full max-w-[400px] zine:sticky zine:top-24">
        <span aria-hidden="true" className="absolute -top-3 left-1/2 z-[2] h-6 w-28 -translate-x-1/2 rotate-2 border-x-2 border-dashed border-ink/20 bg-paper/85" />
        <img
          src="/assets/ladob/vitrola-vermelho.webp"
          alt={discoteca.legenda}
          loading="lazy"
          className="block aspect-[9/11] w-full -rotate-2 border-[3px] border-ink object-cover shadow-zine"
        />
        <figcaption
          className="absolute -bottom-4 right-3 rotate-2 border-2 border-ink bg-paper px-3 py-1 text-xs text-ink shadow-zine-sm"
          style={{ fontFamily: 'var(--font-marker)' }}
        >
          {discoteca.legenda}
        </figcaption>
      </figure>

      <div data-fx="rise" className="min-w-0 text-paper">
        <p className="text-[10px] font-bold tracking-[0.25em] text-paper/80 zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          {discoteca.kicker}
        </p>
        <h2
          className="mt-2 text-[clamp(2.3rem,6vw,4.6rem)] leading-[0.9] drop-shadow-[3px_3px_0_#141414]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {discoteca.titulo}
        </h2>

        {/* gavetas de gênero */}
        <div className="mt-5 flex flex-wrap items-center gap-2" role="tablist" aria-label={discoteca.gavetas}>
          <span className="mr-1 text-sm text-paper/85" style={{ fontFamily: 'var(--font-marker)' }}>
            {discoteca.gavetas}:
          </span>
          {gavetas.map((g) => (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={g === gaveta}
              onClick={() => setGaveta(g)}
              className={`border-2 border-ink px-3 py-1 text-xs font-bold tracking-[0.08em] shadow-[2px_2px_0_#141414] transition-transform hover:-translate-y-0.5 ${g === gaveta ? 'bg-red text-paper' : 'bg-paper text-ink'}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-paper/85" style={{ fontFamily: 'var(--font-marker)' }}>
          {discoteca.escolha}
        </p>

        <ul className="mt-3 grid grid-cols-3 gap-3 pt-[15%] zine:gap-5">
          {naGaveta.map(({ m, i }, k) => {
            const ligada = i === ativa
            return (
              <li key={`${m.spotifyId}-${i}`} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={ligada}
                  onClick={() => setAtiva(i)}
                  className="group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                >
                  {/* o disco atrás da capa: sobe um pouco no hover e quase todo quando toca */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-[6%] top-[4%] aspect-square transition-[translate] duration-500 ease-out ${
                      ligada ? '-translate-y-[46%]' : 'group-hover:-translate-y-[20%]'
                    }`}
                  >
                    <span
                      className={`relative block h-full w-full rounded-full border-2 border-ink ${ligada ? 'fx-spin' : ''}`}
                      style={{ background: 'repeating-radial-gradient(circle, #0d0d0d 0 3px, #222 3px 5px)', animationDuration: '2.4s' }}
                    >
                      <span className={`absolute inset-0 m-auto h-[34%] w-[34%] rounded-full ${ROTULOS[k % ROTULOS.length]}`}>
                        <span className="absolute left-1/2 top-[18%] h-[14%] w-[14%] -translate-x-1/2 rounded-full bg-ink" />
                      </span>
                    </span>
                  </span>
                  <span className="relative block border-[3px] border-ink bg-ink shadow-zine-sm transition-transform group-hover:-rotate-2">
                    <img
                      src={m.capa}
                      alt={`${m.album} · ${m.artista}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="block aspect-square w-full object-cover"
                    />
                  </span>
                  <span className="mt-2 block truncate text-[clamp(0.8rem,1.4vw,1rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {m.titulo}
                  </span>
                  <span className="block truncate text-[9px] text-paper/75 zine:text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {m.artista} · {m.album}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* tocando agora: o player oficial do Spotify, com capa e trecho */}
        <div className="mt-7 border-[3px] border-ink bg-paper p-3 text-ink shadow-zine-sm zine:p-4" aria-live="polite">
          <div className="mb-3 flex items-center gap-4">
            <span aria-hidden="true" className="flex h-10 shrink-0 items-end gap-[3px]">
              {Array.from({ length: 9 }, (_, i) => (
                <i
                  key={i}
                  className="fx-eq block w-[5px] origin-bottom bg-red"
                  style={{ height: `${35 + ((i * 37) % 65)}%`, animationDelay: `${-i * 0.17}s`, animationDuration: `${0.7 + (i % 4) * 0.15}s` }}
                />
              ))}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] tracking-[0.12em] text-ink/60 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                {discoteca.nota}
              </p>
              <p className="truncate text-[clamp(1rem,2vw,1.35rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {atual.titulo} · {atual.artista}
              </p>
              <p className="text-xs text-purple" style={{ fontFamily: 'var(--font-marker)' }}>
                {atual.nota}
              </p>
            </div>
          </div>
          <LazyEmbed height={152}>
            <iframe
              key={atual.spotifyId}
              title={`${atual.titulo} · ${atual.artista}`}
              src={`https://open.spotify.com/embed/track/${encodeURIComponent(atual.spotifyId)}?theme=0`}
              width="100%"
              height="152"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block rounded-xl border-0"
            />
          </LazyEmbed>
          <p className="mt-2 text-[9px] text-ink/55" style={{ fontFamily: 'var(--font-mono)' }}>
            {discoteca.fonte}
          </p>
        </div>
      </div>
    </section>
  )
}
