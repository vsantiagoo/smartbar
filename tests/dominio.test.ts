import { beforeEach, describe, expect, it } from "vitest";
import { DomainError } from "@/lib/data/repository";
import { mockRepository } from "@/lib/data/mock/repo";
import { getMockStore, invKey } from "@/lib/data/mock/store";

/**
 * As regras que, se quebrarem, custam dinheiro.
 *
 * Não são testes de cobertura — são testes dos INVARIANTES: afirmações que
 * precisam valer sempre, e cuja violação significa estoque sumindo, item saindo
 * sem pagamento ou cobrança a mais. Cada `it` abaixo corresponde a uma delas.
 */

/** Zera o banco em memória entre os testes — ele vive em `globalThis`. */
function reiniciarBanco() {
  delete (globalThis as { __smartbarMock?: unknown }).__smartbarMock;
  return getMockStore();
}

/** Um quarto com estadia ativa (tem cartão-chave) e um produto com estoque. */
function cenario() {
  const s = getMockStore();
  const stay = s.stays.find((e) => e.rfidUid)!;
  const room = s.rooms.find((r) => r.id === stay.roomId)!;
  const linha = [...s.inventory.entries()].find(
    ([chave, valor]) => chave.startsWith(`${room.id}:`) && valor.quantity >= 3,
  )!;
  const productId = linha[0].split(":")[1]!;
  const produto = s.products.find((p) => p.id === productId)!;
  return { s, room, stay, produto, estoque: linha[1] };
}

describe("preço e estoque são do servidor, nunca do cliente", () => {
  beforeEach(reiniciarBanco);

  it("usa o preço do catálogo, ignorando o que vier na requisição", async () => {
    const { room, produto } = cenario();

    // O cliente manda só produto e quantidade — não há onde injetar preço.
    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 2 }],
    });

    expect(tx.totalCents).toBe(produto.priceCents * 2);
    expect(tx.items[0]!.unitPriceCents).toBe(produto.priceCents);
    // E o nome também vem do servidor: é ele que aparece no recibo.
    expect(tx.items[0]!.productName).toBe(produto.name);
  });

  it("recusa produto inexistente", async () => {
    const { room } = cenario();
    await expect(
      mockRepository.createTransaction({
        hotelId: room.hotelId,
        roomId: room.id,
        method: "pix",
        items: [{ productId: "nao-existe", quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });

  it("recusa pedido maior que o estoque, antes de criar a transação", async () => {
    const { room, produto, estoque } = cenario();
    await expect(
      mockRepository.createTransaction({
        hotelId: room.hotelId,
        roomId: room.id,
        method: "pix",
        items: [{ productId: produto.id, quantity: estoque.quantity + 1 }],
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});

describe("autorizar é idempotente", () => {
  beforeEach(reiniciarBanco);

  it("webhook repetido não abate o estoque duas vezes", async () => {
    const { s, room, produto, estoque } = cenario();
    const antes = estoque.quantity;

    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 2 }],
    });

    const primeira = await mockRepository.authorizeTransaction(tx.id, "pix_webhook");
    const segunda = await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(primeira.ok).toBe(true);
    // A segunda também devolve ok — o provedor reenvia, e reenvio não é erro.
    expect(segunda.ok).toBe(true);
    expect(segunda.status).toBe("authorized");

    // Mas o estoque caiu UMA vez só. É esta linha que protege o dinheiro.
    expect(s.inventory.get(invKey(room.id, produto.id))!.quantity).toBe(antes - 2);
  });
});

describe("o estoque nunca fica negativo", () => {
  beforeEach(reiniciarBanco);

  it("falha a autorização se o estoque sumiu entre o pedido e o pagamento", async () => {
    const { s, room, produto } = cenario();

    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 2 }],
    });

    // Alguém esvaziou a prateleira enquanto o hóspede pagava.
    s.inventory.get(invKey(room.id, produto.id))!.quantity = 1;

    const r = await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(r.ok).toBe(false);
    expect(r.reason).toBe("out_of_stock");
    // E o que sobrou continua lá: nada foi abatido pela metade.
    expect(s.inventory.get(invKey(room.id, produto.id))!.quantity).toBe(1);
  });

  it("confere TODOS os itens antes de abater qualquer um", async () => {
    const { s, room } = cenario();
    const comEstoque = [...s.inventory.entries()].filter(
      ([chave, v]) => chave.startsWith(`${room.id}:`) && v.quantity >= 2,
    );
    if (comEstoque.length < 2) return; // cenário não disponível no seed

    const [chaveA, linhaA] = comEstoque[0]!;
    const [chaveB] = comEstoque[1]!;
    const idA = chaveA.split(":")[1]!;
    const idB = chaveB.split(":")[1]!;
    const antesA = linhaA.quantity;

    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [
        { productId: idA, quantity: 1 },
        { productId: idB, quantity: 1 },
      ],
    });

    // O SEGUNDO item some. O primeiro não pode ser abatido assim mesmo.
    s.inventory.get(invKey(room.id, idB))!.quantity = 0;

    const r = await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(r.ok).toBe(false);
    expect(s.inventory.get(invKey(room.id, idA))!.quantity).toBe(antesA);
  });
});

describe("só transação pendente autoriza", () => {
  beforeEach(reiniciarBanco);

  it("não autoriza o que já falhou", async () => {
    const { s, room, produto } = cenario();
    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 1 }],
    });

    s.transactions.find((t) => t.id === tx.id)!.status = "failed";
    const r = await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(r.ok).toBe(false);
    expect(r.status).toBe("failed");
  });

  it("não autoriza transação inexistente", async () => {
    const r = await mockRepository.authorizeTransaction("00000000-0000-0000-0000-000000000000", "pix_webhook");
    expect(r.ok).toBe(false);
    expect(r.status).toBe("not_found");
  });
});

describe("a trava só abre com a autorização", () => {
  beforeEach(reiniciarBanco);

  it("o quarto continua trancado enquanto a transação está pendente", async () => {
    const { s, room, produto } = cenario();
    s.rooms.find((r) => r.id === room.id)!.lockState = "locked";

    await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 1 }],
    });

    expect(s.rooms.find((r) => r.id === room.id)!.lockState).toBe("locked");
  });

  it("destranca ao autorizar, e só então", async () => {
    const { s, room, produto } = cenario();
    s.rooms.find((r) => r.id === room.id)!.lockState = "locked";

    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 1 }],
    });
    await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(s.rooms.find((r) => r.id === room.id)!.lockState).toBe("unlocked");
  });

  it("não destranca quando a autorização falha por falta de estoque", async () => {
    const { s, room, produto } = cenario();
    const quarto = s.rooms.find((r) => r.id === room.id)!;
    quarto.lockState = "locked";

    const tx = await mockRepository.createTransaction({
      hotelId: room.hotelId,
      roomId: room.id,
      method: "pix",
      items: [{ productId: produto.id, quantity: 2 }],
    });
    s.inventory.get(invKey(room.id, produto.id))!.quantity = 0;
    await mockRepository.authorizeTransaction(tx.id, "pix_webhook");

    expect(quarto.lockState).toBe("locked");
  });
});

describe("conta do quarto exige estadia com cartão-chave", () => {
  beforeEach(reiniciarBanco);

  it("recusa `room_charge` em quarto sem estadia ativa", async () => {
    const s = getMockStore();
    const semEstadia = s.rooms.find((r) => !s.stays.some((e) => e.roomId === r.id && e.rfidUid));
    if (!semEstadia) return; // o seed não tem esse caso

    const linha = [...s.inventory.entries()].find(([c, v]) => c.startsWith(`${semEstadia.id}:`) && v.quantity > 0);
    if (!linha) return;

    await expect(
      mockRepository.createTransaction({
        hotelId: semEstadia.hotelId,
        roomId: semEstadia.id,
        method: "room_charge",
        items: [{ productId: linha[0].split(":")[1]!, quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});
