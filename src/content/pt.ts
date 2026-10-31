import type { Content } from './types'

/**
 * Fonte única de texto em PT, transcrita de referencias/docs/CONTEUDO.md.
 * Nada aqui é inventado: quando faltar algo, o certo é pedir, não preencher.
 */
export const pt: Content = {
  lang: 'pt',
  htmlLang: 'pt-BR',

  nav: {
    quem: '01 QUEM',
    issues: '02 ISSUES',
    setlist: '03 SETLIST',
    contato: '04 CONTATO',
    ladob: 'LADO B ↻',
    lang: 'PT / EN',
  },

  hero: {
    name: 'HERICK',
    sticker: '*HERICK HOELSCHER',
    tagline: 'dev full-stack que saiu da sala do servidor',
    scroll: 'ROLE ↓',
    links: [
      { label: 'Email', href: 'mailto:herickneumann4@gmail.com' },
      { label: 'GitHub', href: 'https://github.com/herickhoelscher' },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/herick-henrick-neumann-hoelscher-822906318',
      },
    ],
  },

  quem: {
    titulo: 'QUEM SOU EU?',
    bio: [
      'Comecei a trabalhar com 14 anos, carimbando papel e montando planilha. Passei pelo balcão, caí no suporte de TI e fui parar na sala do servidor: rede, firewall, Microsoft 365 e muito script pra ninguém precisar repetir trabalho manual.',
      'Foi ali que eu descobri do que gosto de verdade: pegar um processo chato e transformar em código. Hoje faço isso em sites, lojas, sistemas e automações, de landing page a agente de IA.',
      'Formado em Análise e Desenvolvimento de Sistemas e fazendo pós em IA, Automação e IoT. Moro no oeste do Paraná com o Mike e a Missi, que revisam meu código com muito rigor.',
    ],
    stack: ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE', 'PYTHON', 'POSTGRES', 'FLUTTER', 'N8N'],
    infra: 'e um pé na infra: Linux, Docker, PowerShell, Intune',
    notas: {
      comecei: 'comecei aos 14 ↓',
      missi: 'essa é a Missi. ela reprova PRs.',
      mike: 'o Mike aprova tudo',
    },
    faixa: [
      'DEV FULL-STACK',
      'LANDING PAGES',
      'LOJAS VIRTUAIS',
      'SISTEMAS',
      'AUTOMAÇÃO COM N8N',
      'AGENTES DE IA',
      'LINUX · DOCKER · INTUNE',
      'OESTE DO PARANÁ',
    ],
    carimbos: { desde: 'DESDE OS 14', edicoes: '06 EDIÇÕES', aoVivo: 'AO VIVO' },
  },

  issues: {
    tag: 'ZINE CATALOG // DISPATCHED WORKS',
    titulo: 'ISSUES',
    sub: '6 edições com projetos reais. Código aberto no GitHub, em produção e nos laboratórios.',
    verMais: 'LER A ISSUE →',
    verSite: 'VER O SITE ↗',
    verCodigo: 'VER O CÓDIGO ↗',
    lineup: {
      tag: 'ISSUE #006 // CLIENT LINEUP',
      titulo: 'SITES & CLIENTES NO AR',
      frase: 'Produção independente de alta fidelidade',
    },
    parceiros: {
      titulo: 'EMPRESAS PARCEIRAS',
      lista: [
        { nome: 'Agência B7', cidade: 'Cascavel', href: 'https://www.instagram.com/agenciadb7/' },
        { nome: 'Mais Mídias', href: 'https://www.agenciamaismidias.com.br/' },
      ],
    },
    lista: [
      {
        slug: 'leitor-rco',
        numero: '001',
        kicker: 'PYTHON DESKTOP TOOL',
        tempo: 'TEMPO: HORAS → SEGUNDOS',
        titulo: 'LEITOR RCO',
        gancho: 'nenhum PDF sobreviveu',
        resumoCard:
          'App desktop que lê pastas inteiras de PDFs do Registro de Classe Online do Paraná e entrega frequência, conteúdos e alunos em risco numa planilha pronta pro Power BI.',
        resumoLongo:
          'App desktop que lê pastas inteiras de PDFs do Registro de Classe Online do Paraná e entrega frequência, conteúdos e alunos em risco numa planilha pronta pro Power BI.',
        tipo: 'App desktop',
        stack: ['Python', 'pdfplumber', 'openpyxl', 'Tkinter'],
        status: 'Em produção',
        selo: 'EM PRODUÇÃO',
        repositorio: 'https://github.com/herickhoelscher/leitor_pdf_rco',
        problema:
          'O acompanhamento pedagógico abria, um por um, os PDFs de cada turma e disciplina para conferir frequência e conteúdo.',
        passos: [
          'Processa uma pasta inteira de PDFs de uma vez',
          'Extrai frequência, conteúdos, observações e cabeçalho',
          'Calcula a presença e classifica cada aluno: regular, em risco ou reprovado',
          'Exporta Excel com 3 abas, CSV e relatório em texto',
          'Modo apresentação que anonimiza alunos, escola e professor',
        ],
        fluxo: ['PASTA DE PDFs', 'EXTRAÇÃO', 'PRESENÇA %', 'EXCEL · CSV · TXT'],
        resultado:
          'Em uso em produção. O que levava horas de trabalho manual agora leva segundos.',
        resultadoGigante: 'HORAS → SEGUNDOS',
        resultadoFrase: 'e segue em uso em produção',
        capa: '/assets/issue-rco.jpg',
        foto: '/prints/leitor-rco-1.jpg',
      },
      {
        slug: 'agrovision',
        numero: '002',
        titulo: 'AGROVISION AI',
        gancho: 'uma câmera que responde perguntas',
        resumoCard:
          'Visão computacional em tempo real com YOLO e um agente de IA que explica o que a câmera viu. Roda com Claude ou Ollama.',
        resumoLongo:
          'Monitoramento com visão computacional em tempo real e um agente de IA que interpreta o que a câmera viu.',
        tipo: 'Sistema web com IA',
        stack: ['Python', 'FastAPI', 'OpenCV', 'YOLO', 'SQLite', 'Claude API', 'Ollama'],
        status: 'Laboratório de IA',
        selo: 'LABORATÓRIO DE IA',
        repositorio: 'https://github.com/herickhoelscher/Yolo-agent-llm',
        problema:
          'Câmera de monitoramento só grava. Alguém ainda precisa assistir, entender e decidir.',
        passos: [
          'Detecção de pessoas e veículos em tempo real com YOLO',
          'Cada evento salvo em SQLite com a imagem capturada',
          'Agente no chat que analisa os eventos e sugere a próxima ação',
          'Dois cérebros à escolha: Claude (API da Anthropic) ou Ollama local',
          'Dashboard com vídeo ao vivo e API em FastAPI',
        ],
        fluxo: ['CÂMERA', 'YOLO', 'SQLITE', 'AGENTE', 'CHAT'],
        resultado:
          'Projeto didático para cursos de ADS e Engenharia de Software, com guia de implantação passo a passo.',
        resultadoGigante: 'ASSISTIR → PERGUNTAR',
        resultadoFrase: 'projeto didático para cursos de ADS e Engenharia de Software',
        capa: '/assets/issue-agro.jpg',
        foto: '/prints/agrovision-1.jpg',
      },
      {
        slug: 'portal',
        numero: '003',
        titulo: 'PORTAL MULTICONTEÚDO',
        gancho: 'revista digital com painel próprio',
        resumoCard:
          'Matérias, Eventos, Imóveis e Vídeos, com Modo Revista de virada de página e painel administrativo.',
        resumoLongo:
          'Portal com cara de revista para Matérias, Eventos, Imóveis e Vídeos, com painel administrativo e dados que se atualizam sozinhos.',
        tipo: 'Portal + painel',
        stack: [
          'Next.js 16',
          'TypeScript',
          'Tailwind v4',
          'Framer Motion',
          'PostgreSQL',
          'Prisma',
          'JWT',
        ],
        status: 'Cliente',
        selo: 'CLIENTE',
        repositorio: 'https://github.com/herickhoelscher/QTAL',
        problema:
          'O cliente precisava publicar quatro tipos de conteúdo com autonomia, sem depender de desenvolvedor a cada post.',
        passos: [
          'Site com as quatro frentes e Modo Revista em tela cheia com virada de página',
          'Painel com login, papéis de acesso e upload de mídia',
          'Barra com clima, dólar e custo do m² atualizados sozinhos, com cache e plano B',
          'Dados em PostgreSQL com Prisma',
        ],
        fluxo: ['PAINEL', 'BANCO', 'SITE', 'MODO REVISTA'],
        resultado: 'Pronto para deploy na Vercel com Cloudflare na frente.',
        resultadoGigante: 'DEPENDER DO DEV → PUBLICAR SOZINHO',
        resultadoFrase: 'pronto para deploy na Vercel',
        capa: '/assets/issue-qtal.jpg',
        foto: '/prints/portal-1.jpg',
        site: 'https://qtal-production.up.railway.app/',
        autorizacao: 'Pedir autorização do cliente antes de citar o nome ou mostrar prints.',
      },
      {
        slug: 'maqcenter',
        numero: '004',
        titulo: 'MAQCENTER',
        gancho: 'migrar sem perder o Google',
        resumoCard:
          'Crawler em Python audita o site antigo, gera os redirecionamentos 301 e o novo site nasce em Next.js com loja e painel.',
        resumoLongo:
          'Reconstrução do site de uma locadora de equipamentos e assistência técnica que rodava em OpenCart.',
        tipo: 'Migração + loja',
        stack: [
          'Python',
          'BeautifulSoup',
          'Next.js 16',
          'TypeScript',
          'Tailwind',
          'Prisma',
          'Turso',
          'Mercado Pago',
        ],
        status: 'Em andamento',
        selo: 'EM ANDAMENTO',
        repositorio: 'https://github.com/herickhoelscher/Maqcenter',
        problema:
          'Site antigo em OpenCart, difícil de manter, com páginas que o Google já conhecia.',
        passos: [
          'Crawler em Python que audita o site inteiro: SEO, páginas órfãs, imagens e formulários',
          'Extração do conteúdo de cada página para a migração',
          'Mapa de redirecionamentos 301 de cada URL antiga',
          'Novo site em Next.js com catálogo de locação, loja com Mercado Pago e painel',
        ],
        fluxo: ['SITE ANTIGO', 'CRAWLER', '301', 'NEXT.JS'],
        resultado: 'Em andamento.',
        resultadoGigante: 'OPENCART → NEXT.JS',
        resultadoFrase: 'em andamento',
        capa: '/assets/issue-maq.jpg',
        foto: '/prints/maqcenter-1.jpg',
        site: 'https://www.maqcentercascavel.com.br/',
        autorizacao: 'Pedir autorização do cliente.',
      },
      {
        slug: 'ecommerce',
        numero: '005',
        titulo: 'E-COMMERCE BR',
        gancho: 'do carrinho ao boleto',
        resumoCard:
          'Frete real, Pix, cartão e boleto confirmados por webhook, controle de estoque, login com Google e painel.',
        resumoLongo:
          'Loja virtual completa para o mercado brasileiro, com frete real e Pix, cartão e boleto.',
        tipo: 'Loja virtual',
        stack: [
          'Next.js 16',
          'TypeScript',
          'PostgreSQL',
          'Prisma',
          'NextAuth',
          'Mercado Pago',
          'Melhor Envio',
          'Cloudinary',
        ],
        status: 'Projeto próprio',
        selo: 'PROJETO PRÓPRIO',
        repositorio: 'https://github.com/herickhoelscher/ecommerce',
        problema:
          'Loja brasileira precisa de frete calculado de verdade, Pix e boleto, e um painel que o dono consiga usar.',
        passos: [
          'Catálogo, carrinho e controle de estoque',
          'Frete real pelo Melhor Envio',
          'Pix, cartão e boleto pelo Mercado Pago, confirmados por webhook com assinatura',
          'Login com Google, e-mails transacionais e painel',
          'Testes com Vitest e Playwright',
        ],
        fluxo: ['CARRINHO', 'FRETE', 'PAGAMENTO', 'WEBHOOK', 'ESTOQUE'],
        resultado: 'Base pronta para virar a loja de qualquer cliente.',
        resultadoGigante: 'SÓ VITRINE → LOJA COMPLETA',
        resultadoFrase: 'base pronta para virar a loja de qualquer cliente',
        capa: '/assets/issue-ecommerce.jpg',
        foto: '/prints/ecommerce-1.jpg',
      },
      {
        slug: 'clientes',
        numero: '006',
        titulo: 'SITES DE CLIENTES',
        gancho: 'cinco clientes, cinco sites',
        resumoCard:
          'Landing pages e lojas sob medida para clínicas, consultorias e um ateliê artesanal.',
        resumoLongo:
          'Landing pages e lojas feitas sob medida para clínicas, consultorias e um ateliê artesanal.',
        tipo: 'Landing pages e lojas',
        stack: [
          'HTML',
          'CSS',
          'JavaScript',
          'Tailwind',
          'Cloudflare Workers',
          'Mercado Pago',
          'Meta Pixel',
          'GTM',
        ],
        status: 'Clientes',
        selo: 'CLIENTES',
        repositorio: null,
        problema:
          'Cada cliente precisa de um site sob medida, com performance bruta, SEO e carregamento instantâneo.',
        passos: [],
        fluxo: [],
        resultado: 'O próximo pode ser o seu.',
        resultadoGigante: 'TEMPLATE → SOB MEDIDA',
        resultadoFrase: 'o próximo pode ser o seu',
        capa: '/assets/issue-sites.jpg',
        foto: '/prints/clientes-1.jpg',
        autorizacao: 'Pedir autorização de cada cliente para nome, logo e prints.',
        clientes: [
          {
            nome: 'SIPH',
            tag: 'PORTAL CORPORATIVO',
            descricao:
              'landing de agendamento com formulário validado, WhatsApp, Meta Pixel, Google Ads e integração de leads',
            foto: '/prints/clientes/siph.jpg',
            repo: 'https://github.com/herickhoelscher/Lp_Ship',
          },
          {
            nome: 'Dr. Adriano Tagarra',
            tag: 'SAÚDE & AGENDAMENTO',
            descricao: 'landing de emagrecimento com vídeo',
            foto: '/prints/clientes/adriano.jpg',
            repo: 'https://github.com/herickhoelscher/Lp_Dradriano',
          },
          {
            nome: 'Boss Finance',
            tag: 'FINANCE & B2B',
            descricao: 'financeiro terceirizado para clínicas',
            foto: '/prints/clientes/boss.jpg',
            site: 'https://www.bossmedical.com.br/',
            repo: 'https://github.com/herickhoelscher/Boss-finance',
          },
          {
            nome: 'ALPE Consultoria',
            tag: 'BPO FINANCEIRO',
            descricao: 'landing que saiu do WordPress e virou página estática',
            foto: '/prints/clientes/alpe.jpg',
            site: 'https://alpeconsultoria.com.br/',
          },
          {
            nome: 'Begônia Ateliê',
            tag: 'CATÁLOGO & LOJA',
            descricao: 'vitrine e loja de crochê com Pix e cartão, em Cloudflare Workers',
            foto: '/prints/clientes/begonia.jpg',
            site: 'https://begonia-atelie.begoniaatelie.workers.dev/',
            repo: 'https://github.com/herickhoelscher/Begonia-atelie',
          },
        ],
      },
    ],
  },

  projeto: {
    voltar: '← VOLTAR PRAS ISSUES',
    tipo: 'TIPO',
    stack: 'STACK',
    status: 'STATUS',
    codigo: 'CÓDIGO',
    problema: 'O PROBLEMA',
    oQueFiz: 'O QUE EU FIZ',
    print: 'print do projeto',
    todas: '← todas as issues',
    proxima: 'PRÓXIMA',
    notaMissi: 'a Missi aprovou. milagre.',
  },

  setlist: {
    titulo: 'SETLIST',
    sub: 'a turnê até aqui',
    nota: 'clique numa faixa ↑',
    faixas: [
      {
        n: '01',
        faixa: 'CARIMBO E PLANILHA',
        detalhe:
          'Primeiro emprego aos 14, no administrativo. Aprendi a organizar o que ninguém queria organizar.',
      },
      {
        n: '02',
        faixa: 'ATRÁS DO BALCÃO',
        detalhe: 'Varejo. Atender gente, resolver problema na hora e não perder a calma.',
      },
      {
        n: '03',
        faixa: 'JÁ TENTOU REINICIAR?',
        detalhe:
          'Estágio de suporte no Biopark Educação: chamados no GLPI, Chromebooks, Active Directory, Microsoft 365 e plataformas educacionais.',
      },
      {
        n: '04',
        faixa: 'SALA DO SERVIDOR',
        detalhe:
          'Auxiliar de TI no Biopark: switches, firewall, Intune e Autopilot. E o começo do código de verdade: o Leitor RCO, scripts de remediação em PowerShell, deploy de softwares nos laboratórios, onboarding de alunos via CSV e runbooks.',
      },
      {
        n: '05',
        faixa: 'HELLO WORLD (REMIX)',
        detalhe:
          'Freelas e a Farol.dev com três amigos: landing pages, lojas, portais e automações com n8n e a API da Claude.',
      },
      {
        n: '06',
        faixa: 'FORMATURA',
        detalhe:
          'Análise e Desenvolvimento de Sistemas concluída. Pós em IA, Automação e IoT em andamento.',
      },
      {
        n: 'BIS',
        faixa: '???',
        detalhe: 'A próxima faixa ainda não tem nome. Tem uma ideia? Bora conversar.',
      },
    ],
  },

  flip: {
    tag: 'TRANSIÇÃO DE FAIXA',
    titulo: 'ISSO FOI O LADO A.',
    texto:
      'Quer conhecer o Herick fora do expediente? Música, animes, jogos, xadrez e os verdadeiros gerentes da casa.',
    botao: 'VIRAR O DISCO → LADO B',
    capa: {
      lados: 'LADO A / LADO B',
      nome: 'HERICK',
      sub: 'UNPLUGGED',
      rpm: '33 RPM',
      ano: '2026',
    },
  },

  ladob: {
    voltar: '← VOLTAR PRO LADO A',
    barra: 'HERICK HOELSCHER // LADO B',
    tag: '* o Herick fora do expediente *',
    kicker: 'RELAX // ANALOG // HOBBIES',
    titulo: 'LADO B',
    intro:
      'Sem reuniões, sem dockerfiles quebrando às 18h e sem commit de emergência. Apenas música alta na agulha, animes no talo, xadrez tático e a gerência indiscutível dos dois bichos da casa.',
    chips: ['VINYL 33⅓ RPM', 'STEREO HI-FI', 'CURADORIA MANUAL'],
    disco: { estereo: 'ESTÉREO', lado: 'LADO B', rpm: '33 RPM · 2026' },
    discoNota: {
      titulo: 'Mike (chefe) no intervalo',
      sub: 'Dormindo em cima da pilha de LPs',
    },
    colecao: {
      titulo: 'COLEÇÃO ANALÓGICA & RETRÔ',
      sub: 'fita magnética, cartuchos e fitas rebobinadas',
    },

    mixtape: {
      kicker: 'LADO B // CASSETTE TAPE',
      titulo: 'C-60 · PLAYLIST DA MADRUGADA',
      tipo: 'TYPE II / CrO2',
      side: 'SIDE B · 30 MIN',
      dolby: 'NO DOLBY NR',
      nota: '"gravações raras & fones altos"',
    },
    musicas: [
      {
        titulo: 'Comfortably Numb',
        artista: 'Pink Floyd',
        nota: 'o solo do final conserta qualquer dia ruim',
        spotifyId: '',
        duracao: '06:21',
      },
      {
        titulo: 'I Was Made For Lovin’ You',
        artista: 'KISS',
        nota: 'volume no máximo quando o deploy passa de primeira',
        spotifyId: '',
        duracao: '04:31',
      },
      {
        titulo: 'Aoi, Koi, Daidaiiro No Hi',
        artista: 'MASS OF THE FERMENTING DREGS',
        nota: 'a prova de que rock japonês é outro nível',
        spotifyId: '',
        duracao: '03:45',
      },
    ],

    vhs: {
      kicker: 'ESTANTE // ANALOG VIDEO',
      titulo: 'FITAS VHS · ANIMES',
      modo: 'SP MODE',
      texto:
        'Rótulos adesivos gastos pelo tempo. Sem ilustrações oficiais, apenas a estética crua de videolocadora underground e fitas gravadas da TV.',
      nota: '"Por favor, rebobine antes de devolver!"',
      fitas: [
        {
          vol: 'TAPE VOL. 01 · HI-FI STEREO',
          nome: 'ATTACK ON TITAN',
          selo: 'REBOBINADA',
          mood: 'red',
        },
        {
          vol: 'TAPE VOL. 02 · NTSC CH-03',
          nome: 'FRIEREN',
          selo: 'FAVORITA',
          mood: 'lav',
        },
        {
          vol: 'TAPE VOL. 03 · EP 01-10',
          nome: 'EDGERUNNERS',
          selo: 'OVERDRIVE',
          mood: 'neon',
        },
      ],
    },

    jogos: {
      kicker: '16-BIT / CONSOLE CORNER',
      titulo: 'CARTUCHOS DE JOGO',
      slot: 'SLOT 01',
      texto:
        'Cartuchos cinza com encaixes ranhurados e stickers de identificação. Soprar o conector ainda é boa prática.',
      rodape: 'SOPRO DE CONTATO: OK',
      nota: 'press start to continue',
      cartuchos: [
        { genero: 'RPG / TACTICS', nome: "BALDUR'S GATE 3", cart: 'CART. #0892' },
        { genero: 'SANDBOX / BLOCKS', nome: 'MINECRAFT', cart: 'CART. #0014' },
        { genero: 'MOBA / ARAM ONLY', nome: 'LEAGUE OF LEGENDS', cart: 'CART. #5521' },
        { genero: 'BRAWLER / ARENA', nome: 'BRAWLHALLA', cart: 'CART. #3319' },
      ],
    },

    xadrez: {
      kicker: 'TACTICS & GAMBITS',
      titulo: 'CHESS PLAYER',
      modo: 'RAPID & BLITZ',
      statusLabel: 'STATUS OFICIAL DE RATING:',
      rating: 'RATING: DEPENDE DA QUANTIDADE DE CAFÉ',
      nome: 'MISSI THE WITCH',
      desc: 'Gata Siamesa · Nível GM',
      notaTitulo: '"blunder tático da Missi"',
      notaTexto: 'Derrubou o rei adversário no lance 14. Vitória por W.O. felino.',
    },

    equipe: {
      kicker: 'BACKSTAGE // AUTORIDADE MÁXIMA',
      titulo: 'OS VERDADEIROS GERENTES',
      sub: 'Nada sobe para produção sem o carimbo ou o sono profundo da diretoria executiva de 4 patas.',
    },
    gerentes: [
      {
        passe: 'VIP BACKSTAGE',
        id: 'ID: 001-CANINE',
        fotoLabel: '[ foto do Mike ]',
        foto: '/assets/cracha-mike.jpg',
        especie: 'Poodle Preto · Headphone Red',
        nome: 'Mike Hoelscher',
        cargoLabel: 'CARGO EXECUTIVO',
        cargo: 'CHEFE DE RELAÇÕES HUMANAS // APROVA TUDO',
        frase: 'Se você tem petisco ou faz carinho, o código tá aprovado sem review.',
        status: 'STATUS: SONO REM',
        selo: '● APROVAÇÃO 100%',
      },
      {
        passe: 'GERÊNCIA SUPREMA',
        id: 'ID: 002-FELINE',
        fotoLabel: '[ foto da Missi ]',
        foto: '/assets/cracha-missi.jpg',
        especie: 'Siamesa · Chapéu de Bruxa',
        nome: 'Missi Hoelscher',
        cargoLabel: 'CARGO EXECUTIVO',
        cargo: 'DIRETORA DE QA & SEGURANÇA // REPROVA PRS',
        frase: 'Deita no teclado durante o deploy e derruba os testes unitários por puro capricho.',
        status: 'STATUS: VIGILÂNCIA MÁXIMA',
        selo: '● MERGE BLOQUEADO',
      },
    ],

    mural: {
      titulo: 'MURAL · o que eu salvo no Pinterest',
      tags: 'ARQUITETURA BRUTALISTA // POSTERS JAPONESES // CAFÉ // HARDWARE & VINTAGE',
      pins: [
        {
          titulo: 'CONCRETO BRUTO',
          sub: 'BERLIM ORIENTAL · 1974',
          pin: 'PIN #01 // ARCHITECTURE',
          texto: 'Formas sólidas, sombras duras e zero enfeite desnecessário.',
          tom: 'ink',
        },
        {
          kicker: 'OSAKA PRINT EXPO',
          titulo: '地下室',
          sub: 'UNDERGROUND',
          extra: 'SERIGRAFIA 2 CORES · LIMITED RUN',
          pin: 'PIN #02 // GRAPHIC DESIGN',
          texto: 'Composições verticais e tipografia em bloco inspiram cada detalhe visual.',
          tom: 'red',
        },
        {
          kicker: 'CHERRY MX BLUE',
          titulo: 'CLICK CLACK 1989',
          sub: 'CABO ESPIRALADO BEGE',
          pin: 'PIN #03 // HARDWARE',
          texto: 'Barulho tátil que dá ritmo ao raciocínio lógico.',
          tom: 'paper',
        },
        {
          kicker: 'HARIO V60 // 30g',
          titulo: 'CAFÉ FILTRADO',
          sub: 'TORRA MÉDIA · NOTAS DE CACAU',
          extra: 'COMBUSTÍVEL PRIMÁRIO DO LADO A E LADO B',
          pin: 'PIN #04 // RITUAIS',
          texto: 'O único ritual não negociável antes de qualquer linha ou disco.',
          tom: 'brown',
        },
      ],
    },

    fim: {
      kicker: '// FIM DA REPRODUÇÃO //',
      titulo: 'Pronto para voltar ao código e aos servidores?',
      texto:
        'O Lado B fica por aqui. Gire a bolacha de vinil para inspecionar os cases reais, scripts de infraestrutura e projetos no Lado A.',
      botao: 'VIRAR O DISCO DE NOVO → LADO A',
      conversar: 'ou bora conversar',
      marca: '33⅓',
    },

    rodape: {
      marca: 'HERICK HOELSCHER',
      sub: 'LADO B // UNPLUGGED',
      texto:
        "Feito à mão com café, ruído analógico, vinil e rock 'n' roll · Toledo / Oeste do Paraná · 2026",
    },
  },

  contato: {
    titulo: 'BORA CONVERSAR',
    sub: 'freela, vaga ou só pra falar de Frieren',
    email: 'ESCREVER UM EMAIL',
    cv: 'BAIXAR CV',
    ticket: 'ADMIT ONE · ENTRADA FRANCA',
    emailAddr: 'herickneumann4@gmail.com',
    github: 'https://github.com/herickhoelscher',
    linkedin:
      'https://www.linkedin.com/in/herick-henrick-neumann-hoelscher-822906318',
    localizacao: 'Toledo / Oeste do Paraná',
  },

  footer: {
    left: 'feito com código, café e Pink Floyd no volume máximo',
    right: '© 2026 Herick Hoelscher',
    links: ['01 QUEM', '02 ISSUES', '03 SETLIST', '04 CONTATO', 'LADO B ↻'],
  },

  erro404: {
    texto: 'A Missi derrubou essa página da mesa.',
    botao: 'voltar pro início',
  },

  carregando: 'a Missi está procurando a página...',
}
