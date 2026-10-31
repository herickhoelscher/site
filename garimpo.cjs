// Garimpo de dados públicos para o Lado B: Spotify, Pinterest e YouTube.
const { chromium } = require('playwright')
const fs = require('fs')
const out = (n, d) => fs.writeFileSync('garimpo/' + n, typeof d === 'string' ? d : JSON.stringify(d, null, 1))
;(async () => {
  const b = await chromium.launch()
  const ctx = await b.newContext({ locale: 'pt-BR', viewport: { width: 1366, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' })
  const p = await ctx.newPage()
  const tenta = async (nome, fn) => { try { await fn() } catch (e) { out(nome + '.erro.txt', String(e)) } }
  const nomeArq = (q) => q.replace(/[^a-z0-9]+/gi, '_')

  // SPOTIFY: busca de playlists
  const listas = {}
  for (const q of ['cassino s2', 'cassino <3', 'cassino ❤', 'cassino herick']) {
    await tenta('spotify-' + nomeArq(q), async () => {
      await p.goto('https://open.spotify.com/search/' + encodeURIComponent(q) + '/playlists', { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(7000)
      for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 2000); await p.waitForTimeout(1200) }
      listas[q] = await p.evaluate(() => [...document.querySelectorAll('a[href*="/playlist/"]')].map((a) => { let c = a; for (let k = 0; k < 4 && c.parentElement; k++) c = c.parentElement; return { href: a.getAttribute('href'), txt: c.innerText.replace(/\n+/g, ' | ').slice(0, 160) } }))
      await p.evaluate(() => window.scrollTo(0, 0))
      await p.screenshot({ path: 'garimpo/spotify-' + nomeArq(q) + '.jpg', quality: 60, type: 'jpeg' })
    })
  }
  out('spotify-busca.json', listas)
  for (const u of ['herickneumann4', 'herickneumann', 'herickhoelscher']) {
    await tenta('spotify-user-' + u, async () => {
      await p.goto('https://open.spotify.com/user/' + u, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(6000)
      out('spotify-user-' + u + '.txt', (await p.evaluate(() => document.body.innerText)).slice(0, 3000) + '\n' + JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('a[href*="/playlist/"]')].map((a) => a.getAttribute('href') + ' ' + a.innerText))))
    })
  }

  // PINTEREST: perfil e pastas
  await tenta('pinterest-perfil', async () => {
    await p.goto('https://br.pinterest.com/herickneumann4/_saved/', { waitUntil: 'domcontentloaded', timeout: 45000 })
    await p.waitForTimeout(8000)
    await p.screenshot({ path: 'garimpo/pinterest-perfil.jpg', quality: 60, type: 'jpeg' })
    out('pinterest-pastas.json', await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/herickneumann4/"]')].map((a) => a.getAttribute('href') + ' :: ' + a.innerText.replace(/\n+/g, ' | ')))]))
    out('pinterest-perfil.txt', (await p.evaluate(() => document.body.innerText)).slice(0, 5000))
  })
  let pastas = []
  try { pastas = JSON.parse(fs.readFileSync('garimpo/pinterest-pastas.json', 'utf8')) } catch {}
  const slugs = [...new Set(pastas.map((s) => s.split(' :: ')[0]).filter((h) => /^\/herickneumann4\/[^/_][^/]*\/$/.test(h)))]
  for (const s of slugs.slice(0, 14)) {
    const nome = s.split('/')[2]
    await tenta('pinterest-' + nome, async () => {
      await p.goto('https://br.pinterest.com' + s, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(6000)
      const vistos = new Map()
      for (let i = 0; i < 4; i++) {
        for (const pin of await p.evaluate(() => [...document.querySelectorAll('img')].filter((i) => /pinimg/.test(i.src)).map((i) => ({ alt: i.alt, src: i.src })))) vistos.set(pin.src, pin)
        await p.mouse.wheel(0, 1600); await p.waitForTimeout(1500)
      }
      out('pinterest-' + nome + '.json', [...vistos.values()])
    })
  }

  // YOUTUBE: trailers oficiais
  const yt = {}
  for (const q of ['Cyberpunk Edgerunners official trailer Netflix', "Frieren Beyond Journey's End official trailer", 'Attack on Titan final season official trailer', "Baldur's Gate 3 official launch trailer", 'Minecraft official trailer', 'League of Legends cinematic', 'Brawlhalla official trailer']) {
    await tenta('yt-' + nomeArq(q).slice(0, 24), async () => {
      await p.goto('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(5000)
      yt[q] = await p.evaluate(() => [...document.querySelectorAll('ytd-video-renderer')].slice(0, 6).map((v) => ({ titulo: v.querySelector('#video-title')?.textContent?.trim(), id: (v.querySelector('a#thumbnail')?.getAttribute('href') || '').replace(/^.*v=([^&]+).*$/, '$1'), canal: v.querySelector('ytd-channel-name a')?.textContent?.trim(), meta: v.querySelector('#metadata-line')?.innerText?.replace(/\n/g, ' ') })))
    })
  }
  out('youtube.json', yt)
  await b.close()
})()
