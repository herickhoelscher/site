import { useCallback, useEffect, useRef, useState } from 'react'
import type { Content } from '@/content'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

/** Quadros que passam na TV: paisagens em névoa e ruas de neon (fotos livres, tratadas). */
const QUADROS = [
  '/assets/ladob/tv-montanhas-nevoa.webp',
  '/assets/ladob/tv-montanhas-aurora.webp',
  '/assets/ladob/tv-shibuya.webp',
  '/assets/ladob/tv-beco.webp',
]

/**
 * TV de tubo que troca de canal sozinha, com chiado entre um quadro e outro,
 * número do canal na tela e legenda de anime embaixo. O botão gira o seletor.
 * Com prefers-reduced-motion ela fica parada e só troca pelo botão.
 */
export function TvAnime({ t }: { t: Content }) {
  const { tv } = t.ladob
  const reduced = usePrefersReducedMotion()
  const [canal, setCanal] = useState(0)
  const [chiado, setChiado] = useState(false)
  const timers = useRef<number[]>([])

  const troca = useCallback(() => {
    setChiado(true)
    timers.current.push(window.setTimeout(() => setCanal((c) => (c + 1) % QUADROS.length), 150))
    timers.current.push(window.setTimeout(() => setChiado(false), 430))
  }, [])

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(troca, 4200)
    return () => window.clearInterval(id)
  }, [reduced, troca])
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])

  return (
    <div className="relative mx-auto w-full max-w-[580px] pt-12">
      {/* antena */}
      <span aria-hidden="true" className="absolute left-1/2 top-0 h-14 w-[3px] origin-bottom -translate-x-1/2 -rotate-[30deg] bg-ink" />
      <span aria-hidden="true" className="absolute left-1/2 top-0 h-14 w-[3px] origin-bottom -translate-x-1/2 rotate-[24deg] bg-ink" />
      <span aria-hidden="true" className="absolute left-1/2 top-11 h-4 w-12 -translate-x-1/2 rounded-t-full border-[3px] border-ink bg-zinc-600" />

      <div
        className="relative rounded-[26px] border-4 border-ink p-3 shadow-zine zine:p-5"
        style={{ background: 'linear-gradient(160deg, #4a4a4a, #1d1d1d 70%)' }}
      >
        <div className="flex gap-4">
          <div className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-[16%/13%] border-4 border-ink bg-ink">
            {QUADROS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${i === canal ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div aria-hidden="true" className="fx-scan pointer-events-none absolute inset-0" />
            <div
              aria-hidden="true"
              className={`fx-chiado pointer-events-none absolute inset-0 transition-opacity duration-100 ${chiado ? 'opacity-95' : 'opacity-0'}`}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.6) 100%)' }}
            />
            <span
              aria-hidden="true"
              className="absolute right-3 top-2 text-[clamp(0.8rem,2vw,1.15rem)] font-bold text-lav"
              style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 6px #A68BE6' }}
            >
              {tv.canal} 0{canal + 3}
            </span>
            <p
              className="absolute inset-x-3 bottom-3 text-center text-[clamp(0.78rem,2vw,1.05rem)] font-bold leading-tight text-paper"
              style={{ textShadow: '2px 0 #141414, -2px 0 #141414, 0 2px #141414, 0 -2px #141414' }}
            >
              {tv.legendas[canal]}
            </p>
          </div>

          {/* painel: seletor de canal e alto-falante */}
          <div className="hidden w-16 shrink-0 flex-col items-center gap-4 py-2 zine:flex">
            <button
              type="button"
              onClick={troca}
              aria-label={tv.trocar}
              className="relative size-12 rounded-full border-4 border-ink bg-zinc-400 shadow-[2px_3px_0_#141414] transition-[rotate] duration-300 hover:bg-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              style={{ rotate: `${canal * 90}deg` }}
            >
              <span aria-hidden="true" className="absolute left-1/2 top-1 h-3 w-1 -translate-x-1/2 rounded bg-ink" />
            </button>
            <span aria-hidden="true" className="size-9 rounded-full border-4 border-ink bg-zinc-500" />
            <span
              aria-hidden="true"
              className="mt-auto h-20 w-12 rounded border-2 border-ink"
              style={{ background: 'radial-gradient(#111 1.4px, transparent 1.6px) 0 0 / 7px 7px, #3a3a3a' }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={troca}
          className="mt-3 w-full border-2 border-ink bg-zinc-400 py-1.5 text-[11px] font-bold text-ink uppercase zine:hidden"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {tv.trocar} ↻
        </button>
      </div>
      {/* pés */}
      <span aria-hidden="true" className="absolute -bottom-3 left-[18%] h-4 w-10 rounded-b border-[3px] border-t-0 border-ink bg-zinc-700" />
      <span aria-hidden="true" className="absolute -bottom-3 right-[18%] h-4 w-10 rounded-b border-[3px] border-t-0 border-ink bg-zinc-700" />
    </div>
  )
}
