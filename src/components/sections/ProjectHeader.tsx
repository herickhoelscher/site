import { Link } from 'react-router-dom'
import { Doodle, NetworkCable, Stamp, StickerImg, Tape, TornPaper } from '@/components/collage'
import type { Content, Issue } from '@/content'
import { LangToggle } from '@/components/LangToggle'

type Props = { issue: Issue; t: Content; prefix: string }

export function ProjectHeader({ issue, t, prefix }: Props) {
  const repo = issue.repositorio?.replace('https://github.com/', '')

  return (
    <>
      <header className="tex-preta relative overflow-hidden text-paper">
        <NetworkCable
          path=".9,.12;.96,.4;.985,.75;.92,1.02"
          pathMobile=".95,.2;.99,.6;.95,1.02"
          scrub={false}
        />
        <nav className="relative z-[3] mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-6 py-6 zine:px-10">
          <Link
            to={`${prefix}/`}
            className="border-b-2 border-paper text-[11px] font-bold tracking-[0.05em] text-paper zine:text-[13px]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.projeto.voltar}
          </Link>
          <div className="flex shrink-0 items-center gap-4">
            <span
              className="text-[11px] tracking-[0.08em] text-paper zine:text-[13px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ISSUE {issue.numero} / 006
            </span>
            <LangToggle className="text-paper" />
          </div>
        </nav>

        <div className="relative z-[2] mx-auto grid max-w-[1360px] items-center gap-12 px-6 pb-20 pt-8 zine:grid-cols-2 zine:gap-[5vw] zine:px-10 zine:pb-24">
          <div data-fx="slide-l" className="relative min-w-0">
            <Tape seed={`case-cover-tape-left-${issue.slug}`} at="top-left" width={80} />
            <Tape seed={`case-cover-tape-right-${issue.slug}`} at="bottom-right" width={80} />
            <TornPaper
              seed={`case-cover-${issue.slug}`}
              sides="trbl"
              amp={7}
              tilt={-2}
              wrapperClassName="relative"
              className="tex-creme p-3 zine:p-4"
            >
              <StickerImg
                src={issue.foto ?? issue.capa}
                alt={issue.foto ? `${t.projeto.print}: ${issue.titulo}` : `Capa da issue ${issue.numero}, ${issue.titulo}`}
                seed={`case-image-${issue.slug}`}
                variant="cutout"
                loading="eager"
                className="aspect-[4/3] w-full object-top"
                placeholder={`[ ${t.projeto.print} ]`}
              />
            </TornPaper>
            <span className="absolute right-1 top-2 z-[4] zine:right-4 zine:top-4">
              <Stamp seed={`case-status-${issue.slug}`} tone="red">
                {issue.selo}
              </Stamp>
            </span>
          </div>

          <div data-fx="slide-r" className="relative min-w-0">
            <span className="fx-spin-slow absolute -top-12 right-8 hidden zine:block">
              <Doodle kind="star" seed={`case-star-${issue.slug}`} size={55} />
            </span>
            <p
              className="break-all text-[12px] tracking-[0.08em] text-lav zine:text-[14px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              ISSUE {issue.numero}{repo ? ` · ${repo}` : ''}
            </p>
            <h1
              className={`mt-3 leading-[0.88] text-paper ${
                /* palavra longa (MULTICONTEÚDO) quebrava no meio: corpo menor */
                Math.max(...issue.titulo.split(' ').map((p) => p.length)) > 9
                  ? 'text-[clamp(2.6rem,5.6vw,6rem)]'
                  : 'text-[clamp(3.5rem,8vw,8.25rem)]'
              }`}
              style={{ fontFamily: 'var(--font-display)', overflowWrap: 'anywhere' }}
            >
              {issue.titulo}
            </h1>
            <p
              className="mt-3 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-none text-red"
              style={{ fontFamily: 'var(--font-hand)' }}
            >
              {issue.gancho}
            </p>
            <p className="mt-5 max-w-[560px] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-paper">
              {issue.resumoLongo}
            </p>
            {issue.site ? (
              <a
                href={issue.site}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-block -rotate-1 bg-red px-5 py-3 text-[clamp(1.1rem,1.8vw,1.4rem)] text-ink shadow-[5px_6px_0_var(--color-paper)] transition-transform hover:-translate-y-0.5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t.issues.verSite}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className="tex-creme px-6 pt-12 text-ink zine:px-10 zine:pt-16">
        <dl
          data-fx="rise"
          className={`relative z-[3] mx-auto grid max-w-[1360px] grid-cols-2 border-2 border-ink ${repo ? 'zine:grid-cols-4' : 'zine:grid-cols-3'}`}
        >
          <div className="min-w-0 border-b-2 border-r-2 border-ink p-3 zine:border-b-0 zine:p-4">
            <dt className="text-[11px] tracking-[0.1em] text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.tipo}</dt>
            <dd className="mt-1 text-[clamp(1rem,1.6vw,1.4rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{issue.tipo}</dd>
          </div>
          <div className="min-w-0 border-b-2 border-ink p-3 zine:border-b-0 zine:border-r-2 zine:p-4">
            <dt className="text-[11px] tracking-[0.1em] text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.stack}</dt>
            <dd className="mt-1 break-words text-[clamp(0.9rem,1.4vw,1.3rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{issue.stack.join(' · ')}</dd>
          </div>
          <div className={`min-w-0 p-3 zine:p-4 ${repo ? 'border-r-2 border-ink' : 'col-span-2 zine:col-span-1'}`}>
            <dt className="text-[11px] tracking-[0.1em] text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.status}</dt>
            <dd className="mt-1 text-[clamp(1rem,1.6vw,1.4rem)] leading-tight text-red" style={{ fontFamily: 'var(--font-display)' }}>{issue.status}</dd>
          </div>
          {issue.repositorio && repo ? (
            <div className="min-w-0 p-3 zine:p-4">
              <dt className="text-[11px] tracking-[0.1em] text-ink/70" style={{ fontFamily: 'var(--font-mono)' }}>{t.projeto.codigo}</dt>
              <dd className="mt-1 break-all text-[clamp(0.85rem,1.2vw,1.15rem)] leading-tight">
                {/* quebra só na barra do caminho, nunca no meio do nome do repo */}
                <a
                  href={issue.repositorio}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block [overflow-wrap:anywhere] underline decoration-2 underline-offset-2 hover:text-red"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {repo} ↗
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>
    </>
  )
}
