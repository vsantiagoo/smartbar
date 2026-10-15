/**
 * SINAIS DA MARCA — desenhos próprios, não ícones de biblioteca.
 *
 * Um icon set genérico fala de software em geral: cadeado, caixa, QR. Estes
 * três falam do SmartBar: o celular do hóspede, a trava que libera, a
 * prateleira que baixa sozinha. É a mesma diferença entre uma foto de banco de
 * imagens e uma foto do seu hotel.
 *
 * REGRAS DO TRAÇO (as mesmas do cadeado da declaração, em `lock-3d.tsx`):
 *   · grade de 24, traço de 1.5 — espesso o bastante para sobreviver a 20px;
 *   · ponta e junta arredondadas, nunca em esquadro;
 *   · `currentColor`, para o sinal herdar a cor de quem o usa;
 *   · um detalhe assimétrico em cada um, que é onde mora a autoria.
 */
type MarkProps = {
  className?: string;
  /** Rótulo acessível. Sem ele o desenho é decorativo e some do leitor de tela. */
  title?: string;
};

function Mark({ className, title, children }: MarkProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/**
 * ESCOLHER NO CELULAR — o aparelho do hóspede com o código do quarto dentro.
 * O quarto módulo não fecha: ele se abre em "L" para fora da grade, porque o
 * código aqui não é um fim, é uma porta. Essa quebra é a assinatura do sinal.
 */
export function MarkRoomCode(props: MarkProps) {
  return (
    <Mark {...props}>
      <rect x="6.75" y="2.75" width="10.5" height="18.5" rx="2.5" />
      <path d="M10.5 5.5h3" />
      <rect x="9.4" y="9.4" width="2.3" height="2.3" rx="0.6" />
      <rect x="12.9" y="9.4" width="2.3" height="2.3" rx="0.6" />
      <rect x="9.4" y="12.9" width="2.3" height="2.3" rx="0.6" />
      <path d="M12.9 15.2v-2.3h2.3" />
    </Mark>
  );
}

/**
 * PAGAR E DESTRAVAR — a trava no instante seguinte ao pagamento: a perna
 * esquerda continua presa, a direita já saiu e o arco girou. É a mesma
 * mecânica do cadeado grande da declaração, reduzida a quatro traços.
 * No lugar do segredo há um ponto aceso: esta trava é eletrônica.
 */
export function MarkUnlock(props: MarkProps) {
  return (
    <Mark {...props}>
      <path d="M8.25 10.5V7.6a3.75 3.75 0 0 1 7.15-1.6" />
      <rect x="4.75" y="10.5" width="14.5" height="9.75" rx="2.5" />
      <circle cx="12" cy="14.9" r="0.95" fill="currentColor" stroke="none" />
      <path d="M12 16.6v1.4" />
    </Mark>
  );
}

/**
 * ESTOQUE QUE BAIXA SOZINHO — duas prateleiras vistas de frente. Os itens têm
 * alturas diferentes de propósito: não é um armário cheio, é um armário no meio
 * do dia. O sinal mostra o estoque mudando, que é o que a frase promete.
 */
export function MarkShelf(props: MarkProps) {
  return (
    <Mark {...props}>
      <rect x="4.25" y="3" width="15.5" height="18" rx="2.5" />
      <path d="M4.25 10.25h15.5" />
      <path d="M4.25 16h15.5" />
      <path d="M8 10.25V6.75" />
      <path d="M12 10.25V7.75" />
      <path d="M16 10.25V6.25" />
      <path d="M8 16v-2.5" />
      <path d="M12 16v-3.25" />
    </Mark>
  );
}
