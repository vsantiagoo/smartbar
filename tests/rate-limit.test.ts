import { describe, expect, it, vi, afterEach } from "vitest";
import { aplicarFreio, freio, freioPorAlvo, freioPorIp, origem, ORCAMENTO } from "@/lib/rate-limit";

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

describe("dois níveis: por IP e por alvo", () => {
  const ORC = { porAlvo: 2, porIp: 10, janelaMs: 60_000 };
  const req = (ip: string) =>
    new Request("https://exemplo.test/", { headers: { "x-forwarded-for": ip } });

  it("o alvo tem orçamento próprio: o hotel inteiro não disputa o mesmo balde", () => {
    // ESTE é o bug que os dois níveis consertam. Todos os hóspedes saem pelo
    // MESMO IP; se o orçamento fosse por IP, o terceiro quarto a pedir no mesmo
    // minuto levaria 429 sem ter feito nada.
    const nome = `nat-${Math.random()}`;
    const ip = "203.0.113.9";

    for (const quarto of ["101", "102", "103", "104"]) {
      expect(aplicarFreio(nome, ORC, req(ip), quarto)).toBeNull();
      expect(aplicarFreio(nome, ORC, req(ip), quarto)).toBeNull();
    }
  });

  it("mas o mesmo alvo estoura no seu limite apertado", async () => {
    const nome = `alvo-${Math.random()}`;
    const ip = "203.0.113.10";

    expect(aplicarFreio(nome, ORC, req(ip), "101")).toBeNull();
    expect(aplicarFreio(nome, ORC, req(ip), "101")).toBeNull();

    const barrado = aplicarFreio(nome, ORC, req(ip), "101");
    expect(barrado?.status).toBe(429);
    expect(Number(barrado?.headers.get("retry-after"))).toBeGreaterThan(0);
    await expect(barrado?.json()).resolves.toEqual({ error: "rate_limited" });
  });

  it("o teto por IP ainda detém flood, mesmo com alvos diferentes a cada chamada", () => {
    // O generoso existe para isto: variar o alvo não compra passe livre.
    const nome = `flood-${Math.random()}`;
    const ip = "203.0.113.11";

    for (let i = 0; i < ORC.porIp; i++) {
      expect(aplicarFreio(nome, ORC, req(ip), `quarto-${i}`)).toBeNull();
    }
    expect(aplicarFreio(nome, ORC, req(ip), "quarto-novo")?.status).toBe(429);
  });

  it("os dois passos cobram o orçamento por IP UMA vez, não duas", () => {
    // O handler que só conhece o quarto depois de ler o corpo aplica o freio
    // em dois passos. Se o segundo passo também cobrasse o balde por IP, o teto
    // efetivo seria a metade do declarado — e ninguém notaria até o hotel
    // encher. Aqui o teto é 10: dez requisições completas precisam passar.
    const nome = `dois-passos-${Math.random()}`;
    const ip = "203.0.113.12";

    for (let i = 0; i < ORC.porIp; i++) {
      expect(freioPorIp(nome, ORC, req(ip)), `requisição ${i + 1}`).toBeNull();
      expect(freioPorAlvo(nome, ORC, `quarto-${i}`)).toBeNull();
    }
    expect(freioPorIp(nome, ORC, req(ip))?.status).toBe(429);
  });

  it("IPs diferentes não se contaminam", () => {
    const nome = `ips-${Math.random()}`;
    const apertado = { porAlvo: 50, porIp: 1, janelaMs: 60_000 };

    expect(aplicarFreio(nome, apertado, req("198.51.100.1"), "101")).toBeNull();
    expect(aplicarFreio(nome, apertado, req("198.51.100.1"), "102")?.status).toBe(429);
    expect(aplicarFreio(nome, apertado, req("198.51.100.2"), "103")).toBeNull();
  });

  it("todo endpoint tem o teto por IP maior que o por alvo", () => {
    // Se fosse ao contrário, o nível por alvo nunca seria alcançado e um quarto
    // sozinho conseguiria esgotar o orçamento do prédio.
    for (const [endpoint, orc] of Object.entries(ORCAMENTO)) {
      expect(orc.porIp, endpoint).toBeGreaterThan(orc.porAlvo);
    }
  });
});
