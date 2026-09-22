import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { buttonClasses } from "@/components/ui/button";
import { marketingCopy } from "@/lib/content/copy";

/** SEÇÃO · Cabeçalho fixo em vidro escuro — legível sobre o hero e as seções seguintes. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <div className="glass-dark flex w-full max-w-6xl items-center justify-between rounded-full py-2 pl-3 pr-2 text-white">
        <Link href="#inicio">
          <Logo tone="light" />
        </Link>
        <Link href="/admin" className={buttonClasses("accent", "sm")}>
          {marketingCopy.header.cta}
        </Link>
      </div>
    </header>
  );
}
