import { Link } from 'react-router-dom'
import type { Content } from '@/content'

export function Footer({ t }: { t: Content }) {
  const prefix = t.lang === 'en' ? '/en' : ''
  const targets = ['#quem', '#issues', '#setlist', '#contato', `${prefix}/lado-b`]

  return (
    <footer className="bg-ink px-6 py-7 text-paper zine:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 zine:flex-row zine:items-start zine:justify-between">
        <p className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
          {t.footer.left}
        </p>
        <div className="flex flex-col gap-4 zine:items-end">
          <p className="text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            {t.footer.right}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
            {t.footer.links.map((label, i) => (
              <li key={`${label}-${i}`}>
                {i === targets.length - 1 ? (
                  <Link to={targets[i]} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red">
                    {label}
                  </Link>
                ) : (
                  <a href={targets[i]} className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red">
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
