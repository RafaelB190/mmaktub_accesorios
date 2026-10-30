import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/Badge";
import {
  formatEventDay,
  formatEventTime,
  formatShortDate,
} from "@/lib/format";
import type { StoreEvent } from "@/lib/types";

export function EventCard({ event }: { event: StoreEvent }) {
  const badge = formatShortDate(event.startsAt).split(" ");

  return (
    <article className="overflow-hidden rounded-[2rem] border border-line/70 bg-cream">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <CalendarDays className="h-10 w-10 text-muted/40" strokeWidth={1} />
          </div>
        )}
        <div className="absolute left-5 top-5 flex h-[62px] w-[56px] flex-col items-center justify-center rounded-2xl bg-cream/95 text-ink shadow-sm backdrop-blur">
          <span className="font-display text-2xl leading-none">{badge[0]}</span>
          <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-muted">
            {badge[1]}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-clay">
          {formatEventDay(event.startsAt)} · {formatEventTime(event.startsAt)}
        </p>
        <h3 className="mt-2 text-2xl leading-tight text-ink">{event.title}</h3>
        <p className="mt-2 flex items-start gap-2 text-xs text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          <span>
            {event.location}
            {event.address ? ` · ${event.address}` : ""}
          </span>
        </p>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-soft/85">
          {event.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          {event.mapsUrl ? (
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink underline decoration-line underline-offset-4 transition-colors hover:text-clay"
            >
              Cómo llegar
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <Badge variant="soft" className="border border-line">
              Te esperamos
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
