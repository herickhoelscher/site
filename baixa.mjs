import { chromium } from 'playwright'
import fs from 'node:fs'

// Abre cada página do Unsplash num navegador de verdade (a página tem um
// desafio anti-robô), lê o endereço da imagem no og:image e baixa do CDN.
const lista = fs.readFileSync('lista.txt', 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/))
fs.mkdirSync('fotos', { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' })
const page = await ctx.newPage()
const creditos = []
for (const [nome, id] of lista) {
  try {
    await page.goto(`https://unsplash.com/photos/${id}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForSelector('meta[property="og:image"]', { state: 'attached', timeout: 60000 })
    const og = await page.getAttribute('meta[property="og:image"]', 'content')
    const titulo = await page.title()
    const u = new URL(og)
    u.searchParams.set('w', '1800')
    u.searchParams.set('q', '85')
    u.searchParams.set('fm', 'jpg')
    u.searchParams.delete('h')
    u.searchParams.set('fit', 'max')
    const r = await page.request.get(u.toString())
    fs.writeFileSync(`fotos/${nome}.jpg`, await r.body())
    creditos.push(`${nome}\t${id}\t${titulo}`)
    console.log('ok', nome, r.status(), titulo)
  } catch (e) {
    console.log('falhou', nome, e.message)
  }
}
fs.writeFileSync('fotos/creditos.tsv', creditos.join('\n') + '\n')
await browser.close()
