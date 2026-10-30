import { Link } from 'react-router-dom'
import { NetworkCable } from '@/components/collage'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import type { Content } from '@/content'

type Props = { t: Content; prefix: string }

/**
 * "Virar o disco": a passagem do Lado A para o Lado B.
 *
 * A capa é um quadrado preto com o vinil saindo por trás, pela direita, como na
 * referência em referencias/wireframes/v2/flip-disco.png. Ao passar o mouse no
 * bloco, o disco desliza mais para fora e gira um pouco, que é o gesto de tirar
 * o disco da capa. Com prefers-reduced-motion ele fica parado.
 */
export function FlipRecord({ t, prefix }: Props) {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="tex-roxa relative overflow-hidden py-16 zine:py-24">
      <NetworkCable
        path=".9,-.02;.955,.3;.985,.62;.955,.88;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />

      <div className="relative z-[3] mx-auto grid max-w-[1200px] items-center gap-12 px-6 zine:grid-cols-[minmax(0,420px)_1fr] zine:gap-16 zine:px-10">
        {/* capa + vinil */}
        <div data-fx="slide-l" className="group relative mx-auto w-full max-w-[360px]">
          {/* o vinil, atrás da capa, saindo pela direita */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-[38%] aspect-square w-[70%] -translate-y-1/2 rounded-full"
            style={{
              background:
                'repeating-radial-gradient(circle, #0d0d0d 0 4px, #1c1c1c 4px 6px), #121212',
              transition: reduced ? undefined : 'transform 420ms cubic-bezier(.22,.61,.36,1)',
            }}
          >
            {/* o rótulo gira: é ele que mostra que o disco está tocando */}
            <span className="fx-spin absolute inset-0 m-auto grid h-[30%] w-[30%] place-items-center rounded-full bg-red">
              <span
                className="absolute top-[14%] text-[clamp(0.45rem,1.3vw,0.6rem)] font-bold tracking-[0.12em] text-ink"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                33⅓
              </span>
            </span>
            <span className="absolute inset-0 m-auto h-[4%] w-[4%] rounded-full bg-paper" />
          </div>

          {/* a capa do álbum */}
          <div className="relative aspect-square w-[82%] -rotate-2 bg-ink p-5 shadow-[10px_12px_0_rgba(0,0,0,.35)]">
            <p
              className="text-[11px] font-bold tracking-[0.1em] text-red"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {t.flip.capa.lados}
            </p>

            <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 text-center">
              <p
                className="text-[clamp(1.8rem,6vw,2.6rem)] leading-none text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t.flip.capa.nome}
              </p>
              <p
                className="mt-1 text-[clamp(0.9rem,2.6vw,1.15rem)] tracking-[0.18em] text-lav"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.flip.capa.sub}
              </p>
            </div>

            <div
              className="absolute inset-x-5 bottom-4 flex justify-between text-[11px] tracking-[0.08em] text-paper/50"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>{t.flip.capa.rpm}</span>
              <span>{t.flip.capa.ano}</span>
            </div>
          </div>

          {/* no hover o disco sai mais da capa */}
          <style>{`
            .group:hover > div:first-child { transform: translate(8%, -50%) rotate(12deg); }
          `}</style>
        </div>

        {/* texto */}
        <div data-fx="rise" className="relative z-[4]">
          <span
            className="inline-block border-2 border-ink bg-paper px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-ink uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {t.flip.tag}
          </span>

          <h2
            data-fx="slam"
            className="mt-4 origin-left text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.92] text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.flip.titulo}
          </h2>

          <p className="mt-4 max-w-[46ch] text-[clamp(1rem,1.5vw,1.2rem)] leading-relaxed text-white">
            {t.flip.texto}
          </p>

          <Link
            to={`${prefix}/lado-b`}
            className="fx-jelly mt-8 inline-block bg-paper px-6 py-3 text-[clamp(0.95rem,1.6vw,1.2rem)] text-ink shadow-[6px_6px_0_var(--color-ink)] transition-transform hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.flip.botao}
          </Link>
        </div>
      </div>
    </section>
  )
}
