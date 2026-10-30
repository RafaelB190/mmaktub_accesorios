import { AlertCircle, CheckCircle2, Eye, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteForm } from "@/components/admin/DeleteForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { deleteProductAction } from "@/lib/actions/products";
import { formatPrice } from "@/lib/format";
import { getAllProducts, isOnSale } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const OK_MESSAGES: Record<string, string> = {
  creado: "Producto creado con éxito.",
  actualizado: "Los cambios se guardaron.",
  eliminado: "El producto fue eliminado.",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const ok = firstValue(params.ok);
  const error = firstValue(params.error);
  const products = await getAllProducts();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Productos"
        description="Cargá fotos, precios y características. Los cambios se reflejan al instante en la tienda."
        action={
          <Link href="/admin/productos/nuevo" className={buttonStyles("primary", "md")}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nuevo producto
          </Link>
        }
      />

      {ok && OK_MESSAGES[ok] ? (
        <div className="flex items-center gap-2 rounded-2xl border border-sage/30 bg-sage/10 px-4 py-3 text-xs text-sage-dark">
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
          {OK_MESSAGES[ok]}
        </div>
      ) : null}

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          {error === "modo-demo"
            ? "Configurá Supabase para eliminar productos de verdad."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      {products.length ? (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream">
          {products.map((product) => (
            <li
              key={product.id}
              className="grid gap-4 p-4 sm:grid-cols-[64px_1fr_auto] sm:items-center"
            >
              <Link
                href={`/productos/${product.slug}`}
                target="_blank"
                className="relative h-20 w-16 overflow-hidden rounded-xl bg-sand"
              >
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </Link>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-xl leading-tight text-ink">
                    {product.name}
                  </p>
                  {isOnSale(product) ? <Badge variant="sale">Oferta</Badge> : null}
                  {product.featured ? <Badge variant="new">Novedad</Badge> : null}
                  {!product.active ? <Badge variant="soldout">Oculto</Badge> : null}
                  {product.stock === 0 ? <Badge variant="soft">Sin stock</Badge> : null}
                </div>
                <p className="mt-1 truncate text-[11px] text-muted">
                  {CATEGORY_LABELS[product.category]} · /{product.slug}
                </p>
                <div className="mt-2 flex items-center gap-4 sm:hidden">
                  <span className="text-sm text-ink">{formatPrice(product.price)}</span>
                  <span className="text-[11px] text-muted">Stock: {product.stock}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="hidden text-right sm:block">
                  <p className="text-sm text-ink">{formatPrice(product.price)}</p>
                  <p className="mt-1 text-[10px] text-muted">Stock: {product.stock}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/productos/${product.slug}`}
                    target="_blank"
                    aria-label={`Ver ${product.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
                  >
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href={`/admin/productos/${product.id}`}
                    aria-label={`Editar ${product.name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                  <DeleteForm
                    id={product.id}
                    action={deleteProductAction}
                    confirmText={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-cream px-6 py-16 text-center">
          <p className="font-display text-2xl">Todavía no cargaste productos</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Empezá con una pieza: subí una foto, definí el precio y contá su historia.
          </p>
          <Link
            href="/admin/productos/nuevo"
            className={buttonStyles("primary", "md") + " mt-6"}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Cargar el primero
          </Link>
        </div>
      )}
    </div>
  );
}
