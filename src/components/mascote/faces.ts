/**
 * Caras do mascote em pixel, desenhadas numa grade de 24x16 na tela do monitor.
 * Cada olho é um sprite de strings ("#" = pixel aceso). O olho direito de
 * "bravo" é o esquerdo espelhado.
 */
export const GW = 24
export const GH = 16
export const CYAN = '#2EF2E0'

const S = {
  bored: ['######', '......', '######', '.####.'],
  brow: ['....##', '..###.', '###...', '......', '######', '.####.'],
  ring: ['.####.', '......', '..##..', '.####.', '##..##', '##..##', '.####.', '..##..'],
  happy: ['..##..', '.####.', '##..##', '#....#'],
  angryL: ['##....', '.###..', '...###', '......', '######', '.####.'],
  closed: ['......', '.....#', '######'],
  x: ['#....#', '.#..#.', '..##..', '..##..', '.#..#.', '#....#'],
  line: ['######'],
}
const mirror = (s: string[]) => s.map((r) => [...r].reverse().join(''))

export type FaceKey =
  | 'entediado'
  | 'confiante'
  | 'surpreso'
  | 'feliz'
  | 'piscadinha'
  | 'bravo'
  | 'carregando'
  | 'erro'

type Face = { L?: string[]; R?: string[]; blink?: boolean; dots?: boolean }

export const FACES: Record<FaceKey, Face> = {
  entediado: { L: S.bored, R: S.bored, blink: true },
  confiante: { L: S.bored, R: S.brow, blink: true },
  surpreso: { L: S.ring, R: S.ring, blink: true },
  feliz: { L: S.happy, R: S.happy },
  piscadinha: { L: S.ring, R: S.closed },
  bravo: { L: S.angryL, R: mirror(S.angryL), blink: true },
  carregando: { dots: true },
  erro: { L: S.x, R: S.x },
}

/** Desenha a cara no contexto. ox/oy deslocam os olhos (seguir o cursor). */
export function drawFace(
  ctx: CanvasRenderingContext2D,
  key: FaceKey,
  cell: number,
  ox = 0,
  oy = 0,
  blink = false,
  t = 0,
) {
  const face = FACES[key]
  ctx.fillStyle = '#020605'
  ctx.fillRect(0, 0, GW * cell, GH * cell)
  ctx.fillStyle = 'rgba(46,242,224,0.07)'
  for (let y = 0; y < GH; y++)
    for (let x = 0; x < GW; x++) ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2)

  const px = (x: number, y: number) => {
    if (x >= 0 && x < GW && y >= 0 && y < GH)
      ctx.fillRect(x * cell + 0.5, y * cell + 0.5, cell - 1, cell - 1)
  }

  if (face.dots) {
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = Math.floor(t * 3) % 4 > i ? CYAN : 'rgba(46,242,224,0.25)'
      const x = 7 + i * 4
      px(x, 7); px(x + 1, 7); px(x, 8); px(x + 1, 8)
    }
    return
  }

  ctx.fillStyle = CYAN
  const bottom = 12 + oy
  const put = (spr: string[], x0: number) => {
    const top = bottom - spr.length
    spr.forEach((row, r) => [...row].forEach((c, k) => c === '#' && px(x0 + k, top + r)))
  }
  const closed = blink && face.blink
  put(closed ? S.line : face.L!, 4 + ox)
  put(closed ? S.line : face.R!, 14 + ox)
}
