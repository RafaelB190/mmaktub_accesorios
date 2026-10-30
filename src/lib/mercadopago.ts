import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { absoluteUrl, siteConfig } from "./config";
import type { Order, OrderStatus } from "./types";

const MP_API = "https://api.mercadopago.com";

type PreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point: string;
};

type PaymentResponse = {
  id: number;
  status: string;
  external_reference: string | null;
};

function getAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("Mercado Pago no está configurado.");
  return token;
}

async function mercadoPagoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Mercado Pago error:", response.status, detail);
    throw new Error("Mercado Pago no pudo procesar la operación. Intentá nuevamente.");
  }

  return response.json() as Promise<T>;
}

export async function createPaymentPreference(order: Order) {
  const items = order.items.map((item) => ({
    id: item.productId,
    title: item.name,
    description: `Pedido ${order.id.slice(0, 8)}`,
    quantity: item.quantity,
    currency_id: "ARS",
    unit_price: item.price,
    picture_url: item.image
      ? item.image.startsWith("http")
        ? item.image
        : absoluteUrl(item.image)
      : undefined,
  }));

  if (order.shippingCost > 0) {
    items.push({
      id: "envio",
      title: "Envío a domicilio",
      description: "Envío de tu pedido Maktub",
      quantity: 1,
      currency_id: "ARS",
      unit_price: order.shippingCost,
      picture_url: undefined,
    });
  }

  const useSandbox = process.env.MERCADOPAGO_SANDBOX === "true";

  const preference = await mercadoPagoFetch<PreferenceResponse>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify({
      items,
      payer: {
        name: order.customerName,
        email: order.email,
      },
      back_urls: {
        success: absoluteUrl(`/checkout/resultado?order=${order.id}`),
        failure: absoluteUrl(`/checkout/resultado?order=${order.id}`),
        pending: absoluteUrl(`/checkout/resultado?order=${order.id}`),
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: absoluteUrl("/api/webhooks/mercadopago"),
      statement_descriptor: "MAKTUB",
      metadata: {
        order_id: order.id,
      },
    }),
  });

  return {
    id: preference.id,
    initPoint: useSandbox ? preference.sandbox_init_point : preference.init_point,
  };
}

export async function getPayment(paymentId: string) {
  return mercadoPagoFetch<PaymentResponse>(`/v1/payments/${paymentId}`);
}

export function mapPaymentStatus(status: string): OrderStatus {
  switch (status) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending";
  }
}

/**
 * Validates the x-signature header sent by Mercado Pago webhooks.
 * Docs: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
 */
export function isValidWebhookSignature(input: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
}) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim();
  if (!secret) return true;
  if (!input.signature || !input.dataId) return false;

  const parts = Object.fromEntries(
    input.signature.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key?.trim(), value?.trim()];
    }),
  );

  const timestamp = parts.ts;
  const receivedHash = parts.v1;
  if (!timestamp || !receivedHash) return false;

  const manifest = `id:${input.dataId};request-id:${input.requestId ?? ""};ts:${timestamp};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(receivedHash));
  } catch {
    return false;
  }
}
