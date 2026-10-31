const { chromium } = require('playwright')
;(async () => {
  const b = await chromium.launch()
  const errs = []
  for (const [name, vp, mobile] of [['d', { width: 1440, height: 900 }, false], ['m', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile })).newPage()
    p.on('pageerror', (e) => errs.push(name + ' ' + e.message))
    p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ' ' + m.text().slice(0, 160)) })
    await p.goto('http://localhost:4173/lado-b', { waitUntil: 'networkidle' })
    const h = await p.evaluate(() => document.body.scrollHeight)
    for (let y = 0; y < h; y += 300) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(150) }
    await p.waitForTimeout(4000)
    const info = await p.evaluate(() => ({
      larg: document.documentElement.scrollWidth,
      imgsQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      miniaturas: [...document.images].filter((i) => /ytimg/.test(i.src)).map((i) => i.src.split('/vi/')[1] + ' ' + i.naturalWidth),
      capas: [...document.images].filter((i) => /scdn/.test(i.src)).map((i) => i.naturalWidth),
      iframes: [...document.querySelectorAll('iframe')].map((f) => f.src.slice(0, 70)),
      pinterest: document.querySelectorAll('[data-pin-do], span[class*="PIN_"]').length,
      video: (() => { const v = document.querySelector('video'); return v ? { src: v.currentSrc, pronto: v.readyState, pausado: v.paused } : null })(),
    }))
    console.log(name, JSON.stringify(info))
    const secoes = [['disco', 'section:has([role=tablist][aria-label=gavetas])'], ['edge', 'section:has(.fx-glitch)'], ['telao', 'section:has(h2:text-matches("ANIMES, DESENHOS"))'], ['mural', 'section:has(svg[viewBox="0 0 120 120"])'], ['mix', 'article:has(h3:text-matches("C-60"))']]
    for (const [nome, sel] of secoes) {
      const el = p.locator(sel).first()
      try { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500); await el.screenshot({ path: `olhar/${nome}-${name}.jpg`, type: 'jpeg', quality: 70 }) } catch (e) { errs.push('shot ' + nome + ' ' + String(e).slice(0, 100)) }
    }
    if (name === 'd') {
      // toca o trailer na TV e troca a gaveta
      try {
        await p.locator('section:has(h2:text-matches("ANIMES, DESENHOS")) li button').nth(6).click()
        await p.waitForTimeout(1500)
        await p.locator('button[aria-label^="ver trailer"]').first().click()
        await p.waitForTimeout(5000)
        await p.locator('section:has(h2:text-matches("ANIMES, DESENHOS"))').first().screenshot({ path: 'olhar/telao-play.jpg', type: 'jpeg', quality: 70 })
      } catch (e) { errs.push('play ' + String(e).slice(0, 120)) }
    }
  }
  console.log('erros', JSON.stringify(errs, null, 1))
  await b.close()
})()
