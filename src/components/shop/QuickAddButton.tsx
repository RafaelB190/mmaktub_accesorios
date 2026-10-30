"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [added]);

  if (soldOut) return null;

  return (
    <button
      type="button"
      onClick={() => {
        addItem(
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0] ?? null,
            stock: product.stock,
          },
          1,
        );
        setAdded(true);
      }}
      aria-label={added ? "Agregado al carrito" : `Agregar ${product.name} al carrito`}
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full shadow-sm transition-all duration-200",
        added
          ? "bg-sage text-cream"
          : "bg-cream/95 text-ink hover:bg-ink hover:text-cream",
      )}
    >
      {added ? (
        <Check className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Plus className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
}
