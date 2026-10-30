"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  PRODUCT_CATEGORY_VALUES,
  type ProductCategory,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import type { FormState } from "./types";

const imageSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\/[^\s]+$/.test(value),
    "La imagen debe ser un archivo subido o una URL válida.",
  );

const optionalPrice = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce.number().int().min(1).optional(),
);

const productSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres.").max(80),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo admite minúsculas, números y guiones.",
    )
    .max(80),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(2_000),
  price: z.coerce.number().int("El precio debe ser un número entero.").min(1, "Ingresá un precio."),
  compareAtPrice: optionalPrice,
  category: z.enum(PRODUCT_CATEGORY_VALUES),
  images: z.array(imageSchema).min(1, "Agregá al menos una imagen.").max(6),
  stock: z.coerce.number().int().min(0).max(999),
  featured: z.boolean(),
  active: z.boolean(),
  materials: z.string().trim().max(240).optional(),
});

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;
  return Object.fromEntries(
    Object.entries(flattened)
      .filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length))
      .map(([key, messages]) => [key, messages]),
  );
}

function parseProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const result = productSchema.safeParse({
    name,
    slug: String(formData.get("slug") ?? "").trim() || slugify(name),
    description: String(formData.get("description") ?? ""),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    category: formData.get("category"),
    images: formData.getAll("images").map(String).filter(Boolean),
    stock: formData.get("stock"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    materials: String(formData.get("materials") ?? "").trim() || undefined,
  });

  if (!result.success) {
    return { fieldErrors: fieldErrorsFrom(result.error) };
  }

  const data = result.data;
  if (data.compareAtPrice && data.compareAtPrice <= data.price) {
    return {
      fieldErrors: {
        compareAtPrice: ["El precio anterior debe ser mayor al precio actual."],
      },
    };
  }

  return {
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      compare_at_price: data.compareAtPrice ?? null,
      category: data.category as ProductCategory,
      images: data.images,
      stock: data.stock,
      featured: data.featured,
      active: data.active,
      materials: data.materials ?? null,
    },
  };
}

async function persistProduct(id: string | null, formData: FormData): Promise<FormState> {
  await requireAdmin();

  if (!isSupabaseConfigured) {
    return {
      error:
        "Estás en modo demostración. Configurá Supabase para guardar productos de verdad.",
    };
  }

  const parsed = parseProduct(formData);
  if ("fieldErrors" in parsed) return { fieldErrors: parsed.fieldErrors };

  const supabase = getSupabase();
  const query = id
    ? supabase.from("products").update(parsed.data).eq("id", id)
    : supabase.from("products").insert(parsed.data);

  const { error } = await query;

  if (error) {
    if (error.code === "23505") {
      return {
        error: "Ya existe un producto con ese slug. Probá con otro o dejalo vacío.",
      };
    }
    return { error: `No pudimos guardar el producto: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/productos?ok=${id ? "actualizado" : "creado"}`);
}

export async function createProductAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistProduct(null, formData);
}

export async function updateProductAction(
  id: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistProduct(id, formData);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/productos");

  if (!isSupabaseConfigured) {
    redirect("/admin/productos?error=modo-demo");
  }

  const { error } = await getSupabase().from("products").delete().eq("id", id);

  revalidatePath("/", "layout");
  redirect(
    error
      ? `/admin/productos?error=${encodeURIComponent(error.message)}`
      : "/admin/productos?ok=eliminado",
  );
}
