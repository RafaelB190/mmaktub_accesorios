export const PRODUCT_CATEGORIES = [
  { value: "collares", label: "Collares", description: "Piedras que acompañan el corazón." },
  { value: "pulseras", label: "Pulseras", description: "Detalles para llevar siempre." },
  { value: "combitos", label: "Combitos", description: "Piezas pensadas para combinar." },
  { value: "aritos", label: "Aritos", description: "Luz y color cerca del rostro." },
  { value: "mimos", label: "Mimos al ❤️", description: "Pequeños regalos con intención." },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["value"];

export const PRODUCT_CATEGORY_VALUES = PRODUCT_CATEGORIES.map(
  (category) => category.value,
) as [ProductCategory, ...ProductCategory[]];

export const CATEGORY_LABELS = Object.fromEntries(
  PRODUCT_CATEGORIES.map((category) => [category.value, category.label]),
) as Record<ProductCategory, string>;

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.some((category) => category.value === value);
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: ProductCategory;
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  materials: string | null;
  createdAt: string;
}

export interface StoreEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  location: string;
  address: string | null;
  mapsUrl: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string | null;
}

export const ORDER_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const SHIPPING_METHODS = ["envio", "retiro"] as const;
export type ShippingMethod = (typeof SHIPPING_METHODS)[number];

export interface Order {
  id: string;
  createdAt: string;
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
  status: OrderStatus;
  paymentId: string | null;
  preferenceId: string | null;
  stockDecremented: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
}

export type ProductFilters = {
  category?: ProductCategory;
  search?: string;
  featured?: boolean;
  onSale?: boolean;
  sort?: "recent" | "price-asc" | "price-desc";
  limit?: number;
};
