"use client";

import { Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig, whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const remainingForFreeShipping = siteConfig.shipping.freeFrom - product.price;
  const waLink = whatsappLink(
    `¡Hola! Quisiera consultar por "${product.name}". ¿Está disponible?`,
  );

  function handleAdd() {
    addItem(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? null,
        stock: product.stock,
      },
      quantity,
    );
    setAdded(true);
  }

  if (soldOut) {
    return (
      <div className="space-y-4">
        <button type="button" disabled className={cn(buttonStyles("primary", "lg"), "w-full")}>
          Sin stock
        </button>
        <p className="text-center text-xs text-muted">
          Esta pieza encontró su persona.{" "}
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-clay underline decoration-clay/30 underline-offset-4"
            >
              Consultanos por una similar
            </a>
          ) : null}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-[52px] items-center justify-between rounded-full border border-line px-2 sm:w-36">
          <button
            type="button"
            onClick={() => {
              setQuantity((value) => Math.max(1, value - 1));
              setAdded(false);
            }}
            disabled={quantity <= 1}
            aria-label="Restar una unidad"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <span className="text-sm tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => {
              setQuantity((value) => Math.min(product.stock, value + 1));
              setAdded(false);
            }}
            disabled={quantity >= product.stock}
            aria-label="Sumar una unidad"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sand disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            buttonStyles("primary", "lg"),
            "flex-1",
            added && "bg-sage hover:bg-sage-dark",
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2} />
              Agregado al carrito
            </>
          ) : (
            "Agregar al carrito"
          )}
        </button>
      </div>

      {added ? (
        <p className="text-center text-xs text-muted">
          <Link
            href="/carrito"
            className="text-clay underline decoration-clay/30 underline-offset-4"
          >
            Ver mi carrito
          </Link>{" "}
          o seguí mirando la colección.
        </p>
      ) : (
        <p className="text-center text-[11px] leading-relaxed text-muted">
          {remainingForFreeShipping > 0
            ? `Te faltan ${formatPrice(remainingForFreeShipping)} para el envío gratis.`
            : "Este pedido tiene envío gratis."}{" "}
          <span className="text-ink-soft">Pagás seguro con Mercado Pago.</span>
        </p>
      )}

      {product.stock <= 3 ? (
        <p className="text-center text-[10px] uppercase tracking-[0.16em] text-clay">
          Últimas {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
        </p>
      ) : null}

      {waLink ? (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-clay"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          ¿Tenés una duda? Escribinos
        </a>
      ) : null}
    </div>
  );
}
