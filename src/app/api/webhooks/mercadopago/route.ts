import { NextResponse } from "next/server";

import {
  getPayment,
  isValidWebhookSignature,
  mapPaymentStatus,
} from "@/lib/mercadopago";
import { markOrderPayment } from "@/lib/orders";
import { isStoreConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStoreConfigured) {
    return NextResponse.json({ ok: true, ignored: "not-configured" });
  }

  let body: {
    type?: string;
    action?: string;
    data?: { id?: string | number };
  } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true, ignored: "empty-body" });
  }

  const url = new URL(request.url);
  const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
  const dataId =
    body.data?.id?.toString() ??
    url.searchParams.get("data.id") ??
    url.searchParams.get("id");

  if (type !== "payment" || !dataId) {
    return NextResponse.json({ ok: true, ignored: "not-a-payment" });
  }

  const valid = isValidWebhookSignature({
    signature: request.headers.get("x-signature"),
    requestId: request.headers.get("x-request-id"),
    dataId,
  });

  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid-signature" }, { status: 401 });
  }

  try {
    const payment = await getPayment(dataId);
    if (payment.external_reference) {
      await markOrderPayment(
        payment.external_reference,
        mapPaymentStatus(payment.status),
        String(payment.id),
      );
    }
  } catch (error) {
    console.error("Mercado Pago webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
