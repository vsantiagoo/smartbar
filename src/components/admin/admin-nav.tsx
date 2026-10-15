"use client";
import { BedDouble, LayoutDashboard, LogOut, PackageCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/translate";
import { cn } from "@/lib/utils";

interface NavProps {
  hotelName: string;
  email: string;
  restockCount: number;
  demo: boolean;
}

const ITEMS: { href: string; labelKey: DictKey; icon: typeof LayoutDashboard; exact: boolean }[] = [
  { href: "/admin", labelKey: "admin.nav.overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/quartos", labelKey: "admin.nav.rooms", icon: BedDouble, exact: false },
  { href: "/admin/reposicao", labelKey: "admin.nav.restock", icon: PackageCheck, exact: false },
];

function useActive() {
  const pathname = usePathname();
  return (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));
}

/** Sidebar de vidro (desktop). */
export function AdminSidebar({ hotelName, email, restockCount, demo }: NavProps) {
  const isActive = useActive();
  const { t } = useI18n();
  return (
    <aside className="glass fixed inset-y-4 left-4 z-30 hidden w-[264px] flex-col rounded-[32px] p-4 lg:flex">
      <Logo intro={false} className="px-2 pb-5 pt-2" />
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{hotelName}</p>
      <nav className="flex-1 space-y-1" aria-label={t("admin.nav.main")}>
        {ITEMS.map(({ href, labelKey, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-12 items-center gap-3 rounded-full px-4 text-[0.95rem] font-semibold transition",
                active ? "glass-tint bg-brand-700/80 text-white" : "text-ink-soft hover:bg-white/70 hover:text-ink",
              )}
            >
              <Icon className="size-[19px]" />
              <span className="flex-1">{t(labelKey)}</span>
              {href === "/admin/reposicao" && restockCount > 0 && (
                <span className={cn("tabular rounded-full px-2 py-0.5 text-xs font-bold", active ? "bg-white/25" : "bg-crimson-500 text-white")}>
                  {restockCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {demo && <p className="mb-3 rounded-2xl bg-gold-500/15 px-3 py-2 text-xs font-medium text-gold-600">{t("admin.nav.demo")}</p>}
      <div className="rounded-3xl bg-white/50 p-3">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate px-1 text-xs text-ink-soft">{email}</p>
          <LanguageSwitcher tone="light" />
        </div>
        <form action={logoutAction}>
          <button className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-ink transition hover:bg-white/80">
            <LogOut className="size-4" /> {t("admin.nav.logout")}
          </button>
        </form>
      </div>
    </aside>
  );
}

/** Barra flutuante em pílula (mobile) — ref.: Design System. */
export function AdminBottomNav({ restockCount }: Pick<NavProps, "restockCount">) {
  const isActive = useActive();
  const { t } = useI18n();
  return (
    <nav
      aria-label={t("admin.nav.main")}
      className="glass-strong fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md justify-between rounded-full p-1.5 lg:hidden"
    >
      {ITEMS.map(({ href, labelKey, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold transition",
              active ? "glass-tint bg-brand-700/80 text-white" : "text-ink-soft",
            )}
          >
            <Icon className="size-5" />
            {t(labelKey)}
            {href === "/admin/reposicao" && restockCount > 0 && (
              <span className="tabular absolute right-4 top-1.5 grid min-w-4 place-items-center rounded-full bg-crimson-500 px-1 text-[10px] font-bold text-white">
                {restockCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
