import { Doodle, NetworkCable, RansomTitle, StickerImg, Tape, TornPaper } from '@/components/collage'
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
      <span className="absolute left-[47%] top-[9%] hidden zine:block">
        <Doodle kind="star" seed="about-star" size={70} color="#F6F2E8" />
      </span>
      <span className="absolute right-[7%] top-[8%]">
        <Doodle kind="crown" seed="about-crown" size={62} color="#141414" />
      </span>

      <div className="relative z-[3] mx-auto grid max-w-[1360px] items-center gap-14 zine:grid-cols-[1fr_1.08fr] zine:gap-[5vw]">
        <div className="relative mx-auto w-[82%] max-w-[540px] zine:w-[88%]">
          <img
            src="/assets/herick-xerox.png"
            alt="Retrato do Herick em halftone"
            className="block w-full -rotate-2 drop-shadow-[12px_16px_0_rgba(0,0,0,0.35)]"
          />
          <StickerImg
            src="/assets/missi-brava.png"
            alt="Missi, a gata siamesa, com cara de julgamento"
            variant="plain"
            width="40%"
            className="absolute right-[-8%] top-[20%] z-[4]"
          />
          <StickerImg
            src="/assets/mike-feliz.png"
            alt="Mike, o cachorro preto, de fone"
            variant="plain"
            width="38%"
            className="absolute bottom-[-3%] left-[-8%] z-[4]"
          />
          {t.quem.stack.map((item, i) => (
            <span
              key={item}
              className={`absolute z-[6] grid size-[clamp(3.5rem,8vw,6rem)] place-items-center break-all rounded-full border-[3px] border-white px-1 text-center text-[clamp(0.65rem,1.7vw,1.2rem)] leading-none shadow-zine-sm ${chipPositions[i % chipPositions.length]} ${chipColors[i % chipColors.length]}`}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {item}
            </span>
          ))}
          <span
            className="absolute -top-[14%] right-0 hidden max-w-[13ch] rotate-3 text-[1.75rem] leading-none text-white zine:block"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {t.quem.notas.missi}
          </span>
          <span
            className="absolute -bottom-[17%] left-0 hidden -rotate-3 text-[1.75rem] text-ink zine:block"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {t.quem.notas.mike}
          </span>
        </div>

        <div className="min-w-0">
          <p
            className="mb-4 hidden -rotate-3 text-[1.9rem] text-ink zine:block"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {t.quem.notas.comecei}
          </p>
          <RansomTitle text={t.quem.titulo} size="clamp(2rem, 5vw, 5.3rem)" className="mb-8" />
          <div className="relative">
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
