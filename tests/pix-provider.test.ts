import { afterEach, describe, expect, it } from "vitest";
import { getPixProvider } from "@/lib/payments/pix";

/*
  getPixProvider lê PIX_PROVIDER do ambiente. O caso que importa não é o feliz —
  é a VARIÁVEL VAZIA. Copiar o .env.example e apagar o valor deixa a linha
  presente e vazia; com `??` em vez de `||` isso cairia no `throw` e TODO
  checkout Pix devolveria 500. O teste tranca o `||`.
*/

const original = process.env.PIX_PROVIDER;
afterEach(() => {
  if (original === undefined) delete process.env.PIX_PROVIDER;
  else process.env.PIX_PROVIDER = original;
});

describe("getPixProvider", () => {
  it("cai no mock quando a variável está AUSENTE", () => {
    delete process.env.PIX_PROVIDER;
    expect(() => getPixProvider()).not.toThrow();
  });

  it("cai no mock quando a variável está VAZIA — é o bug do `??`", () => {
    process.env.PIX_PROVIDER = "";
    expect(() => getPixProvider()).not.toThrow();
  });

  it("aceita 'mock' explícito", () => {
    process.env.PIX_PROVIDER = "mock";
    expect(() => getPixProvider()).not.toThrow();
  });

  it("falha claro para um provedor ainda não implementado — não silencioso", () => {
    process.env.PIX_PROVIDER = "asaas";
    expect(() => getPixProvider()).toThrow(/asaas/);
  });
});
