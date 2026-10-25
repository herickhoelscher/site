import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/**
 * Os três easter eggs do briefing (§ 6), num componente só.
 *
 * Todos desligam com prefers-reduced-motion, como o briefing manda: "desligar
 * scrub, quedas, cursor e easter eggs de física". O componente devolve `null`
 * nesse caso, então nem listener é registrado.
 *
 * - Konami: o Mike atravessa a tela correndo.
 * - 5 cliques na Missi: ela derruba um elemento, que cai com gravidade simples.
 * - Cursor de estrela, só no desktop com mouse de verdade.
 */
export function EasterEggs() {
  const reduced = usePrefersReducedMotion()
  const [mikeRunning, setMikeRunning] = useState(false)
  const [star, setStar] = useState<{ x: number; y: number } | null>(null)
  const buffer = useRef<string[]>([])

  // --- Konami -------------------------------------------------------------
  useEffect(() => {
    if (reduced) return
    const onKey = (e: KeyboardEvent) => {
      buffer.current = [...buffer.current, e.key].slice(-KONAMI.length)
      if (KONAMI.every((k, i) => k.toLowerCase() === buffer.current[i]?.toLowerCase())) {
        buffer.current = []
        setMikeRunning(true)
        window.setTimeout(() => setMikeRunning(false), 2600)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reduced])

  // --- cursor de estrela ---------------------------------------------------
  useEffect(() => {
    if (reduced) return
    // só em ponteiro fino: no toque não existe cursor para seguir
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => setStar({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  // --- 5 cliques na Missi --------------------------------------------------
  useEffect(() => {
    if (reduced) return

    let count = 0
    let timer = 0

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('img')
      if (!target || !/missi/i.test(target.getAttribute('alt') ?? '')) return

      count += 1
      window.clearTimeout(timer)
      // os cliques precisam ser seguidos; 1,2s de pausa zera a contagem
      timer = window.setTimeout(() => {
        count = 0
      }, 1200)

      if (count < 5) return
      count = 0
      dropSomething()
    }

    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('click', onClick)
      window.clearTimeout(timer)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <>
      {mikeRunning ? (
        <img
          src="/assets/mike-corpo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed bottom-6 left-0 z-[90] h-28 w-auto"
          style={{ animation: 'mike-run 2.4s linear forwards' }}
        />
      ) : null}

      {star ? (
        <span
          aria-hidden="true"
          className="pointer-events-none fixed z-[95] text-red"
          style={{ left: star.x, top: star.y, transform: 'translate(-50%,-50%)', fontSize: 18 }}
        >
          ★
        </span>
      ) : null}

      <style>{`
        @keyframes mike-run {
          from { transform: translateX(-30vw) scaleX(1); }
          to   { transform: translateX(110vw) scaleX(1); }
        }
        @keyframes missi-drop {
          to { transform: translateY(70vh) rotate(42deg); opacity: 0; }
        }
      `}</style>
    </>
  )
}

/**
 * Derruba um elemento decorativo da página com uma queda simples.
 *
 * Escolhe um rabisco ou adesivo visível, nunca texto: o briefing pede o efeito
 * sem machucar a leitura. A animação é cubic-bezier acelerando, que já lê como
 * gravidade sem precisar de motor de física.
 */
function dropSomething() {
  const candidates = [...document.querySelectorAll<HTMLElement>('svg[aria-hidden="true"]')].filter(
    (el) => {
      const r = el.getBoundingClientRect()
      return r.top > 0 && r.bottom < window.innerHeight && r.width > 24
    },
  )
  const victim = candidates[Math.floor(Math.random() * candidates.length)]
  if (!victim) return

  victim.style.transition = 'none'
  victim.style.animation = 'missi-drop 1.1s cubic-bezier(.55,.06,.68,.19) forwards'
  window.setTimeout(() => {
    victim.style.animation = ''
  }, 1400)
}
