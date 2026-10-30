import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMeasure } from '@/lib/useMeasure'
import { useIsMobile } from '@/lib/useIsMobile'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { useContent } from '@/content'
import type { Content } from '@/content'
import { HeroCanvas } from './HeroCanvas'
import { LangToggle } from '@/components/LangToggle'

type Props = { t: Content }

/**
 * Hero no espírito da abertura do dotconor.com: a primeira tela é só o nome
 * cortado pela linha, a plaquinha, o asterisco e a tinta, com uma linha de
 * texto embaixo. Menu, cabo e pets entram a partir da seção seguinte.
 *
 * Todo o desenho é do HeroCanvas. O h1 continua no HTML (sr-only) para o
 * buscador e o leitor de tela; o canvas é aria-hidden.
 */
export function Hero({ t }: Props) {
  const [sectionRef, { width: W, height: H }] = useMeasure<HTMLElement>()
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const { prefix } = useContent()
  const [pronto, setPronto] = useState(false)

  const aparece = `transition-opacity duration-500 ${pronto || reduced ? 'opacity-100' : 'opacity-0'}`

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="relative min-h-[100svh] overflow-hidden bg-paper"
    >
      {W > 0 && H > 0 && (
        <HeroCanvas
          nome={t.hero.name}
          placa={t.hero.sticker}
          width={W}
          height={H}
          isMobile={isMobile}
          reduced={reduced}
          onEntradaFim={() => setPronto(true)}
        />
      )}

      <h1 className="sr-only">Herick Hoelscher · {t.hero.tagline}</h1>

      <div className={`absolute top-5 right-5 z-10 zine:top-7 zine:right-8 ${aparece}`}>
        <LangToggle className="text-paper" />
      </div>

      {/* rodapé da primeira tela, como o "a product designer in NYC" da referência */}
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-5 pb-6 zine:flex-row zine:items-end zine:justify-between zine:px-10 zine:pb-8 ${aparece}`}
      >
        <p
          className="max-w-[26ch] text-[clamp(1.15rem,2vw,2.2rem)] leading-[1.1] text-ink zine:max-w-none"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {t.hero.tagline}
        </p>
        <div className="flex items-center gap-5">
          {t.hero.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[15px] text-ink hover:underline hover:decoration-2 hover:underline-offset-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {l.label}
            </a>
          ))}
          <Link
            to={`${prefix}/lado-b`}
            className="rounded-full bg-ink px-5 py-2 text-[15px] font-medium text-paper transition-transform hover:scale-105"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t.nav.ladob}
          </Link>
        </div>
      </div>
    </section>
  )
}
