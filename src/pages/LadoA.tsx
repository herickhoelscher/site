import { Helmet } from 'react-helmet-async'
import { useContent } from '@/content'
import { Hero } from '@/components/sections/Hero'
import { Servicos } from '@/components/sections/Servicos'
import { Processo } from '@/components/sections/Processo'
import { IssuesWall } from '@/components/sections/IssuesWall'
import { FlipRecord } from '@/components/sections/FlipRecord'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

const SITE = 'https://herickhoelscher.dev'

/** Lado A, o lado de quem quer contratar: o que eu faço, o que já fiz, como funciona e contato. */
export default function LadoA() {
  const { t, prefix } = useContent()
  const canonical = `${SITE}${prefix || '/'}`

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        {/* uma expressão só: o helmet ignora o título quando recebe mais de um filho */}
        <title>Herick Hoelscher</title>
        <meta name="description" content={t.hero.descricao} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="pt-BR" href={`${SITE}/`} />
        <link rel="alternate" hrefLang="en" href={`${SITE}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Herick Hoelscher" />
        <meta property="og:description" content={t.hero.descricao} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE}/og.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Hero t={t} />
      <Servicos t={t} />
      <IssuesWall t={t} prefix={prefix} />
      <Processo t={t} />
      <FlipRecord t={t} prefix={prefix} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  )
}
