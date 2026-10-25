import { Link } from 'react-router-dom'
import { Stamp, StickerImg, Tape, TornPaper } from '@/components/collage'
import type { Content, Issue } from '@/content'

type Props = {
  issue: Issue
  t: Content
  prefix: string
  /** O 001 é o destaque: capa maior e texto maior. */
  featured?: boolean
  /** O 006 é uma faixa larga com a lista de clientes. */
  wide?: boolean
  className?: string
}

/**
 * Pôster de uma issue.
 *
 * O hover "descola o canto" (§ 6): o card sobe e gira um pouco e a sombra
 * cresce. Fica no group do próprio card para o efeito valer em toda a área,
 * inclusive no link.
 */
export function IssueCard({ issue, t, prefix, featured, wide, className = '' }: Props) {
  const repo = issue.repositorio?.replace('https://github.com/', '') ?? null

  return (
    <article className={`group relative ${className}`}>
      <Tape seed={`tape-${issue.slug}`} at="top-right" label={issue.numero} tone="red" />

      <TornPaper
        seed={`issue-${issue.slug}`}
        sides="trbl"
        amp={7}
        wrapperClassName="h-full transition-transform duration-200 group-hover:-translate-y-1"
        className="tex-creme flex h-full flex-col p-5 text-ink"
      >
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.1em] text-red"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              #{issue.numero}
            </p>
            {repo ? (
              <p
                className="text-[11px] tracking-[0.06em] text-ink/60"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {repo}
              </p>
            ) : null}
          </div>
          <Stamp seed={`selo-${issue.slug}`} tone="red">
            {issue.selo}
          </Stamp>
        </header>

        <h3
          className={`mb-1 leading-[0.95] ${featured ? 'text-[clamp(2rem,4vw,3.25rem)]' : 'text-[clamp(1.4rem,2.4vw,2rem)]'}`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {issue.titulo}
        </h3>

        <p
          className="mb-4 text-[clamp(1rem,1.6vw,1.35rem)] leading-tight text-red"
          style={{ fontFamily: 'var(--font-hand)' }}
        >
          &ldquo;{issue.gancho}&rdquo;
        </p>

        <StickerImg
          src={issue.capa}
          alt={`Capa da issue ${issue.numero}, ${issue.titulo}`}
          seed={`capa-${issue.slug}`}
          variant="cutout"
          height={featured ? 260 : 150}
          className="mb-4 w-full"
          placeholder={`[ ${t.projeto.print} ]`}
        />

        {wide && issue.clientes ? (
          <ul className="mb-4 grid gap-1 zine:grid-cols-2">
            {issue.clientes.map((c) => (
              <li key={c} className="text-[13px] leading-snug">
                <span className="text-red">▪</span> {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 flex-1 text-[15px] leading-relaxed">{issue.resumoCard}</p>
        )}

        <ul className="mb-4 flex flex-wrap gap-1.5">
          {issue.stack.map((s) => (
            <li
              key={s}
              className="border-2 border-ink px-2 py-0.5 text-[11px] font-bold tracking-[0.06em]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {s}
            </li>
          ))}
        </ul>

        <Link
          to={`${prefix}/issues/${issue.slug}`}
          className="mt-auto inline-block self-start bg-ink px-4 py-2 text-[13px] font-bold tracking-[0.06em] text-white uppercase transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {t.issues.verMais}
          <span className="sr-only"> — {issue.titulo}</span>
        </Link>
      </TornPaper>
    </article>
  )
}
