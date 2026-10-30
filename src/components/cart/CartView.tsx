"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig } from "@/lib/config";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, hydrated, subtotal, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-3xl bg-sand/60" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-sand/60" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-line bg-cream-deep/40 px-6 py-20 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sand">
          <ShoppingBag className="h-6 w-6 text-clay" strokeWidth={1.5} />
        </span>
        <h2 className="mt-6 text-3xl">Tu carrito está vacío</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Todavía no elegiste ninguna pieza. Te esperamos en la colección para
          encontrar la que va con vos.
        </p>
        <Link href="/productos" className={buttonStyles("primary", "lg") + " mt-7"}>
          Ver la colección
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const remaining = siteConfig.shipping.freeFrom - subtotal;
  const progress = Math.min(100, (subtotal / siteConfig.shipping.freeFrom) * 100);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:gap-12">
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("¿Querés vaciar el carrito?")) clearCart();
            }}
            className="text-[10px] uppercase tracking-[0.14em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-clay"
          >
            Vaciar carrito
          </button>
        </div>

        <ul className="mt-4 divide-y divide-line/80 border-y border-line/80">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-5 sm:gap-5">
              <Link
                href={`/productos/${item.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-sand sm:h-32 sm:w-28"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center font-display text-xl text-muted/40">
                    maktub
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/productos/${item.slug}`}
                      className="font-display text-xl leading-tight text-ink transition-colors hover:text-clay"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">{formatPrice(item.price)} c/u</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Quitar ${item.name} del carrito`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-clay"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <div className="flex h-10 items-center rounded-full border border-line px-1.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Restar una unidad"
                      className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                    <span className="w-8 text-center text-xs tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Sumar una unidad"
                      className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30"
                    >
                      <Plus className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/productos"
          className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-clay"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" strokeWidth={1.5} />
          Seguir comprando
        </Link>
      </div>

      <aside className="h-fit rounded-[2rem] border border-line bg-cream-deep/60 p-6 lg:sticky lg:top-28 sm:p-7">
        <h2 className="font-display text-2xl">Resumen del pedido</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3 text-muted">
            <dt>Subtotal</dt>
            <dd className="text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-muted">
            <dt>Envío</dt>
            <dd className="text-right text-ink">
              {remaining <= 0 ? "Gratis" : "Se calcula al pagar"}
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-line pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Total</span>
            <span className="font-display text-3xl text-ink">{formatPrice(subtotal)}</span>
          </div>

          {remaining > 0 ? (
            <div className="mt-5">
              <p className="text-[11px] leading-relaxed text-muted">
                Te faltan <span className="text-clay">{formatPrice(remaining)}</span>{" "}
                para tener envío gratis.
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-clay transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-sage/10 px-3 py-2 text-[11px] text-sage-dark">
              ¡Tenés envío gratis en este pedido!
            </p>
          )}
        </div>

        <Link
          href="/checkout"
          className={buttonStyles("primary", "lg") + " mt-6 w-full"}
        >
          Finalizar compra
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
          Pago protegido con Mercado Pago. Revisamos la disponibilidad de cada
          pieza antes de confirmar.
        </p>
      </aside>
    </div>
  );
}
