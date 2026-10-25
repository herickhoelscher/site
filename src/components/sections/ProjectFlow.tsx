type Props = { fluxo: string[] }

export function ProjectFlow({ fluxo }: Props) {
  if (fluxo.length === 0) return null

  return (
    <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3" aria-label={fluxo.join(' → ')}>
      {fluxo.map((bloco, index) => (
        <li key={`${index}-${bloco}`} className="flex items-center gap-2">
          <span
            className="max-w-full border-2 border-ink bg-white px-3 py-2 text-center text-[11px] font-bold text-ink shadow-zine-sm zine:text-[13px]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {bloco}
          </span>
          {index < fluxo.length - 1 ? (
            <span aria-hidden="true" className="text-2xl leading-none text-red" style={{ fontFamily: 'var(--font-marker)' }}>→</span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
