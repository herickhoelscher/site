import { Tape } from '@/components/collage'
import type { Content, Issue } from '@/content'
import { BrowserShot } from './BrowserShot'

/**
 * Faixa vermelha do 006: cada cliente com o print da página e o link para o
 * site no ar (ou para o código, quando o site não tem endereço público). Embaixo,
 * as agências parceiras.
 */
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

      <ul className="grid grid-cols-2 gap-3 zine:grid-cols-5">
        {issue.clientes?.map((cliente, i, todos) => {
          const href = cliente.site ?? cliente.repo
          // no celular, o último de uma lista ímpar ocupa a linha inteira
          const sozinho = i === todos.length - 1 && todos.length % 2 === 1
          return (
            <li key={cliente.nome} className={`min-w-0 ${sozinho ? 'col-span-2 zine:col-span-1' : ''}`}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex h-full flex-col border-2 border-ink bg-paper p-2 text-ink shadow-zine-sm transition-transform hover:-translate-y-0.5"
              >
                <BrowserShot
                  src={cliente.foto}
                  alt={`${t.projeto.print}: ${cliente.nome}`}
                  url={href}
                  seed={`cliente-${cliente.nome}`}
                  tilt={0.8}
                />
                <span
                  className="mt-2.5 text-[14px] leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cliente.nome}
                </span>
                <span
                  className="mt-0.5 text-[9px] leading-tight text-ink/65"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {cliente.tag}
                </span>
                <span
                  className="mt-auto pt-2 text-[9px] font-bold tracking-[0.06em] text-red uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {cliente.site ? t.issues.verSite : t.issues.verCodigo}
                </span>
              </a>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-paper/70 pt-3">
        <span
          className="text-[10px] font-bold tracking-[0.12em] text-paper"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {t.issues.parceiros.titulo}
        </span>
        {t.issues.parceiros.lista.map((p) => (
          <a
            key={p.nome}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="bg-ink px-3 py-1.5 text-[15px] leading-none text-paper shadow-zine-sm transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {p.nome}
            {p.cidade ? (
              <span className="text-[10px] tracking-[0.06em] text-paper/70" style={{ fontFamily: 'var(--font-mono)' }}>
                {' '}· {p.cidade}
              </span>
            ) : null}{' '}
            ↗
          </a>
        ))}
      </div>
    </article>
  )
}
