import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useContent } from '@/content'
import { LangToggle } from '@/components/LangToggle'
import { Mixtape } from '@/components/sections/Mixtape'
import { VhsShelf } from '@/components/sections/VhsShelf'
import { Cartridges } from '@/components/sections/Cartridges'
import { ChessCard } from '@/components/sections/ChessCard'
import { TeamBadges } from '@/components/sections/TeamBadges'
import { PinterestMural } from '@/components/sections/PinterestMural'

export default function LadoB() {
  const { t, prefix } = useContent()
  const { ladob } = t

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        <title>{`${ladob.titulo} - ${ladob.rodape.marca}`}</title>
        <meta name="description" content={ladob.intro} />
      </Helmet>

      <div className="min-h-screen overflow-x-clip bg-purple text-ink" style={{ backgroundColor: '#5d438a', backgroundImage: 'radial-gradient(rgba(20,20,20,.14) 1px,transparent 0)', backgroundSize: '8px 8px' }}>
        <header className="sticky top-0 z-50 border-b-4 border-ink bg-ink text-paper">
          <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-2 px-4 py-2 zine:h-14 zine:grid-cols-[1fr_auto_1fr] zine:px-6 zine:py-0">
            <Link to={`${prefix}/`} className="w-fit max-w-full border-2 border-paper bg-red px-2 py-1 text-[9px] font-bold leading-tight tracking-wide text-paper uppercase shadow-[2px_2px_0_#141414] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 zine:px-3 zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.voltar}</Link>
            <p className="order-3 col-span-2 flex items-center justify-center gap-2 pb-1 text-center text-[9px] font-bold tracking-[.16em] text-paper/85 zine:order-none zine:col-span-1 zine:pb-0 zine:text-xs zine:tracking-[.25em]" style={{ fontFamily: 'var(--font-mono)' }}><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-red" />{ladob.barra}</p>
            <LangToggle className="justify-self-end text-paper" />
          </div>
        </header>

        <main className="relative mx-auto max-w-[1440px] px-4 pt-7 pb-20 zine:px-6 zine:pt-10">
          <section className="relative mb-16 grid min-w-0 items-center gap-9 rounded-xl border-4 border-ink p-5 text-paper shadow-zine zine:mb-20 zine:grid-cols-2 zine:p-10" style={{ backgroundColor: '#48316d' }}>
            <div className="min-w-0 space-y-5">
              <span className="inline-block -rotate-2 border-x-2 border-dashed border-ink/20 bg-paper px-4 py-1.5 text-sm text-red" style={{ fontFamily: 'var(--font-marker)' }}>{ladob.tag}</span>
              <div>
                <p className="mb-2 text-xs font-bold tracking-[.25em] text-paper zine:text-sm" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.kicker}</p>
                <h1 className="break-words text-[clamp(4.5rem,13vw,9rem)] leading-[.88] text-paper drop-shadow-[4px_4px_0_#141414]" style={{ fontFamily: 'var(--font-display)' }}>{ladob.titulo}</h1>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-paper/95 zine:text-xl">{ladob.intro}</p>
              <ul className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold zine:text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                {ladob.chips.map((chip, index) => <li key={chip} className={`border border-ink px-3 py-1.5 shadow-zine-sm ${index === 0 ? 'bg-ink text-paper' : index === 1 ? 'bg-yellow-300 text-ink' : 'bg-lav text-ink'}`}>{chip}</li>)}
              </ul>
            </div>
            <div className="relative mx-auto flex w-full max-w-[430px] items-center justify-center pb-10 zine:pb-4">
              <div className="flex aspect-square w-[min(74vw,390px)] items-center justify-center rounded-full border-4 border-ink shadow-[8px_8px_0_#141414] zine:w-full" style={{ background: 'radial-gradient(circle,#1c1c1c 20%,#292929 21%,#171717 35%,#242424 36%,#141414 48%,#222 49%,#121212 60%,#2b2b2b 61%,#111 75%,#1f1f1f 76%,#0d0d0d 100%)' }}>
                <div className="relative flex aspect-square w-[42%] flex-col items-center justify-center rounded-full border-4 border-ink bg-paper p-2 text-center text-ink">
                  <span aria-hidden="true" className="absolute top-[19%] h-5 w-5 rounded-full border-2 border-zinc-400 bg-ink" />
                  <span className="mt-8 text-xs tracking-widest text-red zine:text-sm" style={{ fontFamily: 'var(--font-display)' }}>{ladob.disco.estereo}</span>
                  <span className="text-xl leading-none zine:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>{ladob.disco.lado}</span>
                  <span className="mt-1 text-[8px] font-bold text-ink/65 zine:text-[9px]" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.disco.rpm}</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-[min(62vw,260px)] -rotate-3 border-[3px] border-ink bg-paper p-2 shadow-zine-sm zine:-bottom-5 zine:-left-5 zine:w-64">
                <span aria-hidden="true" className="absolute -top-3 left-8 h-5 w-20 rotate-2 border-x-2 border-dashed border-ink/20 bg-paper/85" />
                <div className="border-2 border-ink p-3 text-center text-paper" style={{ backgroundColor: '#48316d' }}>
                  <span aria-hidden="true" className="mx-auto mb-2 block h-9 w-9 rounded-full border-4 border-red bg-ink shadow-[0_0_0_5px_#141414]" />
                  <p className="text-xs" style={{ fontFamily: 'var(--font-marker)' }}>{ladob.discoNota.titulo}</p>
                  <p className="mt-1 text-[9px] text-paper/85" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.discoNota.sub}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <header className="mb-8 flex flex-wrap items-center gap-3 border-b-4 border-ink pb-4">
              <h2 className="border-2 border-ink bg-red px-3 py-1 text-xl leading-tight text-paper shadow-zine-sm zine:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{ladob.colecao.titulo}</h2>
              <p className="text-base text-paper zine:text-lg" style={{ fontFamily: 'var(--font-marker)' }}>{ladob.colecao.sub}</p>
            </header>
            <div className="grid grid-cols-1 items-start gap-8 zine:grid-cols-2">
              <Mixtape t={t} />
              <VhsShelf t={t} />
              <Cartridges t={t} />
              <ChessCard t={t} />
            </div>
          </section>

          <section className="mb-20">
            <header className="mx-auto mb-10 max-w-2xl text-center text-paper">
              <p className="inline-block -rotate-1 bg-paper px-4 py-1 text-xs font-bold tracking-widest text-ink" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.equipe.kicker}</p>
              <h2 className="mt-3 text-4xl leading-tight drop-shadow-[3px_3px_0_#141414] zine:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>{ladob.equipe.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed zine:text-base">{ladob.equipe.sub}</p>
            </header>
            <TeamBadges t={t} />
          </section>

          <div className="mb-20"><PinterestMural t={t} /></div>

          <section className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border-4 border-ink bg-ink p-7 text-center text-paper shadow-zine zine:p-12">
            <span aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-8 text-[8rem] leading-none text-paper/10 zine:text-[10rem]" style={{ fontFamily: 'var(--font-display)' }}>{ladob.fim.marca}</span>
            <div className="relative space-y-5">
              <p className="text-xs font-bold tracking-[.25em] text-paper" style={{ fontFamily: 'var(--font-mono)' }}>{ladob.fim.kicker}</p>
              <h2 className="mx-auto max-w-2xl text-3xl leading-tight uppercase zine:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>{ladob.fim.titulo}</h2>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-paper/80 zine:text-base">{ladob.fim.texto}</p>
              <div className="pt-2"><Link to={`${prefix}/`} className="inline-block max-w-full border-4 border-paper bg-paper px-5 py-3 text-lg leading-tight text-ink shadow-[4px_4px_0_#E8432E] transition-transform hover:translate-x-1 hover:translate-y-1 zine:px-8 zine:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>{ladob.fim.botao}</Link></div>
              <a href={`mailto:${t.contato.emailAddr}`} className="inline-block text-base text-paper underline decoration-2 underline-offset-4 hover:text-red" style={{ fontFamily: 'var(--font-marker)' }}>{ladob.fim.conversar}</a>
            </div>
          </section>
        </main>

        <footer className="border-t-4 border-ink bg-ink px-4 py-8 text-paper/70 zine:px-6">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 text-center text-[10px] zine:flex-row zine:text-left" style={{ fontFamily: 'var(--font-mono)' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 font-bold"><span className="text-paper">{ladob.rodape.marca}</span><span className="text-red">{ladob.rodape.sub}</span></div>
            <p className="max-w-xl zine:text-right">{ladob.rodape.texto}</p>
          </div>
        </footer>
      </div>
    </>
  )
}
