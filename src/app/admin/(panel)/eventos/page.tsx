import { AlertCircle, CheckCircle2, Eye, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteForm } from "@/components/admin/DeleteForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { deleteEventAction } from "@/lib/actions/events";
import { getAllEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import type { StoreEvent } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const OK_MESSAGES: Record<string, string> = {
  creado: "Evento creado con éxito.",
  actualizado: "Los cambios se guardaron.",
  eliminado: "El evento fue eliminado.",
};

function EventRow({ event }: { event: StoreEvent }) {
  const isUpcoming = new Date(event.startsAt).getTime() >= Date.now();

  return (
    <li className="grid gap-4 p-4 sm:grid-cols-[64px_1fr_auto] sm:items-center">
      <Link
        href="/eventos"
        target="_blank"
        className="relative h-16 w-16 overflow-hidden rounded-xl bg-sand"
      >
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-xl leading-tight text-ink">{event.title}</p>
          <Badge variant={isUpcoming ? "new" : "soft"}>
            {isUpcoming ? "Próximo" : "Pasado"}
          </Badge>
          {!event.published ? <Badge variant="soldout">Borrador</Badge> : null}
        </div>
        <p className="mt-1 text-[11px] text-muted">
          {formatEventDate(event.startsAt)} · {event.location}
        </p>
      </div>

      <div className="flex items-center justify-between gap-1 sm:justify-end">
        <Link
          href="/eventos"
          target="_blank"
          aria-label={`Ver ${event.title} en la web`}
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
        </Link>
        <Link
          href={`/admin/eventos/${event.id}`}
          aria-label={`Editar ${event.title}`}
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink"
        >
          <Pencil className="h-4 w-4" strokeWidth={1.5} />
        </Link>
        <DeleteForm
          id={event.id}
          action={deleteEventAction}
          confirmText={`¿Eliminar "${event.title}"? Esta acción no se puede deshacer.`}
        />
      </div>
    </li>
  );
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const ok = firstValue(params.ok);
  const error = firstValue(params.error);
  const events = await getAllEvents();

  const upcoming = events
    .filter((event) => new Date(event.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  const past = events
    .filter((event) => new Date(event.startsAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda"
        title="Eventos"
        description="Cargá las próximas ferias y los encuentros que ya pasaron. La web los organiza sola."
        action={
          <Link href="/admin/eventos/nuevo" className={buttonStyles("primary", "md")}>
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nuevo evento
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
            ? "Configurá Supabase para eliminar eventos de verdad."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      {events.length ? (
        <div className="space-y-7">
          <section>
            <h2 className="mb-3 text-xl">Próximos ({upcoming.length})</h2>
            {upcoming.length ? (
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-line bg-cream px-5 py-8 text-center text-sm text-muted">
                No hay eventos próximos cargados.
              </p>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-xl">Ya pasaron ({past.length})</h2>
            {past.length ? (
              <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream">
                {past.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-line bg-cream px-5 py-8 text-center text-sm text-muted">
                Los eventos pasados se van a ir guardando acá.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-cream px-6 py-16 text-center">
          <p className="font-display text-2xl">Todavía no cargaste eventos</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Sumá tu próxima feria y las fotos de los encuentros que ya vivieron.
          </p>
          <Link
            href="/admin/eventos/nuevo"
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
