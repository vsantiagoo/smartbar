import { CircleCheck, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { SegmentedDemo, SheetDemo, StepperDemo } from "@/components/design-system/ds-demos";
import { ReferenceGallery } from "@/components/design-system/reference-gallery";
import { ThemeEditor } from "@/components/design-system/theme-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, SearchField } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { DotNumber, EmptyState, KpiCard, LiveDot, Meter, Skeleton } from "@/components/ui/primitives";
import { ProductTile } from "@/components/ui/product-icon";

export const metadata = { title: "Design System" };

function Section({ id, title, hint, children }: { id: string; title: string; hint?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      {hint && <p className="mt-1 max-w-2xl text-ink-soft">{hint}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* Ver a física e a razão de cada nível no Brandbook §5. */
const NIVEIS = [
  {
    nivel: 1,
    nome: "Apoiada",
    classe: "glass-chip",
    desfoque: "desfoque 14px",
    sombra: "sem sombra projetada",
    onde: "Selo, campo, ícone. Encostada na superfície: um selo que flutua parece erro de escala.",
  },
  {
    nivel: 2,
    nome: "Elevada",
    classe: "glass",
    desfoque: "desfoque 22px",
    sombra: "cast-1",
    onde: "O nível de trabalho: cards, barras, botões.",
  },
  {
    nivel: 3,
    nome: "Sobreposta",
    classe: "glass-strong",
    desfoque: "desfoque 34px",
    sombra: "cast-2",
    onde: "Interrompe a leitura: sheet, dropdown, destaque.",
  },
] as const;

/* A escala completa está no Brandbook §4. */
const RAIOS = [
  { nome: "chip", classe: "rounded-chip", valor: "12px", papel: "selo, campo" },
  { nome: "control", classe: "rounded-control", valor: "20px", papel: "controle estreito" },
  { nome: "inset", classe: "rounded-inset", valor: "24px", papel: "bloco aninhado" },
  { nome: "card", classe: "rounded-card", valor: "28px", papel: "card" },
  { nome: "panel", classe: "rounded-panel", valor: "32px", papel: "painel, dropdown" },
  { nome: "surface", classe: "rounded-surface", valor: "36px", papel: "sheet, tela" },
  { nome: "full", classe: "rounded-full", valor: "pílula", papel: "botão, chip" },
] as const;

function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** Catálogo do Design System SmartBar → /design-system */
export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-16 px-5 py-12">
      <header>
        <Logo />
        <h1 className="mt-8 text-[2.4rem] font-bold leading-tight">Design System</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Cores, tipografia e voz vêm do Brandbook. A forma (vidro fosco, cantos amplos, pílulas, números pontilhados) vem das referências visuais do
          Design System. Tokens em <code className="font-mono text-sm">tailwind.config.ts</code> e <code className="font-mono text-sm">globals.css</code>.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2 text-sm font-semibold" aria-label="Seções">
          {["referencias", "cores", "tipografia", "forma", "niveis", "raios", "acoes", "campos", "dados", "feedback"].map((id) => (
            <a key={id} href={`#${id}`} className="glass rounded-full px-4 py-2 capitalize text-ink hover:bg-white/80">
              {id}
            </a>
          ))}
        </nav>
      </header>

      <Section id="referencias" title="Referências visuais" hint="O Design System de origem: vidro fosco, degradês suaves, formas amplas e números pontilhados. É daqui que vêm as superfícies e os controles do produto.">
        <ReferenceGallery />
      </Section>

      <Section
        id="cores"
        title="Cores"
        hint="Azul comunica confiança, vermelho ação e urgência, ouro é reservado para foco e destaque premium — nunca decoração. Tudo aqui é editável."
      >
        <ThemeEditor />
      </Section>

      <Section id="tipografia" title="Tipografia" hint="Fonte do sistema (San Francisco, Segoe UI ou Roboto, conforme o aparelho), entrelinha 1,6. Números de destaque em fonte pontilhada.">
        <GlassCard className="space-y-5">
          <p className="text-[2rem] font-bold leading-tight">Título H1 · 32/Bold</p>
          <p className="text-2xl font-semibold">Seção H2 · 24/Semibold</p>
          <p className="text-lg font-semibold">Subseção H3 · 18/Semibold</p>
          <p>Corpo · 16/Regular. Recupere R$ 37 mil/ano em faturamento perdido.</p>
          <p className="text-sm text-ink-soft">Apoio · 14/Regular. Pagamento 100% prévio = zero risco de calote.</p>
          {/*
            As duas medidas de caixa-alta (Brandbook §2): a sobrescrita abre uma
            seção e pode respirar; o rótulo é lido de relance, muitas vezes ao
            dia, e respiro demais atrapalha a varredura.
          */}
          <div className="space-y-2 border-t border-brand-700/10 pt-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              <span aria-hidden className="h-px w-7 shrink-0 bg-current opacity-45" />
              Sobrescrita · 0.2em · abre seção
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Rótulo · 0.14em · campo e grupo
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-8 border-t border-brand-700/10 pt-5">
            <DotNumber className="text-5xl">R$ 1.240</DotNumber>
            <span className="tabular font-mono text-2xl">1.234,56</span>
          </div>
        </GlassCard>
      </Section>

      <Section
        id="forma"
        title="Forma e superfícies"
        hint="Vidro fosco sobre gradiente azul-acinzentado. As quatro superfícies do GlassCard."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["glass", "strong", "solid", "navy"] as const).map((s) => (
            <GlassCard key={s} surface={s} className="min-h-32">
              <p className={`font-semibold ${s === "navy" ? "text-white" : "text-ink"}`}>surface="{s}"</p>
              <p className={`mt-1 text-sm ${s === "navy" ? "text-white/70" : "text-ink-soft"}`}>GlassCard</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        id="niveis"
        title="Níveis de vidro"
        hint="Nível é ALTURA, não cor. Quanto mais alto o elemento flutua, mais ele embaça o que está atrás e mais larga fica a sombra. São três — e só três."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {NIVEIS.map((n) => (
            <div key={n.nivel} className={`${n.classe} rounded-card p-5`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Nível {n.nivel}
              </p>
              <p className="mt-1 font-semibold text-ink">{n.nome}</p>
              <p className="mt-2 text-sm text-ink-soft">{n.onde}</p>
              <p className="mt-3 text-xs text-ink-faint">
                {n.desfoque} · {n.sombra}
              </p>
              <code className="mt-1 block text-xs text-ink-faint">{n.classe}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="raios"
        title="Escala de raios"
        hint="O papel do elemento escolhe o degrau, não o olho na hora. Aninhamento óptico: o raio do filho é o do pai MENOS o respiro entre eles."
      >
        <div className="flex flex-wrap gap-4">
          {RAIOS.map((r) => (
            <div key={r.nome} className="text-center">
              <div className={`glass size-24 ${r.classe}`} />
              <p className="mt-2 text-xs font-semibold text-ink">{r.nome}</p>
              <p className="text-xs text-ink-faint">{r.valor}</p>
              <p className="text-[11px] text-ink-faint">{r.papel}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="acoes" title="Ações" hint="Altura mínima de 44 px (mobile-first). Primário em azul; ouro só para a ação de maior valor da tela.">
        <div className="space-y-6">
          <Spec label="Variantes">
            <Button>Primário</Button>
            <Button variant="accent">Destaque</Button>
            <Button variant="danger">Destrutivo</Button>
            <Button variant="glass">Vidro</Button>
            <Button variant="soft">Suave</Button>
            <Button variant="ghost">Discreto</Button>
          </Spec>
          <Spec label="Tamanhos e estados">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio 44px</Button>
            <Button size="lg">Grande 56px</Button>
            <Button loading>Carregando</Button>
            <Button disabled>Desabilitado</Button>
          </Spec>
          <Spec label="Controles">
            <StepperDemo />
            <SegmentedDemo />
            <SheetDemo />
          </Spec>
        </div>
      </Section>

      <Section id="campos" title="Campos">
        <div className="grid max-w-xl gap-4">
          <Input placeholder="Texto" aria-label="Texto" />
          <SearchField placeholder="Buscar quarto…" aria-label="Buscar" />
          <Input type="password" defaultValue="segredo123" aria-label="Senha" />
        </div>
      </Section>

      <Section id="dados" title="Dados e conteúdo">
        <div className="space-y-6">
          <Spec label="Badges">
            <Badge tone="info">Info</Badge>
            <Badge tone="ok" dot>Aprovado</Badge>
            <Badge tone="warn">Repor</Badge>
            <Badge tone="danger">Falhou</Badge>
            <Badge tone="gold">Novo</Badge>
            <Badge tone="neutral">Expirado</Badge>
            <span className="inline-flex items-center gap-2 text-sm text-ink-soft"><LiveDot /> Ao vivo</span>
          </Spec>
          <Spec label="Indicadores">
            <KpiCard className="w-72" label="Faturamento hoje" icon={TrendingUp} tone="gold" value={<DotNumber className="text-[2.3rem]">R$ 248</DotNumber>} hint="62% via Pix" />
            <KpiCard className="w-56" label="Vendas" icon={CircleCheck} tone="ok" value={<DotNumber>14</DotNumber>} />
          </Spec>
          <Spec label="Produtos">
            {["glass-water", "cup-soda", "grape", "nut", "cookie", "wheat", "popcorn"].map((k) => (
              <ProductTile key={k} iconKey={k} className="size-16" />
            ))}
          </Spec>
          <div className="grid max-w-md gap-4">
            <Meter value={5} max={5} tone="ok" label="Cheio" />
            <Meter value={2} max={5} tone="warn" label="Baixo" />
            <Meter value={0} max={5} tone="danger" label="Vazio" />
          </div>
        </div>
      </Section>

      <Section id="feedback" title="Estados e feedback">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <GlassCard><EmptyState icon={CircleCheck} title="Tudo em ordem" description="Nenhum quarto precisa de reposição." /></GlassCard>
          <GlassCard className="space-y-3"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-20 w-full" /><Skeleton className="h-4 w-3/4" /></GlassCard>
        </div>
      </Section>
    </main>
  );
}
