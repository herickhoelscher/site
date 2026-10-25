import { Helmet } from 'react-helmet-async'
import { useContent } from '@/content'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { IssuesWall } from '@/components/sections/IssuesWall'
import { Setlist } from '@/components/sections/Setlist'
import { FlipRecord } from '@/components/sections/FlipRecord'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

const SITE = 'https://herickhoelscher.dev'

/** Lado A, o lado profissional. A ordem é a da especificação § 0. */
export default function LadoA() {
  const { t, prefix } = useContent()
  const canonical = `${SITE}${prefix || '/'}`

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        {/* uma expressão só: o helmet ignora o título quando recebe mais de um filho */}
        <title>{`Herick Hoelscher · ${t.hero.tagline}`}</title>
        <meta name="description" content={t.hero.tagline} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="pt-BR" href={`${SITE}/`} />
        <link rel="alternate" hrefLang="en" href={`${SITE}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`Herick Hoelscher · ${t.hero.tagline}`} />
        <meta property="og:description" content={t.hero.tagline} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE}/og.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Hero t={t} />
      <About t={t} />
      <IssuesWall t={t} prefix={prefix} />
      <Setlist t={t} />
      <FlipRecord t={t} prefix={prefix} />
      <Contact t={t} />
      <Footer t={t} />
    </>
  )
}
