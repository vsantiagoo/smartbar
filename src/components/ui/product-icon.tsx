import {
  Cookie,
  CupSoda,
  GlassWater,
  Grape,
  Nut,
  Package,
  Popcorn,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "glass-water": GlassWater,
  "cup-soda": CupSoda,
  grape: Grape,
  nut: Nut,
  cookie: Cookie,
  wheat: Wheat,
  popcorn: Popcorn,
  package: Package,
};

const TINTS: Record<string, string> = {
  "glass-water": "from-sky-100 to-brand-100 text-brand-600",
  "cup-soda": "from-crimson-100 to-gold-100 text-crimson-600",
  grape: "from-brand-100 to-crimson-100 text-brand-700",
  nut: "from-gold-100 to-amber-100 text-gold-600",
  cookie: "from-gold-100 to-crimson-50 text-gold-600",
  wheat: "from-amber-100 to-gold-50 text-gold-600",
  popcorn: "from-gold-50 to-crimson-100 text-crimson-600",
  package: "from-brand-100 to-white text-brand-600",
};

export function productIcon(key: string): LucideIcon {
  return ICONS[key] ?? Package;
}

/** Ilustração do produto enquanto não há foto: tile em gradiente + ícone. */
export function ProductTile({ iconKey, className }: { iconKey: string; className?: string }) {
  const Icon = productIcon(iconKey);
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center rounded-3xl bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        TINTS[iconKey] ?? TINTS.package,
        className,
      )}
    >
      <Icon className="size-1/2" strokeWidth={1.6} />
    </div>
  );
}
