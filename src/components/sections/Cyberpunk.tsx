import type { Content } from '@/content'

/**
 * Bloco cyberpunk: título com glitch, katakana na lateral, linhas de varredura
 * e quatro fotos livres de ruas de neon de Tóquio, tratadas nas cores do site.
 */
export function Cyberpunk({ t }: { t: Content }) {
  const { cyber } = t.ladob
  return (
    <section className="relative mb-20 overflow-hidden rounded-xl border-4 border-ink bg-ink p-5 text-paper shadow-zine zine:p-10">
      <div aria-hidden="true" className="fx-scan pointer-events-none absolute inset-0 z-[5] opacity-60" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-6 z-[1] hidden opacity-80 text-[clamp(2rem,4.5vw,3.6rem)] leading-none text-red zine:block"
        style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-display)' }}
      >
        {cyber.kana}
      </span>

      <header className="relative z-[6] max-w-3xl">
        <p className="text-[10px] font-bold tracking-[0.25em] text-lav zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          {cyber.kicker}
        </p>
        <h2
          data-text={cyber.titulo}
          className="fx-glitch mt-2 text-[clamp(3.2rem,11vw,8rem)] leading-[0.85]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {cyber.titulo}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/85 zine:text-base">{cyber.texto}</p>
      </header>

      <ul data-fx="stagger" data-fx-child="rise" className="relative z-[6] mt-8 grid grid-cols-2 gap-3 zine:mt-10 zine:grid-cols-4 zine:gap-5">
        {cyber.fotos.map((foto, i) => (
          <li key={foto.src} className="group min-w-0">
            <figure className={`relative overflow-hidden border-2 border-paper/80 bg-ink ${i % 2 ? 'zine:translate-y-10' : ''}`}>
              <img
                src={foto.src}
                alt={foto.lugar}
                loading="lazy"
                className="block aspect-[3/4] w-full object-cover transition-[scale,filter] duration-500 group-hover:scale-105 group-hover:saturate-150"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink via-ink/70 to-transparent p-2 pt-10">
                <span className="text-[9px] font-bold tracking-[0.08em] text-paper zine:text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
                  {foto.lugar}
                </span>
                <span className="shrink-0 text-[8px] text-paper/60" style={{ fontFamily: 'var(--font-mono)' }}>
                  {foto.autor}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="relative z-[6] mt-6 text-[10px] text-paper/55 zine:mt-14" style={{ fontFamily: 'var(--font-mono)' }}>
        {cyber.credito}
      </p>
    </section>
  )
}
