import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Gem,
  Plus,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/admin/PageHeader";
import { EventCard } from "@/components/site/EventCard";
import { buttonStyles } from "@/components/ui/button-styles";
import { formatEventDate, formatOrderDate, formatPrice } from "@/lib/format";
import { getPublicEvents } from "@/lib/events";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/order-status";
import { listOrders } from "@/lib/orders";
import { getAllProducts, isOnSale } from "@/lib/products";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export default async function AdminDashboardPage() {
  const [products, events, orders] = await Promise.all([
    getAllProducts(),
    getPublicEvents(),
    isSupabaseConfigured
      ? listOrders(50).catch((error) => {
          console.error("No pudimos leer pedidos:", error);
          return [] as Order[];
        })
      : Promise.resolve([] as Order[]),
  ]);

  const activeProducts = products.filter((product) => product.active);
  const saleProducts = products.filter(isOnSale);
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const approvedRevenue = orders
    .filter((order) => order.status === "approved")
    .reduce((total, order) => total + order.total, 0);
  const nextEvent = events.upcoming[0];

  const stats = [
    {
      label: "Productos publicados",
      value: activeProducts.length,
      detail: `${saleProducts.length} en oferta`,
      icon: Gem,
      href: "/admin/productos",
    },
    {
      label: "Pedidos pendientes",
      value: pendingOrders.length,
      detail: `${orders.length} pedidos en total`,
      icon: Clock3,
      href: "/admin/pedidos",
    },
    {
      label: "Ventas aprobadas",
      value: formatPrice(approvedRevenue),
      detail: "Según pedidos confirmados",
      icon: TrendingUp,
      href: "/admin/pedidos",
    },
    {
      label: "Próximo evento",
      value: nextEvent ? "Agendado" : "Sin fecha",
      detail: nextEvent ? formatEventDate(nextEvent.startsAt) : "Cargá tu próxima feria",
      icon: CalendarDays,
      href: "/admin/eventos",
    },
  ];

  const actions = [
    {
      label: "Cargar un producto",
      description: "Fotos, precio, stock y características.",
      href: "/admin/productos/nuevo",
      icon: Plus,
    },
    {
      label: "Cargar un evento",
      description: "Tu próxima feria o pop-up.",
      href: "/admin/eventos/nuevo",
      icon: CalendarDays,
    },
    {
      label: "Revisar pedidos",
      description: "Estado de pagos y entregas.",
      href: "/admin/pedidos",
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Bienvenidas"
        title="Hola, Juli & Vero"
        description="Todo lo que necesitás para mantener la tienda al día, en un solo lugar."
        action={
          <Link href="/" target="_blank" className={buttonStyles("outline", "md")}>
            Ver la tienda
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-clay/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-clay" strokeWidth={1.5} />
              </div>
              <p className="mt-3 font-display text-3xl leading-none text-ink">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] text-muted">{stat.detail}</p>
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="text-2xl">Para tener a mano</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-clay/40"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-clay">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="flex items-center gap-2 text-sm font-medium text-ink">
                    {action.label}
                    <ArrowRight
                      className="h-3.5 w-3.5 text-clay opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                    {action.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-line bg-cream">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="text-xl">Últimos pedidos</h2>
            <Link
              href="/admin/pedidos"
              className="text-[10px] uppercase tracking-[0.14em] text-clay transition-colors hover:text-clay-dark"
            >
              Ver todos
            </Link>
          </div>

          {orders.length ? (
            <ul className="divide-y divide-line/80">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div>
                    <p className="text-sm text-ink">
                      #{order.id.slice(0, 8).toUpperCase()} · {order.customerName}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${ORDER_STATUS_STYLES[order.status]}`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <span className="text-sm text-ink">{formatPrice(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="mx-auto h-6 w-6 text-muted/50" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted">
                {isSupabaseConfigured
                  ? "Todavía no recibiste pedidos."
                  : "Los pedidos van a aparecer acá cuando conectes Supabase."}
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl">Próximo evento</h2>
            <Link
              href="/admin/eventos"
              className="text-[10px] uppercase tracking-[0.14em] text-clay"
            >
              Editar
            </Link>
          </div>
          {nextEvent ? (
            <EventCard event={nextEvent} />
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-cream px-5 py-10 text-center">
              <Sparkles className="mx-auto h-5 w-5 text-clay" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted">
                No hay eventos próximos. Cargá el primero.
              </p>
              <Link
                href="/admin/eventos/nuevo"
                className="mt-4 inline-flex text-[10px] uppercase tracking-[0.14em] text-clay"
              >
                Cargar evento
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
