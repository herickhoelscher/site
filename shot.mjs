import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/tmp/out'
fs.mkdirSync(OUT, { recursive: true })

// paginas extras: caminhos relativos ao site; "first:<trecho>" abre o 1o link que contem o trecho
const targets = [
  { id: 'qtal', url: 'https://qtal-production.up.railway.app/', extra: ['/pt/materias', '/pt/imoveis', '/pt/eventos'] },
  { id: 'boss', url: 'https://www.bossmedical.com.br/' },
  { id: 'begonia', url: 'https://begonia-atelie.begoniaatelie.workers.dev/' },
  { id: 'alpe', url: 'https://alpeconsultoria.com.br/' },
  { id: 'maq-antigo', url: 'https://www.maqcentercascavel.com.br/' },
  { id: 'siph', url: 'http://localhost:8101/' },
  { id: 'adriano', url: 'http://localhost:8102/' },
  { id: 'ecommerce', url: 'http://localhost:3001/', extra: ['/produtos', 'first:/produto/'], slow: true },
  { id: 'maq-novo', url: 'http://localhost:3002/', extra: ['/locacoes', '/assistencia-tecnica'], slow: true },
  { id: 'agrovision', url: 'http://agrovision.local/', mock: true },
]

const agroEvents = [
  ['08:42:17', 'person', 0.91], ['08:41:55', 'truck', 0.87], ['08:40:03', 'car', 0.94],
  ['08:37:48', 'person', 0.83], ['08:35:12', 'motorcycle', 0.78], ['08:33:40', 'car', 0.89],
  ['08:31:09', 'person', 0.95], ['08:28:21', 'truck', 0.81],
].map(([t, label, confidence], i) => ({ id: 100 - i, event_time: `2026-10-29 ${t}`, label, confidence, image_path: '' }))

async function mockAgro(page) {
  const html = fs.readFileSync(process.env.AGRO_HTML, 'utf8')
  await page.route('http://agrovision.local/**', (route) => {
    const p = new URL(route.request().url()).pathname
    if (p === '/') return route.fulfill({ contentType: 'text/html; charset=utf-8', body: html })
    if (p === '/camera/status') return route.fulfill({ json: { online: true, connected: true, source_type: 'local' } })
    if (p === '/ai/status') return route.fulfill({ json: { backend: 'claude', available: true, active_model: 'claude-haiku-4-5-20251001' } })
    if (p === '/events') return route.fulfill({ json: agroEvents })
    if (p === '/weather') return route.fulfill({ json: { available: true, weather_code: 2, temperature: 24, condition: 'parcialmente nublado', humidity: 61, wind_speed: 9 } })
    return route.fulfill({ status: 404, body: '' })
  })
}

async function settle(page, ms = 2500) {
  try { await page.waitForLoadState('networkidle', { timeout: 15000 }) } catch {}
  await page.waitForTimeout(ms)
}

async function shoot(page, file) {
  await page.screenshot({ path: `${OUT}/${file}.jpg`, type: 'jpeg', quality: 85 })
  console.log('ok', file)
}

async function scrollShots(page, id) {
  for (const [i, y] of [[1, 900], [2, 1800]].entries()) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(1500)
    await shoot(page, `${id}-desk-${i + 1}`)
  }
}

const only = (process.env.TARGETS || '').split(',').filter(Boolean)
const browser = await chromium.launch()
for (const t of targets.filter((x) => !only.length || only.includes(x.id))) {
  const timeout = t.slow ? 120000 : 45000
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'pt-BR' })
    const page = await ctx.newPage()
    if (t.mock) await mockAgro(page)
    await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout })
    await settle(page, t.slow ? 6000 : 3000)
    await shoot(page, `${t.id}-desk-0`)
    if (!t.mock) await scrollShots(page, t.id)
    for (const [i, e] of (t.extra ?? []).entries()) {
      try {
        let href = e
        if (e.startsWith('first:')) {
          await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout })
          href = await page.evaluate((frag) => [...document.querySelectorAll('a')].map((a) => a.getAttribute('href')).find((h) => h && h.includes(frag)), e.slice(6))
          if (!href) throw new Error('sem link ' + e)
        }
        await page.goto(new URL(href, t.url).toString(), { waitUntil: 'domcontentloaded', timeout })
        await settle(page, t.slow ? 5000 : 2500)
        await shoot(page, `${t.id}-page-${i + 1}`)
      } catch (err) { console.log('falhou extra', t.id, e, err.message) }
    }
    await ctx.close()

    const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pt-BR' })
    const mpage = await mctx.newPage()
    if (t.mock) await mockAgro(mpage)
    await mpage.goto(t.url, { waitUntil: 'domcontentloaded', timeout })
    await settle(mpage, t.slow ? 5000 : 3000)
    await shoot(mpage, `${t.id}-mob-0`)
    await mctx.close()
  } catch (err) {
    console.log('falhou', t.id, err.message)
  }
}
await browser.close()
