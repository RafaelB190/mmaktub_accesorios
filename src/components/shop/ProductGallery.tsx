"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  saleLabel,
}: {
  images: string[];
  name: string;
  saleLabel: string | null;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2rem] rounded-t-[9rem] border border-line/70 bg-sand">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 48vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center font-display text-4xl text-muted/30">
            maktub
          </div>
        )}
        {saleLabel ? (
          <div className="absolute left-5 top-5">
            <Badge variant="sale">{saleLabel}</Badge>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-2.5">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1} de ${name}`}
              aria-current={active === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border bg-sand transition-all",
                active === index
                  ? "border-clay ring-1 ring-clay"
                  : "border-transparent opacity-75 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
