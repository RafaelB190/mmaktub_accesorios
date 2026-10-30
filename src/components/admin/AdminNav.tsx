"use client";

import { CalendarDays, LayoutDashboard, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Sparkles },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export function AdminNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-1",
        orientation === "vertical"
          ? "flex-col"
          : "no-scrollbar overflow-x-auto pb-1",
      )}
      aria-label="Panel de administración"
    >
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors",
              orientation === "horizontal" && "rounded-full px-4 py-2",
              active
                ? "bg-cream/12 text-cream"
                : "text-cream/60 hover:bg-cream/5 hover:text-cream",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
