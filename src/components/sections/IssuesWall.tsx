import { NetworkCable } from '@/components/collage'
import type { Content } from '@/content'
import { ClientLineup } from './ClientLineup'
import { IssueCard } from './IssueCard'

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
            className="inline-block border border-paper/50 bg-ink px-2 py-1 text-[10px] font-bold tracking-wide text-paper"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.issues.tag}
          </span>
          <div className="mt-2 flex flex-col gap-3 zine:flex-row zine:items-end zine:justify-between">
            <h2
              className="text-[clamp(3.5rem,9vw,7rem)] leading-none text-paper"
              style={{ fontFamily: 'var(--font-spray)', WebkitTextStroke: '1px var(--color-ink)' }}
            >
              {t.issues.titulo}
            </h2>
            <p
              className="max-w-[48ch] text-[11px] leading-snug tracking-wide text-red zine:mb-2 zine:text-right"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.issues.sub}
            </p>
          </div>
          <div aria-hidden="true" className="mt-4 h-[3px] w-full bg-red" />
        </header>

        <div className="mt-8 zine:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 pb-5 scroll-px-6">
            {cards.map((issue) => (
              <div key={issue.slug} className="w-[84vw] shrink-0 snap-start">
                <IssueCard issue={issue} t={t} prefix={prefix} />
              </div>
            ))}
            {sixth ? (
              <div className="w-[84vw] shrink-0 snap-start">
                <ClientLineup issue={sixth} t={t} />
              </div>
            ) : null}
          </div>
          <p
            className="px-6 text-[11px] tracking-wide text-paper/70"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            arraste →
          </p>
        </div>

        <div className="relative hidden grid-cols-3 gap-6 px-10 pt-8 zine:grid">
          {first ? <div className="col-span-2 min-w-0"><IssueCard issue={first} t={t} prefix={prefix} featured /></div> : null}
          {second ? <div className="min-w-0"><IssueCard issue={second} t={t} prefix={prefix} /></div> : null}
          {[third, fourth, fifth].map((issue) => issue ? (
            <div key={issue.slug} className="min-w-0"><IssueCard issue={issue} t={t} prefix={prefix} /></div>
          ) : null)}
          {sixth ? <div className="col-span-3 min-w-0"><ClientLineup issue={sixth} t={t} /></div> : null}
        </div>
      </div>
    </section>
  )
}
