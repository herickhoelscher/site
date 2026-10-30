import { useMemo } from 'react'
import { makeRng, hashSeed } from '@/lib/rng'

type Props = {
  text: string
  seed?: string | number
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div'
  className?: string
  /** Tamanho da letra. Pode ser qualquer unidade CSS. */
  size?: string
  /** Letras caem uma a uma quando o título entra na tela (ver components/Fx). */
  fx?: boolean
}

/**
 * Os seis "looks" do zine.js, na mesma ordem — cada um é
 * [fundo, texto, fonte]. Note que a fonte muda junto com a cor: é isso que dá
 * o efeito de letra recortada de revistas diferentes.
 */
const LOOKS: ReadonlyArray<readonly [string, string, string]> = [
  ['#141414', '#F6F2E8', "'Anton'"],
  ['#EFE9DA', '#141414', "'Permanent Marker'"],
  ['#765BA7', '#F6F2E8', "'Anton'"],
  ['#F6F2E8', '#E8432E', "'Rubik Wet Paint'"],
  ['#141414', '#A68BE6', "'Space Mono'"],
  ['#EFE9DA', '#141414', "'Anton'"],
]

/**
 * Título em letras recortadas. Porte de `ransom()` do zine.js.
 *
 * Duas coisas vêm de lá e importam: as palavras ficam em spans próprios, para
 * não quebrarem no meio ao mudar de linha; e cada letra gira ±5.5° e desloca
 * ±4px no eixo Y.
 *
 * Acessibilidade (§ 9): cada letra é texto real dentro de um span, então
 * leitor de tela e Ctrl+F leem a frase inteira.
 */
export function RansomTitle({
  text,
  seed = text,
  as: Tag = 'h2',
  className = '',
  size = 'clamp(2rem, 7vw, 4.5rem)',
  fx = false,
}: Props) {
  const words = useMemo(() => {
    const r = makeRng(hashSeed(seed))
    return text.split(' ').map((word, wi) => ({
      key: `w${wi}`,
      letters: [...word].map((ch, ci) => {
        const look = LOOKS[Math.floor(r.next() * LOOKS.length)]
        return {
          key: `c${ci}`,
          ch,
          bg: look[0],
          fg: look[1],
          font: look[2],
          mono: look[2].includes('Mono'),
          rotate: Number((r.jitter(11)).toFixed(1)),
          shiftY: Number(r.jitter(8).toFixed(0)),
        }
      }),
    }))
  }, [text, seed])

  return (
    <Tag
      data-fx={fx ? 'letters' : undefined}
      className={`flex flex-wrap items-center gap-x-[0.3em] gap-y-2 uppercase leading-none ${className}`}
      style={{ fontSize: size }}
    >
      {words.map((w) => (
        <span key={w.key} className="inline-flex">
          {w.letters.map((l) => (
            <span
              key={l.key}
              className="inline-block px-[0.09em] py-[0.03em]"
              style={{
                background: l.bg,
                color: l.fg,
                fontFamily: l.font,
                fontWeight: l.mono ? 700 : undefined,
                transform: `rotate(${l.rotate}deg) translateY(${l.shiftY}px)`,
              }}
            >
              {l.ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
