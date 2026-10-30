"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "maktub-cart-v1";

export type AddableProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
};

type State = {
  items: CartItem[];
  hydrated: boolean;
};

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; product: AddableProduct; quantity: number }
  | { type: "update"; productId: string; quantity: number }
  | { type: "remove"; productId: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const existing = state.items.find((item) => item.productId === action.product.id);
      const max = Math.max(1, action.product.stock);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.product.id
              ? {
                  ...item,
                  quantity: Math.min(max, item.quantity + action.quantity),
                  stock: action.product.stock,
                  price: action.product.price,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: action.product.id,
            slug: action.product.slug,
            name: action.product.name,
            price: action.product.price,
            image: action.product.image,
            stock: action.product.stock,
            quantity: Math.min(max, action.quantity),
          },
        ],
      };
    }
    case "update":
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.productId
            ? {
                ...item,
                quantity: Math.min(Math.max(1, action.quantity), Math.max(1, item.stock)),
              }
            : item,
        ),
      };
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.productId),
      };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.productId === "string" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.stock === "number" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: AddableProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      dispatch({
        type: "hydrate",
        items: Array.isArray(parsed) ? parsed.filter(isCartItem) : [],
      });
    } catch {
      dispatch({ type: "hydrate", items: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, state.hydrated]);

  useEffect(() => {
    function syncCart(event: StorageEvent) {
      if (event.key !== STORAGE_KEY) return;
      try {
        const parsed: unknown = event.newValue ? JSON.parse(event.newValue) : [];
        if (Array.isArray(parsed)) {
          dispatch({ type: "hydrate", items: parsed.filter(isCartItem) });
        }
      } catch {
        // Ignore malformed storage.
      }
    }

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const addItem = useCallback((product: AddableProduct, quantity = 1) => {
    dispatch({ type: "add", product, quantity });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "update", productId, quantity });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "remove", productId });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return {
      items: state.items,
      hydrated: state.hydrated,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [state, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
