const { chromium } = require('playwright')
const fs = require('fs')
const out = (n, d) => fs.writeFileSync('garimpo/' + n, typeof d === 'string' ? d : JSON.stringify(d, null, 1))
;(async () => {
  const b = await chromium.launch()
  const p = await (await b.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' })).newPage()
  // licenca de cada video do Mixkit
  const mk = {}
  for (const id of ['50989', '50990', '99864', '99868', '99872', '34351', '17996', '19213', '26959', '31096', '20215', '30166']) {
    try {
      await p.goto('https://mixkit.co/free-stock-video/x-' + id + '/', { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(3000)
      const t = await p.evaluate(() => document.body.innerText)
      mk[id] = { url: p.url(), titulo: (t.match(/Mixkit Free Stock Video[^\n]*/) || [''])[0], lic: t.split('\n').filter((l) => /Restricted License|Free License|personal use only/i.test(l)).slice(0, 3), mp4: await p.evaluate(() => [...document.querySelectorAll('video source, video')].map((v) => v.src).filter(Boolean).slice(0, 3)) }
    } catch (e) { mk[id] = String(e) }
  }
  out('mixkit2.json', mk)
  // musicas conhecidas no Spotify
  const sp = {}
  for (const q of ['Comfortably Numb Pink Floyd', "I Was Made For Lovin' You KISS", 'Aoi, Koi, Daidaiiro No Hi MASS OF THE FERMENTING DREGS']) {
    try {
      await p.goto('https://open.spotify.com/search/' + encodeURIComponent(q) + '/tracks', { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(6000)
      sp[q] = await p.evaluate(() => [...document.querySelectorAll('a[href*="/track/"]')].slice(0, 6).map((a) => { let c = a; for (let k = 0; k < 5 && c.parentElement; k++) c = c.parentElement; return a.getAttribute('href') + ' | ' + c.innerText.replace(/\n+/g, ' | ').slice(0, 120) }))
    } catch (e) { sp[q] = String(e) }
  }
  out('spotify-faixas.json', sp)
  // pexels
  try {
    await p.goto('https://www.pexels.com/search/videos/neon%20city%20night/', { waitUntil: 'domcontentloaded', timeout: 45000 })
    await p.waitForTimeout(6000)
    out('pexels.json', await p.evaluate(() => [...document.querySelectorAll('a[href*="/video/"]')].slice(0, 30).map((a) => a.getAttribute('href') + ' | ' + (a.querySelector('img')?.src || ''))))
    await p.screenshot({ path: 'garimpo/pexels.jpg', type: 'jpeg', quality: 55 })
  } catch (e) { out('pexels.json', String(e)) }
  await b.close()
})()
