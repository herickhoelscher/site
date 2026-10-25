import { Link } from 'react-router-dom'
import { Stamp, StickerImg, Tape, TornPaper } from '@/components/collage'
import type { Content, Issue } from '@/content'

type Props = {
  issue: Issue
  t: Content
  prefix: string
  featured?: boolean
}

export function IssueCard({ issue, t, prefix, featured = false }: Props) {
  const stampTone = issue.numero === '002' ? 'purple' : issue.numero === '003' || issue.numero === '005' ? 'ink' : 'red'

  return (
    <article className="group relative min-w-0 h-full">
      <Tape seed={`tape-${issue.slug}`} at="top" width={92} height={20} />

      <TornPaper
        seed={`issue-${issue.slug}`}
        sides="trbl"
        amp={4}
        tilt={false}
        wrapperClassName="h-full transition-transform duration-200 group-hover:-translate-y-1"
        className="tex-creme flex min-h-full flex-col border-2 border-ink p-4 text-ink zine:p-5"
      >
        <header className="mb-3 flex min-w-0 items-start justify-between gap-2 border-b border-ink/50 pb-2">
          <span
            className="shrink-0 text-[11px] font-bold tracking-wide text-red"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ISSUE #{issue.numero}
          </span>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 text-right">
            {issue.kicker ? (
              <span
                className="text-[9px] leading-tight tracking-wide text-ink/55"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {issue.kicker}
              </span>
            ) : null}
            <Stamp seed={`selo-${issue.slug}`} tone={stampTone} className="shrink-0 text-[9px]">
              {issue.selo}
            </Stamp>
          </div>
        </header>

        <div className={`min-w-0 flex-1 ${featured ? 'zine:grid zine:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] zine:gap-5' : ''}`}>
          <StickerImg
            src={issue.capa}
            alt={`${issue.titulo} — ${issue.numero}`}
            seed={`capa-${issue.slug}`}
            variant="cutout"
            height={featured ? 210 : 160}
            className="mb-4 w-full zine:mb-3"
            placeholder={`[ ${t.projeto.print} ]`}
          />

          <div className="flex min-w-0 flex-col">
            <h3
              className={`leading-none ${featured ? 'text-[clamp(1.9rem,3.4vw,3rem)]' : 'text-[clamp(1.55rem,2.3vw,2.1rem)]'}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {issue.titulo}
            </h3>
            <p
              className="mt-1 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-tight text-red"
              style={{ fontFamily: 'var(--font-hand)' }}
            >
              &ldquo;{issue.gancho}&rdquo;
            </p>
            <p className="mt-3 text-[13px] leading-relaxed zine:text-[14px]">{issue.resumoCard}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {issue.stack.map((item) => (
                <li
                  key={item}
                  className="border border-ink px-1.5 py-0.5 text-[9px] font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink pt-3">
          {issue.tempo ? (
            <span
              className="text-[10px] font-bold tracking-wide text-ink/75"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {issue.tempo}
            </span>
          ) : null}
          <Link
            to={`${prefix}/issues/${issue.slug}`}
            className="ml-auto bg-ink px-3 py-2 text-[10px] font-bold tracking-wide text-paper transition-colors hover:bg-red"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.issues.verMais}
            <span className="sr-only"> — {issue.titulo}</span>
          </Link>
        </footer>
      </TornPaper>
    </article>
  )
}
