/**
 * TEXTOS EDITÁVEIS do produto — um único lugar para ajustar a voz da marca.
 *
 * Tom (Brandbook): profissional, direto, orientado a resultado, empático com a
 * operação. Sem jargão técnico. Cada bloco abaixo alimenta uma SEÇÃO de tela;
 * para reescrever uma seção, edite aqui sem tocar nos componentes.
 */

export const guestCopy = {
  catalog: {
    eyebrow: (room: string) => `Quarto ${room}`,
    title: "Sirva-se. Pague em segundos.",
    subtitle: "Escolha o que vai consumir. A trava libera assim que o pagamento é confirmado.",
    empty: "Nenhum item disponível neste quarto agora.",
    soldOut: "Esgotado",
    lowStock: (n: number) => `Restam ${n}`,
    cartCta: (count: number) => `Ver pedido · ${count} ${count === 1 ? "item" : "itens"}`,
  },
  howItWorks: {
    title: "Como funciona",
    steps: [
      { title: "Escolha", text: "Selecione os itens no celular." },
      { title: "Confirme", text: "Pague no Pix ou lance na conta." },
      { title: "Sirva-se", text: "A trava libera por 15 segundos." },
    ],
  },
  checkout: {
    title: "Finalizar pedido",
    subtitle: "Escolha como quer pagar.",
    pix: {
      title: "Pix",
      text: "Pagamento instantâneo. A trava libera na hora.",
      cta: "Gerar Pix",
    },
    roomCharge: {
      title: "Lançar na conta do quarto",
      text: "Aproxime seu cartão-chave do leitor do frigobar para confirmar que é você.",
      cta: "Lançar na conta",
      unavailable: "Disponível apenas para hóspedes com estadia ativa.",
    },
    reassurance: "Você só paga o que consumir. Sem cobranças surpresa no check-out.",
  },
  pix: {
    title: "Pague com Pix",
    steps: ["Abra o app do seu banco", "Escolha Pix → Copia e Cola", "Cole o código e confirme"],
    copy: "Copiar código Pix",
    copied: "Código copiado!",
    waiting: "Aguardando confirmação do pagamento…",
    expired: "O Pix expirou. Gere um novo para continuar.",
  },
  rfid: {
    title: "Aproxime seu cartão-chave",
    text: "Encoste o cartão do quarto no leitor do frigobar para confirmar seu pedido.",
    waiting: "Aguardando leitura do cartão…",
    expired: "Tempo esgotado. Refaça o pedido para continuar.",
  },
  success: {
    title: "Trava liberada",
    text: "Sirva-se dos itens do pedido. A trava fecha sozinha em instantes.",
    countdown: (s: number) => `Fecha em ${s}s`,
    closed: "Trava fechada. Obrigado!",
    receipt: "Resumo do pedido",
    again: "Fazer novo pedido",
  },
  failure: {
    out_of_stock: "Um dos itens acabou de esgotar. Seu pagamento será estornado automaticamente.",
    expired: "O pedido expirou.",
    default: "Não foi possível concluir o pedido.",
  },
} as const;

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
    cta: "Entrar no painel",
  },
  hero: {
    eyebrow: "Minibar inteligente · Pix ou cartão-chave",
    title: "A trava só abre",
    titleAccent: "depois que o consumo está pago.",
    subtitle:
      "O hóspede lê o QR Code do quarto, paga no Pix ou lança na conta com o cartão-chave, e o frigobar destrava por 15 segundos. O estoque daquele quarto baixa no mesmo instante.",
    /** Três provas curtas, lidas em varredura — uma por etapa do ciclo. */
    proofs: [
      { value: "15s", label: "entre pagar e abrir a porta" },
      { value: "0", label: "conferência de frigobar no check-out" },
      { value: "1 QR", label: "por quarto, sem app e sem cadastro" },
    ],
    primaryCta: "Ver a vitrine do hóspede",
    secondaryCta: "Entrar no painel do hotel",
    scrollHint: "Role para ver como funciona",
  },
  story: {
    kicker: "Como funciona",
    steps: [
      {
        n: "01",
        title: "O hóspede escolhe no celular.",
        text: "Um QR Code por quarto. Sem baixar app, sem criar conta — a vitrine abre na hora.",
      },
      {
        n: "02",
        title: "O pagamento confirma o consumo.",
        text: "Pix instantâneo ou lançamento na conta do quarto, validado pelo próprio cartão-chave.",
      },
      {
        n: "03",
        title: "A trava libera. O estoque se atualiza.",
        text: "15 segundos de acesso e o item some do estoque daquele quarto — sem conferência manual.",
      },
    ],
  },
  stats: {
    kicker: "Resultados de referência",
    title: "De 22% de perda.",
    titleAccent: "Para menos de 1%.",
    subtitle: "Comparativo do setor sem sistema de pagamento prévio (Plano de Negócios), não uma medição de cliente.",
    items: [
      { value: "-95%", label: "Perda de estoque (shrinkage)" },
      { value: "75%", label: "Mais rápido no check-out" },
      { value: "60%", label: "Menos tempo de governança" },
      { value: "60×", label: "Mais barato que vending machines" },
    ],
  },
  plans: {
    kicker: "Planos",
    title: "Cresça do QR Code ao whitelabel.",
    subtitle: "Preços de referência do catálogo — ajuste por hotel na implantação.",
    items: [
      {
        tier: "Básico",
        price: "R$ 14,90",
        unit: "/quarto/mês",
        minimum: "mínimo R$ 299/mês",
        features: ["QR Code dinâmico", "Catálogo e carrinho", "Pix copia e cola", "Dashboard básico"],
        highlight: false,
      },
      {
        tier: "Plus",
        price: "R$ 24,90",
        unit: "/quarto/mês",
        minimum: "mínimo R$ 490/mês",
        features: ["Tudo do Básico", "Acionamento da trava IoT", "Estoque em tempo real", "Suporte 24/7"],
        highlight: true,
      },
      {
        tier: "Premium",
        price: "R$ 39,90",
        unit: "/quarto/mês",
        minimum: "mínimo R$ 990/mês",
        features: ["Tudo do Plus", "Integração com o PMS", "IA preditiva de consumo", "Whitelabel + SLA 2h"],
        highlight: false,
      },
    ],
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
    cta: "Ver a vitrine do hóspede",
    backToTop: "Voltar ao início",
  },
} as const;
