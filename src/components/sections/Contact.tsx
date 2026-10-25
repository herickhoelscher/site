import { Barcode, Doodle, NetworkCable, Splat, StickerImg } from '@/components/collage'
import type { Content } from '@/content'

export function Contact({ t }: { t: Content }) {
  return (
    <section id="contato" className="tex-creme relative overflow-hidden px-5 pb-24 pt-32 zine:px-10 zine:pb-36 zine:pt-40">
      <NetworkCable
        path=".9,-.02;.95,.22;.975,.52;.94,.82;.9,1.02"
        pathMobile=".9,-.02;.985,.25;.985,.7;.92,1.02"
      />
      <Splat seed="contact-splat" className="absolute left-[30%] top-6 h-40 w-60 opacity-85" />
      <span className="absolute left-[12%] top-16">
        <Doodle kind="star" seed="contact-star" size={64} color="#E8432E" />
      </span>
      <span className="absolute right-[30%] top-12 hidden zine:block">
        <Doodle kind="crown" seed="contact-crown" size={58} color="#765BA7" />
      </span>
      <StickerImg
        src="/assets/tenis.png"
        alt="Par de tênis pendurado no cabo"
        variant="plain"
        width="clamp(105px, 13vw, 190px)"
        className="absolute right-[-1%] top-0 z-[5]"
      />
      <StickerImg
        src="/assets/mike-surpreso.png"
        alt="Mike surpreso"
        variant="plain"
        width="clamp(85px, 14vw, 190px)"
        className="absolute bottom-4 right-1 z-[5] zine:bottom-auto zine:left-[2%] zine:right-auto zine:top-[36%]"
      />
      <StickerImg
        src="/assets/missi-rindo.png"
        alt="Missi rindo"
        variant="plain"
        width="clamp(110px, 14vw, 190px)"
        className="absolute right-[10%] top-[62%] z-[5] hidden zine:block"
      />

      <div className="relative z-[4] mx-auto mt-8 max-w-[960px] drop-shadow-[14px_16px_0_rgba(0,0,0,0.28)]">
        <div
          className="tex-creme grid -rotate-[1.5deg] text-ink zine:-rotate-[2.5deg] zine:grid-cols-[1fr_170px]"
          style={{
            mask: 'radial-gradient(circle at 0 50%, transparent 18px, #000 19px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 18px, #000 19px) right / 51% 100% no-repeat',
            WebkitMask: 'radial-gradient(circle at 0 50%, transparent 18px, #000 19px) left / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 18px, #000 19px) right / 51% 100% no-repeat',
          }}
        >
          <div className="border-b-4 border-dashed border-ink px-8 py-8 zine:border-r-4 zine:border-b-0 zine:px-14 zine:py-10">
            <p className="text-[10px] font-bold tracking-[.12em] zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
              {t.contato.ticket}
            </p>
            <h2
              /* sem break-words: "CONVERSAR" tem 9 caracteres e era partido no
                 meio. O limite agora cabe a palavra inteira e a quebra cai no
                 espaço, virando "BORA / CONVERSAR". */
              className="my-3 max-w-[10ch] text-[clamp(3rem,7.5vw,7rem)] leading-[.88] hyphens-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.contato.titulo}
            </h2>
            <p className="text-[clamp(1.4rem,3vw,2rem)] leading-tight text-red" style={{ fontFamily: 'var(--font-hand)' }}>
              {t.contato.sub}
            </p>
          </div>
          <div className="flex items-center justify-center p-5 zine:flex-col zine:gap-4">
            <Barcode code="HERICK-2026-DEV" width={110} height={60} />
          </div>
        </div>
      </div>

      <div className="relative z-[6] mx-auto mt-14 flex max-w-[760px] flex-col justify-center gap-4 zine:flex-row zine:gap-6">
        <a
          href={`mailto:${t.contato.emailAddr}`}
          className="-rotate-2 bg-ink px-6 py-4 text-center text-[clamp(1.35rem,2.5vw,1.8rem)] text-paper shadow-[6px_7px_0_#E8432E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.contato.email}
        </a>
        <a
          href="/cv-herick-pt.pdf"
          className="rotate-1 bg-red px-6 py-4 text-center text-[clamp(1.35rem,2.5vw,1.8rem)] text-ink shadow-[6px_7px_0_#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t.contato.cv}
        </a>
      </div>
      <div className="relative z-[6] mt-8 flex justify-center gap-7 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
        {t.hero.links.slice(1).map((link, i) => (
          <a
            key={link.label}
            href={i === 0 ? t.contato.github : t.contato.linkedin}
            className="text-ink underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  )
}
