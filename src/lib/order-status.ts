import type { OrderStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
  refunded: "Reintegrado",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-[#7a5d27]",
  approved: "bg-sage/15 text-sage-dark",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-ink/10 text-ink-soft",
  refunded: "bg-clay/10 text-clay-dark",
};
