const { chromium } = require('playwright')
const fs = require('fs')
const out = (n, d) => fs.writeFileSync('garimpo/' + n, typeof d === 'string' ? d : JSON.stringify(d, null, 1))
;(async () => {
  const b = await chromium.launch()
  const p = await (await b.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' })).newPage()
  const yt = {}
  for (const q of ['The Summer Hikaru Died official trailer Netflix', 'Adventure Time official trailer Cartoon Network', 'Avatar The Last Airbender official trailer Nickelodeon', 'Hikaru ga Shinda Natsu PV', 'Cyberpunk Edgerunners teaser Netflix Brasil', 'Frieren trailer oficial Crunchyroll Brasil']) {
    try {
      await p.goto('https://www.youtube.com/results?search_query=' + encodeURIComponent(q), { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(5000)
      yt[q] = await p.evaluate(() => [...document.querySelectorAll('ytd-video-renderer')].slice(0, 6).map((v) => ({ titulo: v.querySelector('#video-title')?.textContent?.trim(), id: (v.querySelector('a#thumbnail')?.getAttribute('href') || '').replace(/^.*v=([^&]+).*$/, '$1'), canal: v.querySelector('ytd-channel-name a')?.textContent?.trim(), meta: v.querySelector('#metadata-line')?.innerText?.replace(/\n/g, ' ') })))
    } catch (e) { yt[q] = String(e) }
  }
  out('youtube2.json', yt)
  const mk = {}
  for (const u of ['https://mixkit.co/free-stock-video/futuristic-buildings-flashing-in-the-night-31029/', 'https://mixkit.co/free-stock-video/aerial-view-of-tokyo-city-lights-at-night-20064/']) {
    try {
      await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await p.waitForTimeout(4000)
      const t = await p.evaluate(() => document.body.innerText)
      mk[u] = t.split('\n').filter((l) => /license|licen|free|attribution/i.test(l)).slice(0, 12)
    } catch (e) { mk[u] = String(e) }
  }
  out('mixkit.json', mk)
  await b.close()
})()
