import { NetworkCable } from '@/components/collage'
import type { Content } from '@/content'
import { ClientLineup } from './ClientLineup'
import { IssueCard } from './IssueCard'

/**
 * Mural das Issues, conforme referencias/wireframes/v2/issues-v3.png.
 *
 * Fileira 1: a 001 larga (2 colunas, imagem ao lado do texto) e a 002 estreita.
 * Fileira 2: 003, 004 e 005 iguais. Fileira 3: a faixa vermelha dos clientes.
 *
 * `items-start` é de propósito: na referência os cartões têm alturas próprias,
 * não esticam para igualar a linha. Esticar deixava um vazio enorme dentro da
 * 001, que tem menos texto que a 002.
 */
export function IssuesWall({ t, prefix }: { t: Content; prefix: string }) {
  const [first, second, third, fourth, fifth, sixth] = t.issues.lista
  const cards = t.issues.lista.slice(0, 5)

  return (
    <section id="issues" className="tex-preta relative overflow-x-clip py-16 zine:py-24">
      <NetworkCable
        path=".9,-.02;.965,.16;.985,.5;.955,.86;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />

      <div className="relative z-[3] mx-auto max-w-[1200px]">
        <header className="px-6 zine:px-10">
          <span
            data-fx="wipe"
            className="inline-block bg-paper px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-ink uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.issues.tag}
          </span>

          <div className="mt-2 flex flex-col gap-3 zine:flex-row zine:items-end zine:justify-between">
            {/*
              Anton sólido, não o spray pingando: na referência o título é um
              bloco compacto e limpo, com uma leve sombra deslocada.
            */}
            <h2
              data-fx="slam"
              className="origin-left text-[clamp(3rem,7.5vw,5.5rem)] leading-[0.85] text-paper"
              style={{
                fontFamily: 'var(--font-display)',
                textShadow: '4px 4px 0 rgba(0,0,0,.55)',
              }}
            >
              {t.issues.titulo}
            </h2>

            <p
              data-fx="rise"
              className="max-w-[46ch] text-[10px] leading-snug tracking-[0.08em] text-red uppercase zine:mb-3 zine:text-right"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.issues.sub}
            </p>
          </div>

          <div aria-hidden="true" data-fx="wipe" className="mt-4 h-[3px] w-full bg-red" />
        </header>

        {/* celular: carrossel com encaixe, um pôster por vez */}
        <div className="mt-8 zine:hidden">
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-px-6 px-6 pb-5">
            {cards.map((issue) => (
              <div key={issue.slug} data-fx="rise" className="w-[84vw] shrink-0 snap-start">
                <IssueCard issue={issue} t={t} prefix={prefix} />
              </div>
            ))}
          </div>
          <p
            className="px-6 text-[11px] tracking-[0.1em] text-paper/60 uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            arraste →
          </p>
          {/* os clientes têm print cada um: no celular ficam fora do carrossel */}
          {sixth ? (
            <div data-fx="rise" className="mt-8 px-6">
              <ClientLineup issue={sixth} t={t} />
            </div>
          ) : null}
        </div>

        {/* desktop: a grade da referência */}
        <div className="hidden grid-cols-3 items-start gap-7 px-10 pt-10 zine:grid">
          {first ? (
            <div data-fx="drop" className="col-span-2 min-w-0">
              <IssueCard issue={first} t={t} prefix={prefix} featured />
            </div>
          ) : null}
          {second ? (
            <div data-fx="drop" className="min-w-0">
              <IssueCard issue={second} t={t} prefix={prefix} />
            </div>
          ) : null}
          {[third, fourth, fifth].map((issue) =>
            issue ? (
              <div key={issue.slug} data-fx="drop" className="min-w-0">
                <IssueCard issue={issue} t={t} prefix={prefix} />
              </div>
            ) : null,
          )}
          {sixth ? (
            <div data-fx="rise" className="col-span-3 min-w-0 pt-3">
              <ClientLineup issue={sixth} t={t} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
