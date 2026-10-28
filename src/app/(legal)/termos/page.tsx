import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader, Publico } from "@/components/marketing/legal-header";
import { EMPRESA } from "@/lib/content/empresa";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Condições de uso do SmartBar para hóspedes e hotéis: como o serviço funciona, responsabilidades, pagamento, e as leis brasileiras aplicáveis.",
};

export default function TermosPage() {
  return (
    <article>
      <LegalHeader
        titulo="Termos de Uso"
        resumo="Estes Termos regem o uso do SmartBar. Ao usar o minibar inteligente (hóspede) ou o painel do hotel (cliente contratante), você concorda com as condições abaixo."
      />

      <h2 id="objeto">1. O que é o SmartBar</h2>
      <p>
        O SmartBar é um sistema de minibar inteligente para hotéis: o hóspede
        escolhe os itens, paga por Pix e a trava do compartimento é liberada após a
        confirmação do pagamento. O hotel acompanha estoque, reposição e
        faturamento por um painel.
      </p>

      <h2 id="hospede">2. Uso pelo hóspede</h2>
      <Publico quem="hospede" />
      <ul>
        <li>o acesso se dá pelo QR Code do quarto, sem criação de conta;</li>
        <li>a trava só abre após o pagamento confirmado — é a regra central do serviço;</li>
        <li>os itens consumidos são de responsabilidade de quem realiza a compra;</li>
        <li>o uso indevido, a tentativa de fraude ou de violação da trava podem ser cobrados pelo hotel e comunicados às autoridades.</li>
      </ul>

      <h2 id="hotel">3. Uso pelo hotel</h2>
      <Publico quem="empresa" />
      <ul>
        <li>o hotel é responsável pelos dados que cadastra (quartos, produtos, preços) e pela veracidade deles;</li>
        <li>o hotel é o controlador dos dados dos seus hóspedes e deve ter base legal para tratá-los (ver <Link href="/privacidade">Política de Privacidade</Link>);</li>
        <li>as credenciais de acesso ao painel são pessoais e intransferíveis;</li>
        <li>o hotel define preços e condições de venda ao hóspede.</li>
      </ul>

      <h2 id="pagamento">4. Pagamento e preços</h2>
      <p>
        Os preços exibidos ao hóspede são definidos pelo hotel e cobrados em reais,
        por Pix. O valor é validado no servidor no momento da compra — o preço que
        vale é o do catálogo, não o informado pelo dispositivo do cliente. A trava
        só é liberada quando o valor pago corresponde ao total do pedido.
      </p>

      <h2 id="reembolso">5. Cancelamento e reembolso</h2>
      <p>
        As condições de devolução e reembolso estão na{" "}
        <Link href="/reembolso">Política de Reembolso</Link>, que faz parte destes
        Termos e observa o Código de Defesa do Consumidor (CDC).
      </p>

      <h2 id="disponibilidade">6. Disponibilidade e limites</h2>
      <p>
        Empenhamo-nos para manter o serviço disponível e correto, mas ele depende
        de energia, rede e do hardware instalado no hotel. Indicadores de
        desempenho divulgados no site têm caráter de <strong>referência de
        mercado</strong> e são identificados como tais — não constituem garantia de
        resultado individual, que depende da operação de cada hotel.
      </p>

      <h2 id="propriedade">7. Propriedade intelectual</h2>
      <p>
        A marca, o software e os materiais do SmartBar pertencem a{" "}
        {EMPRESA.razaoSocial} e não podem ser copiados, modificados ou
        redistribuídos sem autorização.
      </p>

      <h2 id="responsabilidade">8. Limitação de responsabilidade</h2>
      <p>
        Nos limites permitidos em lei, o SmartBar não responde por danos
        decorrentes de mau uso, de falhas de infraestrutura alheias ao serviço ou
        de dados incorretos cadastrados pelo hotel. Nada nestes Termos afasta
        direitos irrenunciáveis do consumidor previstos no CDC.
      </p>

      <h2 id="dados-empresa">9. Identificação da empresa</h2>
      <p>
        Serviço prestado por {EMPRESA.razaoSocial}, CNPJ {EMPRESA.cnpj}, com sede em{" "}
        {EMPRESA.endereco}. Contato: {EMPRESA.emailContato}.
      </p>

      <h2 id="lei">10. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis do {EMPRESA.pais}, em especial a LGPD
        (Lei 13.709/2018), o Código de Defesa do Consumidor (Lei 8.078/1990) e o
        Marco Civil da Internet (Lei 12.965/2014). Fica eleito o foro de{" "}
        {EMPRESA.foro} para dirimir questões, sem prejuízo do foro de domicílio do
        consumidor quando a lei assim garantir.
      </p>

      <h2 id="contato">11. Contato</h2>
      <p>
        Dúvidas sobre estes Termos:{" "}
        <a href={`mailto:${EMPRESA.emailContato}`}>{EMPRESA.emailContato}</a>.
      </p>
    </article>
  );
}
