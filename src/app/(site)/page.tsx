import {
  ArrowRight,
  CalendarDays,
  Gem,
  Instagram,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EventCard } from "@/components/site/EventCard";
import { Marquee } from "@/components/site/Marquee";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig } from "@/lib/config";
import { getPublicEvents } from "@/lib/events";
import { getCategoryCounts, getNewArrivals, getSaleProducts } from "@/lib/products";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/types";

const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  collares: "/productos/collar-capas.jpg",
  pulseras: "/productos/pulsera-eslabones.jpg",
  combitos: "/productos/combito.jpg",
  aritos: "/productos/aros-cristal.jpg",
  mimos: "/productos/anillo-duo.jpg",
};

const INSTAGRAM_IMAGES = [
  { src: "/productos/collar-capas.jpg", alt: "Collar de capas con piedras naturales" },
  { src: "/brand/manos.jpg", alt: "Manos con pulseras de Maktub" },
  { src: "/productos/aros-cristal.jpg", alt: "Aros con cristales azules" },
  { src: "/productos/anillo-duo.jpg", alt: "Anillos con piedras naturales" },
];

export default async function HomePage() {
  const [newArrivals, saleProducts, categoryCounts, events] = await Promise.all([
    getNewArrivals(8),
    getSaleProducts(4),
    getCategoryCounts(),
    getPublicEvents(),
  ]);

  const nextEvents = events.upcoming.slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/brand/og.jpg`,
    sameAs: [siteConfig.instagram],
    address: { "@type": "PostalAddress", addressCountry: "AR" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-sage/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sand/60 blur-3xl" />

        <Container className="relative grid gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-20">
          <div>
            <p className="rise flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-clay">
              <span className="h-px w-8 bg-clay/60" />
              Hecho a mano · Piedras naturales
            </p>

            <h1 className="rise rise-delay-1 mt-6 text-balance text-[clamp(2.9rem,7.5vw,5.4rem)] leading-[0.97] tracking-[-0.015em] text-ink">
              Piedras que
              <span className="block italic text-clay">guardan historias.</span>
            </h1>

            <p className="rise rise-delay-2 mt-6 max-w-md text-[15px] leading-relaxed text-muted">
              Accesorios de piedras naturales creados por Juli y Vero. Piezas
              únicas que te acompañan y te recuerdan que todo llega a su tiempo.
            </p>

            <div className="rise rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
              <Link href="/productos" className={buttonStyles("primary", "lg")}>
                Ver la colección
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/nosotros" className={buttonStyles("outline", "lg")}>
                Nuestra historia
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6 sm:max-w-lg">
              <div>
                <Sparkles className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  Hecho a mano
                </p>
              </div>
              <div>
                <Gem className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  Piezas únicas
                </p>
              </div>
              <div>
                <Truck className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-soft">
                  Envíos al país
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-[480px]">
            <div className="absolute -left-6 top-16 h-44 w-44 rounded-full bg-sage/15 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[16rem] border border-line/70 bg-sand">
              <Image
                src="/brand/hero.jpg"
                alt="Mujer usando un collar de perlas de Maktub"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-2 -left-2 w-52 rounded-2xl border border-line/70 bg-cream/95 p-4 shadow-[0_16px_40px_rgba(43,37,33,0.12)] backdrop-blur sm:-left-8 sm:bottom-10">
              <Sparkles className="h-4 w-4 text-clay" strokeWidth={1.5} />
              <p className="mt-2 font-display text-lg leading-tight text-ink">
                Piedras elegidas una por una
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted">
                Como un pequeño amuleto
              </p>
            </div>

            <p className="absolute -right-1 top-1/2 hidden -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.4em] text-muted/70 lg:block">
              Maktub · estaba escrito
            </p>
          </div>
        </Container>
      </section>

      <Marquee
        items={[
          "Piedras naturales",
          "Hecho a mano",
          "Piezas únicas",
          "Envíos a todo el país",
          "Combitos con intención",
        ]}
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Recién llegado"
            title="Novedades"
            description="Lo último que salió del taller. Cada pieza es única, igual que quien la elige."
            action={
              <Link
                href="/productos"
                className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
              >
                Ver todo
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            }
          />

          <div className="mt-10">
            {newArrivals.length ? (
              <ProductCarousel products={newArrivals} />
            ) : (
              <p className="rounded-3xl border border-dashed border-line bg-cream-deep/50 px-6 py-16 text-center text-sm text-muted">
                Estamos preparando la próxima colección. Muy pronto vas a poder verla acá.
              </p>
            )}
          </div>
        </Container>
      </section>

      {saleProducts.length ? (
        <section className="border-y border-line/70 bg-cream-deep/65 py-20 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow="Por tiempo limitado"
              title="Ofertas que enamoran"
              description="Piezas seleccionadas con un precio especial. Cuando se van, se van."
              action={
                <Link
                  href="/productos?oferta=1"
                  className="group inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
                >
                  Ver ofertas
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              }
            />
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Explorá"
            title="Encontrá tu pieza"
            description="Collares, pulseras, combitos y pequeños mimos. Todos con piedras naturales y mucho amor."
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/productos?categoria=${category.value}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-b-[1.5rem] rounded-t-[9rem] bg-sand"
              >
                <Image
                  src={CATEGORY_IMAGES[category.value]}
                  alt={category.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-cream/65">
                    {categoryCounts[category.value] ?? 0} piezas
                  </p>
                  <p className="mt-1 font-display text-2xl leading-none">
                    {category.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="overflow-hidden py-20 sm:py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto w-full max-w-[480px] lg:mx-0">
            <div className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-b-[2rem] rounded-t-[13rem] border border-line/70 bg-sand">
              <Image
                src="/brand/historia.jpg"
                alt="Collares de Maktub sobre la piel"
                fill
                sizes="(max-width: 1024px) 80vw, 38vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-0 aspect-square w-[42%] overflow-hidden rounded-full border-[7px] border-cream bg-sand shadow-lg">
              <Image
                src="/brand/manos.jpg"
                alt="Manos con pulseras hechas a mano"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-clay">
              Nuestra historia
            </p>
            <h2 className="mt-4 text-balance text-4xl leading-[1.05] text-ink sm:text-5xl">
              Maktub significa
              <span className="block italic text-clay">«estaba escrito».</span>
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
              Somos Juli y Vero, dos hermanas que encontraron en las piedras
              naturales una forma de contar historias. Cada collar, cada pulsera,
              pasa por nuestras manos y nace con una intención: acompañarte.
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Creemos en los detalles simples, en regalar algo con significado y
              en que la pieza justa aparece cuando tiene que aparecer.
            </p>
            <Link
              href="/nosotros"
              className="group mt-8 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
            >
              Conocé a Juli y Vero
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 text-cream sm:py-24">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="Nos encontramos"
            title="Próximos eventos"
            description="Llevamos nuestro stand a ferias y encuentros. Nos encantaría verte ahí."
            action={
              <Link href="/eventos" className={buttonStyles("light", "md")}>
                Ver agenda
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              </Link>
            }
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {nextEvents.length ? (
              nextEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="rounded-[2rem] border border-cream/15 bg-cream/5 p-8 md:col-span-2">
                <p className="font-display text-2xl">Estamos preparando la próxima fecha.</p>
                <p className="mt-2 text-sm text-cream/65">
                  Mientras tanto, seguinos en Instagram para enterarte primero.
                </p>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cream underline decoration-cream/30 underline-offset-4"
                >
                  <Instagram className="h-4 w-4" strokeWidth={1.5} />
                  {siteConfig.instagramHandle}
                </a>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Comunidad"
            title="Seguinos en Instagram"
            description="Historias, novedades y piezas que encuentran a su persona."
            action={
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-clay"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                {siteConfig.instagramHandle}
              </a>
            }
          />

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INSTAGRAM_IMAGES.map((image) => (
              <a
                key={image.src}
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-sand"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/30">
                  <Instagram
                    className="h-6 w-6 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
