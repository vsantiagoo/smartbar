import { z } from "zod";

/*
  REGRA DE TETO em TODO campo texto.

  Zod aceita `.min(1)` sem `.max()` e deixa passar string de qualquer tamanho.
  Em endpoint público é vetor de DoS: o atacante envia "AAAA..." com milhões
  de caracteres, o parse passa, e o valor rodeia o sistema — vira chave do
  rate limiter (balde enorme na memória), tenta virar query no banco, engorda
  logs. Isso ficou mais sério ainda depois do GHSA que mostrou Zod (<4.6.6)
  esgotando memória com coleções grandes.

  IDs internos (hotelId, roomId, productId, deviceId): 64 chars cabem UUID,
  slug e qualquer esquema futuro. Nada legítimo passa disso.
  Tokens externos (transactionToken, uid RFID): o do nosso app é UUID (36);
  64 dá folga para prefixos sem abrir flanco.
  Mensagens de texto (note, event, status): limites de bom senso.
*/
const ID_MAX = 64;
const SHORT_LABEL_MAX = 120;

export const checkoutSchema = z.object({
  hotelId: z.string().min(1).max(ID_MAX),
  roomId: z.string().min(1).max(ID_MAX),
  method: z.enum(["pix", "room_charge"]),
  items: z
    .array(z.object({ productId: z.string().min(1).max(ID_MAX), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30),
});

export const supportSchema = z.object({
  hotelId: z.string().min(1).max(ID_MAX),
  roomId: z.string().min(1).max(ID_MAX),
  kind: z.enum(["restock", "damaged", "door_problem"]),
  note: z.string().max(300).optional(),
  transactionToken: z.string().min(1).max(ID_MAX).optional(),
});

export const rfidSchema = z.object({
  deviceId: z.string().min(1).max(ID_MAX),
  uid: z.string().min(4).max(32),
});

export const pixWebhookSchema = z.object({
  event: z.string().min(1).max(SHORT_LABEL_MAX),
  payment: z.object({
    id: z.string().min(1).max(ID_MAX),
    externalReference: z.string().max(ID_MAX).nullish(),
    status: z.string().max(SHORT_LABEL_MAX).nullish(),
    /**
     * Valor pago, em REAIS (o Asaas manda `23.9`, não centavos). Opcional
     * porque nem todo provedor envia — mas quando vem, é conferido contra o
     * total do pedido antes de a trava abrir. `.finite()` barra NaN/Infinity
     * que Zod aceita em `z.number()` por padrão: nenhum dos dois é um valor
     * de pagamento válido e não têm por que chegar até a verificação de
     * centavos no webhook.
     */
    value: z.number().finite().nonnegative().nullish(),
  }),
});
