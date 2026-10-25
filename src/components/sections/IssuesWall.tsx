import { NetworkCable, Doodle } from '@/components/collage'
import { IssueCard } from './IssueCard'
import { useIsMobile } from '@/lib/useIsMobile'
import type { Content } from '@/content'

type Props = { t: Content; prefix: string }

/**
 * Mural das Issues (§ 5).
 *
 * Desktop: grade de 12 colunas. A 001 ocupa 6 colunas e 2 linhas, as 002 a 005
 * ocupam 3 colunas cada e a 006 é uma faixa larga com a lista de clientes.
 *
 * Celular: carrossel com scroll-snap, um pôster por vez a 84vw. Ele rola dentro
 * do próprio bloco — a página nunca rola na horizontal (§ 8).
 */
export function IssuesWall({ t, prefix }: Props) {
  const isMobile = useIsMobile()
  const [destaque, ...resto] = t.issues.lista
  const meio = resto.slice(0, 4)
  const faixa = resto[4]

  return (
    <section id="issues" className="tex-preta relative overflow-hidden py-16 zine:py-24">
      <NetworkCable
        path=".9,-.02;.965,.16;.985,.5;.955,.86;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />

      <header className="relative z-[3] mb-10 px-6 zine:px-10">
        <h2
          className="text-[clamp(3rem,10vw,7rem)] leading-none text-red"
          style={{ fontFamily: 'var(--font-spray)' }}
        >
          {t.issues.titulo}
        </h2>
        <p
          className="mt-2 text-[clamp(1.1rem,2vw,1.6rem)] text-white"
          style={{ fontFamily: 'var(--font-hand)' }}
        >
          {t.issues.sub}
        </p>
        <span className="absolute right-8 top-0 hidden zine:block">
          <Doodle kind="crown" seed="issues-crown" size={62} color="#F6F2E8" />
        </span>
      </header>

      {isMobile ? (
        <>
          <ul
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            {t.issues.lista.map((issue) => (
              <li key={issue.slug} className="w-[84vw] shrink-0 snap-center">
                <IssueCard issue={issue} t={t} prefix={prefix} />
              </li>
            ))}
          </ul>
          <p
            className="mt-2 px-6 text-[13px] text-white/70"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            arraste →
          </p>
        </>
      ) : (
        <div className="relative z-[3] grid grid-cols-12 gap-6 px-10">
          <div className="col-span-6 row-span-2">
            <IssueCard issue={destaque} t={t} prefix={prefix} featured className="h-full" />
          </div>
          {meio.map((issue) => (
            <div key={issue.slug} className="col-span-3">
              <IssueCard issue={issue} t={t} prefix={prefix} className="h-full" />
            </div>
          ))}
          {faixa ? (
            <div className="col-span-12">
              <IssueCard issue={faixa} t={t} prefix={prefix} wide />
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
