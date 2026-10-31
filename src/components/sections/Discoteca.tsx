import { useState } from 'react'
import type { Content } from '@/content'

/** Cor de cada capa: as três do site, uma por disco. */
const CAPAS = [
  { fundo: 'bg-ink', texto: 'text-paper', detalhe: 'text-red', rotulo: 'bg-red' },
  { fundo: 'bg-red', texto: 'text-ink', detalhe: 'text-paper', rotulo: 'bg-paper' },
  { fundo: 'bg-purple', texto: 'text-paper', detalhe: 'text-lav', rotulo: 'bg-lav' },
]

/**
 * Discoteca de cabeceira: a foto da vitrola, uma capa por música (desenho
 * próprio, só tipografia: nada de arte de álbum) e o "tocando agora".
 * Clicar numa capa puxa o disco para fora e troca o que está tocando.
 */
export function Discoteca({ t }: { t: Content }) {
  const { discoteca, musicas } = t.ladob
  const [ativa, setAtiva] = useState(0)
  const atual = musicas[ativa]

  return (
    <section className="relative mb-20 grid min-w-0 items-center gap-12 zine:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] zine:gap-14">
      <figure data-fx="slide-l" className="relative mx-auto w-full max-w-[400px]">
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
        <p className="mt-3 text-sm text-paper/85" style={{ fontFamily: 'var(--font-marker)' }}>
          {discoteca.escolha}
        </p>

        <ul className="mt-3 grid grid-cols-3 gap-3 pt-[15%] zine:gap-5">
          {musicas.map((musica, i) => {
            const capa = CAPAS[i % CAPAS.length]
            const ligada = i === ativa
            return (
              <li key={`${musica.titulo}-${i}`} className="min-w-0">
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
                      <span className={`absolute inset-0 m-auto h-[34%] w-[34%] rounded-full ${capa.rotulo}`}>
                        <span className="absolute left-1/2 top-[18%] h-[14%] w-[14%] -translate-x-1/2 rounded-full bg-ink" />
                      </span>
                    </span>
                  </span>
                  <span
                    className={`relative flex aspect-square flex-col justify-between border-[3px] border-ink p-2 shadow-zine-sm transition-transform group-hover:-rotate-2 zine:p-3 ${capa.fundo}`}
                  >
                    <span className={`text-[8px] font-bold tracking-[0.12em] zine:text-[10px] ${capa.detalhe}`} style={{ fontFamily: 'var(--font-mono)' }}>
                      LADO {String.fromCharCode(65 + i)} · {musica.duracao}
                    </span>
                    <span
                      className={`break-words text-[clamp(0.85rem,2.1vw,1.7rem)] leading-[0.92] uppercase ${capa.texto}`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {musica.artista}
                    </span>
                    <span className={`truncate text-[8px] zine:text-[10px] ${capa.texto}`} style={{ fontFamily: 'var(--font-mono)' }}>
                      {musica.titulo}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* tocando agora */}
        <div className="mt-7 flex items-center gap-4 border-[3px] border-ink bg-paper p-3 text-ink shadow-zine-sm zine:p-4" aria-live="polite">
          <span aria-hidden="true" className="flex h-11 shrink-0 items-end gap-[3px]">
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
      </div>
    </section>
  )
}
