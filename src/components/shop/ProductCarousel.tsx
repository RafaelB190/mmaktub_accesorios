"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: true });

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll({
      left: track.scrollLeft > 8,
      right: track.scrollLeft + track.clientWidth < track.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    update();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });

    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [update]);

  function scroll(direction: "left" | "right") {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector<HTMLElement>("[data-carousel-item]");
    const distance = item ? item.offsetWidth + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction === "right" ? distance : -distance, behavior: "smooth" });
  }

  return (
    <div>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            data-carousel-item
            className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc(25%-15px)]"
          >
            <ProductCard product={product} priority={index < 2} />
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScroll.left}
          aria-label="Ver productos anteriores"
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScroll.right}
          aria-label="Ver más productos"
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:opacity-30"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
