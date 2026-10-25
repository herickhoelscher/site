import { Helmet } from 'react-helmet-async'
import { useContent } from '@/content'
import { Hero } from '@/components/sections/Hero'
import { IssuesWall } from '@/components/sections/IssuesWall'

/**
 * Lado A. Por enquanto Hero e Issues (Etapa 2). As seções Quem, Setlist,
 * Virar o disco e Contato entram na Etapa 3.
 */
export default function LadoA() {
  const { t, locale, prefix } = useContent()

  return (
    <>
      <Helmet>
        <html lang={t.htmlLang} />
        <title>Herick Hoelscher · {t.hero.tagline}</title>
        <meta name="description" content={t.hero.tagline} />
        <link rel="alternate" hrefLang="pt-BR" href="/" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="x-default" href="/" />
      </Helmet>

      <Hero t={t} />
      <IssuesWall t={t} prefix={prefix} />

      <p className="px-6 py-10 text-center text-[13px] text-paper/50" style={{ fontFamily: 'var(--font-mono)' }}>
        {locale === 'pt'
          ? 'Quem, Setlist, Virar o disco e Contato: Etapa 3.'
          : 'Who, Setlist, Flip the record and Contact: stage 3.'}
      </p>
    </>
  )
}
