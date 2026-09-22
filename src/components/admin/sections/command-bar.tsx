"use client";
import { BedDouble, CornerDownLeft, LayoutDashboard, PackageCheck, Search, Sparkles, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useNow } from "@/lib/realtime/use-now";
import { cn } from "@/lib/utils";
import type { DashboardRoom } from "@/lib/types";

interface Command {
  id: string;
  group: "Quartos" | "Ações";
  label: string;
  hint?: string;
  href: string;
  icon: typeof BedDouble;
}

const ACTIONS: Command[] = [
  { id: "a-restock", group: "Ações", label: "Abrir reposição", hint: "Governança", href: "/admin/reposicao", icon: PackageCheck },
  { id: "a-rooms", group: "Ações", label: "Ver todos os quartos", href: "/admin/quartos", icon: BedDouble },
  { id: "a-home", group: "Ações", label: "Visão geral", href: "/admin", icon: LayoutDashboard },
];

const CHIPS = [
  { label: "Quartos para repor", href: "/admin/reposicao" },
  { label: "Todos os quartos", href: "/admin/quartos" },
];

function greeting(now: number | null): string {
  if (now === null) return "Olá";
  const h = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", hour: "numeric", hour12: false }).format(new Date(now))) % 24;
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

/**
 * SEÇÃO · Barra de comando (⌘K / Ctrl+K).
 * Busca quarto por número ou hóspede e atalhos de ação, no padrão "campo de
 * prompt + command palette" do design system Orbit.
 */
export function CommandBar({ hotelName, rooms, offlineCount }: { hotelName: string; rooms: DashboardRoom[]; offlineCount: number }) {
  const router = useRouter();
  const now = useNow(60_000);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<Command[]>(() => {
    const q = query.trim().toLowerCase();
    const roomCmds: Command[] = rooms
      .filter((r) => !q || r.number.includes(q) || (r.guestName ?? "").toLowerCase().includes(q))
      .slice(0, q ? 6 : 4)
      .map((r) => ({
        id: `r-${r.number}`,
        group: "Quartos" as const,
        label: `Quarto ${r.number}`,
        hint: r.guestName ?? "Vago",
        href: `/admin/quartos/${r.number}`,
        icon: BedDouble,
      }));
    const actions = ACTIONS.filter((a) => !q || a.label.toLowerCase().includes(q));
    return [...roomCmds, ...actions];
  }, [query, rooms]);

  function go(cmd: Command | undefined) {
    if (!cmd) return;
    setOpen(false);
    setQuery("");
    router.push(cmd.href);
  }

  return (
    <section aria-label="Busca e atalhos" className="relative z-20">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-sm font-medium text-ink-soft">{hotelName}</p>
          <h1 className="text-[2rem] font-bold leading-tight">{greeting(now)}, recepção</h1>
        </div>
        {offlineCount > 0 && (
          <Badge tone="danger" dot>
            <WifiOff className="size-3.5" /> {offlineCount} {offlineCount === 1 ? "trava sem sinal" : "travas sem sinal"}
          </Badge>
        )}
      </div>

      <div className="glass-strong relative mt-4 rounded-[32px] p-2.5">
        <div className="flex items-center gap-3 pl-4">
          <Search className="size-5 shrink-0 text-ink-faint" />
          <input
            ref={input}
            value={query}
            role="combobox"
            aria-expanded={open}
            aria-controls="command-results"
            aria-label="Buscar quarto, hóspede ou ação"
            placeholder="Buscar quarto, hóspede ou ação…"
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") go(results[active]);
              else if (e.key === "Escape") input.current?.blur();
            }}
            className="h-12 min-w-0 flex-1 bg-transparent text-[1.05rem] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="mr-2 hidden items-center gap-1 rounded-full bg-brand-700/8 px-3 py-1.5 font-mono text-xs text-ink-soft sm:flex">
            <span className="text-sm">⌘</span>K
          </kbd>
        </div>

        {open && (
          <ul
            id="command-results"
            role="listbox"
            className="glass-strong absolute inset-x-0 top-[calc(100%+8px)] max-h-[22rem] overflow-y-auto rounded-[28px] p-2"
          >
            {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-soft">Nada encontrado para “{query}”.</li>}
            {results.map((c, i) => {
              const showGroup = i === 0 || results[i - 1]!.group !== c.group;
              return (
                <li key={c.id} role="presentation">
                  {showGroup && <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{c.group}</p>}
                  <button
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      go(c);
                    }}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                      i === active ? "bg-brand-700 text-white" : "text-ink hover:bg-white/70",
                    )}
                  >
                    <span className={cn("grid size-9 place-items-center rounded-xl", i === active ? "bg-white/15" : "bg-brand-700/10 text-brand-700")}>
                      <c.icon className="size-[18px]" />
                    </span>
                    <span className="flex-1 font-semibold">{c.label}</span>
                    {c.hint && <span className={cn("text-sm", i === active ? "text-white/70" : "text-ink-soft")}>{c.hint}</span>}
                    {i === active && <CornerDownLeft className="size-4 opacity-70" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
        <Sparkles className="size-4 text-gold-500" />
        {CHIPS.map((c) => (
          <button
            key={c.label}
            onClick={() => router.push(c.href)}
            className="glass rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/80 active:scale-[0.97]"
          >
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
