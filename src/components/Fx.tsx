import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animações de entrada do site inteiro, num lugar só.
 *
 * Os componentes só marcam os elementos com `data-fx`; este componente acha as
 * marcas a cada troca de página e cria as animações com GSAP + ScrollTrigger.
 *
 *   rise      sobe e aparece              (blocos de texto, papéis)
 *   pop       cresce girando, com repique  (adesivos, pastilhas, rabiscos)
 *   drop      cai de cima e quica          (cards, ingresso, amplificador)
 *   slide-l   entra pela esquerda          (retratos, capas)
 *   slide-r   entra pela direita
 *   slam      carimbo: bate grande e treme (títulos)
 *   wipe      revela da esquerda p/ direita (fitas, faixas, etiquetas)
 *   stagger   os filhos entram em cascata; o tipo vem de data-fx-child
 *   letters   as letras de um RansomTitle caem uma a uma, fora de ordem
 *   data-fx-speed="0.2"  parallax preso à rolagem
 *
 * O que entra na tela junto entra em cascata (ScrollTrigger.batch). Cada
 * animação toca uma vez e depois devolve o elemento ao CSS (clearProps), para
 * os hovers continuarem funcionando. Com prefers-reduced-motion nada disso roda:
 * o gsap.matchMedia só monta as animações quando o movimento é permitido.
 *
 * Regra para quem marca: não ponha data-fx num elemento que já tem `transform`
 * inline (StickerImg, letras do RansomTitle); marque um invólucro em volta.
 */
type Tipo = 'rise' | 'pop' | 'drop' | 'slide-l' | 'slide-r'

const DE: Record<Tipo, gsap.TweenVars> = {
  rise: { y: 56, opacity: 0, rotate: 1.5 },
  pop: { scale: 0.35, opacity: 0, rotate: -16 },
  drop: { y: -110, opacity: 0, rotate: -5 },
  'slide-l': { x: -120, opacity: 0, rotate: -5 },
  'slide-r': { x: 120, opacity: 0, rotate: 5 },
}
const PARA: Record<Tipo, gsap.TweenVars> = {
  rise: { duration: 0.85, ease: 'power3.out' },
  pop: { duration: 0.65, ease: 'back.out(2.4)' },
  drop: { duration: 1.05, ease: 'bounce.out' },
  'slide-l': { duration: 0.85, ease: 'power3.out' },
  'slide-r': { duration: 0.85, ease: 'power3.out' },
}
const TIPOS = Object.keys(DE) as Tipo[]
const NEUTRO = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
// Entra quando o topo passa 60px da borda de baixo. Sem clamp(): com ele, o que
// já está na tela ao abrir a página só entrava depois da primeira rolagem.
const INICIO = 'top bottom-=60px'

export function Fx() {
  const { pathname } = useLocation()

  useEffect(() => {
    const mm = gsap.matchMedia()
    // Imagens e fontes que chegam depois mudam a altura da página e deixam as
    // posições dos gatilhos velhas (o rodapé nunca entrava). Quando o corpo da
    // página muda de tamanho, os gatilhos são recalculados.
    let espera = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(espera)
      espera = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)
    // espera a página nova pintar antes de procurar as marcas
    const raf = requestAnimationFrame(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        for (const tipo of TIPOS) {
          const els = gsap.utils.toArray<HTMLElement>(`[data-fx="${tipo}"]`)
          if (!els.length) continue
          gsap.set(els, DE[tipo])
          ScrollTrigger.batch(els, {
            start: INICIO,
            once: true,
            onEnter: (lote) =>
              gsap.to(lote, {
                ...NEUTRO,
                ...PARA[tipo],
                stagger: 0.09,
                overwrite: true,
                clearProps: 'transform,opacity',
              }),
          })
        }

        for (const el of gsap.utils.toArray<HTMLElement>('[data-fx="stagger"]')) {
          const tipo = (el.dataset.fxChild as Tipo) ?? 'pop'
          const filhos = Array.from(el.children) as HTMLElement[]
          gsap.from(filhos, {
            ...DE[tipo],
            ...PARA[tipo],
            stagger: 0.07,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: el, start: INICIO, once: true },
          })
        }

        for (const el of gsap.utils.toArray<HTMLElement>('[data-fx="letters"]')) {
          // sem clearProps: cada letra tem a própria inclinação inline, e o GSAP
          // devolve exatamente o transform que leu
          gsap.from(el.querySelectorAll(':scope > span > span'), {
            y: -60,
            scale: 1.7,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(3)',
            stagger: { each: 0.04, from: 'random' },
            scrollTrigger: { trigger: el, start: INICIO, once: true },
          })
        }

        for (const el of gsap.utils.toArray<HTMLElement>('[data-fx="slam"]')) {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: INICIO, once: true } })
            .from(el, { scale: 1.9, opacity: 0, rotate: -7, duration: 0.32, ease: 'power4.in' })
            .to(el, { x: 5, duration: 0.045, yoyo: true, repeat: 5, ease: 'none' })
            .set(el, { clearProps: 'transform,opacity' })
        }

        for (const el of gsap.utils.toArray<HTMLElement>('[data-fx="wipe"]')) {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 100% 0 0)' },
            {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.9,
              ease: 'power2.inOut',
              clearProps: 'clipPath',
              scrollTrigger: { trigger: el, start: INICIO, once: true },
            },
          )
        }

        for (const el of gsap.utils.toArray<HTMLElement>('[data-fx-speed]')) {
          const v = Number(el.dataset.fxSpeed) || 0.2
          gsap.to(el, {
            yPercent: -v * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section') ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(espera)
      ro.disconnect()
      mm.revert()
    }
  }, [pathname])

  return null
}
