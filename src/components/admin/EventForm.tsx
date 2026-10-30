"use client";

import { AlertCircle, ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { buttonStyles } from "@/components/ui/button-styles";
import type { FormState } from "@/lib/actions/types";
import { toArgentinaInputValue } from "@/lib/format";
import type { StoreEvent } from "@/lib/types";
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
    <label htmlFor={`event-${name}`} className={cn("block", className)}>
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

export function EventForm({
  event,
  action,
  demo = false,
}: {
  event?: StoreEvent;
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
        <h2 className="text-xl">Datos del evento</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Título"
            name="title"
            required
            error={errors.title?.[0]}
            className="sm:col-span-2"
          >
            <input
              id="event-title"
              name="title"
              defaultValue={event?.title}
              required
              maxLength={100}
              placeholder="Feria de Diseño en Palermo"
              className={inputClass}
            />
          </Field>

          <Field
            label="Fecha y hora"
            name="startsAt"
            required
            error={errors.startsAt?.[0]}
          >
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                strokeWidth={1.5}
              />
              <input
                id="event-startsAt"
                name="startsAt"
                type="datetime-local"
                defaultValue={
                  event ? toArgentinaInputValue(event.startsAt) : undefined
                }
                required
                className={cn(inputClass, "pl-11")}
              />
            </div>
          </Field>

          <Field label="Lugar" name="location" required error={errors.location?.[0]}>
            <input
              id="event-location"
              name="location"
              defaultValue={event?.location}
              required
              maxLength={120}
              placeholder="Plaza Serrano"
              className={inputClass}
            />
          </Field>

          <Field
            label="Dirección"
            name="address"
            hint="Opcional"
            error={errors.address?.[0]}
          >
            <input
              id="event-address"
              name="address"
              defaultValue={event?.address ?? ""}
              maxLength={200}
              placeholder="Serrano y Honduras, Palermo"
              className={inputClass}
            />
          </Field>

          <Field
            label="Link de Google Maps"
            name="mapsUrl"
            hint="Opcional"
            error={errors.mapsUrl?.[0]}
          >
            <input
              id="event-mapsUrl"
              name="mapsUrl"
              type="url"
              defaultValue={event?.mapsUrl ?? ""}
              placeholder="https://maps.google.com/…"
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
              id="event-description"
              name="description"
              defaultValue={event?.description}
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              placeholder="Contá qué van a encontrar en el stand, en qué horario y cualquier detalle útil…"
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
            />
          </Field>
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          Los eventos con fecha futura aparecen en «Próximos eventos»; los que ya
          pasaron se muestran automáticamente en la galería de recuerdos.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Imagen del evento</h2>
        <p className="mt-1 text-xs text-muted">
          Una foto del stand, la feria o el lugar. Se usa en la agenda y en la galería.
        </p>
        <div className="mt-5">
          <ImageUploader
            name="image"
            initialImages={event?.image ? [event.image] : []}
            maxFiles={1}
            folder="eventos"
            demo={demo}
          />
        </div>
        {errors.image?.[0] ? (
          <p className="mt-2 text-[11px] text-red-700">{errors.image[0]}</p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-line bg-cream p-5 sm:p-6">
        <h2 className="text-xl">Visibilidad</h2>
        <label className="mt-4 flex cursor-pointer gap-3 rounded-2xl border border-line bg-cream-deep/30 p-4">
          <input
            type="checkbox"
            name="published"
            defaultChecked={event?.published ?? true}
            className="mt-1 h-4 w-4 accent-[#96573a]"
          />
          <span>
            <span className="block text-sm text-ink">Evento publicado</span>
            <span className="mt-1 block text-[11px] leading-relaxed text-muted">
              Si lo desactivás, se guarda pero no se muestra en la web.
            </span>
          </span>
        </label>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-cream/95 p-3 shadow-[0_12px_30px_rgba(43,37,33,0.10)] backdrop-blur">
        <Link
          href="/admin/eventos"
          className="inline-flex items-center gap-1.5 px-2 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Volver
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin/eventos" className={buttonStyles("ghost", "md")}>
            Cancelar
          </Link>
          <SubmitButton disabled={demo} pendingLabel="Guardando…">
            {event ? "Guardar cambios" : "Crear evento"}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
