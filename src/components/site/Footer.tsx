import { Instagram, Mail } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig, whatsappLink } from "@/lib/config";

const shopLinks = [
  { href: "/productos", label: "Todos los productos" },
  { href: "/productos?categoria=collares", label: "Collares" },
  { href: "/productos?categoria=pulseras", label: "Pulseras" },
  { href: "/productos?categoria=combitos", label: "Combitos" },
  { href: "/productos?categoria=aritos", label: "Aritos" },
  { href: "/productos?categoria=mimos", label: "Mimos al ❤️" },
];

const brandLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/carrito", label: "Mi carrito" },
  { href: siteConfig.instagram, label: "Instagram", external: true },
];

export function Footer() {
  const waLink = whatsappLink("¡Hola! Quisiera hacer una consulta sobre Maktub 💫");

  return (
    <footer className="mt-auto border-t border-line/80 bg-cream-deep">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_0.8fr_1.1fr]">
          <div>
            <Logo align="start" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              Accesorios de piedras naturales hechos a mano por Juli y Vero.
              Piezas únicas para acompañarte todos los días.
            </p>
            <p className="mt-5 font-display text-lg italic text-clay">
              Maktub: estaba escrito.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink">
              Tienda
            </h3>
            <ul className="mt-5 space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-clay"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink">
              Maktub
            </h3>
            <ul className="mt-5 space-y-3">
              {brandLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted transition-colors hover:text-clay"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-clay"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink">
              Hablemos
            </h3>
            <ul className="mt-5 space-y-3">
              {waLink ? (
                <li>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-clay"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    Escribinos por WhatsApp
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-clay"
                >
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-clay"
                >
                  <Instagram className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {siteConfig.instagramHandle}
                </a>
              </li>
            </ul>

            <div className="mt-7 rounded-2xl border border-line bg-cream p-4">
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted">
                Pagos seguros con
              </p>
              <p className="mt-1 font-display text-xl text-ink">Mercado Pago</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Envíos a todo el país · Retiro a coordinar
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-7 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maktub Accesorios. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-clay" />
            Hecho a mano en Argentina
          </p>
        </div>
      </Container>
    </footer>
  );
}
