import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/marketing/legal-header";
import { EMPRESA } from "@/lib/content/empresa";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Quais cookies o SmartBar usa — só os estritamente necessários — e como você controla o consentimento.",
};

export default function CookiesPage() {
  return (
    <article>
      <LegalHeader
        titulo="Política de Cookies"
        resumo="Cookie é um pequeno arquivo que o site guarda no seu navegador. O SmartBar usa o mínimo possível: hoje, apenas os estritamente necessários para o site funcionar. Nenhum cookie de publicidade ou de rastreamento de terceiros."
      />

      <h2 id="tipos">1. O que usamos hoje</h2>
      <p>
        Usamos somente cookies e armazenamento local <strong>estritamente
        necessários</strong>, que não dependem de consentimento prévio porque sem
        eles o site não funciona:
      </p>
      <ul>
        <li><strong>Preferência de idioma</strong> (<code>sb_lang</code>) — lembra o idioma que você escolheu;</li>
        <li><strong>Preferência de tema</strong> (claro/escuro) — para não piscar a cada visita;</li>
        <li><strong>Sessão do painel do hotel</strong> — mantém o operador autenticado enquanto usa o painel;</li>
        <li><strong>Registro do seu consentimento de cookies</strong> — guarda a sua escolha nesta página para não perguntar de novo.</li>
      </ul>

      <h2 id="nao-usamos">2. O que NÃO usamos</h2>
      <p>
        Não usamos Google Analytics, pixels de redes sociais, cookies de
        publicidade nem qualquer rastreador de terceiros para montar perfil de
        navegação. Isso é uma escolha de projeto, descrita também na{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>

      <h2 id="opcionais">3. Cookies opcionais (futuro)</h2>
      <p>
        Caso um dia passemos a usar qualquer cookie <strong>não</strong> essencial
        — por exemplo, medição de uso para melhorar o produto — ele ficará{" "}
        <strong>desligado por padrão</strong> e só será ativado se você aceitar no
        banner de consentimento. Você poderá mudar de ideia a qualquer momento.
      </p>

      <h2 id="controle">4. Como controlar</h2>
      <p>
        O banner de consentimento permite aceitar ou recusar os cookies opcionais.
        A recusa é o padrão e não prejudica o uso do site. Você também pode apagar
        cookies e bloquear novos nas configurações do seu navegador — mas bloquear
        os estritamente necessários pode impedir o site de funcionar (por exemplo,
        trocar de idioma).
      </p>

      <h2 id="contato">5. Contato</h2>
      <p>
        Dúvidas sobre cookies:{" "}
        <a href={`mailto:${EMPRESA.emailPrivacidade}`}>{EMPRESA.emailPrivacidade}</a>.
      </p>
    </article>
  );
}
