import type { Product } from "./products";

export const INSTAGRAM_URL = "https://www.instagram.com/drummondshop/";
export const SHOP_CATEGORIES = ["Todos", "iPhone", "Samsung", "Xiaomi", "Acessórios"] as const;
export function filterCatalog(products: Product[], category: string) {
  return category === "Todos" ? products : products.filter(product => product.category === category);
}