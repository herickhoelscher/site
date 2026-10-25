import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useContent } from '@/content'
import { RansomTitle, Splat, StickerImg, TornPaper } from '@/components/collage'

/** 404: "A Missi derrubou essa página da mesa." */
export default function NotFound() {
  const { t, prefix } = useContent()

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        <title>404 · Herick Hoelscher</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="tex-preta relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <Splat
          seed="404-splat"
          className="absolute"
          style={{ left: '-5vw', top: '10vh', width: 320, height: 280 }}
        />

        <RansomTitle text="404" as="h1" className="relative z-[2] mb-8 justify-center" />

        <StickerImg
          src="/assets/missi-brava.png"
          alt="Missi, a gata siamesa, com cara de julgamento"
          variant="plain"
          height={200}
          width="auto"
          className="relative z-[2] mb-8"
        />

        <TornPaper
          seed="404-card"
          wrapperClassName="relative z-[2]"
          className="tex-creme px-8 py-6 text-ink"
        >
          <p className="text-[clamp(1.2rem,3vw,2rem)]" style={{ fontFamily: 'var(--font-hand)' }}>
            {t.erro404.texto}
          </p>
        </TornPaper>

        <Link
          to={`${prefix}/`}
          className="relative z-[2] mt-8 bg-red px-6 py-3 text-[13px] font-bold tracking-[0.06em] text-white uppercase transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {t.erro404.botao}
        </Link>
      </main>
    </>
  )
}
