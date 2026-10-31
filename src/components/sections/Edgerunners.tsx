import { useState } from 'react'
import type { Content } from '@/content'
import { player } from '@/lib/youtube'
import { Miniatura } from './Miniatura'
import { VideoFundo } from './VideoFundo'

/**
 * Cyberpunk: Edgerunners. Mesmo visual do bloco de neon (glitch, katakana,
 * linhas de varredura), agora sobre o anime: vídeo de fundo de moto no neon,
 * fichinha do anime, trailer oficial da Netflix e, embaixo, a Night City do
 * mundo real nas fotos livres.
 */
export function Edgerunners({ t }: { t: Content }) {
  const { edge } = t.ladob
  const [qual, setQual] = useState(0)
  const [tocando, setTocando] = useState(false)
  const trailer = edge.trailers[qual]

  return (
    <section className="relative mb-20 overflow-hidden rounded-xl border-4 border-ink bg-ink p-5 text-paper shadow-zine zine:p-10">
      <VideoFundo
        src="/assets/ladob/night-city.mp4"
        poster="/assets/ladob/night-city.webp"
        className="absolute inset-0 h-full w-full opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(20,20,20,.94) 8%, rgba(20,20,20,.62) 52%, rgba(72,49,109,.45) 100%), linear-gradient(to top, #141414 4%, transparent 45%)' }}
      />
      <div aria-hidden="true" className="fx-scan pointer-events-none absolute inset-0 z-[5] opacity-60" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-6 z-[1] hidden text-[clamp(1.6rem,3.4vw,2.8rem)] leading-none text-red opacity-80 zine:block"
        style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-display)' }}
      >
        {edge.kana}
      </span>

      <div className="relative z-[6] grid items-center gap-8 zine:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] zine:gap-12 zine:pr-12">
        <header className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.25em] text-lav zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            {edge.kicker}
          </p>
          <h2
            data-text={edge.titulo}
            className="fx-glitch mt-2 text-[13vw] leading-[0.85] zine:text-[clamp(3rem,5.4vw,5.2rem)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {edge.titulo}
          </h2>
          <p className="mt-2 text-lg text-red zine:text-xl" style={{ fontFamily: 'var(--font-marker)' }}>
            {edge.sub}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/90 zine:text-base">{edge.texto}</p>
          <ul data-fx="stagger" data-fx-child="pop" className="mt-5 flex flex-wrap gap-2">
            {edge.fatos.map((fato, i) => (
              <li
                key={fato}
                className={`border-2 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] zine:text-[11px] ${i === 0 ? 'border-red bg-red text-paper' : 'border-lav/70 text-lav'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {fato}
              </li>
            ))}
          </ul>
        </header>

        {/* trailer oficial: a miniatura do YouTube até a pessoa dar play */}
        <div data-fx="slide-r" className="min-w-0">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={edge.assistir}>
            {edge.trailers.map((tr, i) => (
              <button
                key={tr.yt}
                type="button"
                role="tab"
                aria-selected={i === qual}
                onClick={() => {
                  setQual(i)
                  setTocando(false)
                }}
                className={`border-2 border-b-0 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] uppercase transition-colors zine:text-[11px] ${i === qual ? 'border-paper bg-paper text-ink' : 'border-paper/40 text-paper/70 hover:text-paper'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {tr.rotulo}
              </button>
            ))}
          </div>
          <div className="relative aspect-video overflow-hidden border-2 border-paper bg-ink shadow-[6px_6px_0_#E8432E]">
            {tocando ? (
              <iframe
                key={trailer.yt}
                src={player(trailer.yt)}
                title={`${edge.titulo} · ${trailer.rotulo}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setTocando(true)}
                className="group absolute inset-0 block h-full w-full"
                aria-label={`${edge.assistir}: ${trailer.rotulo}`}
              >
                <Miniatura
                  key={trailer.yt}
                  yt={trailer.yt}
                  alt={`${edge.titulo} · ${trailer.rotulo}`}
                  reserva={edge.titulo}
                  className="absolute inset-0 h-full w-full transition-[scale,filter] duration-500 group-hover:scale-[1.03] group-hover:saturate-150"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 flex items-center gap-2 border-2 border-ink bg-red px-3 py-1.5 text-sm text-paper shadow-[3px_3px_0_#141414] transition-transform group-hover:-translate-y-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                  <span aria-hidden="true">▶</span> {edge.assistir}
                </span>
              </button>
            )}
          </div>
          <p className="mt-2 text-[9px] text-paper/55" style={{ fontFamily: 'var(--font-mono)' }}>
            {trailer.canal} · YouTube
          </p>
        </div>
      </div>

      {/* Night City aqui do lado de cá: as fotos livres que já estavam no bloco */}
      <div className="relative z-[6] mt-10 zine:mt-12">
        <p className="mb-3 text-sm text-paper/85" style={{ fontFamily: 'var(--font-marker)' }}>
          {edge.fotosTitulo}
        </p>
        <ul data-fx="stagger" data-fx-child="rise" className="grid grid-cols-2 gap-3 zine:grid-cols-4 zine:gap-5">
          {edge.fotos.map((foto, i) => (
            <li key={foto.src} className="group min-w-0">
              <figure className={`relative overflow-hidden border-2 border-paper/80 bg-ink ${i % 2 ? 'zine:translate-y-6' : ''}`}>
                <img
                  src={foto.src}
                  alt={foto.lugar}
                  loading="lazy"
                  className="block aspect-[4/3] w-full object-cover transition-[scale,filter] duration-500 group-hover:scale-105 group-hover:saturate-150"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink via-ink/70 to-transparent p-2 pt-8">
                  <span className="text-[9px] font-bold tracking-[0.08em] text-paper zine:text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {foto.lugar}
                  </span>
                  <span className="shrink-0 text-[8px] text-paper/60" style={{ fontFamily: 'var(--font-mono)' }}>
                    {foto.autor}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[10px] text-paper/55 zine:mt-10" style={{ fontFamily: 'var(--font-mono)' }}>
          {edge.credito}
        </p>
      </div>
    </section>
  )
}
