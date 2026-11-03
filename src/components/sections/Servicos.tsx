import { FundoVivo } from '@/components/collage'
import type { Content } from '@/content'
import type { Servico } from '@/content/types'
import { linkOrcamento } from '@/lib/orcamento'
import { Adesivo } from './Adesivo'
import { Faixas } from './Faixas'

/** Cor da sombra dura de cada cartão, na ordem. */
const SOMBRAS = ['#E8432E', '#765BA7', '#141414', '#E8432E']

/** Ícones próprios, traço grosso, um por serviço. */
function Icone({ tipo }: { tipo: Servico['icone'] }) {
  const t = { fill: 'none', stroke: '#141414', strokeWidth: 3.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-11 shrink-0">
      {tipo === 'site' && (
        <g {...t}>
          <rect x="5" y="8" width="38" height="30" rx="3" fill="#EFE9DA" />
          <path d="M5 16 H43" />
          <circle cx="10" cy="12" r="1.2" fill="#E8432E" stroke="none" />
          <circle cx="14.5" cy="12" r="1.2" fill="#A68BE6" stroke="none" />
          <path d="M11 23 H27 M11 29 H22" />
          <rect x="30" y="22" width="8" height="10" fill="#E8432E" />
        </g>
      )}
      {tipo === 'loja' && (
        <g {...t}>
          <path d="M9 16 H39 L36 42 H12 Z" fill="#E8432E" />
          <path d="M17 19 V13 a7 7 0 0 1 14 0 V19" />
          <path d="M19 30 l4 4 l7 -8" stroke="#EFE9DA" />
        </g>
      )}
      {tipo === 'sistema' && (
        <g {...t}>
          <rect x="5" y="7" width="38" height="28" rx="3" fill="#EFE9DA" />
          <path d="M13 28 V22 M20 28 V16 M27 28 V19 M34 28 V12" stroke="#765BA7" strokeWidth="4" />
          <path d="M18 42 H30 M24 35 V42" />
        </g>
      )}
      {tipo === 'automacao' && (
        <g {...t}>
          <circle cx="11" cy="12" r="6" fill="#A68BE6" />
          <circle cx="37" cy="24" r="6" fill="#E8432E" />
          <circle cx="11" cy="36" r="6" fill="#EFE9DA" />
          <path d="M17 13 C 26 14, 28 20, 31 22 M17 35 C 26 34, 28 28, 31 26" />
          <path d="M28 18.5 L31.5 22 L27 23.5" />
        </g>
      )}
    </svg>
  )
}

/**
 * Serviços: o que o Herick vende, em quatro cartões alinhados. Cada um diz o
 * que é, o que entra e onde ele já fez isso, com o pedido de orçamento já
 * escrito. Atrás, palavras gigantes correm de lado com a rolagem (parallax) e
 * o fundo vivo de retícula e estrelas.
 */
export function Servicos({ t }: { t: Content }) {
  const { servicos } = t
  const palavras = `${servicos.fundo.join(' · ')} · `

  return (
    <section id="servicos" className="tex-creme relative overflow-x-clip text-ink">
      <Faixas a={servicos.faixa} b={t.quem.stack} />
      <div className="relative px-5 py-20 zine:px-10 zine:py-28">
        <FundoVivo tom="claro" seed="servicos" />
        {/* palavras gigantes em contorno, uma fileira para cada lado */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[18%] select-none overflow-hidden">
          <p
            data-fx-x="-0.35"
            className="whitespace-nowrap text-[clamp(5rem,13vw,12rem)] leading-none text-transparent"
            style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '2px rgba(20,20,20,.12)' }}
          >
            {palavras.repeat(3)}
          </p>
          <p
            data-fx-x="0.35"
            className="-mt-4 whitespace-nowrap text-[clamp(5rem,13vw,12rem)] leading-none text-transparent"
            style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '2px rgba(232,67,46,.16)' }}
          >
            {palavras.repeat(3)}
          </p>
        </div>
        <span data-fx-speed="0.5" className="absolute right-[3%] top-[6%] hidden size-28 zine:block">
          <Adesivo tipo="opart" mexe="spin" className="inset-0" />
        </span>
        <span data-fx-speed="-0.4" className="absolute bottom-[6%] left-[2%] hidden size-24 zine:block">
          <Adesivo tipo="mago" giro={-12} className="inset-0" />
        </span>

        <div className="relative z-[3] mx-auto max-w-[1280px]">
          <header className="max-w-3xl">
            <p data-fx="wipe" className="inline-block bg-ink px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-paper uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
              {servicos.kicker}
            </p>
            <h2 data-fx="slam" className="mt-3 origin-left text-[clamp(2.8rem,7vw,6rem)] leading-[0.88]" style={{ fontFamily: 'var(--font-display)' }}>
              {servicos.titulo}
            </h2>
            <p data-fx="rise" className="mt-4 max-w-2xl text-base leading-relaxed text-ink/85 zine:text-lg">
              {servicos.sub}
            </p>
          </header>

          <ul data-fx="stagger" data-fx-child="rise" className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {servicos.lista.map((s, i) => (
              <li key={s.titulo} className="min-w-0">
                <article
                  className="flex h-full flex-col border-[3px] border-ink bg-paper p-5 transition-transform duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px]"
                  style={{ boxShadow: `8px 8px 0 ${SOMBRAS[i % SOMBRAS.length]}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <Icone tipo={s.icone} />
                    <span className="text-[2.6rem] leading-none text-transparent" style={{ fontFamily: 'var(--font-display)', WebkitTextStroke: '1.5px #141414' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-4 text-[clamp(1.6rem,2.2vw,2rem)] leading-[0.95] uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                    {s.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/85">{s.texto}</p>
                  <ul className="mt-4 space-y-2 border-t-2 border-dashed border-ink/30 pt-4">
                    {s.itens.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] leading-snug">
                        <span aria-hidden="true" className="text-red">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-5">
                    <p className="text-[9px] font-bold tracking-[0.12em] text-ink/55 uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                      {servicos.exemplos}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-1.5">
                      {s.exemplos.map((e) => (
                        <span key={e} className="bg-ink px-2 py-[3px] text-[9px] font-bold tracking-[0.04em] text-paper" style={{ fontFamily: 'var(--font-mono)' }}>
                          {e}
                        </span>
                      ))}
                    </p>
                    <a
                      href={linkOrcamento(t, s.titulo)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 block border-2 border-ink bg-red px-3 py-2.5 text-center text-[11px] font-bold tracking-[0.08em] text-paper uppercase shadow-[4px_4px_0_#141414] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {t.orcamento.botao} ↗<span className="sr-only">: {s.titulo}</span>
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
