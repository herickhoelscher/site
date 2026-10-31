import { useCallback, useEffect, useRef, useState } from 'react'
import type { Content } from '@/content'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { seededTilt } from '@/lib/rng'
import { player } from '@/lib/youtube'
import { Miniatura } from './Miniatura'
import { Adesivo } from './Adesivo'

const COR_TIPO = {
  anime: 'bg-red text-paper',
  desenho: 'bg-lav text-ink',
  jogo: 'bg-ink text-paper',
} as const

/**
 * A TV de tubo virou o telão do Lado B: cada pôster da parede é um canal.
 * Sozinha, ela zapeia entre os canais com chiado; clicar num pôster sintoniza
 * aquele canal e o play toca o trailer oficial dentro da tela.
 * Com prefers-reduced-motion não zapeia sozinha.
 */
export function Telao({ t }: { t: Content }) {
  const { telao, posters } = t.ladob
  const reduced = usePrefersReducedMotion()
  const [canal, setCanal] = useState(0)
  const [tocando, setTocando] = useState(false)
  const [chiado, setChiado] = useState(false)
  const [mexeu, setMexeu] = useState(false)
  const timers = useRef<number[]>([])
  const tv = useRef<HTMLDivElement>(null)
  const atual = posters[canal]

  const sintoniza = useCallback((proximo: (c: number) => number) => {
    setTocando(false)
    setChiado(true)
    timers.current.push(window.setTimeout(() => setCanal(proximo), 150))
    timers.current.push(window.setTimeout(() => setChiado(false), 430))
  }, [])

  // zapeia sozinha até a pessoa mexer
  useEffect(() => {
    if (reduced || mexeu || tocando) return
    const id = window.setInterval(() => sintoniza((c) => (c + 1) % posters.length), 4200)
    return () => window.clearInterval(id)
  }, [reduced, mexeu, tocando, posters.length, sintoniza])
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  const escolhe = (i: number) => {
    setMexeu(true)
    if (i !== canal) sintoniza(() => i)
    // no celular a TV fica lá em cima: traz ela de volta para a tela
    const r = tv.current?.getBoundingClientRect()
    if (r && (r.top < 0 || r.bottom > window.innerHeight)) {
      tv.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    }
  }

  return (
    <section className="mb-20">
      <header className="mb-10 flex flex-wrap items-center gap-3 border-b-4 border-ink pb-4">
        <h2 data-fx="wipe" className="border-2 border-ink bg-lav px-3 py-1 text-xl leading-tight text-ink shadow-zine-sm zine:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
          {telao.titulo}
        </h2>
        <p className="text-base text-paper zine:text-lg" style={{ fontFamily: 'var(--font-marker)' }}>{telao.kicker}</p>
      </header>

      <div className="grid grid-cols-1 items-center gap-10 zine:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] zine:gap-14">
        {/* a TV */}
        <div ref={tv} data-fx="slide-l" className="relative mx-auto w-full max-w-[620px] scroll-mt-24 pt-12">
          <Adesivo tipo="gato" giro={6} mexe="float-2" className="-top-4 right-[6%] size-24 zine:size-28" />
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-14 w-[3px] origin-bottom -translate-x-1/2 -rotate-[30deg] bg-ink" />
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-14 w-[3px] origin-bottom -translate-x-1/2 rotate-[24deg] bg-ink" />
          <span aria-hidden="true" className="absolute left-1/2 top-11 h-4 w-12 -translate-x-1/2 rounded-t-full border-[3px] border-ink bg-zinc-600" />

          <div className="relative rounded-[26px] border-4 border-ink p-3 shadow-zine zine:p-5" style={{ background: 'linear-gradient(160deg, #4a4a4a, #1d1d1d 70%)' }}>
            <div className="flex gap-4">
              <div className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-[16%/13%] border-4 border-ink bg-ink">
                {tocando ? (
                  <iframe
                    key={atual.yt}
                    src={player(atual.yt)}
                    title={`${atual.nome} · trailer`}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                    <Miniatura key={atual.yt} yt={atual.yt} alt={atual.nome} reserva={atual.nome} className="absolute inset-0 h-full w-full" />
                    <div aria-hidden="true" className="fx-scan pointer-events-none absolute inset-0" />
                    <div aria-hidden="true" className={`fx-chiado pointer-events-none absolute inset-0 transition-opacity duration-100 ${chiado ? 'opacity-95' : 'opacity-0'}`} />
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.65) 100%)' }} />
                    <span aria-hidden="true" className="absolute right-[7%] top-[6%] text-[clamp(0.8rem,2vw,1.15rem)] font-bold text-lav" style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 6px #A68BE6' }}>
                      {telao.canal} {String(canal + 1).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMexeu(true)
                        setTocando(true)
                      }}
                      className="group absolute inset-0 grid place-items-center"
                      aria-label={`${telao.assistir}: ${atual.nome}`}
                    >
                      <span aria-hidden="true" className="grid size-14 place-items-center rounded-full border-[3px] border-ink bg-red pl-1 text-2xl text-paper shadow-[3px_3px_0_#141414] transition-transform group-hover:scale-110 zine:size-16">
                        ▶
                      </span>
                    </button>
                    <p
                      className="pointer-events-none absolute inset-x-[8%] bottom-[7%] text-center text-[clamp(0.78rem,2vw,1.05rem)] font-bold leading-tight text-paper"
                      style={{ textShadow: '2px 0 #141414, -2px 0 #141414, 0 2px #141414, 0 -2px #141414' }}
                    >
                      {atual.nota}
                    </p>
                  </>
                )}
              </div>

              {/* painel: seletor de canal e alto-falante */}
              <div className="hidden w-16 shrink-0 flex-col items-center gap-4 py-2 zine:flex">
                <button
                  type="button"
                  onClick={() => {
                    setMexeu(true)
                    sintoniza((c) => (c + 1) % posters.length)
                  }}
                  aria-label={telao.trocar}
                  className="relative size-12 rounded-full border-4 border-ink bg-zinc-400 shadow-[2px_3px_0_#141414] transition-[rotate] duration-300 hover:bg-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                  style={{ rotate: `${canal * 36}deg` }}
                >
                  <span aria-hidden="true" className="absolute left-1/2 top-1 h-3 w-1 -translate-x-1/2 rounded bg-ink" />
                </button>
                <button
                  type="button"
                  onClick={() => setTocando(false)}
                  aria-label={telao.desligar}
                  disabled={!tocando}
                  className="size-9 rounded-full border-4 border-ink bg-zinc-500 enabled:bg-red enabled:hover:bg-red/80"
                />
                <span aria-hidden="true" className="mt-auto h-20 w-12 rounded border-2 border-ink" style={{ background: 'radial-gradient(#111 1.4px, transparent 1.6px) 0 0 / 7px 7px, #3a3a3a' }} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 zine:hidden">
              <button
                type="button"
                onClick={() => {
                  setMexeu(true)
                  sintoniza((c) => (c + 1) % posters.length)
                }}
                className="border-2 border-ink bg-zinc-400 py-1.5 text-[11px] font-bold text-ink uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {telao.trocar} ↻
              </button>
              <button
                type="button"
                onClick={() => setTocando(false)}
                disabled={!tocando}
                className="border-2 border-ink bg-zinc-500 py-1.5 text-[11px] font-bold text-ink uppercase enabled:bg-red enabled:text-paper"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {telao.desligar} ■
              </button>
            </div>
          </div>
          <span aria-hidden="true" className="absolute -bottom-3 left-[18%] h-4 w-10 rounded-b border-[3px] border-t-0 border-ink bg-zinc-700" />
          <span aria-hidden="true" className="absolute -bottom-3 right-[18%] h-4 w-10 rounded-b border-[3px] border-t-0 border-ink bg-zinc-700" />
        </div>

        {/* o que está no ar */}
        <div data-fx="slide-r" className="min-w-0 text-paper" aria-live="polite">
          <p className="inline-block -rotate-1 bg-red px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-paper zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            ● {telao.noAr} · {telao.canal} {String(canal + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-3 break-words text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.9] drop-shadow-[3px_3px_0_#141414]" style={{ fontFamily: 'var(--font-display)' }}>
            {atual.nome}
          </h3>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.1em] zine:text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className={`px-2 py-0.5 ${COR_TIPO[atual.tipo]}`}>{telao.tipos[atual.tipo]}</span>
            <span className="text-paper/80">{atual.meta}</span>
          </p>
          <p className="mt-1 text-[9px] text-paper/55" style={{ fontFamily: 'var(--font-mono)' }}>
            trailer · {atual.canal} · YouTube
          </p>
          <p className="mt-4 max-w-md text-lg leading-snug text-paper zine:text-xl" style={{ fontFamily: 'var(--font-marker)' }}>
            &ldquo;{atual.nota}&rdquo;
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/80">{telao.sub}</p>
          <p className="mt-3 text-sm text-lav" style={{ fontFamily: 'var(--font-hand)' }}>
            {telao.dica}
          </p>
        </div>
      </div>

      {/* a parede de pôsteres: cada um sintoniza um canal */}
      <ul data-fx="stagger" data-fx-child="rise" className="mt-14 grid grid-cols-2 gap-x-4 gap-y-7 zine:grid-cols-5 zine:gap-x-6 zine:gap-y-10">
        {posters.map((p, i) => {
          const ligado = i === canal
          return (
            <li key={p.yt} className="min-w-0">
              <button
                type="button"
                onClick={() => escolhe(i)}
                aria-pressed={ligado}
                className={`group relative block w-full border-[3px] border-ink bg-paper p-2 text-left text-ink shadow-zine-sm transition-[translate,box-shadow] duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red ${ligado ? 'shadow-[6px_6px_0_#E8432E]' : ''}`}
                style={{ rotate: `${seededTilt(`poster:${p.nome}`, 1.6)}deg` }}
              >
                <span aria-hidden="true" className="absolute -top-3 left-1/2 z-[2] h-5 w-16 -translate-x-1/2 rotate-2 border-x-2 border-dashed border-ink/20 bg-paper/85" />
                <span className="relative block overflow-hidden border-2 border-ink bg-ink">
                  <Miniatura yt={p.yt} alt={p.nome} reserva={p.nome} className="block aspect-square w-full transition-[scale,filter] duration-500 group-hover:scale-105 group-hover:saturate-150" />
                  <span className={`absolute left-1.5 top-1.5 px-1.5 py-0.5 text-[8px] font-bold tracking-[0.1em] zine:text-[9px] ${COR_TIPO[p.tipo]}`} style={{ fontFamily: 'var(--font-mono)' }}>
                    {telao.tipos[p.tipo]}
                  </span>
                  {ligado ? (
                    <span className="absolute bottom-1.5 right-1.5 bg-red px-1.5 py-0.5 text-[8px] font-bold tracking-[0.1em] text-paper zine:text-[9px]" style={{ fontFamily: 'var(--font-mono)' }}>
                      ● {telao.noAr}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block break-words text-[clamp(1rem,1.7vw,1.35rem)] leading-[0.95] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.nome}
                </span>
                <span className="mt-1 flex items-center justify-between gap-2 text-[8px] font-bold tracking-[0.06em] text-ink/65 zine:text-[9px]" style={{ fontFamily: 'var(--font-mono)' }}>
                  <span className="truncate">{p.meta}</span>
                  <span className="shrink-0 text-red">{telao.canal} {String(i + 1).padStart(2, '0')}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="mt-8 text-center text-[10px] text-paper/60" style={{ fontFamily: 'var(--font-mono)' }}>
        {telao.fonte}
      </p>
    </section>
  )
}
