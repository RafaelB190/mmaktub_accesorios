"use server";

import { z } from "zod";

import { siteConfig } from "@/lib/config";
import { createPaymentPreference } from "@/lib/mercadopago";
import { attachPreference, createOrder } from "@/lib/orders";
import { getProducts } from "@/lib/products";
import { isStoreConfigured } from "@/lib/supabase";
import type { OrderItem } from "@/lib/types";
import type { CheckoutState } from "./types";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Ingresá tu nombre completo.").max(80),
  email: z.string().trim().email("Ingresá un email válido."),
  phone: z
    .string()
    .trim()
    .min(6, "Ingresá un teléfono de contacto.")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "El teléfono solo puede tener números, espacios y guiones."),
  shippingMethod: z.enum(["envio", "retiro"]),
  address: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(500).optional(),
});

const cartSchema = z
  .array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(20),
    }),
  )
  .min(1, "Tu carrito está vacío.");

function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;
  return Object.fromEntries(
    Object.entries(flattened)
      .filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length))
      .map(([key, messages]) => [key, messages]),
  );
}

export async function checkoutAction(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (!isStoreConfigured) {
    return {
      error:
        "Los pagos todavía no están habilitados. Escribinos por WhatsApp y coordinamos tu compra.",
    };
  }

  let rawCart: unknown;
  try {
    rawCart = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "No pudimos leer el carrito. Recargá la página e intentá de nuevo." };
  }

  const cartResult = cartSchema.safeParse(rawCart);
  if (!cartResult.success) {
    return { error: cartResult.error.issues[0]?.message ?? "Tu carrito está vacío." };
  }

  const customerResult = checkoutSchema.safeParse({
    customerName: String(formData.get("customerName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    shippingMethod: formData.get("shippingMethod"),
    address: String(formData.get("address") ?? "").trim() || undefined,
    city: String(formData.get("city") ?? "").trim() || undefined,
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  });

  if (!customerResult.success) {
    return { fieldErrors: fieldErrorsFrom(customerResult.error) };
  }

  const customer = customerResult.data;
  if (customer.shippingMethod === "envio") {
    const fieldErrors: Record<string, string[]> = {};
    if (!customer.address) fieldErrors.address = ["Ingresá tu dirección."];
    if (!customer.city) fieldErrors.city = ["Ingresá tu ciudad."];
    if (Object.keys(fieldErrors).length) return { fieldErrors };
  }

  const products = await getProducts();
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items: OrderItem[] = [];

  for (const line of cartResult.data) {
    const product = productsById.get(line.productId);
    if (!product) {
      return {
        error: "Uno de los productos ya no está disponible. Revisá tu carrito.",
      };
    }
    if (line.quantity > product.stock) {
      return {
        error: `No hay stock suficiente de "${product.name}". Quedan ${product.stock} unidades.`,
      };
    }

    items.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: line.quantity,
      image: product.images[0] ?? null,
    });
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost =
    customer.shippingMethod === "retiro"
      ? 0
      : subtotal >= siteConfig.shipping.freeFrom
        ? 0
        : siteConfig.shipping.cost;
  const total = subtotal + shippingCost;

  try {
    const order = await createOrder({
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      shippingMethod: customer.shippingMethod,
      address: customer.shippingMethod === "envio" ? (customer.address ?? null) : null,
      city: customer.shippingMethod === "envio" ? (customer.city ?? null) : null,
      notes: customer.notes ?? null,
      items,
      subtotal,
      shippingCost,
      total,
    });

    const preference = await createPaymentPreference(order);
    await attachPreference(order.id, preference.id);

    return { url: preference.initPoint };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "No pudimos iniciar el pago. Intentá nuevamente en unos minutos.",
    };
  }
}
