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
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Fotos reais dos produtos (fonte: Pexels, uso livre). Mapeadas por SKU porque
 * dois produtos podem partilhar o mesmo iconKey (água sem/com gás, cola/cola zero).
 * Ficam em public/images/products/<SKU>.jpg. Sem foto → cai no ícone.
 */
const PRODUCT_IMAGES: Record<string, string> = {
  "AGU-SG": "/images/products/AGU-SG.jpg",
  "AGU-CG": "/images/products/AGU-CG.jpg",
  "REF-CO": "/images/products/REF-CO.jpg",
  "REF-ZE": "/images/products/REF-ZE.jpg",
  "SUC-UV": "/images/products/SUC-UV.jpg",
  "AMD-50": "/images/products/AMD-50.jpg",
  "SAL-PC": "/images/products/SAL-PC.jpg",
  "BAR-CE": "/images/products/BAR-CE.jpg",
  "BAT-PT": "/images/products/BAT-PT.jpg",
};

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

/**
 * Tile do produto em glassmorphism. Com foto (por SKU), mostra a imagem real
 * preenchendo o quadrado; o aro especular do vidro fica por cima. Sem foto, usa
 * o gradiente da marca + ícone como ilustração.
 */
export function ProductTile({ iconKey, sku, className }: { iconKey: string; sku?: string; className?: string }) {
  const photo = sku ? PRODUCT_IMAGES[sku] : undefined;
  const Icon = productIcon(iconKey);
  return (
    <div
      aria-hidden
      className={cn(
        "glass-chip specular-tile grid place-items-center rounded-3xl",
        photo ? "bg-white/60 dark:bg-white/10" : cn("bg-gradient-to-br", TINTS[iconKey] ?? TINTS.package),
        className,
      )}
    >
      {photo ? (
        <Image src={photo} alt="" fill sizes="(min-width: 640px) 72px, 56px" className="object-cover" />
      ) : (
        <Icon className="size-1/2" strokeWidth={1.6} />
      )}
    </div>
  );
}
