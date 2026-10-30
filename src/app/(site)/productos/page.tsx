import type { Metadata } from "next";
import { Search, X } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/shop/ProductCard";
import { Container } from "@/components/ui/Container";
import { getCategoryCounts, getProducts } from "@/lib/products";
import {
  PRODUCT_CATEGORIES,
  isProductCategory,
  type ProductCategory,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Collares, pulseras, combitos, aros y anillos de piedras naturales hechos a mano. Encontrá tu pieza de Maktub.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const SORT_OPTIONS = [
  { value: "recent", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
] as const;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const categoryParam = firstValue(params.categoria);
  const search = firstValue(params.busqueda)?.trim() ?? "";
  const sortParam = firstValue(params.orden);
  const sort = SORT_OPTIONS.some((option) => option.value === sortParam)
    ? (sortParam as (typeof SORT_OPTIONS)[number]["value"])
    : "recent";
  const onSale = firstValue(params.oferta) === "1";

  const category =
    categoryParam && isProductCategory(categoryParam) ? categoryParam : undefined;

  const [products, counts] = await Promise.all([
    getProducts({ category, search, sort, onSale }),
    getCategoryCounts(),
  ]);

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  function hrefFor(nextCategory?: ProductCategory) {
    const next = new URLSearchParams();
    if (nextCategory) next.set("categoria", nextCategory);
    if (search) next.set("busqueda", search);
    if (sort !== "recent") next.set("orden", sort);
    if (onSale) next.set("oferta", "1");
    const query = next.toString();
    return query ? `/productos?${query}` : "/productos";
  }

  return (
    <>
      <section className="border-b border-line/70 bg-cream-deep/55">
        <Container className="py-14 sm:py-18">
          <nav className="text-[10px] uppercase tracking-[0.18em] text-muted" aria-label="Ruta">
            <Link href="/" className="transition-colors hover:text-clay">
              Inicio
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="text-ink">Productos</span>
          </nav>
          <h1 className="mt-5 text-5xl leading-none sm:text-6xl">Nuestra colección</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Piezas de piedras naturales hechas a mano, en pequeñas tandas. Cada
            una tiene su propia historia y su propio brillo.
          </p>
        </Container>
      </section>

      <section id="coleccion" className="scroll-mt-28 py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-6">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              <Link
                href={hrefFor()}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                  !category && !onSale
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-transparent text-ink-soft hover:border-ink",
                )}
              >
                Todas ({total})
              </Link>
              {PRODUCT_CATEGORIES.map((item) => (
                <Link
                  key={item.value}
                  href={hrefFor(item.value)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                    category === item.value
                      ? "border-ink bg-ink text-cream"
                      : "border-line bg-transparent text-ink-soft hover:border-ink",
                  )}
                >
                  {item.label} ({counts[item.value] ?? 0})
                </Link>
              ))}
              <Link
                href={onSale ? hrefFor(category) : "/productos?oferta=1"}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                  onSale
                    ? "border-clay bg-clay text-cream"
                    : "border-clay/40 bg-transparent text-clay hover:border-clay",
                )}
              >
                Ofertas
              </Link>
            </div>

            <form
              action="/productos"
              method="get"
              className="flex flex-col gap-3 rounded-3xl border border-line bg-cream-deep/40 p-3 sm:flex-row sm:items-center"
            >
              {category ? <input type="hidden" name="categoria" value={category} /> : null}
              {onSale ? <input type="hidden" name="oferta" value="1" /> : null}
              <label className="relative flex flex-1 items-center">
                <span className="sr-only">Buscar productos</span>
                <Search
                  className="pointer-events-none absolute left-4 h-4 w-4 text-muted"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  name="busqueda"
                  defaultValue={search}
                  placeholder="Buscar por nombre, piedra o material…"
                  className="h-12 w-full rounded-full border border-transparent bg-cream pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-line focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2">
                <span className="sr-only">Ordenar por</span>
                <select
                  name="orden"
                  defaultValue={sort}
                  className="h-12 rounded-full border border-line bg-cream px-4 text-xs text-ink-soft focus:border-clay focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="h-12 rounded-full bg-ink px-6 text-[10px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-clay"
              >
                Aplicar
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted">
                {products.length} {products.length === 1 ? "pieza" : "piezas"}
                {category
                  ? ` en ${PRODUCT_CATEGORIES.find((item) => item.value === category)?.label}`
                  : ""}
                {onSale ? " en oferta" : ""}
                {search ? ` para “${search}”` : ""}
              </p>
              {search || category || onSale || sort !== "recent" ? (
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-clay transition-colors hover:text-clay-dark"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Limpiar filtros
                </Link>
              ) : null}
            </div>
          </div>

          {products.length ? (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-line bg-cream-deep/40 px-6 py-20 text-center">
              <p className="font-display text-3xl text-ink">No encontramos esa pieza</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Probá con otra búsqueda o mirá toda la colección. Las piezas se
                renuevan seguido.
              </p>
              <Link
                href="/productos"
                className="mt-6 inline-flex rounded-full bg-ink px-6 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-clay"
              >
                Ver toda la colección
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
