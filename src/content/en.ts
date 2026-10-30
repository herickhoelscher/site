import type { Content } from './types'

/** Fonte única de texto em EN, transcrita de referencias/docs/CONTEUDO.md. */
export const en: Content = {
  lang: 'en',
  htmlLang: 'en',

  nav: {
    quem: '01 WHO',
    issues: '02 ISSUES',
    setlist: '03 SETLIST',
    contato: '04 CONTACT',
    ladob: 'SIDE B ↻',
    lang: 'PT / EN',
  },

  hero: {
    name: 'HERICK',
    sticker: '*HERICK HOELSCHER',
    tagline: 'full-stack dev who walked out of the server room',
    scroll: 'SCROLL ↓',
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
    titulo: 'WHO AM I?',
    bio: [
      'I started working at 14, stamping paper and building spreadsheets. Then came the retail counter, then IT support, and then the server room: networks, firewalls, Microsoft 365 and a lot of scripts so nobody had to repeat manual work.',
      'That is where I found out what I actually love: taking a boring process and turning it into code. Today I do that with websites, online stores, systems and automations, from landing pages to AI agents.',
      'Systems Analysis and Development graduate, now doing a postgrad in AI, Automation and IoT. I live in western Paraná, Brazil, with Mike and Missi, who review my code very strictly.',
    ],
    stack: ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE', 'PYTHON', 'POSTGRES', 'FLUTTER', 'N8N'],
    infra: 'and one foot in infra: Linux, Docker, PowerShell, Intune',
    notas: {
      comecei: 'started at 14 ↓',
      missi: "that's Missi. she rejects PRs.",
      mike: 'Mike approves everything',
    },
  },

  issues: {
    tag: 'ZINE CATALOG // DISPATCHED WORKS',
    titulo: 'ISSUES',
    sub: '6 issues with real projects. Open source on GitHub, in production and in the lab.',
    verMais: 'READ THE ISSUE →',
    verSite: 'VISIT THE SITE ↗',
    verCodigo: 'SEE THE CODE ↗',
    lineup: {
      tag: 'ISSUE #006 // CLIENT LINEUP',
      titulo: 'CLIENT SITES, LIVE',
      frase: 'Independent production, high fidelity',
    },
    parceiros: {
      titulo: 'PARTNER AGENCIES',
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
        tempo: 'TIME: HOURS → SECONDS',
        titulo: 'LEITOR RCO',
        gancho: 'no PDF survived',
        resumoCard:
          "Desktop app that reads whole folders of PDFs from Paraná's online class register and delivers attendance, lesson content and at-risk students in a spreadsheet ready for Power BI.",
        resumoLongo:
          "Desktop app that reads whole folders of PDFs from Paraná's online class register and delivers attendance, lesson content and at-risk students in a spreadsheet ready for Power BI.",
        tipo: 'Desktop app',
        stack: ['Python', 'pdfplumber', 'openpyxl', 'Tkinter'],
        status: 'In production',
        selo: 'IN PRODUCTION',
        repositorio: 'https://github.com/herickhoelscher/leitor_pdf_rco',
        problema:
          'The teaching staff opened every class PDF one by one to check attendance and content.',
        passos: [
          'Processes a whole folder of PDFs at once',
          'Extracts attendance, content, notes and header',
          'Calculates attendance and flags each student: regular, at risk or failing',
          'Exports a 3-tab Excel file, CSV and a text report',
          'Presentation mode that anonymizes students, school and teacher',
        ],
        fluxo: ['PDF FOLDER', 'EXTRACTION', 'ATTENDANCE %', 'EXCEL · CSV · TXT'],
        resultado: 'In production. Hours of manual work now take seconds.',
        resultadoGigante: 'HOURS → SECONDS',
        resultadoFrase: 'and still running in production',
        capa: '/assets/issue-rco.jpg',
        foto: '/prints/leitor-rco-1.jpg',
      },
      {
        slug: 'agrovision',
        numero: '002',
        titulo: 'AGROVISION AI',
        gancho: 'a camera that answers questions',
        resumoCard:
          'Real-time computer vision with YOLO and an AI agent that explains what the camera saw. Runs on Claude or Ollama.',
        resumoLongo:
          'Real-time computer vision monitoring plus an AI agent that explains what the camera saw.',
        tipo: 'AI web system',
        stack: ['Python', 'FastAPI', 'OpenCV', 'YOLO', 'SQLite', 'Claude API', 'Ollama'],
        status: 'AI lab',
        selo: 'AI LAB',
        repositorio: 'https://github.com/herickhoelscher/Yolo-agent-llm',
        problema:
          'Security cameras only record. Someone still has to watch, understand and decide.',
        passos: [
          'Real-time people and vehicle detection with YOLO',
          'Every event stored in SQLite with its snapshot',
          'Chat agent that analyzes events and suggests the next action',
          'Two brains to choose from: Claude (Anthropic API) or local Ollama',
          'Dashboard with live video and a FastAPI backend',
        ],
        fluxo: ['CAMERA', 'YOLO', 'SQLITE', 'AGENT', 'CHAT'],
        resultado: 'Teaching project for software courses, with a step-by-step deployment guide.',
        resultadoGigante: 'WATCH → ASK',
        resultadoFrase: 'teaching project for software courses',
        capa: '/assets/issue-agro.jpg',
        foto: '/prints/agrovision-1.jpg',
      },
      {
        slug: 'portal',
        numero: '003',
        titulo: 'PORTAL MULTICONTEÚDO',
        gancho: 'a digital magazine with its own admin',
        resumoCard:
          'Articles, Events, Real Estate and Videos, with a page-flip Magazine Mode and an admin panel.',
        resumoLongo:
          'Magazine-style portal for articles, events, real estate and videos, with an admin panel and self-updating data.',
        tipo: 'Portal + admin',
        stack: [
          'Next.js 16',
          'TypeScript',
          'Tailwind v4',
          'Framer Motion',
          'PostgreSQL',
          'Prisma',
          'JWT',
        ],
        status: 'Client',
        selo: 'CLIENT',
        repositorio: 'https://github.com/herickhoelscher/QTAL',
        problema:
          'The client needed to publish four content types on their own, without a developer for every post.',
        passos: [
          'Site with all four sections and a full-screen page-flip Magazine Mode',
          'Admin with login, roles and media upload',
          'Weather, dollar and cost-per-m² bar that updates itself, with cache and fallback',
          'PostgreSQL data with Prisma',
        ],
        fluxo: ['ADMIN', 'DATABASE', 'SITE', 'MAGAZINE MODE'],
        resultado: 'Ready to deploy on Vercel behind Cloudflare.',
        resultadoGigante: 'WAIT FOR THE DEV → PUBLISH ALONE',
        resultadoFrase: 'ready to deploy on Vercel',
        capa: '/assets/issue-qtal.jpg',
        foto: '/prints/portal-1.jpg',
        site: 'https://qtal-production.up.railway.app/',
        autorizacao: 'Client authorization required before naming them or showing screenshots.',
      },
      {
        slug: 'maqcenter',
        numero: '004',
        titulo: 'MAQCENTER',
        gancho: 'migrating without losing Google',
        resumoCard:
          'A Python crawler audits the old site, builds the 301 redirects, and the new site is born in Next.js with a store and admin.',
        resumoLongo:
          'Rebuilding the website of an equipment rental and repair shop that ran on OpenCart.',
        tipo: 'Migration + store',
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
        status: 'In progress',
        selo: 'IN PROGRESS',
        repositorio: 'https://github.com/herickhoelscher/Maqcenter',
        problema: 'An old OpenCart site, hard to maintain, with pages Google already indexed.',
        passos: [
          'Python crawler that audits the whole site: SEO, orphan pages, images and forms',
          'Content extraction for every page',
          '301 redirect map for every old URL',
          'New Next.js site with rental catalog, Mercado Pago store and admin',
        ],
        fluxo: ['OLD SITE', 'CRAWLER', '301', 'NEXT.JS'],
        resultado: 'In progress.',
        resultadoGigante: 'OPENCART → NEXT.JS',
        resultadoFrase: 'in progress',
        capa: '/assets/issue-maq.jpg',
        foto: '/prints/maqcenter-1.jpg',
        site: 'https://www.maqcentercascavel.com.br/',
        autorizacao: 'Client authorization required.',
      },
      {
        slug: 'ecommerce',
        numero: '005',
        titulo: 'E-COMMERCE BR',
        gancho: 'from cart to boleto',
        resumoCard:
          'Real shipping quotes, Pix, card and boleto confirmed by webhook, stock control, Google login and admin.',
        resumoLongo:
          'Full online store for the Brazilian market, with real shipping quotes and Pix, card and boleto payments.',
        tipo: 'Online store',
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
        status: 'Side project',
        selo: 'SIDE PROJECT',
        repositorio: 'https://github.com/herickhoelscher/ecommerce',
        problema:
          'A Brazilian store needs real shipping quotes, Pix and boleto, and an admin the owner can actually use.',
        passos: [
          'Catalog, cart and stock control',
          'Real shipping quotes via Melhor Envio',
          'Pix, card and boleto via Mercado Pago, confirmed by signed webhook',
          'Google login, transactional emails and admin',
          'Tests with Vitest and Playwright',
        ],
        fluxo: ['CART', 'SHIPPING', 'PAYMENT', 'WEBHOOK', 'STOCK'],
        resultado: "A base ready to become any client's store.",
        resultadoGigante: 'JUST A SHOWCASE → FULL STORE',
        resultadoFrase: "a base ready to become any client's store",
        capa: '/assets/issue-ecommerce.jpg',
        foto: '/prints/ecommerce-1.jpg',
      },
      {
        slug: 'clientes',
        numero: '006',
        titulo: 'CLIENT SITES',
        gancho: 'five clients, five sites',
        resumoCard: 'Custom landing pages and stores for clinics, consultancies and a handmade studio.',
        resumoLongo:
          'Custom landing pages and stores for clinics, consultancies and a handmade studio.',
        tipo: 'Landing pages and stores',
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
        status: 'Clients',
        selo: 'CLIENTS',
        repositorio: null,
        problema:
          'Every client needs a tailor-made site, with raw performance, SEO and instant loading.',
        passos: [],
        fluxo: [],
        resultado: 'The next one could be yours.',
        resultadoGigante: 'TEMPLATE → TAILOR-MADE',
        resultadoFrase: 'the next one could be yours',
        capa: '/assets/issue-sites.jpg',
        foto: '/prints/clientes-1.jpg',
        autorizacao: 'Authorization required from each client for name, logo and screenshots.',
        clientes: [
          {
            nome: 'SIPH',
            tag: 'CORPORATE PORTAL',
            descricao:
              'booking landing page with validated form, WhatsApp, Meta Pixel, Google Ads and lead integration',
            foto: '/prints/clientes/siph.jpg',
            repo: 'https://github.com/herickhoelscher/Lp_Ship',
          },
          {
            nome: 'Dr. Adriano Tagarra',
            tag: 'HEALTH & BOOKING',
            descricao: 'weight-loss landing page with video',
            foto: '/prints/clientes/adriano.jpg',
            repo: 'https://github.com/herickhoelscher/Lp_Dradriano',
          },
          {
            nome: 'Boss Finance',
            tag: 'FINANCE & B2B',
            descricao: 'outsourced finance for clinics',
            foto: '/prints/clientes/boss.jpg',
            site: 'https://www.bossmedical.com.br/',
            repo: 'https://github.com/herickhoelscher/Boss-finance',
          },
          {
            nome: 'ALPE Consultoria',
            tag: 'FINANCIAL BPO',
            descricao: 'landing page moved off WordPress into a fast static page',
            foto: '/prints/clientes/alpe.jpg',
            site: 'https://alpeconsultoria.com.br/',
          },
          {
            nome: 'Begônia Ateliê',
            tag: 'CATALOG & STORE',
            descricao: 'crochet showcase and store with Pix and card, on Cloudflare Workers',
            foto: '/prints/clientes/begonia.jpg',
            site: 'https://begonia-atelie.begoniaatelie.workers.dev/',
            repo: 'https://github.com/herickhoelscher/Begonia-atelie',
          },
        ],
      },
    ],
  },

  projeto: {
    voltar: '← BACK TO ISSUES',
    tipo: 'TYPE',
    stack: 'STACK',
    status: 'STATUS',
    codigo: 'CODE',
    problema: 'THE PROBLEM',
    oQueFiz: 'WHAT I BUILT',
    print: 'project screenshot',
    todas: '← all issues',
    proxima: 'NEXT',
    notaMissi: 'Missi approved. a miracle.',
  },

  setlist: {
    titulo: 'SETLIST',
    sub: 'the tour so far',
    nota: 'click a track ↑',
    faixas: [
      {
        n: '01',
        faixa: 'STAMPS & SPREADSHEETS',
        detalhe:
          'First job at 14, in an office. Learned to organize what nobody wanted to organize.',
      },
      {
        n: '02',
        faixa: 'BEHIND THE COUNTER',
        detalhe: 'Retail. Helping people, fixing problems on the spot and keeping calm.',
      },
      {
        n: '03',
        faixa: 'HAVE YOU TRIED RESTARTING?',
        detalhe:
          'IT support internship at Biopark Educação: GLPI tickets, Chromebooks, Active Directory, Microsoft 365 and education platforms.',
      },
      {
        n: '04',
        faixa: 'THE SERVER ROOM',
        detalhe:
          'IT assistant at Biopark: switches, firewall, Intune and Autopilot. And where real code started: the RCO Reader, PowerShell remediation scripts, lab software deployment, CSV student onboarding and runbooks.',
      },
      {
        n: '05',
        faixa: 'HELLO WORLD (REMIX)',
        detalhe:
          'Freelancing and Farol.dev with three friends: landing pages, stores, portals and automations with n8n and the Claude API.',
      },
      {
        n: '06',
        faixa: 'GRADUATION',
        detalhe:
          'Systems Analysis and Development degree done. Postgrad in AI, Automation and IoT in progress.',
      },
      {
        n: 'BIS',
        faixa: '???',
        detalhe: "The next track has no name yet. Got an idea? Let's talk.",
      },
    ],
  },

  flip: {
    tag: 'TRACK TRANSITION',
    titulo: 'THAT WAS SIDE A.',
    texto:
      'Want to meet Herick after hours? Music, anime, games, chess and the real managers of the house.',
    botao: 'FLIP THE RECORD → SIDE B',
    capa: {
      lados: 'SIDE A / SIDE B',
      nome: 'HERICK',
      sub: 'UNPLUGGED',
      rpm: '33 RPM',
      ano: '2026',
    },
  },

  ladob: {
    voltar: '← BACK TO SIDE A',
    barra: 'HERICK HOELSCHER // SIDE B',
    tag: '* Herick after hours *',
    kicker: 'RELAX // ANALOG // HOBBIES',
    titulo: 'SIDE B',
    intro:
      'No meetings, no dockerfiles breaking at 6pm, no emergency commits. Just loud music on the needle, anime at full blast, tactical chess and the undisputed management of the two animals of the house.',
    chips: ['VINYL 33⅓ RPM', 'STEREO HI-FI', 'HAND-PICKED'],
    disco: { estereo: 'STEREO', lado: 'SIDE B', rpm: '33 RPM · 2026' },
    discoNota: {
      titulo: 'Mike (the boss) on his break',
      sub: 'Asleep on top of the LP pile',
    },
    colecao: {
      titulo: 'ANALOG & RETRO COLLECTION',
      sub: 'magnetic tape, cartridges and rewound reels',
    },

    mixtape: {
      kicker: 'SIDE B // CASSETTE TAPE',
      titulo: 'C-60 · LATE NIGHT PLAYLIST',
      tipo: 'TYPE II / CrO2',
      side: 'SIDE B · 30 MIN',
      dolby: 'NO DOLBY NR',
      nota: '"rare recordings & loud headphones"',
    },
    musicas: [
      {
        titulo: 'Comfortably Numb',
        artista: 'Pink Floyd',
        nota: 'that last solo fixes any bad day',
        spotifyId: '',
        duracao: '06:21',
      },
      {
        titulo: 'I Was Made For Lovin’ You',
        artista: 'KISS',
        nota: 'max volume when the deploy passes first try',
        spotifyId: '',
        duracao: '04:31',
      },
      {
        titulo: 'Aoi, Koi, Daidaiiro No Hi',
        artista: 'MASS OF THE FERMENTING DREGS',
        nota: 'proof that Japanese rock is another level',
        spotifyId: '',
        duracao: '03:45',
      },
    ],

    vhs: {
      kicker: 'SHELF // ANALOG VIDEO',
      titulo: 'VHS TAPES · ANIME',
      modo: 'SP MODE',
      texto:
        'Sticker labels worn down by time. No official artwork, just the raw look of an underground rental shop and tapes recorded off TV.',
      nota: '"Please rewind before returning!"',
      fitas: [
        {
          vol: 'TAPE VOL. 01 · HI-FI STEREO',
          nome: 'ATTACK ON TITAN',
          selo: 'REWOUND',
          mood: 'red',
        },
        {
          vol: 'TAPE VOL. 02 · NTSC CH-03',
          nome: 'FRIEREN',
          selo: 'FAVOURITE',
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
      titulo: 'GAME CARTRIDGES',
      slot: 'SLOT 01',
      texto:
        'Grey cartridges with ridged slots and ID stickers. Blowing into the connector is still good practice.',
      rodape: 'CONTACT BLOW: OK',
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
      statusLabel: 'OFFICIAL RATING STATUS:',
      rating: 'RATING: DEPENDS ON HOW MUCH COFFEE',
      nome: 'MISSI THE WITCH',
      desc: 'Siamese cat · GM level',
      notaTitulo: '"Missi\'s tactical blunder"',
      notaTexto: 'Knocked the opponent king over on move 14. Win by feline walkover.',
    },

    equipe: {
      kicker: 'BACKSTAGE // HIGHEST AUTHORITY',
      titulo: 'THE REAL MANAGERS',
      sub: 'Nothing ships without the stamp, or the deep sleep, of the four-pawed executive board.',
    },
    gerentes: [
      {
        passe: 'VIP BACKSTAGE',
        id: 'ID: 001-CANINE',
        fotoLabel: '[ photo of Mike ]',
        foto: '/assets/cracha-mike.jpg',
        especie: 'Black Poodle · Red Headphones',
        nome: 'Mike Hoelscher',
        cargoLabel: 'EXECUTIVE ROLE',
        cargo: 'HEAD OF HUMAN RELATIONS // APPROVES EVERYTHING',
        frase: 'If you have a treat or a scratch, the code is approved without review.',
        status: 'STATUS: REM SLEEP',
        selo: '● 100% APPROVAL',
      },
      {
        passe: 'SUPREME MANAGEMENT',
        id: 'ID: 002-FELINE',
        fotoLabel: '[ photo of Missi ]',
        foto: '/assets/cracha-missi.jpg',
        especie: 'Siamese · Wizard Hat',
        nome: 'Missi Hoelscher',
        cargoLabel: 'EXECUTIVE ROLE',
        cargo: 'DIRECTOR OF QA & SECURITY // REJECTS PRS',
        frase: 'Lies on the keyboard during the deploy and knocks over the unit tests out of pure spite.',
        status: 'STATUS: MAXIMUM VIGILANCE',
        selo: '● MERGE BLOCKED',
      },
    ],

    mural: {
      titulo: 'BOARD · what I save on Pinterest',
      tags: 'BRUTALIST ARCHITECTURE // JAPANESE POSTERS // COFFEE // HARDWARE & VINTAGE',
      pins: [
        {
          titulo: 'RAW CONCRETE',
          sub: 'EAST BERLIN · 1974',
          pin: 'PIN #01 // ARCHITECTURE',
          texto: 'Solid shapes, hard shadows and zero unnecessary decoration.',
          tom: 'ink',
        },
        {
          kicker: 'OSAKA PRINT EXPO',
          titulo: '地下室',
          sub: 'UNDERGROUND',
          extra: '2-COLOUR SCREEN PRINT · LIMITED RUN',
          pin: 'PIN #02 // GRAPHIC DESIGN',
          texto: 'Vertical compositions and block type inspire every visual detail.',
          tom: 'red',
        },
        {
          kicker: 'CHERRY MX BLUE',
          titulo: 'CLICK CLACK 1989',
          sub: 'BEIGE COILED CABLE',
          pin: 'PIN #03 // HARDWARE',
          texto: 'Tactile noise that gives rhythm to logical thinking.',
          tom: 'paper',
        },
        {
          kicker: 'HARIO V60 // 30g',
          titulo: 'FILTER COFFEE',
          sub: 'MEDIUM ROAST · COCOA NOTES',
          extra: 'PRIMARY FUEL FOR SIDE A AND SIDE B',
          pin: 'PIN #04 // RITUALS',
          texto: 'The one non-negotiable ritual before any line of code or any record.',
          tom: 'brown',
        },
      ],
    },

    fim: {
      kicker: '// END OF PLAYBACK //',
      titulo: 'Ready to go back to the code and the servers?',
      texto:
        'Side B ends here. Spin the vinyl to go inspect the real cases, infrastructure scripts and projects on Side A.',
      botao: 'FLIP IT BACK → SIDE A',
      conversar: "or let's talk",
      marca: '33⅓',
    },

    rodape: {
      marca: 'HERICK HOELSCHER',
      sub: 'SIDE B // UNPLUGGED',
      texto:
        "Handmade with coffee, analog noise, vinyl and rock 'n' roll · Toledo / Western Paraná, Brazil · 2026",
    },
  },

  contato: {
    titulo: "LET'S TALK",
    sub: 'freelance, a job, or just to talk about Frieren',
    email: 'SEND AN EMAIL',
    cv: 'DOWNLOAD CV',
    ticket: 'ADMIT ONE · FREE ENTRY',
    emailAddr: 'herickneumann4@gmail.com',
    github: 'https://github.com/herickhoelscher',
    linkedin: 'https://www.linkedin.com/in/herick-henrick-neumann-hoelscher-822906318',
    localizacao: 'Toledo / Western Paraná, Brazil',
  },

  footer: {
    left: 'made with code, coffee and Pink Floyd at full volume',
    right: '© 2026 Herick Hoelscher',
    links: ['01 WHO', '02 ISSUES', '03 SETLIST', '04 CONTACT', 'SIDE B ↻'],
  },

  erro404: {
    texto: 'Missi knocked this page off the table.',
    botao: 'back to the start',
  },

  carregando: 'Missi is looking for the page...',
}
