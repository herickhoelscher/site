import type { ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Barcode,
  Doodle,
  type DoodleKind,
  RansomTitle,
  Splat,
  Stamp,
  StickerImg,
  Tape,
  TornPaper,
} from '@/components/collage'

const TOKENS = [
  { name: 'ink', value: '#141414' },
  { name: 'paper', value: '#EFE9DA' },
  { name: 'white', value: '#F6F2E8' },
  { name: 'red', value: '#E8432E' },
  { name: 'purple', value: '#765BA7' },
  { name: 'lav', value: '#A68BE6' },
]

const FONTS = [
  { v: 'var(--font-display)', n: 'Anton', u: 'títulos e nome gigante' },
  { v: 'var(--font-spray)', n: 'Rubik Wet Paint', u: 'título spray (ISSUES)' },
  { v: 'var(--font-marker)', n: 'Permanent Marker', u: 'Setlist e Lado B' },
  { v: 'var(--font-hand)', n: 'Caveat Brush', u: 'anotações manuscritas' },
  { v: 'var(--font-body)', n: 'Space Grotesk', u: 'texto corrido' },
  { v: 'var(--font-mono)', n: 'Space Mono', u: 'microtexto, tags, navegação' },
]

const DOODLES: DoodleKind[] = ['star', 'crown', 'arrow', 'swirl', 'lines']

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="mb-20">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="bg-red px-2 py-1 text-[13px] font-bold text-white"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {n}
        </span>
        <h2 className="text-[32px] leading-none" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export default function Kit() {
  return (
    <>
      <Helmet>
        <html lang="pt-BR" />
        <title>Kit de colagem · Herick Hoelscher</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p
          className="mb-2 text-[11px] tracking-[0.1em] text-red uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Etapa 1 · fundação
        </p>
        <RansomTitle text="KIT" as="h1" className="mb-4" />
        <p className="mb-16 max-w-2xl text-[18px] leading-relaxed">
          Tokens, tipografia, texturas e os componentes de colagem portados do{' '}
          <code className="text-lav" style={{ fontFamily: 'var(--font-mono)' }}>
            zine.js
          </code>
          . Toda variação é determinística: a mesma seed sempre desenha a mesma coisa.
        </p>

        <Section n="01" title="Cores">
          <ul className="grid grid-cols-2 gap-4 zine:grid-cols-3">
            {TOKENS.map((t) => (
              <li key={t.name} className="border-2 border-paper/40">
                <div
                  className="h-20"
                  style={{ backgroundColor: t.value, boxShadow: 'inset 0 0 0 1px rgba(246,242,232,.25)' }}
                />
                <div className="p-3">
                  <p className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
                    {t.name}
                  </p>
                  <p className="text-[11px] text-paper/60" style={{ fontFamily: 'var(--font-mono)' }}>
                    {t.value}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section n="02" title="Tipografia">
          <TornPaper seed="kit-type" tilt={false} className="tex-creme p-6 text-ink">
            <ul className="space-y-5">
              {FONTS.map((f) => (
                <li key={f.n}>
                  <p
                    className="mb-1 text-[11px] tracking-[0.1em] text-purple uppercase"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {f.n} — {f.u}
                  </p>
                  <p className="text-[34px] leading-tight" style={{ fontFamily: f.v }}>
                    Herick Hoelscher
                  </p>
                </li>
              ))}
            </ul>
          </TornPaper>
        </Section>

        <Section n="03" title="Texturas">
          <div className="grid grid-cols-2 gap-4 zine:grid-cols-4">
            {[
              { cls: 'tex-creme', label: 'tex-creme' },
              { cls: 'tex-preta', label: 'tex-preta' },
              { cls: 'tex-vermelha', label: 'tex-vermelha' },
              { cls: 'tex-roxa', label: 'tex-roxa' },
            ].map((t) => (
              <div key={t.cls} className="border-2 border-paper/40">
                <div className={`${t.cls} h-28`} />
                <p
                  className="bg-ink p-2 text-[11px] uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section n="04" title="TornPaper + Tape">
          <div className="grid grid-cols-1 gap-10 zine:grid-cols-3">
            <div className="relative">
              <Tape seed="kit-a" at="top" />
              <TornPaper seed="kit-card-a" sides="b" className="tex-creme p-5 text-ink">
                <p
                  className="mb-2 text-[11px] text-red uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  sides=&quot;b&quot;
                </p>
                <p className="text-[15px]">só a base rasgada, fita no topo</p>
              </TornPaper>
            </div>
            <div className="relative">
              <Tape seed="kit-b" at="top-left" tone="red" label="fita" />
              <TornPaper seed="kit-card-b" sides="tb" className="tex-creme p-5 text-ink">
                <p
                  className="mb-2 text-[11px] text-red uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  sides=&quot;tb&quot;
                </p>
                <p className="text-[15px]">topo e base, fita com rótulo</p>
              </TornPaper>
            </div>
            <div className="relative">
              <TornPaper seed="kit-card-c" sides="trbl" amp={10} className="tex-creme p-5 text-ink">
                <p
                  className="mb-2 text-[11px] text-purple uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  sides=&quot;trbl&quot; amp=10
                </p>
                <p className="text-[15px]">os quatro lados, rasgo fundo</p>
              </TornPaper>
            </div>
          </div>
        </Section>

        <Section n="05" title="RansomTitle">
          <RansomTitle text="QUEM É ESSE CARA" size="clamp(1.8rem,5vw,3.2rem)" className="mb-5" />
          <p className="text-[15px] leading-relaxed">
            Seis estilos sorteados por letra, e cada um troca também a fonte (Anton, Permanent
            Marker, Rubik Wet Paint, Space Mono). Cada letra é texto real: o leitor de tela lê a
            frase inteira.
          </p>
        </Section>

        <Section n="06" title="Doodle">
          <div className="flex flex-wrap items-center gap-10">
            {DOODLES.map((k) => (
              <figure key={k} className="text-center">
                <Doodle kind={k} size={70} />
                <figcaption
                  className="mt-2 text-[11px] text-paper/60 uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {k}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-[15px]">Dois traços por rabisco: o principal e um fantasma deslocado.</p>
        </Section>

        <Section n="07" title="Splat + Stamp">
          <div className="relative mb-6 h-[220px]">
            <Splat seed="kit-splat-1" className="absolute" style={{ left: 0, top: 0, width: 260, height: 200 }} />
            <Splat
              seed="kit-splat-2"
              color="#765BA7"
              className="absolute"
              style={{ left: 300, top: 20, width: 220, height: 170 }}
            />
          </div>
          <TornPaper seed="kit-stamps" tilt={false} className="tex-creme p-6">
            <div className="flex flex-wrap items-center gap-5">
              <Stamp seed="kit-s1">em produção</Stamp>
              <Stamp seed="kit-s2" tone="ink">
                aprovado
              </Stamp>
              <Stamp seed="kit-s3" tone="purple" shape="round">
                v1
              </Stamp>
            </div>
          </TornPaper>
        </Section>

        <Section n="08" title="Barcode">
          <TornPaper seed="kit-barcode" tilt={false} className="tex-creme inline-block p-5">
            <Barcode code="HERICK-2026-DEV" width={220} />
          </TornPaper>
        </Section>

        <Section n="09" title="StickerImg">
          <div className="grid grid-cols-1 gap-6 zine:grid-cols-3">
            <StickerImg src="/assets/herick-xerox.png" alt="Retrato do Herick em halftone" height={200} variant="plain" />
            <StickerImg src="/assets/missi-brava.png" alt="Missi, a gata siamesa" height={200} variant="plain" />
            <StickerImg
              src="/prints/leitor-rco-1.jpg"
              alt="Print da tela principal do Leitor RCO"
              placeholder="[ print do projeto ]"
              height={200}
            />
          </div>
          <p className="mt-4 text-[15px]">
            Os dois primeiros vêm de assets/. O terceiro ainda não existe, então cai no placeholder.
          </p>
        </Section>
      </main>
    </>
  )
}
