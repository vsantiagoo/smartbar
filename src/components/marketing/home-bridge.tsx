import { Reveal } from "@/components/ui/reveal";
import { marketingCopy } from "@/lib/content/copy";
import { Lock3D } from "./lock-3d";

/**
 * SEÇÃO · A declaração da marca, sozinha na tela clara entre o hero (foto) e o
 * "Como funciona" (azul-marinho), com o cadeado 3D à direita. Sobre fundo claro
 * o texto usa `ink` e o destaque usa `gold-500` — o par do design system para
 * superfícies claras (o cadeado usa o mesmo par: malha em ink, luz em gold).
 *
 * Mesma caixa e mesmo alinhamento do "Como funciona" logo abaixo, para as duas
 * telas compartilharem a margem esquerda.
 */
export function HomeBridge() {
  const c = marketingCopy.statement;
  return (
    <section className="px-6 py-24 sm:py-32">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
        <h1
          className="max-w-3xl flex-1 self-start text-ink md:self-center"
          // letter-spacing em `em`: -2,8px no tamanho máximo (72px), proporcional no celular.
          style={{ fontSize: "clamp(42px,5vw,72px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.0389em" }}
        >
          {c.title} <span className="text-gold-500">{c.titleAccent}</span>
        </h1>
        <Lock3D className="size-72 shrink-0 sm:size-80 md:size-[22rem] lg:size-[26rem]" />
      </Reveal>
    </section>
  );
}
