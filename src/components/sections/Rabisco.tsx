import type { Tema } from '@/content/types'

/**
 * Rabiscos próprios para os temas do Pinterest do Herick. Desenho original,
 * traço grosso e as cores do site: nada copiado dos pins, só o assunto.
 */
const TINTA = '#141414'
const PAPEL = '#EFE9DA'
const VERMELHO = '#E8432E'
const ROXO = '#765BA7'
const LAVANDA = '#A68BE6'

const brilho = (x: number, y: number, r: number) =>
  `M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`

/** Anel ondulado do op-art, calculado uma vez. */
const onda = (r: number, fase: number) => {
  const pts: string[] = []
  for (let k = 0; k <= 60; k++) {
    const a = (k / 60) * Math.PI * 2
    const rr = r + Math.sin(a * 5 + fase) * r * 0.13
    pts.push(`${(60 + Math.cos(a) * rr).toFixed(1)} ${(60 + Math.sin(a) * rr).toFixed(1)}`)
  }
  return `M${pts.join(' L')}Z`
}
const ANEIS = Array.from({ length: 8 }, (_, i) => ({ d: onda(54 - i * 6.6, i * 0.55), cor: i % 2 ? PAPEL : TINTA }))

const traco = { stroke: TINTA, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

export function Rabisco({ tipo, className = '' }: { tipo: Tema['rabisco']; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      {tipo === 'mago' && (
        <g {...traco}>
          <path d="M66 6 C 74 14, 70 22, 62 26 C 56 42, 44 64, 32 86 L 90 86 C 80 64, 70 44, 62 26" fill={ROXO} />
          <ellipse cx="60" cy="90" rx="50" ry="11" fill={ROXO} />
          <path d="M33 80 Q 60 89 88 80" fill="none" stroke={VERMELHO} strokeWidth="6" />
          <path d={brilho(54, 50, 7)} fill={PAPEL} strokeWidth="2" />
          <path d={brilho(70, 66, 5)} fill={PAPEL} strokeWidth="2" />
          <path d={brilho(46, 72, 4)} fill={PAPEL} strokeWidth="2" />
          <path d="M66 38 a 7 7 0 1 0 6 10 a 5.5 5.5 0 1 1 -6 -10 Z" fill="#F2D24B" strokeWidth="2" />
          <path d={brilho(100, 24, 6)} fill={LAVANDA} strokeWidth="2" />
          <path d={brilho(18, 40, 4)} fill={LAVANDA} strokeWidth="2" />
        </g>
      )}
      {tipo === 'caveira' && (
        <g {...traco}>
          <path d="M24 62 C 22 16, 98 16, 96 62" fill="none" strokeWidth="7" />
          <path d="M24 62 C 22 16, 98 16, 96 62" fill="none" stroke={VERMELHO} strokeWidth="2.5" />
          <path d="M60 26 C 37 26, 30 42, 32 58 C 33 67, 39 71, 41 77 L 41 94 L 79 94 L 79 77 C 81 71, 87 67, 88 58 C 90 42, 83 26, 60 26 Z" fill={PAPEL} />
          <ellipse cx="49" cy="57" rx="7.5" ry="8.5" fill={TINTA} />
          <ellipse cx="71" cy="57" rx="7.5" ry="8.5" fill={TINTA} />
          <path d="M60 64 L 56 72 L 64 72 Z" fill={TINTA} strokeWidth="2" />
          <path d="M41 84 L 79 84 M 50 79 L 50 94 M 60 79 L 60 94 M 70 79 L 70 94" fill="none" strokeWidth="2.5" />
          <rect x="13" y="50" width="16" height="28" rx="6" fill={VERMELHO} />
          <rect x="91" y="50" width="16" height="28" rx="6" fill={VERMELHO} />
          <path d={brilho(104, 18, 6)} fill={LAVANDA} strokeWidth="2" />
        </g>
      )}
      {tipo === 'gato' && (
        <g {...traco}>
          <path d="M84 98 C 104 98, 108 76, 96 70" fill="none" strokeWidth="8" />
          <path d="M38 102 C 32 82, 38 64, 48 57 L 42 32 L 55 45 C 59 43.5, 65 43.5, 69 45 L 82 32 L 76 57 C 86 64, 92 82, 86 102 Z" fill={TINTA} />
          <ellipse cx="54" cy="56" rx="4.5" ry="5" fill={LAVANDA} strokeWidth="0" />
          <ellipse cx="70" cy="56" rx="4.5" ry="5" fill={LAVANDA} strokeWidth="0" />
          <path d="M54 52 L 54 60 M 70 52 L 70 60" stroke={TINTA} strokeWidth="2" />
          <path d="M20 26 a 9 9 0 1 0 9 12 a 7 7 0 1 1 -9 -12 Z" fill="#F2D24B" strokeWidth="2" />
          <path d={brilho(98, 20, 5)} fill={PAPEL} strokeWidth="2" />
        </g>
      )}
      {tipo === 'flash' && (
        <g {...traco} stroke={PAPEL}>
          {/* adaga atravessando o coração, clássico de tattoo flash */}
          <g transform="rotate(28 60 62)">
            <path d="M60 2 L 67 72 L 53 72 Z" fill={PAPEL} />
            <path d="M60 10 L 60 40" fill="none" stroke={TINTA} strokeWidth="2" />
            <path d="M60 94 C 30 74, 25 54, 39 45 C 49 39, 57 45, 60 53 C 63 45, 71 39, 81 45 C 95 54, 90 74, 60 94 Z" fill={VERMELHO} />
            <path d="M44 56 C 46 51, 50 49, 53 50" fill="none" strokeWidth="2.5" />
            <rect x="41" y="94" width="38" height="7" rx="3" fill={PAPEL} />
            <rect x="55" y="101" width="10" height="12" rx="2" fill={VERMELHO} />
            <circle cx="60" cy="117" r="4" fill={PAPEL} />
          </g>
          <path d={brilho(20, 22, 6)} fill={PAPEL} strokeWidth="1.5" />
          <path d={brilho(102, 92, 5)} fill={VERMELHO} strokeWidth="1.5" />
          <path d={brilho(16, 96, 4)} fill={VERMELHO} strokeWidth="1.5" />
        </g>
      )}
      {tipo === 'tenis' && (
        <g {...traco}>
          <path d="M8 84 L 112 84 C 114 92, 110 100, 101 100 L 16 100 C 9 100, 6 92, 8 84 Z" fill={PAPEL} />
          <path d="M12 84 C 12 68, 18 58, 32 56 L 50 50 C 58 48, 62 40, 68 40 L 84 42 C 90 55, 100 64, 108 72 C 113 77, 113 82, 112 84 Z" fill={VERMELHO} />
          <path d="M70 46 L 62 58 M 76 47 L 68 60 M 82 50 L 74 62" fill="none" stroke={PAPEL} strokeWidth="3" />
          <path d="M16 76 C 40 74, 70 76, 108 78" fill="none" stroke={LAVANDA} strokeWidth="5" />
          <path d={brilho(36, 68, 6)} fill={PAPEL} strokeWidth="2" />
          <path d="M20 92 L 104 92" fill="none" strokeWidth="2" strokeDasharray="4 5" />
          <path d={brilho(100, 22, 6)} fill={LAVANDA} strokeWidth="2" />
        </g>
      )}
      {tipo === 'opart' && (
        <g>
          {ANEIS.map((a) => (
            <path key={a.d} d={a.d} fill={a.cor} stroke={TINTA} strokeWidth="1.5" />
          ))}
          <circle cx="60" cy="60" r="5" fill={VERMELHO} stroke={TINTA} strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}
