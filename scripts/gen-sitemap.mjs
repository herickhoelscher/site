/**
 * Gera public/sitemap.xml e public/robots.txt a partir das rotas reais.
 *
 * Roda no `prebuild`, então o sitemap nunca fica desatualizado em relação às
 * issues: ele lê os slugs do próprio content/pt.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = process.env.SITE_URL ?? 'https://herickhoelscher.dev'

// Extrai os slugs sem compilar o TS: eles aparecem como `slug: 'x',`.
const content = readFileSync(resolve(root, 'src/content/pt.ts'), 'utf8')
const slugs = [...content.matchAll(/slug:\s*'([a-z-]+)'/g)].map((m) => m[1])

const paths = [
  '/',
  '/en',
  ...slugs.map((s) => `/issues/${s}`),
  ...slugs.map((s) => `/en/issues/${s}`),
  '/lado-b',
  '/en/lado-b',
]

const today = new Date().toISOString().slice(0, 10)

const urls = paths
  .map((p) => {
    // cada URL declara o par no outro idioma, como manda o briefing (hreflang)
    const isEn = p === '/en' || p.startsWith('/en/')
    const other = isEn ? p.replace(/^\/en/, '') || '/' : p === '/' ? '/en' : `/en${p}`
    return `  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="${isEn ? 'pt-BR' : 'en'}" href="${SITE}${other}"/>
    <xhtml:link rel="alternate" hreflang="${isEn ? 'en' : 'pt-BR'}" href="${SITE}${p}"/>
  </url>`
  })
  .join('\n')

writeFileSync(
  resolve(root, 'public/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
)

writeFileSync(
  resolve(root, 'public/robots.txt'),
  `User-agent: *
Allow: /
Disallow: /kit

Sitemap: ${SITE}/sitemap.xml
`,
)

console.log(`sitemap: ${paths.length} rotas`)
