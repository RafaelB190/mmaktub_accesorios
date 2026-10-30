"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { argentinaInputToIso } from "@/lib/format";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { FormState } from "./types";

const imageSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\/[^\s]+$/.test(value),
    "La imagen debe ser un archivo subido o una URL válida.",
  );

const eventSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres.").max(100),
  startsAt: z
    .string()
    .trim()
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value),
      "Indicá la fecha y la hora del evento.",
    ),
  location: z.string().trim().min(2, "Indicá dónde va a ser el evento.").max(120),
  address: z.string().trim().max(200).optional(),
  mapsUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/[^\s]+$/.test(value),
      "El link de Google Maps debe empezar con http:// o https://.",
    )
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(2_000),
  image: z.union([imageSchema, z.literal("")]).optional(),
  published: z.boolean(),
});

function parseEvent(formData: FormData) {
  const result = eventSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    startsAt: String(formData.get("startsAt") ?? ""),
    location: String(formData.get("location") ?? ""),
    address: String(formData.get("address") ?? "").trim() || undefined,
    mapsUrl: String(formData.get("mapsUrl") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? "").trim() || undefined,
    published: formData.get("published") === "on",
  });

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    return {
      fieldErrors: Object.fromEntries(
        Object.entries(flattened)
          .filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length))
          .map(([key, messages]) => [key, messages]),
      ),
    };
  }

  const data = result.data;
  return {
    data: {
      title: data.title,
      description: data.description,
      starts_at: argentinaInputToIso(data.startsAt),
      location: data.location,
      address: data.address ?? null,
      maps_url: data.mapsUrl || null,
      image: data.image || null,
      published: data.published,
    },
  };
}

async function persistEvent(id: string | null, formData: FormData): Promise<FormState> {
  await requireAdmin();

  if (!isSupabaseConfigured) {
    return {
      error:
        "Estás en modo demostración. Configurá Supabase para guardar eventos de verdad.",
    };
  }

  const parsed = parseEvent(formData);
  if ("fieldErrors" in parsed) return { fieldErrors: parsed.fieldErrors };

  const supabase = getSupabase();
  const query = id
    ? supabase.from("events").update(parsed.data).eq("id", id)
    : supabase.from("events").insert(parsed.data);

  const { error } = await query;

  if (error) {
    return { error: `No pudimos guardar el evento: ${error.message}` };
  }

  revalidatePath("/", "layout");
  redirect(`/admin/eventos?ok=${id ? "actualizado" : "creado"}`);
}

export async function createEventAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistEvent(null, formData);
}

export async function updateEventAction(
  id: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  return persistEvent(id, formData);
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/eventos");

  if (!isSupabaseConfigured) {
    redirect("/admin/eventos?error=modo-demo");
  }

  const { error } = await getSupabase().from("events").delete().eq("id", id);

  revalidatePath("/", "layout");
  redirect(
    error
      ? `/admin/eventos?error=${encodeURIComponent(error.message)}`
      : "/admin/eventos?ok=eliminado",
  );
}
