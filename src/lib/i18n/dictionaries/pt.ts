/**
 * Português (idioma de referência).
 *
 * Dicionário ÚNICO do produto: vitrine do hóspede, painel do hotel e site.
 * As chaves seguem "area.bloco.item" — guest.*, admin.* e site.*.
 *
 * Interpolação: {var}. Plural: {n|singular|plural} (n = 1 → singular).
 */

/* O PT é a FONTE DA VERDADE: as chaves daqui definem o tipo DictKey, e os
   demais idiomas são obrigados pelo TypeScript a ter exatamente as mesmas. */
export const pt = {
  // Cabeçalho
  "guest.header.room": "Quarto {room}",
  "guest.header.hello": "Olá, {name}",
  "guest.header.lock.ready": "Pronto para uso",
  "guest.header.lock.offline": "Trava sem conexão",
  "guest.header.lock.none": "Pagamento por Pix",
  "guest.header.language": "Idioma",
  "guest.header.help": "Ajuda",
  "guest.header.home": "Início",
  "guest.header.theme": "Tema claro ou escuro",
  "guest.header.menu": "Menu",
  "guest.header.assistant": "Assistente virtual",
  "guest.assistant.title": "Assistente virtual",
  "guest.assistant.intro": "Posso te ajudar com o minibar: escolher itens, pagar pelo Pix e liberar a trava do quarto.",
  "guest.assistant.soon": "Respostas automáticas chegando em breve.",
  "guest.assistant.placeholder": "Pergunte ao assistente…",

  // Vitrine
  "guest.catalog.title": "Sirva-se. Pague em segundos.",
  "guest.catalog.subtitle": "Escolha o que vai consumir. A trava libera assim que o pagamento é confirmado.",
  "guest.catalog.subtitle.nolock": "Escolha o que vai consumir e pague pelo Pix. O anfitrião é avisado na hora.",
  "guest.catalog.empty": "Nenhum item disponível neste quarto agora.",
  "guest.catalog.soldOut": "Esgotado",
  "guest.catalog.onlyLeft": "Apenas {n} {n|restante|restantes}",
  "guest.catalog.filter": "Filtrar por categoria",
  "guest.catalog.all": "Todos",
  "guest.cat.bebida": "Bebidas",
  "guest.cat.snack": "Snacks",
  "guest.cat.adega": "Adega",
  "guest.cat.conveniencia": "Conveniência",
  "guest.tag.cold": "Gelado",
  "guest.tag.gluten-free": "Sem glúten",
  "guest.tag.vegan": "Vegano",
  "guest.tag.zero-sugar": "Zero açúcar",
  "guest.catalog.add": "Adicionar {name}",

  // Regras e transparência
  "guest.rules.title": "Você só paga o que consumir.",
  "guest.rules.text": "Sem taxas de conferência ou surpresas no check-out. Os preços são os que aparecem aqui, sem letra miúda.",

  // Guia de uso
  "guest.how.title": "Como funciona",
  "guest.how.1.title": "Escolha",
  "guest.how.1.text": "Selecione os itens no celular.",
  "guest.how.2.title": "Pague",
  "guest.how.2.text": "Pix ou cartão-chave, em segundos.",
  "guest.how.3.title": "Sirva-se",
  "guest.how.3.text": "A trava libera por {s} segundos.",
  "guest.how.3.nolock": "O anfitrião recebe o aviso na hora.",
  "guest.how.safety.title": "Segurança",
  "guest.how.safety.text": "Depois de se servir, feche bem a porta do minibar até ouvir o clique da trava. Não force a porta enquanto ela estiver travada.",

  // Motel
  "guest.privacy.title": "Compra 100% anônima",
  "guest.privacy.text": "Pague pelo Pix direto na suíte. Não pedimos nome, CPF nem qualquer identificação, e ninguém precisa falar com a portaria.",

  // Barra do pedido
  "guest.cart.items": "{n} {n|item|itens}",
  "guest.cart.view": "Ver pedido",
  "guest.cart.payUnlock": "Pagar e Destravar",
  "guest.cart.pay": "Pagar com Pix",
  "guest.cart.title": "Seu pedido",
  "guest.cart.total": "Total",
  "guest.cart.clear": "Limpar pedido",

  // Navegação inferior
  "guest.nav.catalog": "Vitrine",
  "guest.nav.consumption": "Meu consumo",

  // Checkout
  "guest.checkout.back": "Vitrine",
  "guest.checkout.title": "Finalizar pedido",
  "guest.checkout.subtitle": "Escolha como quer pagar.",
  "guest.checkout.empty.title": "Seu pedido está vazio",
  "guest.checkout.empty.text": "Escolha itens na vitrine para continuar.",
  "guest.checkout.empty.action": "Voltar à vitrine",
  "guest.checkout.summary": "Resumo do pedido",
  "guest.checkout.method": "Forma de pagamento",
  "guest.checkout.pix.title": "Pix",
  "guest.checkout.pix.text": "Pagamento instantâneo por QR Code ou Copia e Cola. A trava libera na hora.",
  "guest.checkout.pix.badge": "Mais rápido",
  "guest.checkout.pix.cta": "Gerar Pix",
  "guest.checkout.room.title": "Lançar na conta da suíte",
  "guest.checkout.room.text": "Aproxime o cartão-chave (NFC) do leitor do frigobar para confirmar que é você.",
  "guest.checkout.room.cta": "Lançar na conta",
  "guest.checkout.room.unavailable": "Disponível apenas para hóspedes com estadia ativa.",
  "guest.checkout.reassurance": "Você só paga o que consumir. Sem cobranças surpresa no check-out.",
  "guest.checkout.offline": "Sem conexão. Verifique o Wi-Fi e tente de novo.",

  // Pix
  "guest.pix.title": "Pague com Pix",
  "guest.pix.waiting": "Aguardando confirmação do pagamento…",
  "guest.pix.amount": "Valor a pagar",
  "guest.pix.expires": "Expira em",
  "guest.pix.copy": "Copiar código Pix",
  "guest.pix.copied": "Código copiado!",
  "guest.pix.code": "Código Pix copia e cola",
  "guest.pix.step.1": "Abra o app do seu banco",
  "guest.pix.step.2": "Escolha Pix → Copia e Cola, ou leia o QR Code",
  "guest.pix.step.3": "Confirme o pagamento",
  "guest.pix.demo": "Simular pagamento confirmado (webhook)",

  // Cartão-chave
  "guest.rfid.title": "Aproxime seu cartão-chave",
  "guest.rfid.text": "Encoste o cartão do quarto no leitor do frigobar para confirmar seu pedido.",
  "guest.rfid.waiting": "Aguardando leitura do cartão…",
  "guest.rfid.demo": "Simular aproximação do cartão (ESP32)",

  // Sucesso
  "guest.success.title": "Trava liberada! Sirva-se dos itens selecionados.",
  "guest.success.text": "A trava fecha sozinha. Depois de se servir, feche bem a porta.",
  "guest.success.nolock.title": "Pagamento confirmado!",
  "guest.success.nolock.text": "O anfitrião já foi avisado. Sirva-se dos itens selecionados.",
  "guest.success.countdown": "Porta aberta: {s}s",
  "guest.success.closed": "Trava fechada. Obrigado!",
  "guest.success.closed.text": "Pedido concluído com sucesso.",
  "guest.success.receipt": "Resumo do pedido",
  "guest.success.paidPix": "Pago via Pix.",
  "guest.success.paidRoom": "Lançado na conta do quarto — você acerta no check-out.",
  "guest.success.again": "Fazer novo pedido",
  "guest.success.download": "Baixar recibo",
  "guest.success.myConsumption": "Ver meu consumo",
  "guest.success.noOpen": "Paguei e a trava não destravou",

  // Falhas
  "guest.failure.title": "Pedido não concluído",
  "guest.failure.out_of_stock": "Um dos itens acabou de esgotar. Seu pagamento será estornado automaticamente. Escolha um item similar na vitrine.",
  "guest.failure.expired": "O pedido expirou. Gere um novo para continuar.",
  "guest.failure.default": "Não foi possível concluir o pedido.",
  "guest.failure.back": "Voltar à vitrine",
  "guest.error.stock": "Um dos itens acabou de esgotar neste quarto. Escolha um similar.",

  // Meu consumo
  "guest.consumption.title": "Meu consumo",
  "guest.consumption.subtitle": "Tudo o que foi consumido nesta estadia, com horário e forma de pagamento.",
  "guest.consumption.empty": "Você ainda não consumiu nada nesta estadia.",
  "guest.consumption.total": "Total da estadia",
  "guest.consumption.pix": "Pix",
  "guest.consumption.room": "Conta do quarto",
  "guest.consumption.receipt": "Recibo",
  "guest.consumption.paid": "Pago",
  "guest.consumption.charged": "A cobrar no check-out",
  "guest.consumption.problem": "Paguei e a trava não destravou",

  // Recibo
  "guest.receipt.title": "Recibo",
  "guest.receipt.hotel": "Estabelecimento",
  "guest.receipt.room": "Quarto",
  "guest.receipt.date": "Data e hora",
  "guest.receipt.method": "Forma de pagamento",
  "guest.receipt.code": "Código do pedido",
  "guest.receipt.status": "Situação",
  "guest.receipt.status.paid": "Pago",
  "guest.receipt.status.charged": "Lançado na conta do quarto",
  "guest.receipt.print": "Baixar / imprimir recibo",
  "guest.receipt.back": "Meu consumo",
  "guest.receipt.notfound": "Recibo não encontrado.",
  "guest.receipt.footer": "Comprovante emitido pelo SmartBar. Guarde para prestação de contas.",

  // Ajuda
  "guest.help.title": "Como podemos ajudar?",
  "guest.help.restock": "Solicitar reposição",
  "guest.help.restock.text": "Frigobar vazio ou faltando itens. Avisamos a governança com prioridade.",
  "guest.help.damaged": "Reportar item danificado",
  "guest.help.damaged.text": "Garrafa quebrada ou lacre rompido antes de consumir.",
  "guest.help.door": "Paguei e a trava não destravou",
  "guest.help.door.text": "Testamos a trava do quarto e reenviamos o sinal de abertura. Se não resolver, a recepção é avisada.",
  "guest.help.whatsapp": "Falar com a recepção",
  "guest.help.whatsapp.text": "Abre o WhatsApp com a mensagem pronta.",
  "guest.help.note": "Quer detalhar? (opcional)",
  "guest.help.send": "Enviar",
  "guest.help.sending": "Enviando…",
  "guest.help.done.restock": "Pronto! A governança foi avisada e vai repor os itens com prioridade.",
  "guest.help.done.damaged": "Registrado. A recepção vai conferir e ajustar a cobrança do item.",
  "guest.help.done.door": "Aviso enviado. Testamos a trava e a recepção já sabe do problema.",
  "guest.help.error": "Não foi possível enviar agora. Fale com a recepção pelo WhatsApp.",
  "guest.help.close": "Fechar",
  "guest.help.back": "Voltar",
  "guest.wa.text": "Olá! Estou no quarto {room} e preciso de ajuda com o minibar SmartBar.",

  /* ── Comum às três áreas ──────────────────────────────────────────── */
  "common.language": "Idioma",
  // Nomes dos idiomas: sempre no próprio idioma, iguais nos três dicionários.
  "common.lang.pt": "Português",
  "common.lang.en": "English",
  "common.lang.es": "Español",

  /* ── Painel do hotel ──────────────────────────────────────────────── */
  "admin.nav.main": "Principal",
  "admin.nav.overview": "Visão geral",
  "admin.nav.rooms": "Quartos",
  "admin.nav.restock": "Reposição",
  "admin.nav.logout": "Sair",
  "admin.nav.demo": "Modo demonstração · dados simulados",

  "admin.status.live": "Ao vivo",
  "admin.status.demo": "Modo demonstração",
  "admin.status.connecting": "Conectando…",

  "admin.dashboard.title": "Visão geral",
  "admin.dashboard.subtitle": "Faturamento do minibar em tempo real",
  "admin.dashboard.feedTitle": "Últimas vendas aprovadas",
  "admin.dashboard.feedHint": "Atualiza sozinho a cada compra concluída pelo hóspede.",
  "admin.dashboard.feedEmpty": "Nenhuma venda aprovada hoje ainda.",

  "admin.rooms.title": "Quartos",
  "admin.rooms.subtitle": "Status do frigobar, consumo da estadia e valores para o check-out.",
  "admin.rooms.searchPlaceholder": "Buscar por número do quarto ou hóspede…",
  "admin.rooms.searchAria": "Buscar quarto",
  "admin.rooms.filterLabel": "Filtrar quartos",
  "admin.rooms.filter.all": "Todos",
  "admin.rooms.filter.occupied": "Ocupados",
  "admin.rooms.filter.restock": "Repor",
  "admin.rooms.filter.offline": "Sem sinal",
  "admin.rooms.emptyTitle": "Nenhum quarto encontrado",
  "admin.rooms.emptyText": "Tente outro número, nome de hóspede ou filtro.",
  "admin.rooms.floor": "Andar {floor}",
  "admin.rooms.restockBadge": "Repor {n}",
  "admin.rooms.vacant": "Quarto vago",
  "admin.rooms.open": "Aberto",
  "admin.rooms.locked": "Trancado",

  "admin.restock.title": "Reposição",
  "admin.restock.subtitle": "Quartos que precisam de itens. Confirme após repor para atualizar o estoque.",
  "admin.restock.empty": "Tudo em ordem. Nenhum quarto precisa de reposição.",
  "admin.restock.emptyHint": "Novos alertas aparecem aqui assim que um quarto atingir o estoque mínimo.",

  // Indicadores do dia
  "admin.kpi.section": "Indicadores do dia",
  "admin.kpi.revenue": "Faturamento hoje",
  "admin.kpi.revenueHint": "{pix}% via Pix · {account}% na conta do quarto",
  "admin.kpi.sales": "Vendas aprovadas",
  "admin.kpi.salesHint": "Pedidos com trava liberada",
  "admin.kpi.ticket": "Ticket médio",
  "admin.kpi.ticketHint": "Por pedido aprovado",
  "admin.kpi.restock": "Quartos p/ repor",
  "admin.kpi.restockHint": "{n} unidades faltando",

  "admin.chart.title": "Faturamento por hora",
  "admin.chart.hint": "Vendas aprovadas hoje",
  "admin.chart.aria": "Gráfico de faturamento por hora do dia",

  "admin.top.title": "Mais vendidos hoje",
  "admin.top.empty": "Sem vendas ainda",
  "admin.top.units": "{n} un",
  "admin.top.meter": "Faturamento de {name}",

  "admin.feed.room": "Quarto {room}",
  "admin.feed.new": "Novo",
  "admin.feed.items": "{n} {n|item|itens}",
  "admin.feed.pix": "Pix",
  "admin.feed.account": "Na conta",

  "admin.side.label": "Painel lateral",
  "admin.side.live": "Ao vivo",
  "admin.side.restock": "Repor",
  "admin.side.devices": "Travas",

  "admin.impact.title": "Receita protegida hoje",
  "admin.impact.meter": "Receita protegida frente ao custo diário do plano",
  "admin.impact.times": "{times}× o custo diário do plano",
  "admin.impact.below": "Abaixo do custo diário do plano",
  "admin.impact.perDay": "{value}/dia",
  "admin.impact.note": "Estimativa: considera a perda média de 22% do setor sem pagamento prévio (Plano de Negócios). Não é uma medição deste hotel.",

  // Busca rápida (⌘K)
  "admin.cmd.groupRooms": "Quartos",
  "admin.cmd.groupActions": "Ações",
  "admin.cmd.openRestock": "Abrir reposição",
  "admin.cmd.housekeeping": "Governança",
  "admin.cmd.allRooms": "Ver todos os quartos",
  "admin.cmd.overview": "Visão geral",
  "admin.cmd.roomsToRestock": "Quartos para repor",
  "admin.cmd.allRoomsShort": "Todos os quartos",
  "admin.cmd.hello": "Olá",
  "admin.cmd.morning": "Bom dia",
  "admin.cmd.afternoon": "Boa tarde",
  "admin.cmd.evening": "Boa noite",
  "admin.cmd.vacant": "Vago",
  "admin.cmd.search": "Buscar quarto, hóspede ou ação",
  "admin.cmd.searchPlaceholder": "Buscar quarto, hóspede ou ação…",
} as const;

/** Toda chave de texto do produto. Adicionar aqui obriga traduzir em en.ts e es.ts. */
export type DictKey = keyof typeof pt;
