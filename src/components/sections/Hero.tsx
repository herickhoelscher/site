import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { makeRng } from '@/lib/rng'
import { useMeasure } from '@/lib/useMeasure'
import { useIsMobile } from '@/lib/useIsMobile'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'
import { NetworkCable, Doodle, InkField, TornPaper } from '@/components/collage'
import { LangToggle } from '@/components/LangToggle'
import type { Content } from '@/content'

type Props = { t: Content }

/**
 * Hero. Porte de `hero()` do zine.js.
 *
 * O efeito central: o fundo é cortado por uma diagonal rasgada (preto em cima,
 * creme embaixo) e o nome "HERICK" é desenhado DUAS vezes, uma em creme
 * recortada pela área escura e outra em preto recortada pela área clara. Onde
 * as letras cruzam o corte, a cor inverte sozinha.
 *
 * Acessibilidade (§ 9): só a camada clara é o <h1>; a escura é aria-hidden,
 * senão o leitor de tela anunciaria "HERICK" duas vezes.
 */
export function Hero({ t }: Props) {
  const [sectionRef, { width: W, height: H }] = useMeasure<HTMLElement>()
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  /*
    A diagonal rasgada, em duas posições: a final e uma deslocada para cima.

    A animação de entrada varre a linha de cima para baixo, então a inversão de
    cor do nome é revelada progressivamente. Como os dois polígonos têm o MESMO
    número de pontos, o navegador interpola `clip-path` sozinho por transição
    CSS — nada de recalcular em JS a cada quadro.
  */
  const { darkClip, lightClip, darkClipStart, lightClipStart, lineAt } = useMemo(() => {
    const semLinha = (x: number) => x * 0
    if (!W || !H) {
      return {
        darkClip: undefined,
        lightClip: undefined,
        darkClipStart: undefined,
        lightClipStart: undefined,
        lineAt: semLinha,
      }
    }

    const r = makeRng(42) // mesma semente do protótipo
    const yL = H * (isMobile ? 0.6 : 0.63)
    const yR = H * (isMobile ? 0.4 : 0.36)

    const line: Array<[number, number]> = []
    for (let x = 0; x <= W; x += 10 + r.next() * 8) {
      line.push([x, yL + (yR - yL) * (x / W) + (r.next() - 0.5) * 9])
    }
    line.push([W, yR])

    const P = (a: Array<[number, number]>, dy = 0) =>
      a.map((p) => `${p[0].toFixed(1)}px ${(p[1] + dy).toFixed(1)}px`).join(',')

    const build = (dy: number) => ({
      dark: `polygon(0 0,${W}px 0,${P([...line].reverse(), dy)},0 ${(yL + dy).toFixed(1)}px)`,
      light: `polygon(${P(line, dy)},${W}px ${H}px,0 ${H}px)`,
    })

    const fim = build(0)
    // começa acima do topo: a área escura nasce zerada e desce varrendo
    const inicio = build(-H)

    return {
      darkClip: fim.dark,
      lightClip: fim.light,
      darkClipStart: inicio.dark,
      lightClipStart: inicio.light,
      // y do rasgo para um x normalizado: é por aqui que a tinta se adensa
      lineAt: (xn: number) => yL + (yR - yL) * xn,
    }
  }, [W, H, isMobile])

  /*
    Entrada: a varredura só acontece uma vez, no primeiro quadro depois de medir.
    Com prefers-reduced-motion já nasce no lugar final, sem transição.
  */
  const [entrou, setEntrou] = useState(false)
  useEffect(() => {
    if (!W || !H) return
    if (reduced) {
      setEntrou(true)
      return
    }
    const id = requestAnimationFrame(() => setEntrou(true))
    return () => cancelAnimationFrame(id)
  }, [W, H, reduced])

  const varredura = reduced
    ? undefined
    : 'clip-path 1200ms cubic-bezier(.22,.61,.36,1) 120ms'

  // --- ajusta o nome à largura da tela --------------------------------------
  const probeRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(100)

  useLayoutEffect(() => {
    if (!W) return
    let cancelled = false

    const fit = () => {
      const probe = probeRef.current
      if (!probe || cancelled) return
      const target = W * (isMobile ? 0.92 : 0.94)
      // no celular o nome quebra em duas linhas; manda a linha mais larga
      const widest = isMobile
        ? Math.max(
            ...[...probe.querySelectorAll('[data-line]')].map(
              (e) => e.getBoundingClientRect().width,
            ),
          )
        : probe.getBoundingClientRect().width
      if (widest > 0) setFontSize((100 * target) / widest)
    }

    // espera a Anton carregar: medir antes dá a largura da fonte substituta
    document.fonts.ready.then(fit)
    fit()
    return () => {
      cancelled = true
    }
  }, [W, isMobile])

  const Name = ({ hidden }: { hidden: boolean }) => (
    <span
      data-name
      className="block whitespace-nowrap"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${fontSize}px`,
        lineHeight: 0.82,
      }}
      aria-hidden={hidden ? 'true' : undefined}
    >
      {isMobile ? (
        <>
          <span data-line className="block">
            HER
          </span>
          <span data-line className="block">
            ICK
          </span>
        </>
      ) : (
        t.hero.name
      )}
    </span>
  )

  return (
    <section
      ref={sectionRef}
      id="topo"
      className="tex-creme relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* metade escura, recortada pela diagonal */}
      <div
        className="tex-preta pointer-events-none absolute inset-0"
        style={{ clipPath: entrou ? darkClip : darkClipStart, transition: varredura }}
        aria-hidden="true"
      />

      {/* rabiscos; a tinta fica por conta do InkField, dentro das camadas */}
      <span className="absolute left-[4vw] top-[58%] z-[3]">
        <Doodle kind="star" seed="hero-star-1" size={64} />
      </span>
      <span className="absolute left-[8vw] top-[68%] z-[3] hidden zine:block">
        <Doodle kind="star" seed="hero-star-2" size={46} />
      </span>

      {/* o cabo começa aqui; no hero ele já nasce desenhado */}
      <NetworkCable
        path=".80,.40;.92,.48;.97,.66;.91,.86;.9,1.02"
        pathMobile=".84,.44;.95,.56;.96,.8;.93,1.02"
        scrub={false}
        className="z-[2]"
      />

      {/* nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 zine:px-10">
        <ul className="hidden gap-6 zine:flex">
          {[t.nav.quem, t.nav.issues, t.nav.setlist, t.nav.contato].map((label, i) => (
            <li key={label}>
              <a
                href={`#${['quem', 'issues', 'setlist', 'contato'][i]}`}
                className="text-[13px] font-bold tracking-[0.06em] text-white uppercase hover:text-red"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <span
          className="text-[13px] font-bold tracking-[0.06em] text-white uppercase zine:hidden"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          ☰ MENU
        </span>
        <LangToggle className="text-white" />
      </nav>

      {/*
        As duas camadas do nome cobrem a SEÇÃO inteira. Isso não é estético: o
        clip-path é calculado em coordenadas da seção (0..W, 0..H), então o
        elemento que recebe o recorte precisa ter exatamente essa caixa. Aplicar
        o mesmo polígono num elemento menor recortava no lugar errado.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-[4] flex items-center px-[3vw] text-paper"
        style={{ clipPath: entrou ? darkClip : darkClipStart, transition: varredura }}
        aria-hidden="true"
      >
        <Name hidden />
        <InkField
          seed="hero-ink"
          width={W}
          height={H}
          lineAt={lineAt}
          color="var(--color-paper)"
          settled={entrou}
        />
      </div>

      <h1
        className="pointer-events-none absolute inset-0 z-[4] flex items-center px-[3vw] text-ink"
        style={{ clipPath: entrou ? lightClip : lightClipStart, transition: varredura }}
      >
        <Name hidden={false} />
        <InkField
          seed="hero-ink"
          width={W}
          height={H}
          lineAt={lineAt}
          color="var(--color-ink)"
          settled={entrou}
        />
      </h1>

      {/* sonda invisível, só para medir a largura natural do nome */}
      <span
        ref={probeRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 whitespace-nowrap opacity-0"
        style={{ fontFamily: 'var(--font-display)', fontSize: 100, lineHeight: 0.82 }}
      >
        {isMobile ? (
          <>
            <span data-line className="block">
              HER
            </span>
            <span data-line className="block">
              ICK
            </span>
          </>
        ) : (
          t.hero.name
        )}
      </span>

      {/* empurra o rodapé para baixo do nome */}
      <div className="flex-1" />

      {/*
        O PNG vem com fundo preto chapado. `lighten` descarta o preto contra a
        área escura do hero, que é onde os pets ficam — era isso ou pedir uma
        versão recortada do arquivo.
      */}
      <img
        src="/assets/pets-espiando.png"
        alt="Mike e Missi espiando por cima do nome"
        className={`pointer-events-none absolute left-1/2 z-[6] w-[26vw] max-w-[300px] -translate-x-1/2 zine:left-[56%] ${entrou ? 'hero-pets-in' : 'hero-pets-out'}`}
        style={{
          mixBlendMode: 'lighten',
          // apoiados na borda de cima das letras, que começam em ~18% da seção
          top: 'max(2%, calc(18% - 13vw))',
        }}
      />

      {/* adesivo vermelho */}
      <div className="relative z-[5] -mt-2 px-[6vw] zine:px-[16vw]">
        <TornPaper
          seed="hero-sticker"
          amp={4}
          tilt={-5}
          wrapperClassName={`inline-block ${entrou ? 'hero-in' : 'hero-out'}`}
          className="tex-vermelha px-6 py-2 text-ink"
        >
          <span
            className="block whitespace-nowrap text-[clamp(1.1rem,2.8vw,2.1rem)] leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t.hero.sticker}
          </span>
        </TornPaper>
      </div>

      {/* rodapé do hero */}
      <div className="relative z-[5] flex flex-col gap-4 px-6 pb-8 zine:flex-row zine:items-end zine:justify-between zine:px-10">
        <p
          className="max-w-[20ch] text-[clamp(1.1rem,2.2vw,1.75rem)] leading-tight text-ink"
          style={{ fontFamily: 'var(--font-hand)' }}
        >
          {t.hero.tagline} ↘
        </p>
        <ul className="flex gap-5">
          {t.hero.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-[13px] font-bold text-ink underline decoration-2 underline-offset-4 hover:decoration-[3px] hover:decoration-red"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <span
        className="absolute bottom-3 left-1/2 z-[5] -translate-x-1/2 text-[11px] font-bold tracking-[0.1em] text-ink uppercase"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {t.hero.scroll}
      </span>
    </section>
  )
}
