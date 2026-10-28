import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/marketing/legal-header";
import { EMPRESA } from "@/lib/content/empresa";

export const metadata: Metadata = {
  title: "Política de Reembolso",
  description:
    "Quando e como pedir reembolso de uma compra no minibar SmartBar, de acordo com o Código de Defesa do Consumidor.",
};

export default function ReembolsoPage() {
  return (
    <article>
      <LegalHeader
        titulo="Política de Reembolso"
        resumo="Esta política descreve quando uma compra no minibar pode ser reembolsada, seguindo o Código de Defesa do Consumidor (CDC). O reembolso é operacionalizado pelo hotel, com o suporte do SmartBar."
      />

      <h2 id="falha">1. Pagou e a trava não abriu</h2>
      <p>
        Se o pagamento foi confirmado mas a trava do minibar não liberou, você tem
        direito ao reembolso integral ou à liberação do item, à sua escolha. Use o
        botão de suporte na tela do pedido ou procure a recepção. É o caso mais
        comum e o de resolução mais direta.
      </p>

      <h2 id="divergencia">2. Item errado ou cobrança divergente</h2>
      <p>
        Se o valor cobrado não corresponde ao pedido, ou o item retirado não é o
        comprado, o hotel corrige a cobrança e reembolsa a diferença. O preço que
        vale é sempre o exibido no catálogo no momento da compra.
      </p>

      <h2 id="arrependimento">3. Direito de arrependimento</h2>
      <p>
        A compra no minibar é um consumo imediato e presencial, feito dentro do
        quarto — não é uma compra à distância. Por isso o prazo de arrependimento
        de 7 dias do art. 49 do CDC, próprio de compras fora do estabelecimento,
        não se aplica a itens já liberados e consumidos. Produtos{" "}
        <strong>não liberados</strong> por falha do serviço são sempre
        reembolsáveis (ver item 1).
      </p>

      <h2 id="prazo">4. Prazo e forma do reembolso</h2>
      <p>
        Reembolsos de Pix são feitos para a mesma origem do pagamento, no menor
        prazo operacional possível após a confirmação do caso. O prazo efetivo pode
        depender do provedor de pagamento e da instituição do pagador.
      </p>

      <h2 id="como">5. Como solicitar</h2>
      <ul>
        <li>pelo botão de suporte na tela do seu pedido; ou</li>
        <li>na recepção do hotel, informando o quarto e o horário da compra; ou</li>
        <li>pelo e-mail <a href={`mailto:${EMPRESA.emailContato}`}>{EMPRESA.emailContato}</a>, para casos não resolvidos no hotel.</li>
      </ul>

      <h2 id="cdc">6. Seus direitos no CDC</h2>
      <p>
        Esta política não limita direitos garantidos pelo Código de Defesa do
        Consumidor. Em caso de conflito, prevalece o que for mais favorável ao
        consumidor. Veja também os <Link href="/termos">Termos de Uso</Link>.
      </p>
    </article>
  );
}
