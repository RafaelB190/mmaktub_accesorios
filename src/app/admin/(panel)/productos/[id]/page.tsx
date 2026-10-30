import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteForm } from "@/components/admin/DeleteForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { deleteProductAction, updateProductAction } from "@/lib/actions/products";
import { getProductById } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Editar producto" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title={product.name}
        description="Editá cualquier dato y guardá los cambios. La tienda se actualiza al instante."
        action={
          <Link
            href="/admin/productos"
            className="text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
          >
            ← Volver a productos
          </Link>
        }
      />

      <ProductForm
        product={product}
        action={updateProductAction.bind(null, product.id)}
        demo={!isSupabaseConfigured}
      />

      <section className="max-w-4xl rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
        <h2 className="text-lg text-red-900">Eliminar producto</h2>
        <p className="mt-1 text-xs leading-relaxed text-red-800/80">
          Esta acción no se puede deshacer. Si solo querés ocultarlo, desmarcá
          «Producto visible» y guardá los cambios.
        </p>
        <div className="mt-4">
          <DeleteForm
            id={product.id}
            action={deleteProductAction}
            confirmText={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
            label="Eliminar producto"
          />
        </div>
      </section>
    </div>
  );
}
