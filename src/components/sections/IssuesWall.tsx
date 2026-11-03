import { FundoVivo, Splat } from '@/components/collage'
import type { Content } from '@/content'
import { linkOrcamento } from '@/lib/orcamento'
import { ClientLineup } from './ClientLineup'
import { IssueCard } from './IssueCard'

/** O sexto lugar da grade: a próxima issue é o projeto de quem está lendo. */
function ProximaIssue({ t }: { t: Content }) {
  const { proxima } = t.issues
  return (
    <a
      href={linkOrcamento(t)}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-full min-h-[340px] flex-col justify-between border-2 border-dashed border-paper/60 bg-ink/40 p-5 text-paper transition-colors hover:border-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
    >
      <span className="flex items-center gap-3">
        <span className="text-[clamp(0.95rem,1.4vw,1.15rem)] leading-none text-red" style={{ fontFamily: 'var(--font-display)' }}>
          {proxima.tag}
        </span>
        <span className="bg-red px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-paper uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
          {proxima.selo}
        </span>
      </span>
      <span>
        <span className="block text-[clamp(2rem,3.2vw,2.9rem)] leading-[0.92] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
          {proxima.titulo}
        </span>
        <span className="mt-3 block text-[clamp(1.05rem,1.5vw,1.3rem)] leading-tight text-lav" style={{ fontFamily: 'var(--font-hand)' }}>
          {proxima.sub}
        </span>
      </span>
      <span
        className="self-start bg-red px-5 py-2.5 text-[11px] font-bold tracking-[0.08em] text-paper uppercase shadow-[4px_4px_0_#EFE9DA] transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {t.orcamento.botao} ↗
      </span>
    </a>
  )
}

/**
 * Mural das Issues em grade reta: três colunas iguais, cartões da mesma
 * fileira com a mesma altura e os botões alinhados embaixo. Seis lugares:
 * as cinco issues e a "próxima", que é o pedido de orçamento. Embaixo, a
 * faixa vermelha dos clientes.
 */
export function IssuesWall({ t, prefix }: { t: Content; prefix: string }) {
  const lista = t.issues.lista
  const cards = lista.slice(0, 5)
  const clientes = lista[5]

  return (
    <section id="issues" className="tex-preta relative overflow-x-clip py-16 zine:py-24">
      <FundoVivo tom="escuro" seed="issues" />
      <span data-fx-speed="0.2" aria-hidden="true" className="pointer-events-none absolute bottom-[8%] left-[1%] block h-52 w-72 opacity-40">
        <Splat seed="issues-splat" color="#765BA7" className="h-full w-full" />
      </span>

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
            <div className="flex items-end gap-4">
              <h2
                data-fx="slam"
                className="origin-left text-[clamp(3rem,7.5vw,5.5rem)] leading-[0.85] text-paper"
                style={{ fontFamily: 'var(--font-display)', textShadow: '4px 4px 0 rgba(0,0,0,.55)' }}
              >
                {t.issues.titulo}
              </h2>
              <span
                data-fx="pop"
                className="mb-2 border-[3px] border-red px-2 py-1 text-[11px] font-bold tracking-[0.12em] text-red uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.quem.carimbos.edicoes}
              </span>
            </div>

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
              <div key={issue.slug} className="w-[84vw] shrink-0 snap-start">
                <IssueCard issue={issue} t={t} prefix={prefix} />
              </div>
            ))}
            <div className="w-[84vw] shrink-0 snap-start">
              <ProximaIssue t={t} />
            </div>
          </div>
          <p className="px-6 text-[11px] tracking-[0.1em] text-paper/60 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
            {t.issues.arraste}
          </p>
          {clientes ? (
            <div data-fx="rise" className="mt-8 px-6">
              <ClientLineup issue={clientes} t={t} />
            </div>
          ) : null}
        </div>

        {/* desktop: grade reta, 3 colunas iguais */}
        <div data-fx="stagger" data-fx-child="rise" className="hidden grid-cols-3 gap-7 px-10 pt-10 zine:grid">
          {cards.map((issue) => (
            <div key={issue.slug} className="min-w-0">
              <IssueCard issue={issue} t={t} prefix={prefix} />
            </div>
          ))}
          <div className="min-w-0">
            <ProximaIssue t={t} />
          </div>
        </div>
        {clientes ? (
          <div data-fx="rise" className="hidden px-10 pt-10 zine:block">
            <ClientLineup issue={clientes} t={t} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
