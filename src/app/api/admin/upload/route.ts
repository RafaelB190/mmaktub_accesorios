import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured, MEDIA_BUCKET } from "@/lib/supabase";

export const runtime = "nodejs";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_FILE_SIZE = 6 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Configurá Supabase para poder subir imágenes." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") === "eventos" ? "eventos" : "productos";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No recibimos ninguna imagen." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá JPG, PNG, WebP o AVIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "La imagen pesa más de 6 MB. Probá comprimirla un poco." },
      { status: 400 },
    );
  }

  const path = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabase()
    .storage.from(MEDIA_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "No pudimos subir la imagen. Revisá el bucket en Supabase." },
      { status: 500 },
    );
  }

  const { data } = getSupabase().storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
