"use client";

import { Instagram, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { formatPrice } from "@/lib/format";
import { siteConfig, whatsappLink } from "@/lib/config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/productos", label: "Productos" },
  { href: "/eventos", label: "Eventos" },
  { href: "/nosotros", label: "Nosotros" },
];

function CartLink({ onClick }: { onClick?: () => void }) {
  const { itemCount, hydrated } = useCart();

  return (
    <Link
      href="/carrito"
      onClick={onClick}
      aria-label={`Carrito${hydrated && itemCount > 0 ? `, ${itemCount} productos` : ""}`}
      className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-sand"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {hydrated && itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-clay px-1 text-[9px] font-medium text-cream">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const waLink = whatsappLink();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[9px] font-medium uppercase tracking-[0.22em] text-cream/85 sm:text-[10px]">
        Envío gratis desde {formatPrice(siteConfig.shipping.freeFrom)}
        <span className="mx-2 text-cream/35">·</span>
        <span className="hidden sm:inline">Piezas hechas a mano en Argentina</span>
        <span className="sm:hidden">Hecho a mano</span>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/92 backdrop-blur-md">
        <Container className="grid h-[74px] grid-cols-[1fr_auto_1fr] items-center sm:h-20">
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
            <Link
              href="/"
              className={cn(
                "text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-clay",
                pathname === "/" ? "text-clay" : "text-ink-soft",
              )}
            >
              Inicio
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-clay",
                  pathname.startsWith(link.href) ? "text-clay" : "text-ink-soft",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-ml-1 grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-sand lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <Link href="/" aria-label="Maktub Accesorios, ir al inicio">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-1">
            <Link
              href="/productos#coleccion"
              aria-label="Buscar productos"
              className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-sand sm:grid"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Escribinos por WhatsApp"
                className="hidden h-10 w-10 place-items-center rounded-full transition-colors hover:bg-sand sm:grid"
              >
                <WhatsAppIcon className="h-[19px] w-[19px]" />
              </a>
            ) : null}
            <CartLink />
          </div>
        </Container>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream lg:hidden">
          <div className="flex h-[74px] items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-sand"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col justify-center gap-2 px-8"
            aria-label="Navegación móvil"
          >
            {[{ href: "/", label: "Inicio" }, ...NAV_LINKS].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-baseline gap-4 py-2"
              >
                <span className="text-[10px] tracking-[0.2em] text-clay">
                  0{index + 1}
                </span>
                <span className="font-display text-4xl text-ink transition-colors group-hover:text-clay">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="space-y-5 border-t border-line px-8 py-7">
            <div className="flex items-center gap-5">
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
                Instagram
              </a>
              {waLink ? (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-ink-soft"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              ) : null}
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Piedras naturales, piezas únicas y hechas a mano.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
