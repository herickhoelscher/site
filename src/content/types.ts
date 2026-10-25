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
  /** Aviso interno; não é renderizado. */
  autorizacao?: string
  /** Só a issue 006 tem lista de clientes. */
  clientes?: string[]
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
}

/** Uma fita VHS da estante de animes. */
export type Tape = {
  /** "TAPE VOL. 01 · HI-FI STEREO" */
  vol: string
  nome: string
  /** O adesivo: REBOBINADA, FAVORITA, OVERDRIVE. */
  selo: string
  /** Clima que a fita aplica na seção ao passar o mouse. */
  mood: 'red' | 'lav' | 'neon'
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

/** Um pin do mural do Pinterest. */
export type Pin = {
  /** Linha pequena acima do título, quando existe. */
  kicker?: string
  titulo: string
  sub: string
  /** Terceira linha, quando o pin tem. */
  extra?: string
  /** "PIN #01 // ARCHITECTURE" */
  pin: string
  texto: string
  tom: 'ink' | 'red' | 'paper' | 'brown'
}

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
  }
  issues: {
    titulo: string
    sub: string
    verMais: string
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
    vhs: {
      kicker: string
      titulo: string
      modo: string
      texto: string
      nota: string
      fitas: Tape[]
    }
    jogos: {
      kicker: string
      titulo: string
      slot: string
      texto: string
      rodape: string
      nota: string
      cartuchos: Cartridge[]
    }
    xadrez: {
      kicker: string
      titulo: string
      modo: string
      statusLabel: string
      rating: string
      nome: string
      desc: string
      notaTitulo: string
      notaTexto: string
    }
    equipe: { kicker: string; titulo: string; sub: string }
    gerentes: Manager[]
    mural: { titulo: string; tags: string; pins: Pin[] }
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
