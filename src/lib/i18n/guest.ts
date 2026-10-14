/**
 * Textos do Web App do Hóspede em português, inglês e espanhol.
 * O idioma vem do celular (navigator.language) e o hóspede pode trocar no cabeçalho.
 * Nomes e descrições de produto vêm do cadastro do hotel e não são traduzidos aqui.
 */

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const LANG_COOKIE = "sb_lang";

const pt = {
  // Cabeçalho
  "header.room": "Quarto {room}",
  "header.hello": "Olá, {name}",
  "header.lock.ready": "Pronto para uso",
  "header.lock.offline": "Trava sem conexão",
  "header.lock.none": "Pagamento por Pix",
  "header.language": "Idioma",
  "header.help": "Ajuda",
  "header.home": "Início",
  "header.theme": "Tema claro ou escuro",

  // Vitrine
  "catalog.title": "Sirva-se. Pague em segundos.",
  "catalog.subtitle": "Escolha o que vai consumir. A trava libera assim que o pagamento é confirmado.",
  "catalog.subtitle.nolock": "Escolha o que vai consumir e pague pelo Pix. O anfitrião é avisado na hora.",
  "catalog.empty": "Nenhum item disponível neste quarto agora.",
  "catalog.soldOut": "Esgotado",
  "catalog.onlyLeft": "Apenas {n} {n|restante|restantes}",
  "catalog.filter": "Filtrar por categoria",
  "catalog.all": "Todos",
  "cat.bebida": "Bebidas",
  "cat.snack": "Snacks",
  "cat.adega": "Adega",
  "cat.conveniencia": "Conveniência",
  "tag.cold": "Gelado",
  "tag.gluten-free": "Sem glúten",
  "tag.vegan": "Vegano",
  "tag.zero-sugar": "Zero açúcar",
  "catalog.add": "Adicionar {name}",

  // Regras e transparência
  "rules.title": "Você só paga o que consumir.",
  "rules.text": "Sem taxas de conferência ou surpresas no check-out. Os preços são os que aparecem aqui, sem letra miúda.",

  // Guia de uso
  "how.title": "Como funciona",
  "how.1.title": "Escolha",
  "how.1.text": "Selecione os itens no celular.",
  "how.2.title": "Pague",
  "how.2.text": "Pix ou cartão-chave, em segundos.",
  "how.3.title": "Sirva-se",
  "how.3.text": "A trava libera por {s} segundos.",
  "how.3.nolock": "O anfitrião recebe o aviso na hora.",
  "how.safety.title": "Segurança",
  "how.safety.text": "Depois de se servir, feche bem a porta do minibar até ouvir o clique da trava. Não force a porta enquanto ela estiver travada.",

  // Motel
  "privacy.title": "Compra 100% anônima",
  "privacy.text": "Pague pelo Pix direto na suíte. Não pedimos nome, CPF nem qualquer identificação, e ninguém precisa falar com a portaria.",

  // Barra do pedido
  "cart.items": "{n} {n|item|itens}",
  "cart.view": "Ver pedido",
  "cart.payUnlock": "Pagar e Destravar",
  "cart.pay": "Pagar com Pix",
  "cart.title": "Seu pedido",
  "cart.total": "Total",
  "cart.clear": "Limpar pedido",

  // Navegação inferior
  "nav.catalog": "Vitrine",
  "nav.consumption": "Meu consumo",

  // Checkout
  "checkout.back": "Vitrine",
  "checkout.title": "Finalizar pedido",
  "checkout.subtitle": "Escolha como quer pagar.",
  "checkout.empty.title": "Seu pedido está vazio",
  "checkout.empty.text": "Escolha itens na vitrine para continuar.",
  "checkout.empty.action": "Voltar à vitrine",
  "checkout.summary": "Resumo do pedido",
  "checkout.method": "Forma de pagamento",
  "checkout.pix.title": "Pix",
  "checkout.pix.text": "Pagamento instantâneo por QR Code ou Copia e Cola. A trava libera na hora.",
  "checkout.pix.badge": "Mais rápido",
  "checkout.pix.cta": "Gerar Pix",
  "checkout.room.title": "Lançar na conta da suíte",
  "checkout.room.text": "Aproxime o cartão-chave (NFC) do leitor do frigobar para confirmar que é você.",
  "checkout.room.cta": "Lançar na conta",
  "checkout.room.unavailable": "Disponível apenas para hóspedes com estadia ativa.",
  "checkout.reassurance": "Você só paga o que consumir. Sem cobranças surpresa no check-out.",
  "checkout.offline": "Sem conexão. Verifique o Wi-Fi e tente de novo.",

  // Pix
  "pix.title": "Pague com Pix",
  "pix.waiting": "Aguardando confirmação do pagamento…",
  "pix.amount": "Valor a pagar",
  "pix.expires": "Expira em",
  "pix.copy": "Copiar código Pix",
  "pix.copied": "Código copiado!",
  "pix.code": "Código Pix copia e cola",
  "pix.step.1": "Abra o app do seu banco",
  "pix.step.2": "Escolha Pix → Copia e Cola, ou leia o QR Code",
  "pix.step.3": "Confirme o pagamento",
  "pix.demo": "Simular pagamento confirmado (webhook)",

  // Cartão-chave
  "rfid.title": "Aproxime seu cartão-chave",
  "rfid.text": "Encoste o cartão do quarto no leitor do frigobar para confirmar seu pedido.",
  "rfid.waiting": "Aguardando leitura do cartão…",
  "rfid.demo": "Simular aproximação do cartão (ESP32)",

  // Sucesso
  "success.title": "Trava liberada! Sirva-se dos itens selecionados.",
  "success.text": "A trava fecha sozinha. Depois de se servir, feche bem a porta.",
  "success.nolock.title": "Pagamento confirmado!",
  "success.nolock.text": "O anfitrião já foi avisado. Sirva-se dos itens selecionados.",
  "success.countdown": "Porta aberta: {s}s",
  "success.closed": "Trava fechada. Obrigado!",
  "success.closed.text": "Pedido concluído com sucesso.",
  "success.receipt": "Resumo do pedido",
  "success.paidPix": "Pago via Pix.",
  "success.paidRoom": "Lançado na conta do quarto — você acerta no check-out.",
  "success.again": "Fazer novo pedido",
  "success.download": "Baixar recibo",
  "success.myConsumption": "Ver meu consumo",
  "success.noOpen": "Paguei e a trava não destravou",

  // Falhas
  "failure.title": "Pedido não concluído",
  "failure.out_of_stock": "Um dos itens acabou de esgotar. Seu pagamento será estornado automaticamente. Escolha um item similar na vitrine.",
  "failure.expired": "O pedido expirou. Gere um novo para continuar.",
  "failure.default": "Não foi possível concluir o pedido.",
  "failure.back": "Voltar à vitrine",
  "error.stock": "Um dos itens acabou de esgotar neste quarto. Escolha um similar.",

  // Meu consumo
  "consumption.title": "Meu consumo",
  "consumption.subtitle": "Tudo o que foi consumido nesta estadia, com horário e forma de pagamento.",
  "consumption.empty": "Você ainda não consumiu nada nesta estadia.",
  "consumption.total": "Total da estadia",
  "consumption.pix": "Pix",
  "consumption.room": "Conta do quarto",
  "consumption.receipt": "Recibo",
  "consumption.paid": "Pago",
  "consumption.charged": "A cobrar no check-out",
  "consumption.problem": "Paguei e a trava não destravou",

  // Recibo
  "receipt.title": "Recibo",
  "receipt.hotel": "Estabelecimento",
  "receipt.room": "Quarto",
  "receipt.date": "Data e hora",
  "receipt.method": "Forma de pagamento",
  "receipt.code": "Código do pedido",
  "receipt.status": "Situação",
  "receipt.status.paid": "Pago",
  "receipt.status.charged": "Lançado na conta do quarto",
  "receipt.print": "Baixar / imprimir recibo",
  "receipt.back": "Meu consumo",
  "receipt.notfound": "Recibo não encontrado.",
  "receipt.footer": "Comprovante emitido pelo SmartBar. Guarde para prestação de contas.",

  // Ajuda
  "help.title": "Como podemos ajudar?",
  "help.restock": "Solicitar reposição",
  "help.restock.text": "Frigobar vazio ou faltando itens. Avisamos a governança com prioridade.",
  "help.damaged": "Reportar item danificado",
  "help.damaged.text": "Garrafa quebrada ou lacre rompido antes de consumir.",
  "help.door": "Paguei e a trava não destravou",
  "help.door.text": "Testamos a trava do quarto e reenviamos o sinal de abertura. Se não resolver, a recepção é avisada.",
  "help.whatsapp": "Falar com a recepção",
  "help.whatsapp.text": "Abre o WhatsApp com a mensagem pronta.",
  "help.note": "Quer detalhar? (opcional)",
  "help.send": "Enviar",
  "help.sending": "Enviando…",
  "help.done.restock": "Pronto! A governança foi avisada e vai repor os itens com prioridade.",
  "help.done.damaged": "Registrado. A recepção vai conferir e ajustar a cobrança do item.",
  "help.done.door": "Aviso enviado. Testamos a trava e a recepção já sabe do problema.",
  "help.error": "Não foi possível enviar agora. Fale com a recepção pelo WhatsApp.",
  "help.close": "Fechar",
  "help.back": "Voltar",
  "wa.text": "Olá! Estou no quarto {room} e preciso de ajuda com o minibar SmartBar.",

  // Idioma
  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",
} as const;

export type GuestKey = keyof typeof pt;

const en: Record<GuestKey, string> = {
  "header.room": "Room {room}",
  "header.hello": "Hello, {name}",
  "header.lock.ready": "Ready to use",
  "header.lock.offline": "Lock offline",
  "header.lock.none": "Pay with Pix",
  "header.language": "Language",
  "header.help": "Help",
  "header.home": "Home",
  "header.theme": "Light or dark theme",

  "catalog.title": "Help yourself. Pay in seconds.",
  "catalog.subtitle": "Pick what you'd like. The lock opens as soon as payment is confirmed.",
  "catalog.subtitle.nolock": "Pick what you'd like and pay with Pix. The host is notified right away.",
  "catalog.empty": "No items available in this room right now.",
  "catalog.soldOut": "Sold out",
  "catalog.onlyLeft": "Only {n} left",
  "catalog.filter": "Filter by category",
  "catalog.all": "All",
  "cat.bebida": "Drinks",
  "cat.snack": "Snacks",
  "cat.adega": "Wine cellar",
  "cat.conveniencia": "Essentials",
  "tag.cold": "Chilled",
  "tag.gluten-free": "Gluten-free",
  "tag.vegan": "Vegan",
  "tag.zero-sugar": "Zero sugar",
  "catalog.add": "Add {name}",

  "rules.title": "You only pay for what you consume.",
  "rules.text": "No checking fees or surprises at check-out. Prices are exactly what you see here, no fine print.",

  "how.title": "How it works",
  "how.1.title": "Choose",
  "how.1.text": "Select items on your phone.",
  "how.2.title": "Pay",
  "how.2.text": "Pix or key card, in seconds.",
  "how.3.title": "Help yourself",
  "how.3.text": "The lock opens for {s} seconds.",
  "how.3.nolock": "The host is notified right away.",
  "how.safety.title": "Safety",
  "how.safety.text": "After helping yourself, close the minibar door firmly until you hear the lock click. Don't force the door while it is locked.",

  "privacy.title": "100% anonymous purchase",
  "privacy.text": "Pay with Pix right in the suite. We never ask for your name or ID, and you don't need to talk to the front desk.",

  "cart.items": "{n} {n|item|items}",
  "cart.view": "View order",
  "cart.payUnlock": "Pay & Unlock",
  "cart.pay": "Pay with Pix",
  "cart.title": "Your order",
  "cart.total": "Total",
  "cart.clear": "Clear order",

  "nav.catalog": "Menu",
  "nav.consumption": "My consumption",

  "checkout.back": "Menu",
  "checkout.title": "Checkout",
  "checkout.subtitle": "Choose how you'd like to pay.",
  "checkout.empty.title": "Your order is empty",
  "checkout.empty.text": "Pick items from the menu to continue.",
  "checkout.empty.action": "Back to the menu",
  "checkout.summary": "Order summary",
  "checkout.method": "Payment method",
  "checkout.pix.title": "Pix",
  "checkout.pix.text": "Instant payment by QR Code or copy-and-paste. The lock opens right away.",
  "checkout.pix.badge": "Fastest",
  "checkout.pix.cta": "Generate Pix",
  "checkout.room.title": "Charge to the suite account",
  "checkout.room.text": "Hold your key card (NFC) to the minibar reader to confirm it's you.",
  "checkout.room.cta": "Charge to room",
  "checkout.room.unavailable": "Only available to guests with an active stay.",
  "checkout.reassurance": "You only pay for what you consume. No surprise charges at check-out.",
  "checkout.offline": "No connection. Check your Wi-Fi and try again.",

  "pix.title": "Pay with Pix",
  "pix.waiting": "Waiting for payment confirmation…",
  "pix.amount": "Amount due",
  "pix.expires": "Expires in",
  "pix.copy": "Copy Pix code",
  "pix.copied": "Code copied!",
  "pix.code": "Pix copy-and-paste code",
  "pix.step.1": "Open your banking app",
  "pix.step.2": "Choose Pix → Copy and Paste, or scan the QR Code",
  "pix.step.3": "Confirm the payment",
  "pix.demo": "Simulate confirmed payment (webhook)",

  "rfid.title": "Hold your key card",
  "rfid.text": "Touch your room card to the minibar reader to confirm your order.",
  "rfid.waiting": "Waiting for the card…",
  "rfid.demo": "Simulate card tap (ESP32)",

  "success.title": "Unlocked! Help yourself to the selected items.",
  "success.text": "The lock closes by itself. After helping yourself, close the door firmly.",
  "success.nolock.title": "Payment confirmed!",
  "success.nolock.text": "The host has been notified. Help yourself to the selected items.",
  "success.countdown": "Door open: {s}s",
  "success.closed": "Locked again. Thank you!",
  "success.closed.text": "Order completed successfully.",
  "success.receipt": "Order summary",
  "success.paidPix": "Paid with Pix.",
  "success.paidRoom": "Charged to your room — you settle at check-out.",
  "success.again": "New order",
  "success.download": "Download receipt",
  "success.myConsumption": "View my consumption",
  "success.noOpen": "I paid but the lock didn't open",

  "failure.title": "Order not completed",
  "failure.out_of_stock": "One of the items just ran out. Your payment will be refunded automatically. Pick a similar item from the menu.",
  "failure.expired": "The order expired. Create a new one to continue.",
  "failure.default": "We couldn't complete the order.",
  "failure.back": "Back to the menu",
  "error.stock": "One of the items just ran out in this room. Pick a similar one.",

  "consumption.title": "My consumption",
  "consumption.subtitle": "Everything consumed during this stay, with time and payment method.",
  "consumption.empty": "You haven't consumed anything during this stay yet.",
  "consumption.total": "Stay total",
  "consumption.pix": "Pix",
  "consumption.room": "Room account",
  "consumption.receipt": "Receipt",
  "consumption.paid": "Paid",
  "consumption.charged": "Due at check-out",
  "consumption.problem": "I paid but the lock didn't open",

  "receipt.title": "Receipt",
  "receipt.hotel": "Property",
  "receipt.room": "Room",
  "receipt.date": "Date and time",
  "receipt.method": "Payment method",
  "receipt.code": "Order code",
  "receipt.status": "Status",
  "receipt.status.paid": "Paid",
  "receipt.status.charged": "Charged to room account",
  "receipt.print": "Download / print receipt",
  "receipt.back": "My consumption",
  "receipt.notfound": "Receipt not found.",
  "receipt.footer": "Receipt issued by SmartBar. Keep it for your expense reports.",

  "help.title": "How can we help?",
  "help.restock": "Request a refill",
  "help.restock.text": "Minibar empty or missing items. We alert housekeeping with priority.",
  "help.damaged": "Report a damaged item",
  "help.damaged.text": "Broken bottle or broken seal before consuming.",
  "help.door": "I paid but the lock didn't open",
  "help.door.text": "We test the room lock and resend the open signal. If that fails, the front desk is alerted.",
  "help.whatsapp": "Talk to the front desk",
  "help.whatsapp.text": "Opens WhatsApp with the message ready.",
  "help.note": "Want to add details? (optional)",
  "help.send": "Send",
  "help.sending": "Sending…",
  "help.done.restock": "Done! Housekeeping was alerted and will refill the items with priority.",
  "help.done.damaged": "Logged. The front desk will check and adjust the charge for the item.",
  "help.done.door": "Alert sent. We tested the lock and the front desk knows about the problem.",
  "help.error": "We couldn't send it right now. Please contact the front desk on WhatsApp.",
  "help.close": "Close",
  "help.back": "Back",
  "wa.text": "Hello! I'm in room {room} and need help with the SmartBar minibar.",

  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",
};

const es: Record<GuestKey, string> = {
  "header.room": "Habitación {room}",
  "header.hello": "Hola, {name}",
  "header.lock.ready": "Listo para usar",
  "header.lock.offline": "Cerradura sin conexión",
  "header.lock.none": "Pago con Pix",
  "header.language": "Idioma",
  "header.help": "Ayuda",
  "header.home": "Inicio",
  "header.theme": "Tema claro u oscuro",

  "catalog.title": "Sírvase. Pague en segundos.",
  "catalog.subtitle": "Elija lo que va a consumir. La cerradura se abre en cuanto se confirma el pago.",
  "catalog.subtitle.nolock": "Elija lo que va a consumir y pague con Pix. El anfitrión recibe el aviso al instante.",
  "catalog.empty": "No hay artículos disponibles en esta habitación ahora.",
  "catalog.soldOut": "Agotado",
  "catalog.onlyLeft": "Solo {n|queda|quedan} {n}",
  "catalog.filter": "Filtrar por categoría",
  "catalog.all": "Todos",
  "cat.bebida": "Bebidas",
  "cat.snack": "Snacks",
  "cat.adega": "Bodega",
  "cat.conveniencia": "Conveniencia",
  "tag.cold": "Frío",
  "tag.gluten-free": "Sin gluten",
  "tag.vegan": "Vegano",
  "tag.zero-sugar": "Cero azúcar",
  "catalog.add": "Agregar {name}",

  "rules.title": "Solo paga lo que consume.",
  "rules.text": "Sin tasas de revisión ni sorpresas en el check-out. Los precios son los que ve aquí, sin letra pequeña.",

  "how.title": "Cómo funciona",
  "how.1.title": "Elija",
  "how.1.text": "Seleccione los artículos en su móvil.",
  "how.2.title": "Pague",
  "how.2.text": "Pix o tarjeta-llave, en segundos.",
  "how.3.title": "Sírvase",
  "how.3.text": "La cerradura se abre por {s} segundos.",
  "how.3.nolock": "El anfitrión recibe el aviso al instante.",
  "how.safety.title": "Seguridad",
  "how.safety.text": "Después de servirse, cierre bien la puerta del minibar hasta oír el clic de la cerradura. No fuerce la puerta mientras esté cerrada.",

  "privacy.title": "Compra 100% anónima",
  "privacy.text": "Pague con Pix directamente en la suite. No pedimos nombre ni documento, y no necesita hablar con la recepción.",

  "cart.items": "{n} {n|artículo|artículos}",
  "cart.view": "Ver pedido",
  "cart.payUnlock": "Pagar y Abrir",
  "cart.pay": "Pagar con Pix",
  "cart.title": "Su pedido",
  "cart.total": "Total",
  "cart.clear": "Vaciar pedido",

  "nav.catalog": "Menú",
  "nav.consumption": "Mi consumo",

  "checkout.back": "Menú",
  "checkout.title": "Finalizar pedido",
  "checkout.subtitle": "Elija cómo quiere pagar.",
  "checkout.empty.title": "Su pedido está vacío",
  "checkout.empty.text": "Elija artículos en el menú para continuar.",
  "checkout.empty.action": "Volver al menú",
  "checkout.summary": "Resumen del pedido",
  "checkout.method": "Forma de pago",
  "checkout.pix.title": "Pix",
  "checkout.pix.text": "Pago instantáneo por código QR o copiar y pegar. La cerradura se abre al instante.",
  "checkout.pix.badge": "Más rápido",
  "checkout.pix.cta": "Generar Pix",
  "checkout.room.title": "Cargar a la cuenta de la suite",
  "checkout.room.text": "Acerque la tarjeta-llave (NFC) al lector del minibar para confirmar que es usted.",
  "checkout.room.cta": "Cargar a la cuenta",
  "checkout.room.unavailable": "Disponible solo para huéspedes con estadía activa.",
  "checkout.reassurance": "Solo paga lo que consume. Sin cargos sorpresa en el check-out.",
  "checkout.offline": "Sin conexión. Revise el Wi-Fi e inténtelo de nuevo.",

  "pix.title": "Pague con Pix",
  "pix.waiting": "Esperando la confirmación del pago…",
  "pix.amount": "Valor a pagar",
  "pix.expires": "Expira en",
  "pix.copy": "Copiar código Pix",
  "pix.copied": "¡Código copiado!",
  "pix.code": "Código Pix copiar y pegar",
  "pix.step.1": "Abra la app de su banco",
  "pix.step.2": "Elija Pix → Copiar y Pegar, o lea el código QR",
  "pix.step.3": "Confirme el pago",
  "pix.demo": "Simular pago confirmado (webhook)",

  "rfid.title": "Acerque su tarjeta-llave",
  "rfid.text": "Apoye la tarjeta de la habitación en el lector del minibar para confirmar su pedido.",
  "rfid.waiting": "Esperando la lectura de la tarjeta…",
  "rfid.demo": "Simular tarjeta (ESP32)",

  "success.title": "¡Cerradura abierta! Sírvase los artículos seleccionados.",
  "success.text": "La cerradura se cierra sola. Después de servirse, cierre bien la puerta.",
  "success.nolock.title": "¡Pago confirmado!",
  "success.nolock.text": "El anfitrión ya fue avisado. Sírvase los artículos seleccionados.",
  "success.countdown": "Puerta abierta: {s}s",
  "success.closed": "Cerradura cerrada. ¡Gracias!",
  "success.closed.text": "Pedido completado con éxito.",
  "success.receipt": "Resumen del pedido",
  "success.paidPix": "Pagado con Pix.",
  "success.paidRoom": "Cargado a la habitación — lo liquida en el check-out.",
  "success.again": "Nuevo pedido",
  "success.download": "Descargar recibo",
  "success.myConsumption": "Ver mi consumo",
  "success.noOpen": "Pagué y la cerradura no se abrió",

  "failure.title": "Pedido no completado",
  "failure.out_of_stock": "Uno de los artículos se agotó. Su pago será reembolsado automáticamente. Elija un artículo similar en el menú.",
  "failure.expired": "El pedido expiró. Genere uno nuevo para continuar.",
  "failure.default": "No fue posible completar el pedido.",
  "failure.back": "Volver al menú",
  "error.stock": "Uno de los artículos se agotó en esta habitación. Elija uno similar.",

  "consumption.title": "Mi consumo",
  "consumption.subtitle": "Todo lo consumido en esta estadía, con hora y forma de pago.",
  "consumption.empty": "Aún no ha consumido nada en esta estadía.",
  "consumption.total": "Total de la estadía",
  "consumption.pix": "Pix",
  "consumption.room": "Cuenta de la habitación",
  "consumption.receipt": "Recibo",
  "consumption.paid": "Pagado",
  "consumption.charged": "A pagar en el check-out",
  "consumption.problem": "Pagué y la cerradura no se abrió",

  "receipt.title": "Recibo",
  "receipt.hotel": "Establecimiento",
  "receipt.room": "Habitación",
  "receipt.date": "Fecha y hora",
  "receipt.method": "Forma de pago",
  "receipt.code": "Código del pedido",
  "receipt.status": "Estado",
  "receipt.status.paid": "Pagado",
  "receipt.status.charged": "Cargado a la cuenta de la habitación",
  "receipt.print": "Descargar / imprimir recibo",
  "receipt.back": "Mi consumo",
  "receipt.notfound": "Recibo no encontrado.",
  "receipt.footer": "Comprobante emitido por SmartBar. Guárdelo para rendición de cuentas.",

  "help.title": "¿Cómo podemos ayudar?",
  "help.restock": "Solicitar reposición",
  "help.restock.text": "Minibar vacío o con artículos faltantes. Avisamos a la gobernanta con prioridad.",
  "help.damaged": "Reportar artículo dañado",
  "help.damaged.text": "Botella rota o sello roto antes de consumir.",
  "help.door": "Pagué y la cerradura no se abrió",
  "help.door.text": "Probamos la cerradura de la habitación y reenviamos la señal de apertura. Si no se resuelve, se avisa a la recepción.",
  "help.whatsapp": "Hablar con la recepción",
  "help.whatsapp.text": "Abre WhatsApp con el mensaje listo.",
  "help.note": "¿Quiere dar más detalles? (opcional)",
  "help.send": "Enviar",
  "help.sending": "Enviando…",
  "help.done.restock": "¡Listo! La gobernanta fue avisada y repondrá los artículos con prioridad.",
  "help.done.damaged": "Registrado. La recepción revisará y ajustará el cobro del artículo.",
  "help.done.door": "Aviso enviado. Probamos la cerradura y la recepción ya conoce el problema.",
  "help.error": "No fue posible enviar ahora. Hable con la recepción por WhatsApp.",
  "help.close": "Cerrar",
  "help.back": "Volver",
  "wa.text": "¡Hola! Estoy en la habitación {room} y necesito ayuda con el minibar SmartBar.",

  "lang.pt": "Português",
  "lang.en": "English",
  "lang.es": "Español",
};

export const DICTIONARIES: Record<Lang, Record<GuestKey, string>> = { pt, en, es };

/**
 * Traduz `key` e troca `{var}`. O plural usa `{n|singular|plural}` (n = 1 → singular).
 */
export function translate(lang: Lang, key: GuestKey, vars: Record<string, string | number> = {}): string {
  const raw = DICTIONARIES[lang][key] ?? DICTIONARIES.pt[key] ?? key;
  return raw
    .replace(/\{(\w+)\|([^|}]*)\|([^}]*)\}/g, (_, v: string, one: string, many: string) => (Number(vars[v]) === 1 ? one : many))
    .replace(/\{(\w+)\}/g, (_, v: string) => String(vars[v] ?? ""));
}

/** Idioma do celular → um dos três suportados (padrão: português). */
export function detectLang(navigatorLang: string | undefined | null): Lang {
  const base = (navigatorLang ?? "").toLowerCase().slice(0, 2);
  return (LANGS as readonly string[]).includes(base) ? (base as Lang) : "pt";
}

export const LOCALE_TAG: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

/* ── Traduções dos produtos do catálogo ────────────────────────────── */

interface ProductI18n {
  name: string;
  description: string;
}

const PRODUCT_PT: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Água mineral sem gás", description: "500 ml" },
  "AGU-CG": { name: "Água mineral com gás", description: "500 ml" },
  "REF-CO": { name: "Refrigerante coca cola original", description: "Lata 350 ml" },
  "REF-ZE": { name: "Refrigerante coca cola zero", description: "Lata 350 ml" },
  "SUC-UV": { name: "Suco de uva", description: "Lata 290 ml" },
  "AMD-50": { name: "Amendoim torrado", description: "Pacote 50 g" },
  "BAR-CE": { name: "Barra de cereal", description: "Castanhas e mel" },
  "BAT-PT": { name: "Batata chips", description: "35 g" },
};

const PRODUCT_EN: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Still mineral water", description: "500 ml" },
  "AGU-CG": { name: "Sparkling mineral water", description: "500 ml" },
  "REF-CO": { name: "Coca-Cola Original", description: "Can 350 ml" },
  "REF-ZE": { name: "Coca-Cola Zero", description: "Can 350 ml" },
  "SUC-UV": { name: "Grape juice", description: "Can 290 ml" },
  "AMD-50": { name: "Roasted peanuts", description: "50 g pack" },
  "BAR-CE": { name: "Cereal bar", description: "Nuts and honey" },
  "BAT-PT": { name: "Potato chips", description: "35 g" },
};

const PRODUCT_ES: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Agua mineral sin gas", description: "500 ml" },
  "AGU-CG": { name: "Agua mineral con gas", description: "500 ml" },
  "REF-CO": { name: "Coca-Cola Original", description: "Lata 350 ml" },
  "REF-ZE": { name: "Coca-Cola Zero", description: "Lata 350 ml" },
  "SUC-UV": { name: "Jugo de uva", description: "Lata 290 ml" },
  "AMD-50": { name: "Maní tostado", description: "Paquete 50 g" },
  "BAR-CE": { name: "Barra de cereal", description: "Frutos secos y miel" },
  "BAT-PT": { name: "Papas chips", description: "35 g" },
};

const PRODUCT_DICTS: Record<Lang, Record<string, ProductI18n>> = {
  pt: PRODUCT_PT,
  en: PRODUCT_EN,
  es: PRODUCT_ES,
};

export function translateProduct(lang: Lang, sku: string | null): ProductI18n | null {
  if (!sku) return null;
  return PRODUCT_DICTS[lang][sku] ?? PRODUCT_DICTS.pt[sku] ?? null;
}
