export type IssueSlug =
  | 'leitor-rco'
  | 'agrovision'
  | 'portal'
  | 'maqcenter'
  | 'ecommerce'
  | 'clientes'

export type Issue = {
  slug: IssueSlug
  /** "001" a "006". */
  numero: string
  titulo: string
  /** A frase manuscrita do card. */
  gancho: string
  /** Linha técnica no topo do card, quando o design mostra uma. */
  kicker?: string
  /** Resultado resumido no rodapé do card, quando existe. */
  tempo?: string
  /** Texto curto, usado no card. */
  resumoCard: string
  /** Texto longo, usado na página do projeto. */
  resumoLongo: string
  tipo: string
  stack: string[]
  status: string
  /** Rótulo do carimbo no card. */
  selo: string
  repositorio: string | null
  problema: string
  /** Os passos numerados de "O QUE EU FIZ". */
  passos: string[]
  /** Blocos do fluxo. Vazio quando a issue não tem fluxo (006). */
  fluxo: string[]
  resultado: string
  /** As letras gigantes do resultado, ex. "HORAS → SEGUNDOS". */
  resultadoGigante: string
  /** A linha curta embaixo do resultado gigante. */
  resultadoFrase: string
  capa: string
  /** Print real do projeto, usado no card das Issues. Sem ele o card usa a capa. */
  foto?: string
  /** Endereço do projeto no ar. Sem ele o card leva ao código. */
  site?: string
  /** Aviso interno; não é renderizado. */
  autorizacao?: string
  /** Só a issue 006 tem lista de clientes. */
  clientes?: Client[]
}

/** Um cliente da issue 006. O repositório é conferido contra o GitHub. */
export type Client = {
  nome: string
  /** Rótulo curto do chip na faixa do 006. */
  tag: string
  descricao: string
  /** Print da página inicial do cliente. */
  foto: string
  /** Site no ar. Quando não tem, o cartão leva ao repositório. */
  site?: string
  /** Repositório público, quando existe. */
  repo?: string
}

/** Agência parceira, citada embaixo da faixa de clientes. */
export type Partner = {
  nome: string
  /** Cidade, quando faz parte do jeito que o Herick cita a agência. */
  cidade?: string
  href: string
}

export type Track = {
  n: string
  faixa: string
  detalhe: string
}

export type Song = {
  titulo: string
  artista: string
  nota: string
  spotifyId: string
  /** Impressa no rótulo da fita, como no design. */
  duracao: string
  /** Gaveta da discoteca: ROCK, MPB, POP, J-ROCK... */
  genero: string
  album: string
  /** Capa oficial do álbum, servida pelo Spotify (i.scdn.co). */
  capa: string
}

/** Um cartucho de jogo. */
export type Cartridge = {
  genero: string
  nome: string
  /** "CART. #0892" */
  cart: string
}

export type Manager = {
  /** "VIP BACKSTAGE" / "GERÊNCIA SUPREMA" */
  passe: string
  /** "ID: 001-CANINE" */
  id: string
  /** Rótulo da moldura enquanto a foto real não existe. */
  fotoLabel: string
  foto: string
  /** "Poodle Preto · Headphone Red" */
  especie: string
  nome: string
  cargoLabel: string
  cargo: string
  frase: string
  status: string
  /** "● APROVAÇÃO 100%" */
  selo: string
}

/**
 * Um anime, desenho ou jogo da parede de pôsteres. A imagem e o vídeo vêm do
 * trailer oficial no YouTube (miniatura e player do próprio YouTube).
 */
export type Poster = {
  nome: string
  /** "MADHOUSE · 2023" */
  meta: string
  tipo: 'anime' | 'desenho' | 'jogo'
  /** ID do vídeo oficial no YouTube. */
  yt: string
  /** Canal oficial que publicou o vídeo. */
  canal: string
  /** Comentário do Herick, em letra de marcador. */
  nota: string
}

/** Uma foto livre do bloco do Edgerunners: onde foi tirada e de quem é. */
export type FotoLugar = { src: string; lugar: string; autor: string }

export type Content = {
  lang: 'pt' | 'en'
  htmlLang: string
  nav: {
    quem: string
    issues: string
    setlist: string
    contato: string
    ladob: string
    lang: string
  }
  hero: {
    name: string
    sticker: string
    tagline: string
    scroll: string
    links: { label: string; href: string }[]
  }
  quem: {
    titulo: string
    bio: string[]
    stack: string[]
    infra: string
    notas: { comecei: string; missi: string; mike: string }
    /** Fita preta que corre embaixo do hero: o que o Herick faz. */
    faixa: string[]
    /** Carimbos espalhados pelo Lado A. */
    carimbos: { desde: string; edicoes: string; aoVivo: string }
  }
  issues: {
    /** "ZINE CATALOG // DISPATCHED WORKS" */
    tag: string
    titulo: string
    sub: string
    verMais: string
    /** Botão do card que abre o projeto no ar. */
    verSite: string
    /** Botão do card quando o projeto não tem site, só código. */
    verCodigo: string
    /** A faixa vermelha do 006. */
    lineup: { tag: string; titulo: string; frase: string }
    parceiros: { titulo: string; lista: Partner[] }
    lista: Issue[]
  }
  projeto: {
    voltar: string
    tipo: string
    stack: string
    status: string
    codigo: string
    problema: string
    oQueFiz: string
    print: string
    todas: string
    proxima: string
    notaMissi: string
  }
  setlist: {
    titulo: string
    sub: string
    nota: string
    faixas: Track[]
  }
  flip: {
    /** Etiqueta pequena acima do título. */
    tag: string
    titulo: string
    texto: string
    botao: string
    /** Textos impressos na capa do disco. */
    capa: { lados: string; nome: string; sub: string; rpm: string; ano: string }
  }
  ladob: {
    voltar: string
    barra: string
    /** "* o Herick fora do expediente *" */
    tag: string
    /** "RELAX // ANALOG // HOBBIES" */
    kicker: string
    titulo: string
    intro: string
    chips: string[]
    /** Rótulo central do vinil. */
    disco: { estereo: string; lado: string; rpm: string }
    /** O cartão que se apoia no disco. */
    discoNota: { titulo: string; sub: string }
    colecao: { titulo: string; sub: string }
    mixtape: {
      kicker: string
      titulo: string
      tipo: string
      side: string
      dolby: string
      nota: string
    }
    musicas: Song[]
    jogos: {
      kicker: string
      titulo: string
      slot: string
      texto: string
      rodape: string
      nota: string
      cartuchos: Cartridge[]
    }
    discoteca: {
      kicker: string
      titulo: string
      nota: string
      escolha: string
      legenda: string
      /** Rótulo das gavetas de gênero. */
      gavetas: string
      ouvir: string
      fonte: string
    }
    /** Bloco do Cyberpunk: Edgerunners, com vídeo de fundo e trailer oficial. */
    edge: {
      kicker: string
      titulo: string
      sub: string
      kana: string
      texto: string
      fatos: string[]
      trailers: { rotulo: string; yt: string; canal: string }[]
      assistir: string
      fotosTitulo: string
      fotos: FotoLugar[]
      credito: string
    }
    /** TV de tubo + parede de pôsteres. */
    telao: {
      kicker: string
      titulo: string
      sub: string
      noAr: string
      canal: string
      trocar: string
      assistir: string
      desligar: string
      dica: string
      tipos: Record<Poster['tipo'], string>
      fonte: string
    }
    posters: Poster[]
    dado: { kicker: string; titulo: string; texto: string }
    vitrola: { kicker: string; titulo: string; texto: string }
    /** Créditos das fotos livres, no rodapé do Lado B. */
    creditos: string
    equipe: { kicker: string; titulo: string; sub: string }
    gerentes: Manager[]
    fim: {
      kicker: string
      titulo: string
      texto: string
      botao: string
      conversar: string
      marca: string
    }
    rodape: { marca: string; sub: string; texto: string }
  }
  contato: {
    titulo: string
    sub: string
    email: string
    cv: string
    ticket: string
    emailAddr: string
    github: string
    linkedin: string
    localizacao: string
  }
  footer: {
    left: string
    right: string
    links: string[]
  }
  erro404: {
    texto: string
    botao: string
  }
  carregando: string
}
