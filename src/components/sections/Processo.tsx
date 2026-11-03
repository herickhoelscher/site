import { FundoVivo } from '@/components/collage'
import type { Content } from '@/content'
import { linkOrcamento, temWhatsapp } from '@/lib/orcamento'
import { Adesivo } from './Adesivo'

/**
 * Como funciona: quatro passos em linha reta, ligados por um tracejado, do
 * primeiro "oi" até o site no ar. Fecha com o botão de orçamento.
 */
export function Processo({ t }: { t: Content }) {
  const { processo } = t
  return (
    <section id="processo" className="tex-roxa relative overflow-x-clip px-5 py-20 text-paper zine:px-10 zine:py-28">
      <FundoVivo tom="roxo" seed="processo" />
      <span data-fx-speed="0.45" className="absolute right-[5%] top-[10%] hidden size-24 zine:block">
        <Adesivo tipo="caveira" giro={10} className="inset-0" />
      </span>
      <span data-fx-speed="-0.35" className="absolute bottom-[8%] left-[4%] hidden size-24 zine:block">
        <Adesivo tipo="tenis" giro={-8} mexe="float-2" className="inset-0" />
      </span>

      <div className="relative z-[3] mx-auto max-w-[1280px]">
        <header className="mx-auto max-w-3xl text-center">
          <p data-fx="wipe" className="inline-block bg-paper px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-ink uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
            {processo.kicker}
          </p>
          <h2 data-fx="slam" className="mt-3 text-[clamp(2.8rem,7vw,6rem)] leading-[0.88] drop-shadow-[4px_4px_0_#141414]" style={{ fontFamily: 'var(--font-display)' }}>
            {processo.titulo}
          </h2>
          <p data-fx="rise" className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-paper/90 zine:text-lg">
            {processo.sub}
          </p>
        </header>

        <ol data-fx="stagger" data-fx-child="rise" className="relative mt-14 grid grid-cols-1 gap-6 zine:grid-cols-4 zine:gap-7">
          {/* o tracejado que liga os passos, atrás dos cartões */}
          <span aria-hidden="true" className="pointer-events-none absolute left-[12%] right-[12%] top-9 hidden border-t-4 border-dashed border-paper/50 zine:block" />
          {processo.passos.map((p, i) => (
            <li key={p.titulo} className="relative min-w-0">
              <div className="flex h-full flex-col border-[3px] border-ink bg-paper p-5 text-ink shadow-[8px_8px_0_#141414]">
                <span
                  className="grid size-14 place-items-center rounded-full border-[3px] border-ink bg-red text-2xl leading-none text-paper shadow-[3px_3px_0_#141414]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-[clamp(1.5rem,2vw,1.9rem)] leading-[0.95] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/85">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <div data-fx="rise" className="mt-14 flex flex-col items-center gap-3 text-center">
          <a
            href={linkOrcamento(t)}
            target="_blank"
            rel="noreferrer"
            className="fx-jelly border-[3px] border-ink bg-red px-8 py-4 text-[clamp(1.4rem,2.6vw,2rem)] leading-none text-paper shadow-[6px_6px_0_#141414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {temWhatsapp(t) ? processo.ctaWhats : t.orcamento.botao} ↗
          </a>
          <p className="text-lg text-paper/90" style={{ fontFamily: 'var(--font-hand)' }}>
            {processo.nota}
          </p>
        </div>
      </div>
    </section>
  )
}
