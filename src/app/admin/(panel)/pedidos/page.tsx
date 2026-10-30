import { ChevronDown, Database, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/admin/PageHeader";
import { formatOrderDate, formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/order-status";
import { listOrders } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminOrdersPage() {
  let orders: Order[] = [];

  if (isSupabaseConfigured) {
    try {
      orders = await listOrders(100);
    } catch (error) {
      console.error("No pudimos leer los pedidos:", error);
    }
  }

  const pending = orders.filter((order) => order.status === "pending").length;
  const approved = orders.filter((order) => order.status === "approved");
  const revenue = approved.reduce((total, order) => total + order.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ventas"
        title="Pedidos"
        description="Cada compra confirmada por Mercado Pago aparece acá con todos los datos para preparar el envío."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-cream p-5">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">Pendientes</p>
          <p className="mt-2 font-display text-3xl">{pending}</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">
            Aprobados
          </p>
          <p className="mt-2 font-display text-3xl">{approved.length}</p>
        </div>
        <div className="rounded-2xl border border-line bg-cream p-5">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">
            Total vendido
          </p>
          <p className="mt-2 font-display text-2xl">{formatPrice(revenue)}</p>
        </div>
      </div>

      {orders.length ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <details
              key={order.id}
              className="group overflow-hidden rounded-2xl border border-line bg-cream"
            >
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-display text-lg">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${ORDER_STATUS_STYLES[order.status]}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="hidden sm:inline">{order.customerName}</span>
                  <span>{formatOrderDate(order.createdAt)}</span>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                    strokeWidth={1.5}
                  />
                </div>
              </summary>

              <div className="grid gap-5 border-t border-line px-4 py-5 text-xs sm:grid-cols-2">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                    Cliente
                  </p>
                  <p className="mt-2 text-sm text-ink">{order.customerName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-muted">
                    <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <a href={`mailto:${order.email}`} className="hover:text-clay">
                      {order.email}
                    </a>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-muted">
                    <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {order.phone}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                    Entrega
                  </p>
                  <p className="mt-2 flex items-start gap-1.5 text-ink">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                    {order.shippingMethod === "envio"
                      ? `${order.address ?? "Domicilio"}${order.city ? `, ${order.city}` : ""}`
                      : "Retiro a coordinar"}
                  </p>
                  {order.notes ? (
                    <p className="mt-2 text-muted">
                      <span className="text-[9px] uppercase tracking-[0.14em]">
                        Nota:
                      </span>{" "}
                      {order.notes}
                    </p>
                  ) : null}
                </div>

                <div className="sm:col-span-2">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                    Productos
                  </p>
                  <ul className="mt-2 divide-y divide-line/70 rounded-xl border border-line">
                    {order.items.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                      >
                        <span>
                          {item.name}{" "}
                          <span className="text-muted">× {item.quantity}</span>
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap justify-end gap-4 text-muted">
                    <span>
                      Subtotal{" "}
                      <span className="text-ink">{formatPrice(order.subtotal)}</span>
                    </span>
                    <span>
                      Envío{" "}
                      <span className="text-ink">
                        {order.shippingCost === 0
                          ? "Gratis"
                          : formatPrice(order.shippingCost)}
                      </span>
                    </span>
                    <span>
                      Total{" "}
                      <span className="font-medium text-ink">
                        {formatPrice(order.total)}
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                    Pago
                  </p>
                  <p className="mt-2 text-muted">
                    Mercado Pago ·{" "}
                    <span className="text-ink">{ORDER_STATUS_LABELS[order.status]}</span>
                  </p>
                  {order.paymentId ? (
                    <p className="mt-1 font-mono text-[10px] text-muted">
                      ID: {order.paymentId}
                    </p>
                  ) : null}
                </div>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-cream px-6 py-16 text-center">
          <ShoppingBag className="mx-auto h-7 w-7 text-muted/50" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl">Todavía no hay pedidos</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            {isSupabaseConfigured
              ? "Cuando alguien compre, el pedido aparece acá automáticamente."
              : "Conectá Supabase para empezar a guardar los pedidos de la tienda."}
          </p>
          {!isSupabaseConfigured ? (
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] text-amber-900">
              <Database className="h-3.5 w-3.5" strokeWidth={1.5} />
              Modo demostración
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
