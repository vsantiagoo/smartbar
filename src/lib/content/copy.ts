/**
 * TEXTOS EDITÁVEIS do produto — um único lugar para ajustar a voz da marca.
 *
 * Tom (Brandbook): profissional, direto, orientado a resultado, empático com a
 * operação. Sem jargão técnico. Cada bloco abaixo alimenta uma SEÇÃO de tela;
 * para reescrever uma seção, edite aqui sem tocar nos componentes.
 */

/* Textos do Web App do Hóspede: src/lib/i18n/guest.ts (português, inglês e espanhol). */

export const adminCopy = {
  dashboard: {
    title: "Visão geral",
    subtitle: "Faturamento do minibar em tempo real",
    live: "Ao vivo",
    demo: "Modo demonstração",
    feedTitle: "Últimas vendas aprovadas",
    feedHint: "Atualiza sozinho a cada compra concluída pelo hóspede.",
    feedEmpty: "Nenhuma venda aprovada hoje ainda.",
  },
  rooms: {
    title: "Quartos",
    subtitle: "Status do frigobar, consumo da estadia e valores para o check-out.",
    searchPlaceholder: "Buscar por número do quarto ou hóspede…",
  },
  restock: {
    title: "Reposição",
    subtitle: "Quartos que precisam de itens. Confirme após repor para atualizar o estoque.",
    empty: "Tudo em ordem. Nenhum quarto precisa de reposição.",
  },
} as const;

/**
 * Site público (landing) — src/app/page.tsx.
 * Estilo de referência: Orbit (glassmorfismo, hero em vídeo, telas que
 * acompanham o scroll). Números vêm do Plano de Negócios / PRD; são
 * referência de mercado, não medições de um cliente específico.
 */
export const marketingCopy = {
  nav: [
    { id: "inicio", label: "Início" },
    { id: "como-funciona", label: "Como funciona" },
    { id: "resultados", label: "Resultados" },
    { id: "planos", label: "Planos" },
    { id: "explorar", label: "Explorar" },
  ],
  header: {
    cta: "Login",
    ctaShort: "Login",
  },
  hero: {
    eyebrow: "Minibar inteligente · Pix ou cartão-chave",
    /* As quebras de linha (\n) são propositais — ver `whitespace-pre-line` em hero.tsx. */
    title: "A tecnologia do consumo\nsem atrito.",
    subtitle:
      "Pagamento instantâneo. Liberação imediata.\nControle total para o hotel. Zero prejuízo para a operação.",
    primaryCta: "Explorar vitrine do hóspede",
    secondaryCta: "Explorar painel de gestão",
    scrollHint: "Role para ver como funciona",
  },
  /** Declaração da marca, sozinha na tela clara entre o hero e o "Como funciona". */
  statement: {
    title: "A trava só abre",
    titleAccent: "depois que o consumo está pago.",
  },
  story: {
    eyebrow: "DO QUARTO AO CAIXA, SEM ATRITO",
    signLabel: "SMARTBAR · MINIBAR INTELIGENTE",
    title: "Entre o consumo",
    titleAccent: "e o pagamento garantido.",
    subtitle:
      "O consumo do hóspede vira receita registrada. Sem conferência no check-out, sem perda de estoque, sem cobrança surpresa.",
    cards: [
      { n: "01", icon: "qr", title: "O hóspede escolhe no celular", text: "Um QR Code por quarto, sem app." },
      { n: "02", icon: "lock", title: "Paga e destrava.", text: "Pix ou cartão-chave em segundos." },
      { n: "03", icon: "stock", title: "Estoque atualiza.", text: "Baixa automática, painel em tempo real." },
    ],
  },
  stats: {
    kicker: "Resultados de referência",
    title: "De 22% de perda.",
    titleAccent: "Para menos de 1%.",
    subtitle: "Média de referência do setor para operações tradicionais.",
    items: [
      { value: "-95%", label: "Perda de estoque (shrinkage)" },
      { value: "75%", label: "Mais rápido no check-out" },
      { value: "60%", label: "Menos tempo de governança" },
      { value: "60×", label: "Mais barato que vending machines" },
    ],
  },
  /**
   * Planos — Plano de Negócios, seções 6 a 9.
   *
   * A matriz original cruza 5 perfis de cliente × 3 módulos. Uma tabela dessas
   * na landing afasta em vez de vender, então ela virou UM seletor de perfil
   * que troca só os preços dos três cards: o visitante vê o valor dele, e o
   * desconto por porte fica evidente ao trocar de aba.
   *
   * `segments[].prices` segue SEMPRE a ordem de `tiers` (Básico, Plus, Premium).
   */
  plans: {
    kicker: "Planos",
    title: "Do tradicional ao digital: transforme a experiência do seu hóspede!",
    subtitle: "O preço acompanha o porte da operação. Escolha o seu perfil para ver os valores.",
    segmentLabel: "Perfil da operação",
    segments: [
      {
        id: "anfitriao",
        label: "Airbnb / anfitrião",
        note: "Até 15 imóveis",
        unit: "/imóvel/mês",
        prices: [
          { price: "R$ 14,90", minimum: "mínimo R$ 149/mês" },
          { price: "R$ 24,90", minimum: "mínimo R$ 249/mês" },
          { price: "R$ 39,90", minimum: "mínimo R$ 490/mês" },
        ],
      },
      {
        id: "temporada",
        label: "Temporada",
        note: "Aluguel esporádico, sem estrutura hoteleira",
        unit: "/mês fixo",
        prices: [
          { price: "R$ 19,90", minimum: "controle de consumo básico" },
          { price: "R$ 34,90", minimum: "com automação do compartimento" },
          { price: "Sob consulta", minimum: "fale com a gente" },
        ],
      },
      {
        id: "pequeno",
        label: "Hotel · 20 a 50 quartos",
        note: "",
        unit: "/quarto/mês",
        prices: [
          { price: "R$ 14,90", minimum: "mínimo R$ 299/mês" },
          { price: "R$ 24,90", minimum: "mínimo R$ 490/mês" },
          { price: "R$ 39,90", minimum: "mínimo R$ 990/mês" },
        ],
      },
      {
        id: "medio",
        label: "Hotel · 50 a 100 quartos",
        note: "",
        unit: "/quarto/mês",
        prices: [
          { price: "R$ 12,90", minimum: "mínimo R$ 650/mês" },
          { price: "R$ 21,90", minimum: "mínimo R$ 1.100/mês" },
          { price: "R$ 34,90", minimum: "mínimo R$ 1.750/mês" },
        ],
      },
      {
        id: "grande",
        label: "Hotel · 100+ quartos",
        note: "",
        unit: "/quarto/mês",
        prices: [
          { price: "R$ 10,90", minimum: "mínimo R$ 1.100/mês" },
          { price: "R$ 18,90", minimum: "mínimo R$ 1.900/mês" },
          { price: "R$ 29,90", minimum: "mínimo R$ 3.000/mês" },
        ],
      },
    ],
    tiers: [
      {
        tier: "Básico",
        tagline: "QR Code digital, sem trava",
        features: [
          "QR Code dinâmico por quarto",
          "Checkout do hóspede com Pix dinâmico",
          "Painel de produtos e preços",
          "Alerta de compra por WhatsApp ou e-mail",
        ],
        highlight: false,
      },
      {
        tier: "Plus",
        tagline: "Automação IoT + trava",
        features: [
          "Tudo do Básico",
          "Trava destrava em menos de 2s após o Pix",
          "Estoque em tempo real",
          "Suporte prioritário 24/7",
        ],
        highlight: true,
      },
      {
        tier: "Premium",
        tagline: "Enterprise & PMS",
        features: [
          "Tudo do Plus",
          "Integração com o PMS (Totvs, Hospedin)",
          "IA preditiva de consumo por perfil",
          "Whitelabel próprio + SLA de 2h",
        ],
        highlight: false,
      },
    ],
    /** Taxa única, cobrada na implantação (seção 8 do Plano de Negócios). */
    setup: {
      title: "Implantação",
      text: "Taxa única, cobrada uma vez, conforme o porte.",
      items: [
        { label: "Anfitriões e temporada", value: "R$ 350 a R$ 600" },
        { label: "Hotéis de 20 a 50 quartos", value: "R$ 1.200 a R$ 1.800" },
        { label: "Hotéis acima de 50 quartos", value: "R$ 2.000 a R$ 4.500" },
      ],
      note: "Inclui configuração da conta, catálogo e o primeiro lote de QR Codes. Acima de 50 quartos, também homologação de rede e treinamento da governança.",
    },
    /** Funcionalidades fora do padrão (seção 8 do Plano de Negócios). */
    custom: {
      title: "Customização",
      text: "Funcionalidades extras e integrações específicas.",
      note: "Caso o estabelecimento necessite de integrações específicas ou funções que o sistema padrão não possui, será realizada uma análise técnica de viabilidade. O custo de desenvolvimento avulso pode variar de acordo com a complexidade da solicitação.",
    },
    cta: "Explorar planos",
  },
  explore: {
    kicker: "Explorar agora",
    title: "Veja o sistema por dentro.",
    items: [
      { title: "Web App do hóspede", text: "Vitrine, checkout por Pix e trava liberada.", route: "guest" },
      { title: "Painel do hotel", text: "Operação em tempo real e reposição.", route: "admin" },
      { title: "Design system", text: "Tokens, componentes e editor de cores.", route: "design" },
    ],
  },
  finalCta: {
    title: "Pronto para transformar hospedagem em receita?",
    subtitle: "Solicite uma demonstração e veja o faturamento recuperado em tempo real. 20 minutos, sem compromisso.",
    backToTop: "Voltar ao início",
  },
} as const;
