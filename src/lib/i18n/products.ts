/**
 * Nomes e descrições dos produtos do catálogo, por SKU.
 *
 * Ficam SEPARADOS do dicionário de telas porque são dados de catálogo, não
 * texto de interface: quando o cadastro do hotel passar a vir do banco, este
 * arquivo some e a tradução virá de lá. Sem SKU conhecido, a tela usa o nome
 * cadastrado pelo hotel.
 */
import type { Lang } from "@/lib/i18n/config";

interface ProductI18n {
  name: string;
  description: string;
}

const PRODUCT_PT: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Água mineral sem gás", description: "500 ml" },
  "AGU-CG": { name: "Água mineral com gás", description: "500 ml" },
  "REF-CO": { name: "Refrigerante coca cola original", description: "Lata 350 ml" },
  "REF-ZE": { name: "Refrigerante coca cola zero", description: "Lata 350 ml" },
  "SUC-UV": { name: "Suco de uva", description: "Lata 290 ml" },
  "AMD-50": { name: "Amendoim torrado", description: "Pacote 50 g" },
  "BAR-CE": { name: "Barra de cereal", description: "Castanhas e mel" },
  "BAT-PT": { name: "Batata chips", description: "35 g" },
};

const PRODUCT_EN: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Still mineral water", description: "500 ml" },
  "AGU-CG": { name: "Sparkling mineral water", description: "500 ml" },
  "REF-CO": { name: "Coca-Cola Original", description: "Can 350 ml" },
  "REF-ZE": { name: "Coca-Cola Zero", description: "Can 350 ml" },
  "SUC-UV": { name: "Grape juice", description: "Can 290 ml" },
  "AMD-50": { name: "Roasted peanuts", description: "50 g pack" },
  "BAR-CE": { name: "Cereal bar", description: "Nuts and honey" },
  "BAT-PT": { name: "Potato chips", description: "35 g" },
};

const PRODUCT_ES: Record<string, ProductI18n> = {
  "AGU-SG": { name: "Agua mineral sin gas", description: "500 ml" },
  "AGU-CG": { name: "Agua mineral con gas", description: "500 ml" },
  "REF-CO": { name: "Coca-Cola Original", description: "Lata 350 ml" },
  "REF-ZE": { name: "Coca-Cola Zero", description: "Lata 350 ml" },
  "SUC-UV": { name: "Jugo de uva", description: "Lata 290 ml" },
  "AMD-50": { name: "Maní tostado", description: "Paquete 50 g" },
  "BAR-CE": { name: "Barra de cereal", description: "Frutos secos y miel" },
  "BAT-PT": { name: "Papas chips", description: "35 g" },
};

const PRODUCT_DICTS: Record<Lang, Record<string, ProductI18n>> = {
  pt: PRODUCT_PT,
  en: PRODUCT_EN,
  es: PRODUCT_ES,
};

export function translateProduct(lang: Lang, sku: string | null): ProductI18n | null {
  if (!sku) return null;
  return PRODUCT_DICTS[lang][sku] ?? PRODUCT_DICTS.pt[sku] ?? null;
}
