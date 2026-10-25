import { TornPaper, Tape } from '@/components/collage'
import { LazyEmbed } from './LazyEmbed'
import type { Content } from '@/content'

type Props = { t: Content }

/** Altura do embed compacto de faixa do Spotify (§ 5). */
const EMBED_H = 80

/*
  Aviso da moldura enquanto o spotifyId está vazio. O texto não existe em
  t.ladob (o dono ainda não passou os IDs), então fica aqui, por idioma.
*/
const SEM_ID: Record<Content['lang'], string> = {
  pt: 'o player entra quando o ID do Spotify chegar',
  en: 'the player goes in once the Spotify ID arrives',
}

/**
 * Mixtape (§ 5): Mike dormindo sobre a fita e as 3 faixas com player e nota.
 *
 * O spotifyId vem vazio de propósito. Só renderiza o iframe quando há um ID
 * de verdade; nunca monta uma URL com ID inventado.
 */
export function Mixtape({ t }: Props) {
  const { musicas, gerentes } = t.ladob

  return (
    <div className="relative">
      {/* o Mike sobre a fita: ele vem na frente e desce um pouco sobre ela */}
      <div className="relative mx-auto w-[92%] max-w-[420px]">
        <img
          src="/assets/mike-discos.png"
          alt={gerentes[0].nome}
          loading="lazy"
          decoding="async"
          className="relative z-[2] mx-auto -mb-[8%] block w-[88%]"
          style={{ filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.3))' }}
        />
        {/* decorativa: o texto "MIXTAPE" já está desenhado na fita */}
        <img
          src="/assets/mixtape.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="relative z-[1] block w-full"
          style={{ filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.3))' }}
        />
      </div>

      <div className="relative mt-2">
        {/* a fita fica fora do TornPaper: dentro, o clip-path recortaria ela junto */}
        <Tape seed="ladob-mixtape-tape" at="top" width={96} />
        <TornPaper
          seed="ladob-mixtape"
          amp={5}
          tilt={-1}
          className="tex-creme px-4 pt-6 pb-5 text-ink zine:px-5"
        >
          <ol className="flex flex-col gap-5">
            {musicas.map((musica) => (
              <li key={musica.titulo}>
                <p className="text-[15px] leading-tight font-bold">
                  {musica.titulo}
                  <span
                    className="block text-[11px] font-normal tracking-[0.06em] uppercase"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {musica.artista}
                  </span>
                </p>

                <div className="mt-2">
                  {musica.spotifyId ? (
                    <LazyEmbed height={EMBED_H}>
                      <iframe
                        title={`${musica.titulo} · ${musica.artista}`}
                        src={`https://open.spotify.com/embed/track/${musica.spotifyId}`}
                        width="100%"
                        height={EMBED_H}
                        allow="encrypted-media"
                        loading="lazy"
                        className="block rounded-xl border-0"
                      />
                    </LazyEmbed>
                  ) : (
                    <div
                      className="tex-halftone flex items-center justify-center bg-ink/10 px-3 text-center"
                      style={{ height: EMBED_H, border: '2px dashed var(--color-ink)' }}
                    >
                      <span
                        className="text-[11px] font-bold tracking-[0.06em] uppercase"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {SEM_ID[t.lang]}
                      </span>
                    </div>
                  )}
                </div>

                <p
                  className="mt-1 text-[1.15rem] leading-tight text-red"
                  style={{ fontFamily: 'var(--font-hand)' }}
                >
                  {musica.nota}
                </p>
              </li>
            ))}
          </ol>
        </TornPaper>
      </div>
    </div>
  )
}
