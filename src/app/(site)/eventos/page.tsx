import { ArrowRight, CalendarDays, Instagram, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { EventCard } from "@/components/site/EventCard";
import { PastEventCard } from "@/components/site/PastEventCard";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig, whatsappLink } from "@/lib/config";
import { getPublicEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Ferias, pop-ups y encuentros donde podés conocer los accesorios de Maktub en persona. Enterate de las próximas fechas.",
};

export default async function EventsPage() {
  const { upcoming, past } = await getPublicEvents();
  const next = upcoming[0];
  const waLink = whatsappLink(
    "¡Hola! Quisiera saber en qué próximos eventos van a estar 💫",
  );

  return (
    <>
      <section className="border-b border-line/70 bg-cream-deep/45">
        <Container className="py-14 sm:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-clay">
            Agenda
          </p>
          <h1 className="mt-5 max-w-3xl text-balance text-[clamp(2.8rem,6vw,5rem)] leading-[0.98]">
            Nos encontramos
            <span className="block italic text-clay">en persona.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Llevamos nuestro stand a ferias, mercados y pop-ups. Es la mejor forma
            de tocar las piedras, probarte las piezas y charlar un rato.
          </p>

          {next ? (
            <div className="mt-8 inline-flex max-w-full flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-line bg-cream px-5 py-4">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-clay">
                <CalendarDays className="h-4 w-4" strokeWidth={1.5} />
                Próxima parada
              </span>
              <span className="font-display text-lg text-ink">{next.title}</span>
              <span className="text-[11px] text-muted">{formatEventDate(next.startsAt)}</span>
              <a
                href="#proximos"
                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-4 hover:text-clay"
              >
                Ver detalles
                <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </a>
            </div>
          ) : null}
        </Container>
      </section>

      <section id="proximos" className="scroll-mt-28 py-14 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-clay">
                Próximas fechas
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl">Nuestro stand</h2>
            </div>
            <p className="text-xs text-muted">
              {upcoming.length} {upcoming.length === 1 ? "evento agendado" : "eventos agendados"}
            </p>
          </div>

          {upcoming.length ? (
            <div className="mt-9 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <div key={event.id} id={event.id} className="scroll-mt-28">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-9 rounded-[2rem] border border-dashed border-line bg-cream-deep/40 px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-7 w-7 text-clay" strokeWidth={1.2} />
              <p className="mt-4 font-display text-3xl">Estamos preparando la próxima fecha</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Seguinos en Instagram para enterarte primero. Mientras tanto, podés
                escribirnos y coordinamos una visita.
              </p>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles("outline", "md") + " mt-6"}
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                {siteConfig.instagramHandle}
              </a>
            </div>
          )}
        </Container>
      </section>

      <section className="border-t border-line/70 bg-cream-deep/35 py-14 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-clay">
                Recuerdos
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl">Donde ya estuvimos</h2>
            </div>
            <p className="text-xs text-muted">
              {past.length} {past.length === 1 ? "encuentro" : "encuentros"}
            </p>
          </div>

          {past.length ? (
            <div className="mt-9 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <div key={event.id} id={event.id} className="scroll-mt-28">
                  <PastEventCard event={event} />
                  <p className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                    <MapPin className="h-3 w-3" strokeWidth={1.5} />
                    {event.location}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-9 rounded-[2rem] border border-dashed border-line bg-cream px-6 py-12 text-center text-sm text-muted">
              Los recuerdos de nuestros encuentros van a aparecer acá.
            </p>
          )}
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-ink px-6 py-10 text-center sm:flex-row sm:px-10 sm:text-left">
          <div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-cream/50">
              ¿Organizás una feria o un pop-up?
            </p>
            <h2 className="mt-2 font-display text-3xl text-cream sm:text-4xl">
              Nos encantaría participar.
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles("light", "md")}
              >
                <WhatsAppIcon className="h-4 w-4" />
                Escribinos
              </a>
            ) : null}
            <Link href="/productos" className={buttonStyles("outline", "md") + " border-cream/25 text-cream hover:border-cream hover:bg-cream/10"}>
              Ver la colección
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
