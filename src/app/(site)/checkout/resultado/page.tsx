import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  Package,
  XCircle,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig, whatsappLink } from "@/lib/config";
import { formatOrderDate, formatPrice } from "@/lib/format";
import { mapPaymentStatus, getPayment } from "@/lib/mercadopago";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/order-status";
import { getOrderById, markOrderPayment } from "@/lib/orders";
import { isStoreConfigured, isSupabaseConfigured } from "@/lib/supabase";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Resultado de tu compra",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const RESULT_COPY: Record<
  OrderStatus,
  { title: string; description: string; tone: string }
> = {
  approved: {
    title: "¡Gracias por tu compra!",
    description:
      "Tu pago fue aprobado. En breve nos ponemos en contacto para coordinar la entrega de tu pieza.",
    tone: "bg-sage/15 text-sage-dark",
  },
  pending: {
    title: "Estamos confirmando tu pago",
    description:
      "Mercado Pago todavía está procesando la operación. Si ya pagaste, actualizá esta página en unos minutos.",
    tone: "bg-gold/15 text-[#7a5d27]",
  },
  rejected: {
    title: "El pago no se pudo completar",
    description:
      "No se realizó ningún cobro. Podés intentar nuevamente con otro medio de pago o escribirnos.",
    tone: "bg-red-100 text-red-800",
  },
  cancelled: {
    title: "El pago fue cancelado",
    description:
      "No se realizó ningún cobro. Tu carrito sigue guardado por si querés volver a intentarlo.",
    tone: "bg-ink/10 text-ink-soft",
  },
  refunded: {
    title: "Pago reintegrado",
    description:
      "La operación fue reintegrada. Si tenés dudas, escribinos y lo revisamos juntas.",
    tone: "bg-clay/10 text-clay-dark",
  },
};

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderId = firstValue(params.order);
  const paymentId = firstValue(params.payment_id);

  if (!isSupabaseConfigured || !orderId) {
    return (
      <ResultShell>
        <div className="rounded-[2rem] border border-line bg-cream-deep/50 px-6 py-16 text-center">
          <Clock3 className="mx-auto h-9 w-9 text-clay" strokeWidth={1.2} />
          <h1 className="mt-5 text-4xl">No encontramos este pedido</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            El link puede haber expirado o la tienda todavía no tiene los pagos
            configurados. Escribinos y te ayudamos a revisarlo.
          </p>
          <ResultActions status="pending" />
        </div>
      </ResultShell>
    );
  }

  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error("No pudimos leer el pedido:", error);
    order = null;
  }

  if (!order) {
    return (
      <ResultShell>
        <div className="rounded-[2rem] border border-line bg-cream-deep/50 px-6 py-16 text-center">
          <XCircle className="mx-auto h-9 w-9 text-muted" strokeWidth={1.2} />
          <h1 className="mt-5 text-4xl">Pedido no encontrado</h1>
          <p className="mt-3 text-sm text-muted">
            Revisá el link o escribinos con tu número de pedido.
          </p>
          <ResultActions status="rejected" />
        </div>
      </ResultShell>
    );
  }

  if (paymentId && order.status !== "approved" && isStoreConfigured) {
    try {
      const payment = await getPayment(paymentId);
      if (payment.external_reference === order.id) {
        const updated = await markOrderPayment(
          order.id,
          mapPaymentStatus(payment.status),
          String(payment.id),
        );
        if (updated) order = updated;
      }
    } catch (error) {
      console.error("No pudimos verificar el pago:", error);
    }
  }

  const copy = RESULT_COPY[order.status];
  const StatusIcon =
    order.status === "approved"
      ? CheckCircle2
      : order.status === "pending"
        ? Clock3
        : XCircle;

  return (
    <ResultShell>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${copy.tone}`}
          >
            <StatusIcon className="h-7 w-7" strokeWidth={1.4} />
          </span>
          <h1 className="mt-6 text-balance text-4xl sm:text-5xl">{copy.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-line bg-cream">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream-deep/50 px-6 py-5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted">
                Número de pedido
              </p>
              <p className="mt-1 font-display text-xl">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[9px] font-medium uppercase tracking-[0.16em] ${ORDER_STATUS_STYLES[order.status]}`}
              >
                {ORDER_STATUS_LABELS[order.status]}
              </span>
              <p className="mt-2 text-[10px] text-muted">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <ul className="divide-y divide-line/70">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm text-ink-soft">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between gap-3 text-muted">
                <dt>Subtotal</dt>
                <dd className="text-ink">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-muted">
                <dt>Envío</dt>
                <dd className="text-ink">
                  {order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-2">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted">Total</dt>
                <dd className="font-display text-2xl text-ink">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-4 border-t border-line bg-cream-deep/40 px-6 py-5 text-xs text-muted sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-clay" strokeWidth={1.5} />
              <span>
                {order.shippingMethod === "envio"
                  ? `Envío a ${order.address ?? "domicilio"}${order.city ? `, ${order.city}` : ""}`
                  : siteConfig.shipping.pickupLabel}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-clay" strokeWidth={1.5} />
              <span>Te escribimos a {order.email}</span>
            </div>
          </div>
        </div>

        <ResultActions status={order.status} />
      </div>
    </ResultShell>
  );
}

function ResultShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>{children}</Container>
    </section>
  );
}

function ResultActions({ status }: { status: OrderStatus }) {
  const waLink = whatsappLink("¡Hola! Quiero consultar por mi compra en Maktub 💫");

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      {status === "rejected" || status === "cancelled" ? (
        <Link href="/carrito" className={buttonStyles("primary", "lg")}>
          Volver al carrito
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      ) : (
        <Link href="/productos" className={buttonStyles("primary", "lg")}>
          Seguir explorando
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      )}

      {waLink ? (
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles("outline", "lg")}
        >
          <WhatsAppIcon className="h-4 w-4" />
          Escribinos
        </a>
      ) : null}
    </div>
  );
}
