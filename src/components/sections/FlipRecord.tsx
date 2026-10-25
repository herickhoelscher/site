import { Link } from 'react-router-dom'
import { NetworkCable, TornPaper } from '@/components/collage'
import type { Content } from '@/content'

export function FlipRecord({ t, prefix }: { t: Content; prefix: string }) {
  return (
    <section className="tex-roxa relative overflow-hidden px-6 py-24 zine:px-10 zine:py-32">
      <NetworkCable
        path=".9,-.02;.95,.22;.975,.52;.94,.82;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />
      <div className="relative z-[3] mx-auto grid max-w-[1200px] items-center gap-12 zine:grid-cols-[1fr_.8fr]">
        <div>
          <TornPaper
            seed="flip-title"
            sides="trbl"
            amp={5}
            tilt={-2}
            wrapperClassName="inline-block max-w-full"
            className="tex-preta px-5 py-4 text-paper zine:px-8"
          >
            <h2
              className="text-[clamp(2.8rem,6vw,6rem)] leading-[.95]"
              style={{ fontFamily: 'var(--font-marker)' }}
            >
              {t.flip.titulo}
            </h2>
          </TornPaper>
          <p className="mt-8 max-w-[38rem] text-[clamp(1.125rem,2vw,1.5rem)] leading-relaxed text-white">
            {t.flip.texto}
          </p>
          <Link
            to={`${prefix}/lado-b`}
            className="mt-8 inline-block max-w-full -rotate-2 bg-ink px-5 py-4 text-center text-[clamp(1.35rem,2.7vw,2rem)] leading-tight text-paper shadow-zine-sm transition-transform hover:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.flip.botao}
          </Link>
        </div>

        <div className="relative mx-auto aspect-square w-[min(72vw,440px)] max-w-full" aria-hidden="true">
          <div
            className="absolute inset-0 rounded-full border-[10px] border-ink shadow-zine"
            style={{ background: 'repeating-radial-gradient(circle at center, #171717 0 5px, #292929 6px 7px, #171717 8px 13px)' }}
          />
          <div className="absolute inset-[34%] rounded-full border-[8px] border-ink bg-red" />
          <div className="absolute inset-[49%] rounded-full bg-ink" />
        </div>
      </div>
    </section>
  )
}
