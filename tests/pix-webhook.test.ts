import { beforeEach, describe, expect, it } from "vitest";
import { mockRepository } from "@/lib/data/mock/repo";
import { getMockStore, invKey } from "@/lib/data/mock/store";
import { POST } from "@/app/api/pix/webhook/route";

/*
  O WEBHOOK É O PORTÃO DO DINHEIRO.

  É o único lugar onde um evento vindo de fora abre uma trava física e abate
  estoque. Dois invariantes valem aqui, e os dois custam caro quando quebram:

    1. Não autoriza sem pagamento do valor certo.  (prejuízo do hotel)
    2. Autoriza UMA vez, mesmo recebendo o evento repetido. (estoque sumindo)

  Provedores de pagamento reenviam webhook por desenho — o item 2 não é zelo
  excessivo, é o comportamento normal do Asaas.
*/

const TOKEN = "token-de-teste-do-webhook";
process.env.PIX_WEBHOOK_TOKEN = TOKEN;

function reiniciarBanco() {
  delete (globalThis as { __smartbarMock?: unknown }).__smartbarMock;
  return getMockStore();
}

/** Um pedido Pix pendente, com o total que o hóspede viu na tela. */
async function pedidoPendente() {
  const s = getMockStore();
  const stay = s.stays.find((e) => e.rfidUid)!;
  const room = s.rooms.find((r) => r.id === stay.roomId)!;
  const [chave, linha] = [...s.inventory.entries()].find(
    ([k, v]) => k.startsWith(`${room.id}:`) && v.quantity >= 2,
  )!;
  const productId = chave.split(":")[1]!;

  const tx = await mockRepository.createTransaction({
    hotelId: room.hotelId,
    roomId: room.id,
    method: "pix",
    items: [{ productId, quantity: 1 }],
  });
  return { tx, room, productId, estoqueAntes: linha.quantity };
}

function evento(txId: string, value?: number) {
  return new Request("https://exemplo.test/api/pix/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "asaas-access-token": TOKEN },
    body: JSON.stringify({
      event: "PAYMENT_RECEIVED",
      payment: { id: "pay_1", externalReference: txId, ...(value === undefined ? {} : { value }) },
    }),
  });
}

describe("webhook do Pix", () => {
  beforeEach(reiniciarBanco);

  it("recusa sem o token, e não toca na transação", async () => {
    const { tx } = await pedidoPendente();
    const semToken = new Request("https://exemplo.test/api/pix/webhook", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "PAYMENT_RECEIVED", payment: { id: "p", externalReference: tx.id } }),
    });

    expect((await POST(semToken)).status).toBe(401);
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("pending");
  });

  it("NÃO autoriza quando o valor pago é menor que o total", async () => {
    const { tx, room, productId, estoqueAntes } = await pedidoPendente();

    const res = await POST(evento(tx.id, (tx.totalCents - 1) / 100));
    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toEqual({ error: "amount_mismatch" });

    // E nada aconteceu: pedido pendente, estoque intacto, trava fechada.
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("pending");
    expect(getMockStore().inventory.get(invKey(room.id, productId))!.quantity).toBe(estoqueAntes);
    expect(getMockStore().rooms.find((r) => r.id === room.id)!.lockState).toBe("locked");
  });

  it("autoriza com o valor exato", async () => {
    const { tx, room, productId, estoqueAntes } = await pedidoPendente();

    expect((await POST(evento(tx.id, tx.totalCents / 100))).status).toBe(200);
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("authorized");
    expect(getMockStore().inventory.get(invKey(room.id, productId))!.quantity).toBe(estoqueAntes - 1);
  });

  it("aceita pagamento a MAIS — estorno é outro problema, não motivo para trancar", async () => {
    const { tx } = await pedidoPendente();
    expect((await POST(evento(tx.id, tx.totalCents / 100 + 5))).status).toBe(200);
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("authorized");
  });

  it("autoriza quando o provedor não manda valor — não dá pra conferir o que não veio", async () => {
    const { tx } = await pedidoPendente();
    expect((await POST(evento(tx.id))).status).toBe(200);
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("authorized");
  });

  it("é IDEMPOTENTE: o evento repetido não abate estoque duas vezes", async () => {
    const { tx, room, productId, estoqueAntes } = await pedidoPendente();

    await POST(evento(tx.id, tx.totalCents / 100));
    await POST(evento(tx.id, tx.totalCents / 100));
    await POST(evento(tx.id, tx.totalCents / 100));

    expect(getMockStore().inventory.get(invKey(room.id, productId))!.quantity).toBe(estoqueAntes - 1);
  });

  it("ignora evento que não é de pagamento recebido", async () => {
    const { tx } = await pedidoPendente();
    const req = new Request("https://exemplo.test/api/pix/webhook", {
      method: "POST",
      headers: { "content-type": "application/json", "asaas-access-token": TOKEN },
      body: JSON.stringify({ event: "PAYMENT_CREATED", payment: { id: "p", externalReference: tx.id } }),
    });

    await expect((await POST(req)).json()).resolves.toEqual({ ignored: true });
    expect((await mockRepository.getTransactionById(tx.id))!.status).toBe("pending");
  });
});
