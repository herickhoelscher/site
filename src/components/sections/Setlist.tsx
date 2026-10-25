import { useState } from 'react'
import { Doodle, NetworkCable, StickerImg, Tape, TornPaper } from '@/components/collage'
import type { Content } from '@/content'

export function Setlist({ t }: { t: Content }) {
  const [openTrack, setOpenTrack] = useState<number | null>(3)

  return (
    <section id="setlist" className="tex-preta relative overflow-hidden px-5 py-24 zine:px-10 zine:py-32">
      <NetworkCable
        path=".9,-.02;.95,.22;.975,.52;.94,.82;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-[18%] w-[52%]"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(255,236,190,.20), rgba(255,236,190,.06) 55%, transparent 75%)', clipPath: 'polygon(38% 0,62% 0,100% 100%,0 100%)' }}
        aria-hidden="true"
      />
      <span className="absolute left-[6%] top-16 z-[4]">
        <Doodle kind="star" seed="setlist-star" size={60} color="#E8432E" />
      </span>

      <div className="relative z-[3] mx-auto grid max-w-[1320px] items-end gap-10 zine:grid-cols-[1.3fr_.7fr] zine:gap-[4vw]">
        <div className="relative min-w-0">
          <TornPaper
            seed="setlist-sheet"
            sides="tb"
            amp={4}
            tilt={-1.8}
            className="bg-paper px-5 py-8 text-ink zine:px-14 zine:py-12"
            style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 43px, rgba(118,91,167,.16) 43px 45px)' }}
          >
            <h2
              className="text-[clamp(3.25rem,7vw,6.75rem)] leading-none"
              style={{ fontFamily: 'var(--font-marker)' }}
            >
              {t.setlist.titulo}
            </h2>
            <p className="mb-5 mt-1 text-[1.6rem] leading-none text-red" style={{ fontFamily: 'var(--font-hand)' }}>
              {t.setlist.sub}
            </p>
            <ol>
              {t.setlist.faixas.map((track, i) => {
                const open = openTrack === i
                const panelId = `setlist-detail-${i}`
                const buttonId = `setlist-track-${i}`
                return (
                  <li key={`${track.n}-${i}`} className="border-b-2 border-dashed border-ink/20">
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenTrack(open ? null : i)}
                      className={`grid w-full grid-cols-[2.75rem_1fr] items-baseline gap-1 py-2 text-left text-[clamp(1.2rem,2.4vw,2.3rem)] leading-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red zine:grid-cols-[3.75rem_1fr] ${open ? 'text-red' : 'text-ink'}`}
                      style={{ fontFamily: 'var(--font-marker)' }}
                    >
                      <span className={open ? 'text-red' : 'text-purple'}>{track.n}</span>
                      <span>{track.faixa}</span>
                    </button>
                    <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
                      <p className="pb-4 pl-[2.75rem] text-[15px] leading-relaxed zine:pl-[3.75rem] zine:text-base">
                        {track.detalhe}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </TornPaper>
          <Tape seed="setlist-tape-left" at="top-left" width={78} height={24} />
          <Tape seed="setlist-tape-right" at="top-right" width={78} height={24} />
          <Tape seed="setlist-tape-bottom" at="bottom-left" />
        </div>

        <div className="relative mx-auto h-[330px] w-full max-w-[360px] zine:h-[560px]">
          <p
            className="absolute top-5 left-0 hidden -rotate-6 text-[1.9rem] text-white zine:block"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {t.setlist.nota}
          </p>
          <div className="absolute right-0 bottom-0 h-[150px] w-[170px] rounded border-[6px] border-[#2a2a2a] bg-[#1d1d1d] shadow-zine zine:h-[230px] zine:w-[260px]">
            <div className="absolute inset-x-3 top-3 flex gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => <i key={i} className="size-3 rounded-full bg-paper" />)}
            </div>
            <div
              className="absolute inset-x-3 top-11 bottom-3 border-[3px] border-[#2c2c2c]"
              style={{ background: 'radial-gradient(circle,#3a3a3a 32%,transparent 36%) 0 0/9px 9px' }}
              aria-hidden="true"
            />
          </div>
          <StickerImg src="/assets/mike-corpo.png" alt="Mike no palco" variant="plain" width="58%" className="absolute bottom-0 left-0 z-[3] max-w-[230px]" />
          <StickerImg src="/assets/missi-sentada.png" alt="Missi em cima do amplificador" variant="plain" width="42%" className="absolute right-[9%] bottom-[142px] z-[4] max-w-[170px] zine:bottom-[222px]" />
        </div>
      </div>
    </section>
  )
}
