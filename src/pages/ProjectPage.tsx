import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { StickerImg, Tape, TornPaper } from '@/components/collage'
import { useContent, findIssue } from '@/content'
import { ProjectFlow } from '@/components/sections/ProjectFlow'
import { ProjectHeader } from '@/components/sections/ProjectHeader'

export default function ProjectPage() {
  const { slug } = useParams()
  const { t, prefix } = useContent()
  const issue = findIssue(t, slug ?? '')

  if (!issue) {
    return (
      <>
        <Helmet>
          <html lang={t.htmlLang} />
          <title>{t.erro404.texto}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="tex-preta flex min-h-[100svh] flex-col items-start justify-center gap-6 px-6 text-paper">
          <p className="text-2xl" style={{ fontFamily: 'var(--font-hand)' }}>{t.erro404.texto}</p>
          <Link to={`${prefix}/`} className="border-b-2 border-paper text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.voltar}</Link>
        </main>
      </>
    )
  }

  const issues = t.issues.lista
  const index = issues.findIndex((item) => item.slug === issue.slug)
  const proxima = issues[(index + 1) % issues.length]
  const passos = issue.passos.length > 0 ? issue.passos : (issue.clientes ?? [])
  const resultado = issue.resultadoGigante.split(' → ')

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        <title>{issue.titulo}</title>
        <meta name="description" content={issue.resumoCard} />
      </Helmet>

      <main className="overflow-hidden">
        <ProjectHeader issue={issue} t={t} prefix={prefix} />

        <section className="tex-creme px-6 pb-24 pt-20 text-ink zine:px-10 zine:pb-32">
          <div className="mx-auto grid max-w-[1360px] items-start gap-16 zine:grid-cols-[1fr_1.2fr] zine:gap-[5vw]">
            <div className="min-w-0">
              <h2 className="mb-5 text-[clamp(2.6rem,4.4vw,4.4rem)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{t.projeto.problema}</h2>
              <div className="relative">
                <Tape seed={`problem-tape-${issue.slug}`} at="top" width={84} />
                <TornPaper
                  seed={`problem-${issue.slug}`}
                  sides="trbl"
                  amp={6}
                  tilt={-1}
                  className="bg-white px-6 py-8 text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-ink zine:px-8"
                >
                  <p>{issue.problema}</p>
                </TornPaper>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="mb-4 text-[clamp(2.6rem,4.4vw,4.4rem)] leading-none" style={{ fontFamily: 'var(--font-display)' }}>{t.projeto.oQueFiz}</h2>
              <ol className="divide-y-2 divide-dashed divide-ink/20">
                {passos.map((passo, i) => (
                  <li key={`${i}-${passo}`} className="flex items-start gap-4 py-3 text-[clamp(0.95rem,1.3vw,1.1rem)] leading-relaxed">
                    <span className="grid size-11 shrink-0 -rotate-6 place-items-center rounded-full bg-ink text-lg leading-none text-paper" style={{ fontFamily: 'var(--font-display)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">{passo}</span>
                  </li>
                ))}
              </ol>
              <ProjectFlow fluxo={issue.fluxo} />
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-[1360px] gap-8 zine:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="relative min-w-0 border-2 border-ink bg-paper p-3 shadow-zine-sm">
                <Tape seed={`print-tape-${issue.slug}-${n}`} at="top" width={70} />
                <StickerImg
                  src={`/prints/${issue.slug}-${n}.jpg`}
                  alt={`${t.projeto.print} ${n}: ${issue.titulo}`}
                  seed={`print-${issue.slug}-${n}`}
                  variant="cutout"
                  height={220}
                  className="w-full"
                  placeholder={`[ ${t.projeto.print} ]`}
                />
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-32 max-w-[1200px] text-center">
            {issue.slug === 'leitor-rco' ? (
              <div className="mb-5 flex items-center justify-center gap-3">
                <StickerImg src="/assets/missi-brava.png" alt="Missi, a gata do Herick" variant="plain" width={72} height={72} className="object-contain" />
                <p className="text-[clamp(1.3rem,2vw,1.8rem)] text-purple" style={{ fontFamily: 'var(--font-hand)' }}>{t.projeto.notaMissi}</p>
              </div>
            ) : null}
            <p className="break-words text-[clamp(2.4rem,7.5vw,6rem)] leading-[0.95]" style={{ fontFamily: 'var(--font-display)', overflowWrap: 'anywhere' }}>
              {resultado.length === 2 ? (
                <>
                  <span className="text-red line-through decoration-[0.06em]">{resultado[0]}</span>{' '}
                  <span>→</span>{' '}
                  <span>{resultado[1]}</span>
                </>
              ) : issue.resultadoGigante}
            </p>
            <p className="mt-4 text-[clamp(1.5rem,2.6vw,2.2rem)] leading-tight" style={{ fontFamily: 'var(--font-hand)' }}>{issue.resultadoFrase}</p>
          </div>
        </section>

        <footer className="tex-preta px-6 py-12 text-paper zine:px-10">
          <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-10 zine:flex-row zine:items-center">
            <Link to={`${prefix}/`} className="text-lg underline decoration-2 underline-offset-4" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.todas}</Link>
            {proxima ? (
              <Link to={`${prefix}/issues/${proxima.slug}`} className="max-w-full text-left zine:text-right">
                <span className="block text-xs tracking-[0.08em] text-lav" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.proxima}</span>
                <span className="block text-[clamp(2rem,4vw,3.75rem)] leading-none" style={{ fontFamily: 'var(--font-display)', overflowWrap: 'anywhere' }}>ISSUE {proxima.numero} · {proxima.titulo} →</span>
              </Link>
            ) : null}
          </div>
        </footer>
      </main>
    </>
  )
}
