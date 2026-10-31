type Props = {
  src: string
  alt: string
  kicker: string
  titulo: string
  texto: string
  /** Etiqueta escura no canto, como os outros cartões da coleção. */
  selo?: string
}

/** Cartão da coleção com uma foto livre tratada nas cores do site. */
export function FotoCard({ src, alt, kicker, titulo, texto, selo }: Props) {
  return (
    <article className="relative min-w-0 border-[3px] border-ink bg-paper p-4 text-ink shadow-zine-sm zine:p-6">
      <span aria-hidden="true" className="absolute -top-3 left-10 h-5 w-24 -rotate-3 border-x-2 border-dashed border-ink/20 bg-paper/85" />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-b-2 border-ink pb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest text-ink/65" style={{ fontFamily: 'var(--font-mono)' }}>
            {kicker}
          </p>
          <h3 className="text-[clamp(1.35rem,3vw,1.75rem)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {titulo}
          </h3>
        </div>
        {selo ? (
          <span className="bg-ink px-2 py-1 text-[10px] font-bold text-paper" style={{ fontFamily: 'var(--font-mono)' }}>
            {selo}
          </span>
        ) : null}
      </header>
      <div className="group overflow-hidden border-2 border-ink">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block aspect-[10/7] w-full object-cover transition-[scale] duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/85" style={{ fontFamily: 'var(--font-marker)' }}>
        {texto}
      </p>
    </article>
  )
}
