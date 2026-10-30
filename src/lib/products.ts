import "server-only";

import { cache } from "react";

import { demoProducts } from "./demo";
import { isOnSale } from "./pricing";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Product, ProductCategory, ProductFilters } from "./types";
import { normalizeText } from "./utils";

export { discountPercentage, isOnSale } from "./pricing";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: ProductCategory;
  images: string[] | null;
  stock: number;
  featured: boolean;
  active: boolean;
  materials: string | null;
  created_at: string;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    category: row.category,
    images: row.images ?? [],
    stock: row.stock,
    featured: row.featured,
    active: row.active,
    materials: row.materials,
    createdAt: row.created_at,
  };
}

/** All products, including drafts. Used by the admin and filtered below. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  if (!isSupabaseConfigured) return demoProducts;

  const { data, error } = await getSupabase()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`No pudimos leer los productos: ${error.message}`);
  return (data as ProductRow[]).map(mapProduct);
});

export function filterProducts(products: Product[], filters: ProductFilters = {}) {
  const search = filters.search ? normalizeText(filters.search) : "";

  const result = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.featured !== undefined && product.featured !== filters.featured) return false;
    if (filters.onSale && !isOnSale(product)) return false;

    if (search) {
      const haystack = normalizeText(
        `${product.name} ${product.description} ${product.materials ?? ""}`,
      );
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  return filters.limit ? result.slice(0, filters.limit) : result;
}

export async function getProducts(filters: ProductFilters = {}) {
  const products = await getAllProducts();
  return filterProducts(
    products.filter((product) => product.active),
    filters,
  );
}

export const getProductBySlug = cache(async (slug: string) => {
  const products = await getAllProducts();
  return products.find((product) => product.slug === slug) ?? null;
});

export async function getProductById(id: string) {
  const products = await getAllProducts();
  return products.find((product) => product.id === id) ?? null;
}

/**
 * Novedades: first the products marked as featured, then the newest ones so the
 * carousel never looks empty in a brand-new store.
 */
export async function getNewArrivals(limit = 8) {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured);
  const rest = products.filter((product) => !product.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getSaleProducts(limit = 8) {
  return getProducts({ onSale: true, limit });
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProducts();
  const sameCategory = products.filter(
    (item) => item.id !== product.id && item.category === product.category,
  );
  const others = products.filter(
    (item) => item.id !== product.id && item.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getCategoryCounts() {
  const products = await getProducts();
  return products.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
}


