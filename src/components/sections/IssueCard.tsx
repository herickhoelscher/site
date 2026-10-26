import { Link } from 'react-router-dom'
import { StickerImg, Tape } from '@/components/collage'
import type { Content, Issue } from '@/content'

type Props = {
  issue: Issue
  t: Content
  prefix: string
  /** O 001: imagem à esquerda e texto à direita, numa caixa larga. */
  featured?: boolean
}

/**
 * Cor de destaque de cada issue, lida da referência
 * referencias/wireframes/v2/issues-v3.png. Ela pinta o número, o carimbo e a
 * sombra deslocada do cartão.
 */
const ACENTO: Record<string, { cor: string; sobre: string }> = {
  '001': { cor: 'var(--color-red)', sobre: 'var(--color-white)' },
  '002': { cor: 'var(--color-purple)', sobre: 'var(--color-white)' },
  '003': { cor: 'var(--color-ink)', sobre: 'var(--color-white)' },
  '004': { cor: 'var(--color-red)', sobre: 'var(--color-white)' },
  '005': { cor: 'var(--color-ink)', sobre: 'var(--color-white)' },
}

/**
 * Pôster de uma issue.
 *
 * Diferente do resto do site, estes cartões NÃO usam papel rasgado: a
 * referência mostra retângulos de borda reta com uma sombra sólida deslocada na
 * cor de destaque da issue. É o que separa o catálogo das Issues das seções de
 * colagem.
 */
export function IssueCard({ issue, t, prefix, featured = false }: Props) {
  const acento = ACENTO[issue.numero] ?? ACENTO['003']

  return (
    <article className="group relative h-full min-w-0">
      {/* a sombra sólida, atrás e deslocada */}
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-x-[7px] translate-y-[7px]"
        style={{ backgroundColor: acento.cor }}
      />

      <Tape seed={`tape-${issue.slug}`} at="top" width={86} height={18} />

      <div className="relative flex h-full min-w-0 flex-col border-2 border-ink bg-paper p-4 text-ink transition-transform duration-150 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] zine:p-5">
        {/* topo: número, carimbo preenchido e a linha técnica */}
        <header className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className="text-[clamp(0.95rem,1.4vw,1.15rem)] leading-none"
            style={{ fontFamily: 'var(--font-display)', color: acento.cor }}
          >
            ISSUE #{issue.numero}
          </span>

          <span
            className="px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: acento.cor,
              color: acento.sobre,
            }}
          >
            {issue.selo}
          </span>

          {issue.kicker ? (
            <span
              className="ml-auto hidden text-[9px] tracking-[0.12em] text-ink/45 uppercase zine:block"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {issue.kicker}
            </span>
          ) : null}
        </header>

        <hr className="my-3 border-0 border-t-2 border-ink/80" />

        {/* corpo */}
        <div
          className={`min-w-0 flex-1 ${
            featured ? 'zine:grid zine:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] zine:gap-6' : ''
          }`}
        >
          <StickerImg
            src={issue.capa}
            alt={`${issue.titulo}, issue ${issue.numero}`}
            seed={`capa-${issue.slug}`}
            variant="cutout"
            height={featured ? 215 : 150}
            className="mb-4 w-full"
            placeholder={`[ ${t.projeto.print} ]`}
          />

          <div className="flex min-w-0 flex-col">
            <h3
              className={`leading-[0.95] ${
                featured ? 'text-[clamp(1.9rem,3.2vw,2.9rem)]' : 'text-[clamp(1.5rem,2.2vw,2rem)]'
              }`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {issue.titulo}
            </h3>

            <p
              className="mt-1 text-[clamp(1.05rem,1.5vw,1.3rem)] leading-tight"
              style={{ fontFamily: 'var(--font-hand)', color: acento.cor }}
            >
              &ldquo;{issue.gancho}&rdquo;
            </p>

            <p className="mt-3 text-[13px] leading-relaxed zine:text-[14px]">{issue.resumoCard}</p>

            {/* pastilhas preenchidas, como na referência */}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {issue.stack.map((item) => (
                <li
                  key={item}
                  className="bg-ink px-2 py-[3px] text-[9px] font-bold tracking-[0.04em] text-paper"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* rodapé */}
        <hr className="mt-4 mb-3 border-0 border-t-2 border-dashed border-ink/40" />
        <footer className="flex flex-wrap items-center gap-3">
          {issue.tempo ? (
            <span
              className="text-[9px] tracking-[0.12em] text-ink/60 uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {issue.tempo}
            </span>
          ) : null}

          <Link
            to={`${prefix}/issues/${issue.slug}`}
            className={`text-center text-[10px] font-bold tracking-[0.08em] uppercase transition-transform hover:translate-x-[2px] hover:translate-y-[2px] ${
              featured ? 'ml-auto px-5 py-2.5' : 'w-full px-4 py-2.5'
            }`}
            style={{
              fontFamily: 'var(--font-mono)',
              backgroundColor: featured ? acento.cor : 'var(--color-ink)',
              color: 'var(--color-white)',
              boxShadow: '4px 4px 0 var(--color-ink)',
            }}
          >
            {t.issues.verMais}
            <span className="sr-only"> — {issue.titulo}</span>
          </Link>
        </footer>
      </div>
    </article>
  )
}
