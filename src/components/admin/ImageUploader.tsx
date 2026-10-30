"use client";

import { ImagePlus, Link2, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  name: string;
  initialImages?: string[];
  maxFiles?: number;
  folder?: "productos" | "eventos";
  demo?: boolean;
};

export function ImageUploader({
  name,
  initialImages = [],
  maxFiles = 6,
  folder = "productos",
  demo = false,
}: Props) {
  const [images, setImages] = useState(initialImages.filter(Boolean));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    const available = maxFiles - images.length;
    if (available <= 0) {
      setError(`Podés cargar hasta ${maxFiles} imágenes.`);
      return;
    }

    const selected = Array.from(files).slice(0, available);
    setUploading(true);

    try {
      for (const file of selected) {
        if (file.size > 6 * 1024 * 1024) {
          setError(`"${file.name}" pesa más de 6 MB.`);
          continue;
        }

        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);

        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data: { url?: string; error?: string } = await response.json();

        if (!response.ok || !data.url) {
          setError(data.error ?? "No pudimos subir la imagen.");
          continue;
        }

        setImages((current) =>
          current.length >= maxFiles ? current : [...current, data.url as string],
        );
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const value = url.trim();
    if (!value) return;
    if (!value.startsWith("/") && !/^https?:\/\/[^\s]+$/.test(value)) {
      setError("Pegá una URL que empiece con http:// o https://.");
      return;
    }
    if (images.includes(value)) {
      setError("Esa imagen ya está en la lista.");
      return;
    }
    if (images.length >= maxFiles) {
      setError(`Podés cargar hasta ${maxFiles} imágenes.`);
      return;
    }
    setImages((current) => [...current, value]);
    setUrl("");
    setError(null);
  }

  function remove(index: number) {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function makeCover(index: number) {
    setImages((current) => {
      const next = [...current];
      const [selected] = next.splice(index, 1);
      return [selected, ...next];
    });
  }

  return (
    <div>
      {images.map((image) => (
        <input key={image} type="hidden" name={name} value={image} />
      ))}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-sand"
          >
            <Image
              src={image}
              alt={`Imagen ${index + 1}`}
              fill
              sizes="140px"
              className="object-cover"
            />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-cream/95 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.12em] text-clay">
                Portada
              </span>
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/55 opacity-0 transition-opacity group-hover:opacity-100">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  aria-label="Usar como portada"
                  className="grid h-7 w-7 place-items-center rounded-full bg-cream text-ink hover:bg-white"
                >
                  <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Quitar imagen"
                className="grid h-7 w-7 place-items-center rounded-full bg-cream text-red-700 hover:bg-white"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxFiles ? (
          <label
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-cream-deep/40 px-3 text-center transition-colors hover:border-clay/50 hover:bg-cream-deep/70",
              (uploading || demo) && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-clay" strokeWidth={1.5} />
            ) : (
              <ImagePlus className="h-5 w-5 text-clay" strokeWidth={1.5} />
            )}
            <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
              {uploading ? "Subiendo…" : "Subir foto"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple={maxFiles > 1}
              disabled={uploading || demo}
              onChange={(event) => uploadFiles(event.target.files)}
              className="sr-only"
            />
          </label>
        ) : null}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted">
        JPG, PNG, WebP o AVIF hasta 6 MB.{" "}
        {maxFiles > 1
          ? "La primera imagen es la portada; podés cambiarla con la estrella."
          : "Se usa como imagen principal del evento."}
      </p>

      {demo ? (
        <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-900">
          En modo demostración no se pueden subir archivos. Conectá Supabase para
          activar la subida.
        </p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Link2
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="O pegá una URL de imagen…"
            className="h-10 w-full rounded-xl border border-line bg-cream pl-9 pr-3 text-xs text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line px-4 text-[9px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
        >
          <UploadCloud className="h-3.5 w-3.5" strokeWidth={1.5} />
          Agregar
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-[11px] text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
