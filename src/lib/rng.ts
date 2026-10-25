/**
 * Aleatoriedade determinística para a colagem.
 *
 * Porte direto do gerador de `referencias/prototipo/zine.js`:
 *
 *   const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1;
 *     return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5;
 *                    s >>>= 0; return s / 4294967296; }; };
 *
 * Usar o mesmo xorshift32 com a mesma semente numérica reproduz exatamente o
 * mesmo desenho do protótipo. Nada aqui usa Math.random, então a colagem não
 * muda entre renders.
 */

/** xorshift32, igual ao do zine.js. */
export function makeRng(seed: number) {
  let s = (Math.imul(seed, 2654435761) >>> 0) || 1

  const next = (): number => {
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    return s / 4294967296
  }

  return {
    next,
    range: (min: number, max: number) => min + next() * (max - min),
    int: (min: number, max: number) => Math.floor(min + next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    /** jitter centrado em zero, como o `J` do zine.js */
    jitter: (amount: number) => (next() - 0.5) * amount,
  }
}

export type Rng = ReturnType<typeof makeRng>

/**
 * Semente numérica a partir de uma string, para os componentes aceitarem
 * `seed="issue-leitor-rco"` em vez de um índice solto. FNV-1a.
 */
export function hashSeed(seed: string | number): number {
  if (typeof seed === 'number') return seed
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export const rngFrom = (seed: string | number) => makeRng(hashSeed(seed))

/**
 * Micro-rotação de colagem. O briefing manda -3° a 3° no desktop e no máximo
 * 2° no celular, para o texto continuar legível (§ 1 e § 8).
 */
export function seededTilt(seed: string | number, max = 3): number {
  return Number(rngFrom(`${seed}:tilt`).jitter(max * 2).toFixed(2))
}
