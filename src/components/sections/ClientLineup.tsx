import { Tape } from '@/components/collage'
import type { Content, Issue } from '@/content'

export function ClientLineup({ issue, t }: { issue: Issue; t: Content }) {
  return (
    <article className="tex-vermelha relative min-w-0 border-2 border-ink p-4 text-paper shadow-zine zine:p-5">
      <Tape seed={`lineup-${issue.slug}`} at="top" width={100} height={20} />
      <span
        className="inline-block bg-ink px-2 py-1 text-[10px] font-bold tracking-wide text-paper"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {t.issues.lineup.tag}
      </span>
      <div className="mt-2 flex flex-col gap-1 zine:flex-row zine:items-end zine:justify-between zine:gap-6">
        <h3
          className="text-[clamp(1.7rem,3vw,2.7rem)] leading-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.issues.lineup.titulo}
        </h3>
        <p
          className="text-[clamp(1.1rem,1.6vw,1.4rem)] leading-tight zine:text-right"
          style={{ fontFamily: 'var(--font-hand)' }}
        >
          &ldquo;{t.issues.lineup.frase}&rdquo;
        </p>
      </div>
      <div aria-hidden="true" className="my-3 h-px bg-paper/80" />
      <ul className="grid grid-cols-1 gap-2 zine:grid-cols-5">
        {issue.clientes?.map((cliente) => (
          <li key={cliente.repo} className="min-w-0">
            <a
              href={cliente.repo}
              target="_blank"
              rel="noreferrer"
              className="flex h-full min-h-14 flex-col items-center justify-center border-2 border-ink bg-paper px-2 py-2 text-center text-ink shadow-zine-sm transition-transform hover:-translate-y-0.5"
            >
              <span className="text-[13px] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {cliente.nome}
              </span>
              <span className="mt-1 text-[9px] leading-tight text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>
                {cliente.tag}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
