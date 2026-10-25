import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useContent } from '@/content'
import { NetworkCable, TornPaper, Tape, Doodle, Barcode, StickerImg } from '@/components/collage'
import { Mixtape } from '@/components/sections/Mixtape'
import { VhsShelf } from '@/components/sections/VhsShelf'
import { TeamBadges } from '@/components/sections/TeamBadges'
import { LazyEmbed } from '@/components/sections/LazyEmbed'
import { LangToggle } from '@/components/LangToggle'

/** Quadradinhos do mural enquanto o widget do Pinterest não entra (cor + altura). */
const TILES = [
  'bg-purple h-28',
  'bg-lav h-20',
  'bg-red h-24',
  'bg-ink h-16',
  'bg-lav h-28',
  'bg-red h-20',
  'bg-purple h-24',
  'bg-paper h-16',
  'bg-red h-28',
  'bg-lav h-20',
  'bg-ink h-24',
  'bg-purple h-16',
]

/** Estilo comum dos botões do fim da página, igual ao do Stitch. */
const FIM_BTN =
  'inline-block bg-paper px-5 py-3 text-center text-[13px] font-bold tracking-[0.06em] text-ink uppercase shadow-zine-sm hover:bg-white'

/**
 * Lado B (§ 5, bloco 04): a página pessoal. Mixtape, animes, jogos, xadrez, os
 * verdadeiros gerentes e o mural do Pinterest.
 *
 * Desktop: três colunas (mixtape | animes + jogos | xadrez + equipe), como no
 * wireframe. Celular: uma coluna só. O mural vai embaixo, largura inteira.
 */
export default function LadoB() {
  const { t, prefix } = useContent()
  const { ladob } = t

  // o último termo do título ("B") vai em vermelho, como no wireframe
  const palavras = ladob.titulo.split(' ')
  const ultima = palavras.pop()

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        <title>{ladob.barra}</title>
        <meta name="description" content={`${ladob.abertura} · ${ladob.sub}`} />
        <link rel="alternate" hrefLang="pt-BR" href="/lado-b" />
        <link rel="alternate" hrefLang="en" href="/en/lado-b" />
        <link rel="alternate" hrefLang="x-default" href="/lado-b" />
      </Helmet>

      <main className="tex-roxa relative overflow-hidden pb-16 text-white">
        {/* o NetworkCable usa o <section> mais próximo como gatilho do scroll; o <main> não serve */}
        <section aria-hidden="true" className="pointer-events-none absolute inset-0">
          <NetworkCable
            path=".96,-.02;.985,.2;.965,.5;.985,.8;.95,1.02"
            pathMobile=".96,-.02;.99,.3;.975,.7;.95,1.02"
          />
        </section>

        {/* barra de cima */}
        <div className="relative z-[3] flex flex-wrap items-center justify-between gap-3 px-6 py-5 zine:px-10">
          <span
            className="text-[12px] font-bold tracking-[0.08em] uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {ladob.barra}
          </span>
          <div className="flex items-center gap-3">
            <LangToggle className="text-ink" />
            <Link
              to={`${prefix}/`}
              className="bg-ink px-3 py-1.5 text-[12px] font-bold tracking-[0.06em] text-white uppercase hover:text-red"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {ladob.voltar}
            </Link>
          </div>
        </div>

        {/* título */}
        <header className="relative z-[3] px-6 pt-4 pb-10 zine:px-10">
          <TornPaper
            seed="ladob-titulo"
            amp={4}
            tilt={-2}
            wrapperClassName="inline-block"
            className="tex-preta px-6 py-3 zine:px-10 zine:py-4"
          >
            <h1
              className="text-[clamp(3rem,10vw,6.5rem)] leading-none text-paper"
              style={{ fontFamily: 'var(--font-marker)' }}
            >
              {palavras.length ? `${palavras.join(' ')} ` : ''}
              <span className="text-red">{ultima}</span>
            </h1>
          </TornPaper>
          <span className="absolute top-2 left-[min(60vw,22rem)] hidden zine:block">
            <Doodle kind="crown" seed="ladob-crown" size={52} />
          </span>

          <p
            className="mt-4 text-[clamp(1.2rem,2.4vw,1.8rem)] leading-tight text-white"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {ladob.sub}
          </p>
          <p
            className="mt-2 inline-block bg-ink px-2 py-1 text-[12px] font-bold tracking-[0.08em] text-white uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {ladob.abertura}
          </p>
        </header>

        {/* colunas */}
        <div className="relative z-[3] grid gap-12 px-6 zine:grid-cols-2 zine:gap-x-8 zine:px-10 lg:grid-cols-3">
          {/* mixtape */}
          <Mixtape t={t} />

          {/* animes + jogos */}
          <div className="flex flex-col gap-10">
            <VhsShelf t={t} />

            <div>
              {/* decorativa: os jogos estão nos chips logo abaixo */}
              <img
                src="/assets/cartuchos.png"
                alt=""
                loading="lazy"
                decoding="async"
                className="mx-auto block w-full max-w-[420px]"
                style={{ filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.3))' }}
              />
              <ul className="mt-3 flex flex-wrap gap-2">
                {ladob.jogos.lista.map((jogo) => (
                  <li
                    key={jogo}
                    className="bg-ink px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] text-white uppercase"
                    style={{ fontFamily: 'var(--font-mono)', border: '2px solid var(--color-ink)' }}
                  >
                    {jogo}
                  </li>
                ))}
              </ul>
              <p
                className="mt-3 inline-block bg-ink px-2 py-0.5 text-[1.1rem] leading-tight text-white"
                style={{ fontFamily: 'var(--font-hand)' }}
              >
                {ladob.jogos.nota}
              </p>
            </div>
          </div>

          {/* xadrez + equipe */}
          <div className="flex flex-col gap-12 zine:col-span-2 lg:col-span-1">
            <div className="relative pb-16">
              <StickerImg
                src="/assets/missi-xadrez.jpg"
                alt={`${ladob.gerentes[1].nome}: ${ladob.xadrez.titulo}`}
                seed="ladob-xadrez"
                variant="cutout"
                className="aspect-[4/3]"
              />
              {/* a ficha ocupa o canto de baixo, sobre a foto, como no wireframe */}
              <div className="absolute right-0 bottom-0 w-[62%] max-w-[260px]">
                <Tape seed="ladob-ficha-tape" at="top-left" width={52} />
                <TornPaper
                  seed="ladob-ficha"
                  amp={3}
                  tilt={3}
                  className="tex-creme px-3 py-2.5 text-ink"
                >
                  <p
                    className="text-[1.5rem] leading-none"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {ladob.xadrez.titulo}
                  </p>
                  <p
                    className="mt-1 text-[10px] leading-tight font-bold tracking-[0.06em] uppercase"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {ladob.xadrez.rating}
                  </p>
                  <Barcode seed="ladob-xadrez" width={110} height={22} className="mt-2" />
                </TornPaper>
              </div>
            </div>

            <section>
              <h2
                className="mb-4 inline-block bg-ink px-3 py-1 text-[13px] font-bold tracking-[0.08em] text-white uppercase"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {ladob.equipe}
              </h2>
              <TeamBadges t={t} />
            </section>
          </div>
        </div>

        {/* mural */}
        <section className="relative z-[3] mt-16 px-6 zine:px-10">
          <div className="relative">
            <Tape seed="ladob-mural-tape" at="top-right" width={84} />
            <TornPaper
              seed="ladob-mural"
              amp={6}
              tilt={-0.5}
              className="tex-creme px-5 pt-6 pb-8 text-ink zine:px-8"
            >
              <h2
                className="mb-5 text-[clamp(1.4rem,3vw,2rem)] leading-tight text-purple"
                style={{ fontFamily: 'var(--font-hand)' }}
              >
                {ladob.mural}
              </h2>
              {/*
                O widget do Pinterest (pinit.js) é de terceiros: só entra quando o
                bloco chega na tela. Falta a URL da pasta "referências" para
                montar o embed; até lá o LazyEmbed guarda a vaga com os quadrados.
              */}
              <LazyEmbed height={300}>
                <ul
                  className="grid grid-cols-3 items-start gap-3 zine:grid-cols-6"
                  aria-hidden="true"
                >
                  {TILES.map((tile, i) => (
                    <li
                      key={i}
                      className={`tex-halftone ${tile}`}
                      style={{ border: '2px solid var(--color-ink)' }}
                    />
                  ))}
                </ul>
              </LazyEmbed>
            </TornPaper>
          </div>
        </section>

        {/* fim */}
        <footer className="relative z-[3] mt-16 flex flex-col items-center gap-4 px-6 text-center">
          <Link to={`${prefix}/`} className={FIM_BTN}>
            {ladob.virarDeNovo}
          </Link>
          <Link
            to={`${prefix}/#contato`}
            className="bg-ink px-2 py-1 text-[1.2rem] text-white underline decoration-2 underline-offset-4 hover:decoration-red"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            {ladob.conversar}
          </Link>
        </footer>
      </main>
    </>
  )
}
