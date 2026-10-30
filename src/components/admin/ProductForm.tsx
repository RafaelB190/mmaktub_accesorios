"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { buttonStyles } from "@/components/ui/button-styles";
import type { FormState } from "@/lib/actions/types";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Action = (previous: FormState, formData: FormData) => Promise<FormState>;

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none";

function Field({
  label,
  name,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={`product-${name}`} className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
          {label}
          {required ? <span className="ml-1 text-clay">*</span> : null}
        </span>
        {hint ? <span className="text-[10px] text-muted">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[11px] text-red-700">{error}</span> : null}
    </label>
  );
}

export function ProductForm({
  product,
  action,
  demo = false,
}: {
  product?: Product;
  action: Action;
  demo?: boolean;
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-4xl space-y-5">
      {state.error ? (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p>{state.error}</p>
        </div>
      ) : null}

      {demo ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Modo demostración: podés completar el formulario, pero los cambios no se
          van a guardar hasta que configures Supabase.
        </div>
      ) : null}

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Información básica</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" name="name" required error={errors.name?.[0]}>
            <input
              id="product-name"
              name="name"
              defaultValue={product?.name}
              required
              maxLength={80}
              placeholder="Collar Luna de Turquesa"
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug / URL"
            name="slug"
            hint="Se genera solo si lo dejás vacío"
            error={errors.slug?.[0]}
          >
            <input
              id="product-slug"
              name="slug"
              defaultValue={product?.slug}
              maxLength={80}
              placeholder="collar-luna-de-turquesa"
              className={inputClass}
            />
          </Field>

          <Field label="Categoría" name="category" required error={errors.category?.[0]}>
            <select
              id="product-category"
              name="category"
              defaultValue={product?.category ?? "collares"}
              className={inputClass}
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Materiales"
            name="materials"
            hint="Opcional"
            error={errors.materials?.[0]}
          >
            <input
              id="product-materials"
              name="materials"
              defaultValue={product?.materials ?? ""}
              maxLength={240}
              placeholder="Turquesa natural · Acero dorado"
              className={inputClass}
            />
          </Field>

          <Field
            label="Descripción"
            name="description"
            required
            error={errors.description?.[0]}
            className="sm:col-span-2"
          >
            <textarea
              id="product-description"
              name="description"
              defaultValue={product?.description}
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Contá la historia de esta pieza, sus materiales y para quién la imaginás…"
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Precio y stock</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Precio" name="price" required error={errors.price?.[0]}>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                $
              </span>
              <input
                id="product-price"
                name="price"
                type="number"
                inputMode="numeric"
                min={1}
                step={100}
                defaultValue={product?.price}
                required
                placeholder="32900"
                className={cn(inputClass, "pl-8")}
              />
            </div>
          </Field>

          <Field
            label="Precio anterior"
            name="compareAtPrice"
            hint="Opcional"
            error={errors.compareAtPrice?.[0]}
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted">
                $
              </span>
              <input
                id="product-compareAtPrice"
                name="compareAtPrice"
                type="number"
                inputMode="numeric"
                min={1}
                step={100}
                defaultValue={product?.compareAtPrice ?? ""}
                placeholder="38900"
                className={cn(inputClass, "pl-8")}
              />
            </div>
          </Field>

          <Field label="Stock" name="stock" required error={errors.stock?.[0]}>
            <input
              id="product-stock"
              name="stock"
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              defaultValue={product?.stock ?? 1}
              required
              className={inputClass}
            />
          </Field>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          Si completás el precio anterior, la pieza se muestra automáticamente en la
          sección de ofertas. Los precios se cargan en pesos argentinos, sin centavos.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Imágenes</h2>
        <p className="mt-1 text-xs text-muted">La primera es la que se ve en la tienda.</p>
        <div className="mt-5">
          <ImageUploader
            name="images"
            initialImages={product?.images ?? []}
            maxFiles={6}
            demo={demo}
          />
        </div>
        {errors.images?.[0] ? (
          <p className="mt-2 text-[11px] text-red-700">{errors.images[0]}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Visibilidad</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer gap-3 rounded-2xl border border-line bg-cream-deep/30 p-4">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="mt-1 h-4 w-4 accent-[#96573a]"
            />
            <span>
              <span className="block text-sm text-ink">Destacar en Novedades</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                Aparece primero en el carrusel de la página de inicio.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer gap-3 rounded-2xl border border-line bg-cream-deep/30 p-4">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="mt-1 h-4 w-4 accent-[#96573a]"
            />
            <span>
              <span className="block text-sm text-ink">Producto visible</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                Si lo desactivás, deja de mostrarse en la tienda.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream/95 p-3 shadow-[0_12px_30px_rgba(43,37,33,0.10)] backdrop-blur">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-1.5 px-2 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Volver
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin/productos" className={buttonStyles("ghost", "md")}>
            Cancelar
          </Link>
          <SubmitButton disabled={demo} pendingLabel="Guardando…">
            {product ? "Guardar cambios" : "Crear producto"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
