import "server-only";

import { randomUUID } from "node:crypto";

import { getSupabase } from "./supabase";
import {
  ORDER_STATUSES,
  type Order,
  type OrderItem,
  type OrderStatus,
  type ShippingMethod,
} from "./types";

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_method: ShippingMethod;
  address: string | null;
  city: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  payment_id: string | null;
  preference_id: string | null;
  stock_decremented: boolean;
};

export type NewOrder = {
  customerName: string;
  email: string;
  phone: string;
  shippingMethod: ShippingMethod;
  address: string | null;
  city: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

function toStatus(value: string): OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : "pending";
}

function mapOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    shippingMethod: row.shipping_method,
    address: row.address,
    city: row.city,
    notes: row.notes,
    items: row.items ?? [],
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    total: row.total,
    status: toStatus(row.status),
    paymentId: row.payment_id,
    preferenceId: row.preference_id,
    stockDecremented: row.stock_decremented,
  };
}

export async function createOrder(input: NewOrder): Promise<Order> {
  const id = randomUUID();
  const { data, error } = await getSupabase()
    .from("orders")
    .insert({
      id,
      customer_name: input.customerName,
      email: input.email,
      phone: input.phone,
      shipping_method: input.shippingMethod,
      address: input.address,
      city: input.city,
      notes: input.notes,
      items: input.items,
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      total: input.total,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw new Error(`No pudimos crear el pedido: ${error.message}`);
  return mapOrder(data as OrderRow);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`No pudimos leer el pedido: ${error.message}`);
  return data ? mapOrder(data as OrderRow) : null;
}

export async function listOrders(limit = 100): Promise<Order[]> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`No pudimos leer los pedidos: ${error.message}`);
  return (data as OrderRow[]).map(mapOrder);
}

export async function attachPreference(orderId: string, preferenceId: string) {
  const { error } = await getSupabase()
    .from("orders")
    .update({ preference_id: preferenceId })
    .eq("id", orderId);

  if (error) throw new Error(`No pudimos guardar la preferencia de pago: ${error.message}`);
}

/**
 * Updates the order status coming from Mercado Pago. Stock is discounted only
 * once per order thanks to the stock_decremented flag.
 */
export async function markOrderPayment(
  orderId: string,
  status: OrderStatus,
  paymentId: string,
): Promise<Order | null> {
  const supabase = getSupabase();

  const { data: existing, error: readError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (readError) throw new Error(`No pudimos leer el pedido: ${readError.message}`);
  if (!existing) return null;

  if (status === "approved" && !(existing as OrderRow).stock_decremented) {
    const { data: claimed, error: claimError } = await supabase
      .from("orders")
      .update({
        status,
        payment_id: paymentId,
        stock_decremented: true,
      })
      .eq("id", orderId)
      .eq("stock_decremented", false)
      .select("*")
      .maybeSingle();

    if (claimError) throw new Error(`No pudimos actualizar el pedido: ${claimError.message}`);

    if (claimed) {
      const items = (claimed as OrderRow).items ?? [];
      await Promise.all(
        items.map((item) =>
          supabase.rpc("decrement_stock", {
            p_product_id: item.productId,
            p_quantity: item.quantity,
          }),
        ),
      );
      return mapOrder(claimed as OrderRow);
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status, payment_id: paymentId })
    .eq("id", orderId)
    .select("*")
    .maybeSingle();

  if (error) throw new Error(`No pudimos actualizar el pedido: ${error.message}`);
  return data ? mapOrder(data as OrderRow) : null;
}
