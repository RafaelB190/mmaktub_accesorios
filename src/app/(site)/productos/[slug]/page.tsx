import { ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCart } from "@/components/shop/AddToCart";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { Container } from "@/components/ui/Container";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import {
  discountPercentage,
  getProductBySlug,
  getRelatedProducts,
  isOnSale,
} from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/types";

type PageProps = { params: Promise<{ slug: string }> };

function imageUrl(image: string | undefined) {
  if (!image) return absoluteUrl("/brand/og.jpg");
  return image.startsWith("http") ? image : absoluteUrl(image);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Producto no encontrado" };

  const image = imageUrl(product.images[0]);
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/productos/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(product, 4);
  const onSale = isOnSale(product);
  const discount = discountPercentage(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map(imageUrl),
    sku: product.slug,
    brand: { "@type": "Brand", name: "Maktub Accesorios" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/productos/${product.slug}`),
      priceCurrency: "ARS",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="py-8 sm:py-12">
        <Container>
          <nav
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.16em] text-muted"
            aria-label="Ruta"
          >
            <Link href="/" className="transition-colors hover:text-clay">
              Inicio
            </Link>
            <span className="text-line">/</span>
            <Link href="/productos" className="transition-colors hover:text-clay">
              Productos
            </Link>
            <span className="text-line">/</span>
            <Link
              href={`/productos?categoria=${product.category}`}
              className="transition-colors hover:text-clay"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
            <span className="text-line">/</span>
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ProductGallery
                images={product.images}
                name={product.name}
                saleLabel={onSale ? `-${discount}%` : null}
              />
            </div>

            <div className="lg:pt-8">
              <Link
                href={`/productos?categoria=${product.category}`}
                className="text-[10px] font-medium uppercase tracking-[0.24em] text-clay transition-colors hover:text-clay-dark"
              >
                {CATEGORY_LABELS[product.category]}
              </Link>

              <h1 className="mt-3 text-balance text-4xl leading-[1.05] sm:text-5xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl text-ink">
                  {formatPrice(product.price)}
                </span>
                {onSale && product.compareAtPrice ? (
                  <>
                    <span className="text-sm text-muted line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="rounded-full bg-clay/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-clay">
                      Ahorrás {discount}%
                    </span>
                  </>
                ) : null}
              </div>

              <p className="mt-2 text-[11px] text-muted">
                Hasta 3 cuotas con Mercado Pago · Precio final en pesos argentinos.
              </p>

              <div className="mt-6 border-y border-line/80 py-6">
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft/90">
                  {product.description}
                </p>
                {product.materials ? (
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    <span className="font-medium uppercase tracking-[0.14em] text-ink-soft">
                      Materiales:
                    </span>{" "}
                    {product.materials}
                  </p>
                ) : null}
              </div>

              <div className="mt-6">
                <AddToCart product={product} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-y border-line/80 py-5 text-center">
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
                    Pago seguro
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 border-x border-line/80">
                  <Truck className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
                    Envíos al país
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Sparkles className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
                    Hecho a mano
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <details className="group border-b border-line/80 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
                    Envíos y retiro
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-line transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pt-3 text-sm leading-relaxed text-muted">
                    Hacemos envíos a todo el país. El costo es de{" "}
                    {formatPrice(siteConfig.shipping.cost)} y es gratis en compras
                    desde {formatPrice(siteConfig.shipping.freeFrom)}. También podés
                    coordinar el retiro en persona.
                  </p>
                </details>

                <details className="group border-b border-line/80 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
                    Cuidados
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-line transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pt-3 text-sm leading-relaxed text-muted">
                    Evitá el contacto con perfumes y productos químicos. Guardá tu
                    pieza en su bolsita cuando no la uses y limpiala con un paño
                    suave y seco.
                  </p>
                </details>

                <details className="group border-b border-line/80 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ink [&::-webkit-details-marker]:hidden">
                    Cambios y consultas
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-line transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pt-3 text-sm leading-relaxed text-muted">
                    Cada pieza es única y hecha a mano. Si algo no sale como
                    esperabas, escribinos dentro de los 7 días de recibido el pedido
                    y buscamos una solución juntas.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="border-t border-line/70 bg-cream-deep/50 py-18 sm:py-20">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl sm:text-4xl">También te puede gustar</h2>
              <Link
                href="/productos"
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:text-clay"
              >
                Ver todo
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
