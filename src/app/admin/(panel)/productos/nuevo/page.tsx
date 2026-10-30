import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/products";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Nuevo producto" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Nuevo producto"
        description="Cargá la información y las fotos. Podés editar todo más adelante."
        action={
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Volver
          </Link>
        }
      />
      <ProductForm action={createProductAction} demo={!isSupabaseConfigured} />
    </div>
  );
}
