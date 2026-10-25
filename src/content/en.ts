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
    titulo: 'WHO IS THIS GUY?',
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
    titulo: 'ISSUES',
    sub: '6 issues. Open source on GitHub.',
    verMais: 'SEE MORE →',
    lista: [
      {
        slug: 'leitor-rco',
        numero: '001',
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
        autorizacao: 'Authorization required from each client for name, logo and screenshots.',
        clientes: [
          'SIPH: booking landing page with validated form, WhatsApp, Meta Pixel, Google Ads and lead integration',
          'Dr. Adriano Tagarra: weight-loss landing page with video',
          'Empreender com Pilates (Dra. Vanessa Meira): live, with a post-purchase thank-you page',
          'Boss Finance: outsourced finance for clinics',
          'Begônia Ateliê: crochet showcase and store with Pix and card, on Cloudflare Workers',
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
    titulo: 'THAT WAS SIDE A.',
    texto:
      'Want to meet Herick after hours? Music, anime, games, chess and the real managers of the house.',
    botao: 'FLIP THE RECORD → SIDE B',
  },

  ladob: {
    titulo: 'SIDE B',
    sub: 'what plays when the code compiles',
    voltar: '← BACK TO SIDE A',
    barra: 'HERICK HOELSCHER // SIDE B',
    abertura: 'Herick after hours',
    equipe: 'THE REAL MANAGERS',
    virarDeNovo: 'FLIP IT BACK → SIDE A',
    conversar: "or let's talk",
    musicas: [
      {
        titulo: 'Comfortably Numb',
        artista: 'Pink Floyd',
        nota: 'that last solo fixes any bad day',
        spotifyId: '',
      },
      {
        titulo: 'I Was Made For Lovin’ You',
        artista: 'KISS',
        nota: 'max volume when the deploy passes first try',
        spotifyId: '',
      },
      {
        titulo: 'Aoi, Koi, Daidaiiro No Hi',
        artista: 'MASS OF THE FERMENTING DREGS',
        nota: 'proof that Japanese rock is another level',
        spotifyId: '',
      },
    ],
    animes: {
      lista: ['Attack on Titan', 'Frieren', 'Cyberpunk: Edgerunners'],
      nota: 'hover a tape',
    },
    jogos: {
      lista: ["Baldur's Gate 3", 'Minecraft', 'League of Legends', 'Brawlhalla'],
      nota: 'and any co-op with a free slot',
    },
    xadrez: {
      titulo: 'CHESS PLAYER',
      rating: 'RATING: DEPENDS ON HOW MUCH COFFEE',
    },
    mural: 'what I save on Pinterest',
    gerentes: [
      {
        nome: 'MIKE',
        cargo: 'Emotional support, tier 1',
        frase: 'Never closed a ticket, but everyone leaves happy.',
        foto: '/assets/cracha-mike.jpg',
      },
      {
        nome: 'MISSI',
        cargo: 'Senior Code Reviewer',
        frase: 'Rejected 100% of PRs.',
        foto: '/assets/cracha-missi.jpg',
      },
    ],
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
