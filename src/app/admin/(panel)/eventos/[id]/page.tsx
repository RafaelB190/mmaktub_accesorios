import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteForm } from "@/components/admin/DeleteForm";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { deleteEventAction, updateEventAction } from "@/lib/actions/events";
import { getEventById } from "@/lib/events";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Editar evento" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda"
        title={event.title}
        description="Actualizá la fecha, el lugar o las fotos del evento."
        action={
          <Link
            href="/admin/eventos"
            className="text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
          >
            ← Volver a eventos
          </Link>
        }
      />

      <EventForm
        event={event}
        action={updateEventAction.bind(null, event.id)}
        demo={!isSupabaseConfigured}
      />

      <section className="max-w-4xl rounded-2xl border border-red-200 bg-red-50/50 p-5 sm:p-6">
        <h2 className="text-lg text-red-900">Eliminar evento</h2>
        <p className="mt-1 text-xs leading-relaxed text-red-800/80">
          Esta acción no se puede deshacer. Si solo querés ocultarlo, desmarcá
          «Evento publicado» y guardá los cambios.
        </p>
        <div className="mt-4">
          <DeleteForm
            id={event.id}
            action={deleteEventAction}
            confirmText={`¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`}
            label="Eliminar evento"
          />
        </div>
      </section>
    </div>
  );
}
