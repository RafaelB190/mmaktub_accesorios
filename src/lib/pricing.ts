import type { Product } from "./types";

/** Shared pricing helpers. Safe to import from client and server components. */

export function isOnSale(product: Pick<Product, "price" | "compareAtPrice">) {
  return product.compareAtPrice !== null && product.compareAtPrice > product.price;
}

export function discountPercentage(product: Pick<Product, "price" | "compareAtPrice">) {
  if (!isOnSale(product) || !product.compareAtPrice) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}
