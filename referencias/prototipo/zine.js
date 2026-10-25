/* Efeitos de colagem do protótipo. Tudo determinístico (seed), para o layout não mudar a cada carregamento. */
(function(){
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const isMobile = () => window.innerWidth <= 760;

  /* ---------- bordas rasgadas ---------- */
  function tornPolygon(w, h, amp, r, sides){
    const pts = [], step = () => 7 + r() * 9, j = on => on ? r() * amp : 0;
    for (let x = 0; x < w; x += step()) pts.push([x, j(sides.includes('t'))]);
    for (let y = 0; y < h; y += step()) pts.push([w - j(sides.includes('r')), y]);
    for (let x = w; x > 0; x -= step()) pts.push([x, h - j(sides.includes('b'))]);
    for (let y = h; y > 0; y -= step()) pts.push([j(sides.includes('l')), y]);
    return 'polygon(' + pts.map(p => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',') + ')';
  }
  function applyTorn(){
    document.querySelectorAll('[data-torn]').forEach((el, i) => {
      const r = rng(i * 131 + 7);
      el.style.clipPath = tornPolygon(el.offsetWidth, el.offsetHeight, +el.dataset.torn || 6, r, el.dataset.sides || 'trbl');
    });
  }

  /* ---------- hero: diagonal rasgada + nome em duas cores ---------- */
  function hero(){
    const h = document.querySelector('.hero'); if (!h) return;
    const W = h.offsetWidth, H = h.offsetHeight, r = rng(42);
    const yL = H * (isMobile() ? 0.60 : 0.63), yR = H * (isMobile() ? 0.40 : 0.36);
    const line = [];
    for (let x = 0; x <= W; x += 10 + r() * 8){ const y = yL + (yR - yL) * (x / W) + (r() - 0.5) * 9; line.push([x, y]); }
    line.push([W, yR]);
    const P = a => a.map(p => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(',');
    const dark = 'polygon(0 0,' + W + 'px 0,' + P(line.slice().reverse()) + ',0 ' + yL + 'px)';
    const light = 'polygon(' + P(line) + ',' + W + 'px ' + H + 'px,0 ' + H + 'px)';
    h.querySelector('.hero-dark').style.clipPath = dark;
    h.querySelector('.name--on-dark').style.clipPath = dark;
    h.querySelector('.name--on-light').style.clipPath = light;
    // ajusta o tamanho do nome à largura da tela
    h.querySelectorAll('.name span').forEach(s => {
      s.style.fontSize = '100px';
      const target = W * (isMobile() ? 0.92 : 0.94);
      const widest = isMobile() ? Math.max(...[...s.querySelectorAll('.l1,.l2')].map(e => e.getBoundingClientRect().width)) : s.getBoundingClientRect().width;
      s.style.fontSize = (100 * target / widest) + 'px';
    });
    // posiciona os pets espiando por cima das letras
    const span = h.querySelector('.name--on-light span'), b = span.getBoundingClientRect(), hb = h.getBoundingClientRect();
    const pets = h.querySelector('.pets-peek');
    if (pets){ const ph = pets.getBoundingClientRect().height || pets.offsetWidth * 0.653; pets.style.top = (b.top - hb.top - ph * 0.80 + span.offsetHeight * 0.03) + 'px'; }
    const st = h.querySelector('.sticker-name');
    if (st && !isMobile()) st.style.top = (b.bottom - hb.top - b.height * 0.13) + 'px';
  }

  /* ---------- título em letras recortadas ---------- */
  function ransom(){
    document.querySelectorAll('[data-ransom]').forEach((el, k) => {
      const r = rng(900 + k), txt = el.dataset.ransom;
      const looks = [['#141414','#F6F2E8',"'Anton'"],['#EFE9DA','#141414',"'Permanent Marker'"],['#765BA7','#F6F2E8',"'Anton'"],['#F6F2E8','#E8432E',"'Rubik Wet Paint'"],['#141414','#A68BE6',"'Space Mono'"],['#EFE9DA','#141414',"'Anton'"]];
      el.innerHTML = txt.split(' ').map(word => '<span class="rw">' + [...word].map(ch => {
        const L = looks[Math.floor(r() * looks.length)];
        return `<span class="rl" style="background:${L[0]};color:${L[1]};font-family:${L[2]};transform:rotate(${((r() - .5) * 11).toFixed(1)}deg) translateY(${((r() - .5) * 8).toFixed(0)}px);${L[2].includes('Mono') ? 'font-weight:700;' : ''}">${ch}</span>`;
      }).join('') + '</span>').join('');
    });
  }

  /* ---------- rabiscos: estrela, coroa, seta, espiral ---------- */
  function doodle(type, size, color, seed){
    const r = rng(seed), J = a => (r() - .5) * a, s = size, sw = Math.max(2.5, s / 22);
    let d = '';
    if (type === 'star'){
      const c = s / 2, R = s * .44, pts = [];
      for (let i = 0; i <= 5; i++){ const a = (-90 + i * 144) * Math.PI / 180; pts.push([c + R * Math.cos(a) + J(s * .07), c + R * Math.sin(a) + J(s * .07)]); }
      pts.push([pts[1][0] * .7 + pts[0][0] * .3, pts[1][1] * .7 + pts[0][1] * .3]);
      d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L');
    } else if (type === 'crown'){
      const w = s, h = s * .75, y0 = h * .22;
      const p = [[w*.06,h*.9],[w*.02,y0+J(4)],[w*.28,h*.55],[w*.5,y0-4+J(4)],[w*.72,h*.55],[w*.98,y0+J(4)],[w*.94,h*.9],[w*.04,h*.92]];
      d = 'M' + p.map(q => q.map(v => v.toFixed(1)).join(' ')).join(' L');
    } else if (type === 'arrow'){
      d = `M${s*.05} ${s*.2} C ${s*.45} ${s*.05}, ${s*.75} ${s*.4}, ${s*.85} ${s*.85} M${s*.62} ${s*.7} L${s*.86} ${s*.88} L${s*.95} ${s*.6}`;
    } else if (type === 'swirl'){
      d = `M${s*.1} ${s*.6} C ${s*.2} ${s*.1}, ${s*.45} ${s*.1}, ${s*.4} ${s*.5} S ${s*.65} ${s*.9}, ${s*.75} ${s*.4} S ${s*.95} ${s*.2}, ${s*.92} ${s*.55}`;
    } else if (type === 'lines'){
      d = `M${s*.15} ${s*.75} L${s*.35} ${s*.15} M${s*.45} ${s*.8} L${s*.62} ${s*.22} M${s*.72} ${s*.82} L${s*.88} ${s*.3}`;
    }
    const d2 = d.replace(/-?\d+(\.\d+)?/g, v => (parseFloat(v) + J(2.2)).toFixed(1));
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d2}" fill="none" stroke="${color}" stroke-width="${sw*.45}" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/></svg>`;
  }
  function doodles(){
    document.querySelectorAll('[data-doodle]').forEach((el, i) => {
      el.innerHTML = doodle(el.dataset.doodle, +(el.dataset.size || 50), el.dataset.color || '#E8432E', i * 17 + 3);
    });
  }

  /* ---------- respingos ---------- */
  function splats(){
    document.querySelectorAll('[data-splat]').forEach((el, i) => {
      const r = rng(300 + i), w = el.offsetWidth, h = el.offsetHeight, col = el.dataset.splat;
      let c = '';
      for (let k = 0; k < 4; k++){
        const cx = w * (.25 + r() * .5), cy = h * (.25 + r() * .5), R = 8 + r() * 22;
        c += `<circle cx="${cx}" cy="${cy}" r="${R}"/>`;
        for (let n = 0; n < 26; n++){ const a = r() * 6.283, dist = R * (1 + r() * 3.2); c += `<circle cx="${(cx + Math.cos(a) * dist).toFixed(1)}" cy="${(cy + Math.sin(a) * dist).toFixed(1)}" r="${(1 + r() * R * .22).toFixed(1)}"/>`; }
      }
      el.innerHTML = `<svg width="${w}" height="${h}" fill="${col}" style="overflow:visible">${c}</svg>`;
    });
  }

  /* ---------- código de barras ---------- */
  function barcodes(){
    document.querySelectorAll('[data-barcode]').forEach((el, i) => {
      const r = rng(700 + i), w = +el.dataset.w || 150, h = +el.dataset.h || 40; let x = 0, bars = '';
      while (x < w){ const bw = 1 + Math.floor(r() * 4); if (r() > .35) bars += `<rect x="${x}" y="0" width="${bw}" height="${h}"/>`; x += bw + 1 + Math.floor(r() * 2); }
      el.innerHTML = `<svg width="${w}" height="${h}" fill="#141414">${bars}</svg>`;
    });
  }

  /* ---------- cabo de rede (fio condutor) ---------- */
  function cables(){
    document.querySelectorAll('svg.cable[data-path]').forEach(svg => {
      const sec = svg.parentElement, W = sec.offsetWidth, H = sec.offsetHeight;
      const key = isMobile() && svg.dataset.pathMobile ? 'pathMobile' : 'path';
      const pts = svg.dataset[key].split(';').map(p => p.split(',').map(Number)).map(([x, y]) => [x * W, y * H]);
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++){
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)},${c2[0].toFixed(1)} ${c2[1].toFixed(1)},${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      const sw = isMobile() ? 7 : 10;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = `<path d="${d}" fill="none" stroke="#F6F2E8" stroke-width="${sw + 6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#141414" stroke-width="${sw}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-linecap="round" transform="translate(-2,-2)"/>`;
    });
  }

  /* ---------- interações ---------- */
  function interactions(){
    document.querySelectorAll('.trk button').forEach(b => b.addEventListener('click', () => b.parentElement.classList.toggle('open')));
    document.querySelectorAll('.chips span').forEach(c => c.addEventListener('mouseenter', () => {
      document.querySelectorAll('.chips span').forEach(o => o.classList.remove('on')); c.classList.add('on');
      const lb = document.querySelector('.ladob'); if (lb) lb.dataset.mood = c.dataset.mood;
    }));
  }

  function all(){ hero(); applyTorn(); splats(); cables(); }
  window.addEventListener('DOMContentLoaded', () => { ransom(); doodles(); barcodes(); interactions(); });
  window.addEventListener('load', () => { all(); document.documentElement.classList.add('ready'); });
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(all, 120); });
  window.__zine = { all };
})();
