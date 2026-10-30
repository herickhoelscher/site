import { Doodle, NetworkCable, RansomTitle, Tape, TornPaper } from '@/components/collage'
import type { Content } from '@/content'

const chipPositions = [
  'left-[1%] top-[3%]',
  'left-[-4%] top-[33%]',
  'left-[35%] top-[-5%]',
  'right-[-3%] top-[58%]',
  'left-[31%] bottom-[-5%]',
  'right-[12%] bottom-[-7%]',
  'left-[-5%] top-[64%]',
  'right-[-4%] top-[83%]',
]
const chipColors = [
  'bg-ink text-white',
  'bg-paper text-ink',
  'bg-purple text-white',
  'bg-lav text-ink',
]

export function About({ t }: { t: Content }) {
  return (
    <section id="quem" className="tex-vermelha relative overflow-hidden px-6 py-24 zine:px-10 zine:py-32">
      <NetworkCable
        path=".9,-.02;.95,.22;.975,.52;.94,.82;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />
      <span data-fx="pop" className="absolute left-[47%] top-[9%] hidden zine:block">
        <span className="fx-float block">
          <Doodle kind="star" seed="about-star" size={70} color="#F6F2E8" />
        </span>
      </span>
      <span data-fx="pop" className="absolute right-[7%] top-[8%]">
        <span className="fx-float-2 block">
          <Doodle kind="crown" seed="about-crown" size={62} color="#141414" />
        </span>
      </span>

      <div className="relative z-[3] mx-auto grid max-w-[1360px] items-center gap-14 zine:grid-cols-[1fr_1.08fr] zine:gap-[5vw]">
        <div data-fx="slide-l" className="relative mx-auto w-[82%] max-w-[540px] zine:w-[88%]">
          <img
            src="/assets/herick-xerox.png"
            alt="Retrato do Herick em halftone"
            className="block w-full -rotate-2 drop-shadow-[12px_16px_0_rgba(0,0,0,0.35)]"
          />
          {t.quem.stack.map((item, i) => (
            <span
              key={item}
              data-fx="pop"
              className={`absolute z-[6] ${chipPositions[i % chipPositions.length]}`}
            >
              <span
                className={`fx-jelly grid size-[clamp(3.5rem,8vw,6rem)] place-items-center break-all rounded-full border-[3px] border-white px-1 text-center text-[clamp(0.65rem,1.7vw,1.2rem)] leading-none shadow-zine-sm ${i % 2 ? 'fx-float' : 'fx-float-2'} ${chipColors[i % chipColors.length]}`}
                style={{ fontFamily: 'var(--font-display)', animationDelay: `${-i * 0.7}s` }}
              >
                {item}
              </span>
            </span>
          ))}
        </div>

        <div className="min-w-0">
          <p
            data-fx="pop"
            className="mb-4 hidden -rotate-3 text-[1.9rem] text-ink zine:block"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {t.quem.notas.comecei}
          </p>
          <RansomTitle text={t.quem.titulo} size="clamp(2rem, 5vw, 5.3rem)" className="mb-8" fx />
          <div data-fx="rise" className="relative">
            <TornPaper seed="about-bio" sides="trbl" amp={5} tilt={1.2} className="tex-creme px-6 py-7 text-ink zine:px-11 zine:py-10">
              {t.quem.bio.map((paragraph) => (
                <p key={paragraph} className="mb-4 text-[1rem] leading-relaxed last:mb-0 zine:text-[1.125rem]">
                  {paragraph}
                </p>
              ))}
              <p
                className="mt-5 border-t-2 border-dashed border-ink/25 pt-4 text-xs leading-relaxed zine:text-[13px]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {t.quem.infra}
              </p>
            </TornPaper>
            <Tape seed="about-tape-top" at="top-left" />
            <Tape seed="about-tape-bottom" at="bottom-right" />
          </div>
        </div>
      </div>
    </section>
  )
}
