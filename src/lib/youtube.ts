/**
 * Miniatura e player oficiais do YouTube.
 *
 * As imagens dos animes e jogos não ficam no repositório: a miniatura vem do
 * próprio YouTube (do trailer oficial) e o vídeo toca no player dele, no domínio
 * sem cookies. Assim a arte continua com quem é dono dela.
 */
export const miniatura = (id: string, qualidade: 'maxresdefault' | 'hqdefault' = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${id}/${qualidade}.jpg`

export const player = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`

export const assistirNoYoutube = (id: string) => `https://www.youtube.com/watch?v=${id}`
