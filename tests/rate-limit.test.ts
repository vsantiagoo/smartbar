import { describe, expect, it, vi, afterEach } from "vitest";
import { freio, origem } from "@/lib/rate-limit";

/*
  O freio é a defesa dos endpoints anônimos. Se ele estiver frouxo, não protege;
  se estiver apertado ou errado, bloqueia hóspede legítimo. As duas falhas
  custam caro, então as duas estão cobertas aqui.
*/

afterEach(() => vi.useRealTimers());

describe("freio de abuso", () => {
  it("deixa passar até o limite e barra a seguinte", () => {
    const chave = `teste-basico-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(freio(chave, 3, 60_000).permitido).toBe(true);
    }
    const quarta = freio(chave, 3, 60_000);
    expect(quarta.permitido).toBe(false);
    expect(quarta.esperarSegundos).toBeGreaterThan(0);
  });

  it("conta cada chave separadamente", () => {
    const a = `sep-a-${Math.random()}`;
    const b = `sep-b-${Math.random()}`;
    freio(a, 1, 60_000);
    expect(freio(a, 1, 60_000).permitido).toBe(false);
    // O vizinho não paga pelo abuso do outro.
    expect(freio(b, 1, 60_000).permitido).toBe(true);
  });

  it("libera quando a janela passa", () => {
    vi.useFakeTimers();
    const chave = `janela-${Math.random()}`;
    expect(freio(chave, 1, 10_000).permitido).toBe(true);
    expect(freio(chave, 1, 10_000).permitido).toBe(false);

    vi.advanceTimersByTime(10_001);
    expect(freio(chave, 1, 10_000).permitido).toBe(true);
  });

  it("é janela DESLIZANTE: não aceita o dobro na virada", () => {
    vi.useFakeTimers();
    const chave = `deslizante-${Math.random()}`;
    const limite = 5;
    const janela = 60_000;

    // Gasta o orçamento inteiro no fim de um minuto.
    vi.setSystemTime(new Date("2026-01-01T10:00:59.000Z"));
    for (let i = 0; i < limite; i++) expect(freio(chave, limite, janela).permitido).toBe(true);

    // Dois segundos depois já é "outro minuto" — um contador que zera na virada
    // deixaria passar mais cinco aqui. A janela deslizante não deixa.
    vi.setSystemTime(new Date("2026-01-01T10:01:01.000Z"));
    expect(freio(chave, limite, janela).permitido).toBe(false);
  });

  it("informa quanto falta esperar, e o valor encolhe com o tempo", () => {
    vi.useFakeTimers();
    const chave = `espera-${Math.random()}`;
    freio(chave, 1, 60_000);

    const logo = freio(chave, 1, 60_000).esperarSegundos;
    vi.advanceTimersByTime(30_000);
    const depois = freio(chave, 1, 60_000).esperarSegundos;

    expect(logo).toBeGreaterThan(depois);
    expect(depois).toBeGreaterThan(0);
  });
});

describe("identificação de origem", () => {
  const req = (h: Record<string, string>) => new Request("https://exemplo.test/", { headers: h });

  it("usa o PRIMEIRO item de x-forwarded-for — é o cliente, o resto é proxy", () => {
    expect(origem(req({ "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178" }))).toBe("203.0.113.7");
  });

  it("aceita espaços em volta", () => {
    expect(origem(req({ "x-forwarded-for": "  203.0.113.7  , 70.41.3.18" }))).toBe("203.0.113.7");
  });

  it("cai para x-real-ip quando não há cadeia", () => {
    expect(origem(req({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
  });

  it("tem um fallback reconhecível quando não há cabeçalho nenhum", () => {
    expect(origem(req({}))).toBe("sem-ip");
  });
});
