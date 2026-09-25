import { supabase } from "@/integrations/supabase/client";

export const CATEGORIES = ["iPhone", "Samsung", "Motorola", "Xiaomi", "Acessórios"] as const;
export const CONDITIONS = ["Novo", "Seminovo"] as const;
export const TAGS = ["", "Oferta", "Reservado", "Vendido"] as const;

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  condition: string;
  detail: string;
  price: number;
  old_price: number | null;
  tag: string | null;
  image_path: string | null;
  created_at: string;
  imageUrl?: string | null;
};

export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as Product[];
  const paths = rows.map((r) => r.image_path).filter((p): p is string => !!p);
  if (paths.length) {
    const { data: signed } = await supabase.storage.from("product-images").createSignedUrls(paths, 60 * 60 * 24);
    const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
    rows.forEach((r) => (r.imageUrl = r.image_path ? map.get(r.image_path) ?? null : null));
  }
  return rows;
}
