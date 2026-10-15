"use client";
import { Receipt, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGuest } from "@/components/guest/guest-context";
import { cn } from "@/lib/utils";

/** SEÇÃO · Menu do rodapé: Vitrine e Meu consumo. Só aparece nas telas de navegação, não no pagamento. */
export function GuestNav({ baseHref }: { baseHref: string }) {
  const { t } = useGuest();
  const path = usePathname();
  const consumption = `${baseHref}/consumo`;
  if (path !== baseHref && path !== consumption) return null;

  const items = [
    { href: baseHref, label: t("guest.nav.catalog"), icon: Store, active: path === baseHref },
    { href: consumption, label: t("guest.nav.consumption"), icon: Receipt, active: path === consumption },
  ];
  return (
    <nav aria-label="SmartBar" className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] print:hidden">
      <ul className="glass-strong pointer-events-auto grid grid-cols-2 gap-1 rounded-full p-1.5">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={i.active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition",
                i.active ? "glass-tint bg-brand-700/85 text-white" : "text-ink-soft hover:bg-brand-700/10 hover:text-ink",
              )}
            >
              <i.icon className="size-[18px]" />
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
