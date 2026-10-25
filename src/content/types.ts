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
}

export type Manager = {
  nome: string
  cargo: string
  frase: string
  foto: string
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
    titulo: string
    texto: string
    botao: string
  }
  ladob: {
    titulo: string
    sub: string
    voltar: string
    barra: string
    abertura: string
    equipe: string
    virarDeNovo: string
    conversar: string
    musicas: Song[]
    animes: { lista: string[]; nota: string }
    jogos: { lista: string[]; nota: string }
    xadrez: { titulo: string; rating: string }
    mural: string
    gerentes: Manager[]
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
