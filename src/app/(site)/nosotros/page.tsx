import { ArrowRight, Gem, Heart, Instagram, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppContactForm } from "@/components/site/WhatsAppContactForm";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Somos Juli y Vero, dos hermanas detrás de Maktub Accesorios. Creamos piezas de piedras naturales hechas a mano en Argentina.",
};

const VALUES = [
  {
    icon: Gem,
    title: "Piedras naturales",
    text: "Elegimos cada piedra por su color, su textura y eso que no se explica del todo. Todas son distintas.",
  },
  {
    icon: Heart,
    title: "Hecho a mano",
    text: "Armamos las piezas en nuestro taller, una por una. Nos gusta el proceso y se nota en el resultado.",
  },
  {
    icon: Sparkles,
    title: "Piezas únicas",
    text: "No hay dos iguales. La pieza que elegís es tuya y de nadie más, igual que la historia que vas a contar con ella.",
  },
];

export default function AboutPage() {
  const waLink = whatsappLink();

  return (
    <>
      <section className="border-b border-line/70 bg-cream-deep/45">
        <Container className="py-14 sm:py-20">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-clay">
            Nosotras
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.7rem,6vw,5rem)] leading-[0.98] tracking-[-0.01em]">
            Dos hermanas, un montón de piedras y una idea:
            <span className="italic text-clay"> estaba escrito.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
            Somos Juli y Vero, las manos detrás de Maktub. Te invitamos a
            sumergirte en el mundo de las piedras naturales y a encontrar esa pieza
            que parece hecha para vos.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-[10rem] bg-sand sm:mt-10">
              <Image
                src="/brand/historia.jpg"
                alt="Collares de piedras naturales de Maktub"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-sand">
              <Image
                src="/brand/manos.jpg"
                alt="Manos de Juli y Vero con pulseras hechas a mano"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-b-[2rem] rounded-t-[10rem] bg-sand sm:mt-10">
              <Image
                src="/brand/taller.jpg"
                alt="Piedras y anillos en el taller de Maktub"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-clay">
                Nuestra historia
              </p>
              <h2 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
                Empezó como un juego
                <span className="block italic text-clay">y se volvió un lenguaje.</span>
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
                <p>
                  «Buenas, buenas». Así arrancamos siempre, porque Maktub nació en
                  esas charlas largas entre hermanas, con piedras sobre la mesa y
                  ganas de crear algo propio.
                </p>
                <p>
                  Un día armamos un collar para regalar. Después otro. Después
                  empezamos a elegir piedras por su historia, a probar combinaciones
                  y a entender que cada pieza encontraba a su persona en el momento
                  justo.
                </p>
                <p>
                  Hoy hacemos collares, pulseras, combitos, aros y pequeños mimos.
                  Todo con piedras naturales, todo a mano, todo en pequeñas tandas.
                  No buscamos producir en serie: buscamos que cada pieza tenga
                  intención.
                </p>
              </div>

              <p className="mt-8 font-display text-2xl italic text-clay">
                Juli & Vero
              </p>
            </div>

            <div className="space-y-3">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="flex gap-4 rounded-2xl border border-line bg-cream-deep/35 p-5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-clay">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl leading-tight">{value.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">
                        {value.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line/70 bg-sand/40 py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-display text-6xl leading-none text-clay/40">“</span>
            <p className="text-balance font-display text-3xl leading-snug text-ink sm:text-4xl">
              Maktub significa «estaba escrito». Nos gusta pensar que cada piedra
              encuentra a su persona, y que no hay casualidades.
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-muted">
              Nuestra forma de ver las cosas
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-clay">
              Hablemos
            </p>
            <h2 className="mt-4 text-4xl leading-[1.05] sm:text-5xl">
              ¿Tenés una idea
              <span className="block italic text-clay">en mente?</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Podés escribirnos para consultar por una pieza, pedir algo especial,
              coordinar un regalo o invitarnos a tu feria. Nos encanta leerlas.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles("primary", "lg")}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Escribinos por WhatsApp
                </a>
              ) : null}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles("outline", "lg")}
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                Seguinos en Instagram
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-muted">
              <span>Hecho a mano en Argentina</span>
              <span>Envíos a todo el país</span>
              <span>Piezas únicas</span>
            </div>

            <Link
              href="/productos"
              className="group mt-8 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
            >
              Ver la colección
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          <WhatsAppContactForm />
        </Container>
      </section>
    </>
  );
}
