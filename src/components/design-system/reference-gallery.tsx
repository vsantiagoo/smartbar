/* eslint-disable @next/next/no-img-element */

const REFS = [
  { src: "/design-refs/ref-01.jpg", title: "Painéis de vidro sobre degradê", note: "Superfícies translúcidas, cantos muito amplos, tipografia leve." },
  { src: "/design-refs/ref-02.jpg", title: "Campo de entrada em vidro", note: "Barra de ações com ícones de traço fino." },
  { src: "/design-refs/ref-03.jpg", title: "Card com botões-pílula orgânicos", note: "Métricas em pílulas unidas ao botão principal." },
  { src: "/design-refs/ref-04.jpg", title: "Controles de vidro", note: "Input + botão redondo de enviar, brilho na borda." },
  { src: "/design-refs/ref-05.jpg", title: "Formas superelípticas", note: "Widgets azul-acinzentados e datas pontilhadas." },
  { src: "/design-refs/ref-06.jpg", title: "Navegação flutuante", note: "Barra em pílula com item ativo destacado." },
  { src: "/design-refs/ref-07.jpg", title: "Card branco com números pontilhados", note: "Um único acento de cor (lima) para a ação." },
  { src: "/design-refs/ref-08.jpg", title: "Hero em degradê", note: "Título grande, botão de vidro, navegação em pílula." },
] as const;

/** Referências visuais do Design System que originaram a linguagem do produto. */
export function ReferenceGallery() {
  return (
    <div className="columns-2 gap-4 md:columns-4 [&>figure]:mb-4">
      {REFS.map((r) => (
        <figure key={r.src} className="glass break-inside-avoid overflow-hidden rounded-3xl">
          <img src={r.src} alt={r.title} loading="lazy" className="w-full" />
          <figcaption className="p-3">
            <p className="text-sm font-semibold text-brand-800">{r.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-ink-soft">{r.note}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
