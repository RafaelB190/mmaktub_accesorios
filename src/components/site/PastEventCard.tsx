import Image from "next/image";

import { formatEventDay } from "@/lib/format";
import type { StoreEvent } from "@/lib/types";

export function PastEventCard({ event }: { event: StoreEvent }) {
  return (
    <article className="group">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-sand">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center font-display text-4xl text-muted/30">
            maktub
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-cream/75">
            {formatEventDay(event.startsAt)}
          </p>
          <h3 className="mt-1 font-display text-2xl text-cream">{event.title}</h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {event.description}
      </p>
    </article>
  );
}
