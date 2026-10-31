import { useEffect, useRef, useState } from 'react'
import type { Content } from '@/content'
import type { Tema } from '@/content/types'
import { seededTilt } from '@/lib/rng'
import { LazyEmbed } from './LazyEmbed'
import { Rabisco } from './Rabisco'

type Props = { t: Content }

const TONS: Record<Tema['tom'], string> = {
  ink: 'bg-ink',
  red: 'bg-red',
  paper: 'bg-paper',
  lav: 'bg-lav',
}

declare global {
  interface Window {
    PinUtils?: { build: (el?: HTMLElement) => void }
  }
}

/**
 * A pasta do Pinterest pelo widget oficial: os pins aparecem como o Pinterest
 * mostra, com o crédito de cada um, sem copiar imagem nenhuma para o site.
 * O script só carrega quando o mural chega na tela (LazyEmbed).
 */
function PastaPinterest({ url, rotulo }: { url: string; rotulo: string }) {
  const caixa = useRef<HTMLDivElement>(null)
  const [largura, setLargura] = useState(0)

  useEffect(() => {
    if (caixa.current) setLargura(Math.min(1100, Math.round(caixa.current.clientWidth)))
  }, [])

  useEffect(() => {
    if (!largura) return
    if (window.PinUtils) {
      window.PinUtils.build(caixa.current ?? undefined)
      return
    }
    if (document.querySelector('script[data-pinit]')) return
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://assets.pinterest.com/js/pinit.js'
    s.dataset.pinit = '1'
    document.body.appendChild(s)
  }, [largura])

  return (
    <div ref={caixa} className="flex min-h-[420px] w-full items-center justify-center overflow-hidden">
      {largura ? (
        <a
          data-pin-do="embedBoard"
          data-pin-board-width={String(largura)}
          data-pin-scale-height="360"
          data-pin-scale-width={largura < 500 ? '90' : '120'}
          href={url}
          className="text-lg text-ink underline decoration-red decoration-2 underline-offset-4"
          style={{ fontFamily: 'var(--font-marker)' }}
        >
          {rotulo} ↗
        </a>
      ) : null}
    </div>
  )
}

export function PinterestMural({ t }: Props) {
  const { mural } = t.ladob

  return (
    <section className="relative rounded-xl border-4 border-ink p-4 text-ink shadow-zine zine:p-8" style={{ backgroundColor: '#d6ccb8', backgroundImage: 'radial-gradient(#9e8e75 1px, transparent 0)', backgroundSize: '12px 12px' }}>
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-ink/70 zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          {mural.kicker}
        </p>
        <h2 className="mt-2 inline-block -rotate-1 border-2 border-ink/50 bg-paper px-4 py-2 text-xl shadow-zine-sm zine:px-8 zine:text-2xl" style={{ fontFamily: 'var(--font-marker)' }}>
          {mural.titulo}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-ink/85 zine:text-base">{mural.analise}</p>
        <p className="mt-4 break-words text-[10px] font-bold leading-relaxed text-red zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          {mural.tags}
        </p>
      </header>

      <ul data-fx="stagger" data-fx-child="pop" className="grid grid-cols-2 items-start gap-4 zine:grid-cols-3 zine:gap-7">
        {mural.temas.map((tema, i) => (
          <li
            key={tema.titulo}
            className="relative min-w-0 border-[3px] border-ink bg-white p-2.5 shadow-zine-sm transition-[translate] hover:-translate-y-1 zine:p-3"
            style={{ rotate: `${seededTilt(`tema:${tema.titulo}`, 1.4)}deg` }}
          >
            <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-red shadow-[2px_2px_0_#141414]" />
            <div className={`grid aspect-square place-items-center border-2 border-ink ${TONS[tema.tom]} ${tema.rabisco === 'opart' ? 'p-0' : 'p-[12%]'}`}>
              <Rabisco tipo={tema.rabisco} className={`h-full w-full ${tema.rabisco === 'opart' ? 'fx-spin-slow' : i % 2 ? 'fx-float-2' : 'fx-float'}`} />
            </div>
            <p className="mt-2.5 break-words text-[clamp(1rem,2vw,1.45rem)] leading-[0.95] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
              {tema.titulo}
            </p>
            <p className="mt-1.5 text-[11px] leading-snug text-ink/80 zine:text-xs">{tema.texto}</p>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-[3px] border-ink bg-paper p-3 shadow-zine-sm zine:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
          <p className="text-lg leading-tight zine:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            {mural.widget}
          </p>
          <a
            href={mural.perfil}
            target="_blank"
            rel="noreferrer"
            className="fx-jelly border-2 border-ink bg-red px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-paper uppercase shadow-[2px_2px_0_#141414]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {mural.abrir} ↗
          </a>
        </div>
        <LazyEmbed height={420}>
          <PastaPinterest url={mural.pasta} rotulo={mural.abrir} />
        </LazyEmbed>
      </div>
    </section>
  )
}
