import type { ReactNode } from 'react'
import { seededTilt } from '@/lib/rng'

type Props = {
  children: ReactNode
  seed?: string | number
  tone?: 'red' | 'ink' | 'purple'
  shape?: 'round' | 'rect'
  className?: string
}

const TONE: Record<NonNullable<Props['tone']>, string> = {
  red: 'var(--color-red)',
  ink: 'var(--color-ink)',
  purple: 'var(--color-purple)',
}

/**
 * Carimbo de borracha: borda dupla, mono caixa-alta, girado.
 * Pensado para ficar sobre papel; num fundo escuro use tone="red".
 */
export function Stamp({
  children,
  seed = 'stamp',
  tone = 'red',
  shape = 'rect',
  className = '',
}: Props) {
  const color = TONE[tone]
  const rotate = seededTilt(`stamp:${seed}`, 5.5)

  return (
    <span
      className={`inline-flex items-center justify-center text-[11px] font-bold tracking-[0.12em] uppercase ${
        shape === 'round' ? 'aspect-square rounded-full' : ''
      } ${className}`}
      style={{
        fontFamily: 'var(--font-mono)',
        color,
        border: `3px solid ${color}`,
        boxShadow: `inset 0 0 0 1.5px ${color}`,
        padding: shape === 'round' ? '0.85rem' : '0.3rem 0.6rem',
        transform: `rotate(${rotate}deg)`,
        opacity: 0.88,
      }}
    >
      {children}
    </span>
  )
}
