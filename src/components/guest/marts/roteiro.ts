import { normalizar } from "@/components/guest/marts/voice";
import type { Lang } from "@/lib/i18n/config";

/**
 * Deixa o hóspede DIGITAR uma pergunta, em vez de só tocar nos botões — sem
 * fingir ser um chat de IA. O casamento é por palavra-chave contra o mesmo
 * roteiro das perguntas prontas; a pergunta com mais palavras batendo vence,
 * e abaixo de um acerto não há resposta — a Marts diz que não sabe e entrega
 * para a recepção, em vez de inventar.
 */
export type TopicoId = "howItWorks" | "security" | "help";

const PALAVRAS: Record<TopicoId, Record<Lang, string[]>> = {
  howItWorks: {
    pt: ["pagar", "pagamento", "pix", "funciona", "cobra", "preco", "preço", "valor", "comprar"],
    en: ["pay", "payment", "pix", "work", "charge", "price", "cost", "buy"],
    es: ["pagar", "pago", "funciona", "cobra", "precio", "valor", "comprar"],
  },
  security: {
    pt: ["seguro", "seguranca", "segurança", "cobranca", "cobrança", "depois", "taxa", "dado", "privacidade", "cartao", "cartão"],
    en: ["safe", "security", "charge", "later", "fee", "data", "privacy", "card"],
    es: ["seguro", "seguridad", "cargo", "despues", "después", "tarifa", "dato", "privacidad", "tarjeta"],
  },
  help: {
    pt: ["ajuda", "problema", "reposicao", "reposição", "danificado", "quebrado", "trava", "abriu", "recepcao", "recepção", "defeito"],
    en: ["help", "problem", "restock", "damaged", "broken", "lock", "open", "front desk", "issue"],
    es: ["ayuda", "problema", "reposicion", "reposición", "danado", "dañado", "roto", "cerradura", "abrio", "abrió", "recepcion", "recepción"],
  },
};

/** Devolve o tópico com mais palavras-chave batendo, ou `null` se nenhuma bateu. */
export function casarPergunta(texto: string, lang: Lang): TopicoId | null {
  const norm = normalizar(texto);
  let melhor: TopicoId | null = null;
  let maiorPontuacao = 0;
  for (const id of Object.keys(PALAVRAS) as TopicoId[]) {
    const pontos = PALAVRAS[id][lang].filter((p) => norm.includes(normalizar(p))).length;
    if (pontos > maiorPontuacao) {
      maiorPontuacao = pontos;
      melhor = id;
    }
  }
  return melhor;
}
