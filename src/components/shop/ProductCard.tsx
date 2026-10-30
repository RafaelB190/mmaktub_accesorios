import Image from "next/image";
import Link from "next/link";

import { QuickAddButton } from "@/components/shop/QuickAddButton";
import { Badge } from "@/components/ui/Badge";
import { discountPercentage, isOnSale } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { CATEGORY_LABELS, type Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const image = product.images[0];
  const onSale = isOnSale(product);
  const soldOut = product.stock <= 0;

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand">
        <Link
          href={`/productos/${product.slug}`}
          className="absolute inset-0"
          aria-label={`Ver ${product.name}`}
        >
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <span className="grid h-full place-items-center font-display text-3xl text-muted/40">
              maktub
            </span>
          )}
          {soldOut ? (
            <span className="absolute inset-0 grid place-items-center bg-cream/55">
              <span className="rounded-full bg-ink px-4 py-2 text-[9px] font-medium uppercase tracking-[0.2em] text-cream">
                Sin stock
              </span>
            </span>
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-2">
          {onSale ? <Badge variant="sale">-{discountPercentage(product)}%</Badge> : null}
          {!onSale && product.featured ? <Badge variant="new">Novedad</Badge> : null}
        </div>

        {!soldOut ? (
          <div className="absolute bottom-3 right-3 translate-y-1 opacity-100 transition-all duration-200 focus-within:translate-y-0 focus-within:opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <QuickAddButton product={product} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-muted">
          {CATEGORY_LABELS[product.category]}
        </p>
        <Link href={`/productos/${product.slug}`} className="mt-1.5">
          <h3 className="text-xl leading-snug text-ink transition-colors group-hover:text-clay">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              onSale ? "text-clay" : "text-ink-soft",
            )}
          >
            {formatPrice(product.price)}
          </span>
          {onSale && product.compareAtPrice ? (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
