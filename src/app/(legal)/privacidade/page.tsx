import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader, Publico } from "@/components/marketing/legal-header";
import { EMPRESA } from "@/lib/content/empresa";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o SmartBar trata dados pessoais de hóspedes e hotéis, sob a LGPD: o que coletamos (o mínimo), por quê, com quem compartilhamos e como exercer seus direitos.",
};

export default function PrivacidadePage() {
  return (
    <article>
      <LegalHeader
        titulo="Política de Privacidade"
        resumo="Esta política explica como o SmartBar coleta, usa, compartilha e protege dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD). Vale tanto para o hóspede que usa o minibar quanto para o hotel que contrata o serviço."
      />

      <h2 id="controlador">1. Quem é o controlador</h2>
      <p>
        O controlador dos dados tratados nesta plataforma é {EMPRESA.razaoSocial}{" "}
        (CNPJ {EMPRESA.cnpj}), responsável pelo serviço SmartBar. Para qualquer
        assunto de privacidade, fale com nosso Encarregado de Dados (DPO):{" "}
        <a href={`mailto:${EMPRESA.emailPrivacidade}`}>{EMPRESA.encarregadoDados}</a>.
      </p>
      <p>
        Quando o hotel usa o SmartBar para atender seus hóspedes, o hotel é o
        controlador dos dados daquela relação de hospedagem e o SmartBar atua como{" "}
        <strong>operador</strong> (LGPD, art. 5º, VII), tratando os dados conforme
        as instruções do hotel e esta política.
      </p>

      <h2 id="minima">2. Coleta mínima: o que NÃO pedimos</h2>
      <Publico quem="hospede" />
      <p>
        O SmartBar foi desenhado para funcionar com o <strong>mínimo</strong> de
        dado pessoal possível (LGPD, art. 6º, III — necessidade). Para comprar no
        minibar, o hóspede <strong>não cria conta, não informa nome, CPF, e-mail
        nem telefone</strong>. O pedido é identificado por um código aleatório de
        uso único (o token do pedido), não por você.
      </p>
      <p>Na prática, ao usar o minibar tratamos apenas:</p>
      <ul>
        <li>o <strong>quarto</strong> e os <strong>itens</strong> escolhidos (quais produtos e quantidades);</li>
        <li>o <strong>identificador do cartão-chave</strong> (UID do RFID), para liberar a trava do quarto certo;</li>
        <li>dados do <strong>pagamento Pix</strong>, processados pelo provedor de pagamento — não guardamos dados bancários.</li>
      </ul>

      <h2 id="empresa-dados">3. Dados do hotel e de seus operadores</h2>
      <Publico quem="empresa" />
      <p>
        Do hotel contratante e de quem opera o painel administrativo, tratamos o
        necessário para prestar o serviço: nome e e-mail de acesso dos usuários do
        painel, dados cadastrais do hotel, estoque, preços e o histórico de
        transações. A base legal é a <strong>execução de contrato</strong> (LGPD,
        art. 7º, V).
      </p>

      <h2 id="finalidades">4. Para que usamos os dados</h2>
      <ul>
        <li>liberar a trava do minibar após o pagamento confirmado;</li>
        <li>processar o pagamento e emitir o recibo do pedido;</li>
        <li>dar ao hotel o controle de estoque, reposição e faturamento;</li>
        <li>atender pedidos de suporte do hóspede (reposição, item danificado, trava que não abriu);</li>
        <li>cumprir obrigações legais, fiscais e regulatórias.</li>
      </ul>

      <h2 id="bases">5. Bases legais (LGPD, art. 7º)</h2>
      <ul>
        <li><strong>Execução de contrato</strong> — operar o minibar e o painel do hotel;</li>
        <li><strong>Cumprimento de obrigação legal</strong> — guarda fiscal e contábil das transações;</li>
        <li><strong>Legítimo interesse</strong> — segurança da plataforma e prevenção a fraude e abuso, sempre ponderado contra seus direitos;</li>
        <li><strong>Consentimento</strong> — apenas para o que for opcional (ver <Link href="/cookies">Política de Cookies</Link>), revogável a qualquer momento.</li>
      </ul>

      <h2 id="compartilhamento">6. Com quem compartilhamos (terceiros)</h2>
      <p>
        Não vendemos dados pessoais. Compartilhamos o estritamente necessário com
        operadores que sustentam o serviço, cada um tratando dados conforme
        contrato e esta política:
      </p>
      <ul>
        <li><strong>Provedor de banco de dados e autenticação</strong> (Supabase) — armazenamento seguro dos dados do hotel e das transações;</li>
        <li><strong>Provedor de pagamento Pix</strong> — para gerar a cobrança e confirmar o pagamento;</li>
        <li><strong>Provedor de hospedagem</strong> da aplicação;</li>
        <li><strong>Autoridades públicas</strong>, quando houver obrigação legal ou ordem judicial.</li>
      </ul>
      <p>
        Caso algum desses operadores trate dados fora do Brasil, exigimos garantias
        de proteção compatíveis com a LGPD (art. 33).
      </p>

      <h2 id="rastreamento">7. Rastreamento e analytics</h2>
      <p>
        O site do SmartBar <strong>não usa Google Analytics nem scripts de
        rastreamento publicitário de terceiros</strong>. Não montamos perfil de
        navegação para anúncios. Usamos apenas cookies estritamente necessários ao
        funcionamento (como a sua preferência de idioma e de tema). Se um dia
        adotarmos qualquer medição opcional, ela só será ativada{" "}
        <strong>após o seu consentimento</strong>, e esta seção e a{" "}
        <Link href="/cookies">Política de Cookies</Link> serão atualizadas antes
        disso.
      </p>

      <h2 id="retencao">8. Por quanto tempo guardamos</h2>
      <p>
        Guardamos os dados pelo tempo necessário às finalidades acima e aos prazos
        legais — em especial a guarda fiscal e contábil das transações exigida por
        lei. Encerrado o prazo e a finalidade, os dados são eliminados ou
        anonimizados.
      </p>

      <h2 id="direitos">9. Seus direitos (LGPD, art. 18) e exclusão de dados</h2>
      <Publico quem="ambos" />
      <p>Você pode, a qualquer momento, solicitar:</p>
      <ul>
        <li>confirmação de que tratamos seus dados e acesso a eles;</li>
        <li>correção de dados incompletos ou desatualizados;</li>
        <li><strong>eliminação</strong> dos dados tratados com base no seu consentimento;</li>
        <li>portabilidade e informação sobre com quem compartilhamos;</li>
        <li>revogação do consentimento.</li>
      </ul>
      <p>
        Para exercer qualquer direito, escreva para{" "}
        <a href={`mailto:${EMPRESA.emailPrivacidade}`}>{EMPRESA.emailPrivacidade}</a>.
        Respondemos no menor prazo possível. Alguns dados podem ser retidos mesmo
        após o pedido de exclusão quando houver obrigação legal de guarda — nesse
        caso, explicamos qual e por quanto tempo.
      </p>

      <h2 id="seguranca">10. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger os dados:
        isolamento de acesso por hotel no banco (RLS), autenticação de dispositivos
        de hardware com comparação em tempo constante, cabeçalhos de segurança HTTP
        e freio contra abuso dos endpoints públicos. Nenhum sistema é
        infalível; em caso de incidente relevante, comunicaremos os titulares e a
        ANPD conforme a LGPD (art. 48).
      </p>

      <h2 id="alteracoes">11. Alterações desta política</h2>
      <p>
        Podemos atualizar esta política. Mudanças relevantes serão sinalizadas no
        site, e a data de vigência no topo sempre indica a versão em vigor.
      </p>

      <h2 id="anpd">12. Reclamação à ANPD</h2>
      <p>
        Se entender que seus dados não foram tratados conforme a lei, você pode
        reclamar à Autoridade Nacional de Proteção de Dados (ANPD), sem prejuízo de
        falar antes com o nosso Encarregado de Dados.
      </p>
    </article>
  );
}
