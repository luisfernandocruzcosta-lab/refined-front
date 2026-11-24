import { test } from "node:test";
import assert from "node:assert/strict";
import { INSTAGRAM_URL, filterCatalog } from "./catalog";
import type { Product } from "./products";

test("purchase and contact destination is the exclusive Drummondshop Instagram", () => {
  assert.equal(INSTAGRAM_URL, "https://www.instagram.com/drummondshop/");
});
test("category selection preserves registered product information", () => {
  const products: Product[] = [{ id: "real", name: "iPhone 15", brand: "Apple", category: "iPhone", condition: "Novo", detail: "128GB", description: "Itens cadastrados", price: 4899, old_price: null, tag: null, image_path: null, created_at: "2026-11-24" }];
  assert.equal(filterCatalog(products, "iPhone")[0], products[0]);
  assert.equal(filterCatalog(products, "Todos"), products);
  assert.deepEqual(filterCatalog(products, "Samsung"), []);
});