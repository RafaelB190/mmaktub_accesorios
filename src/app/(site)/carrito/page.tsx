import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Tu carrito",
  description: "Revisá las piezas que elegiste y finalizá tu compra en Maktub.",
};

export default function CartPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-9">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-clay">
            Tu selección
          </p>
          <h1 className="mt-3 text-5xl leading-none sm:text-6xl">Carrito</h1>
        </div>
        <CartView />
      </Container>
    </section>
  );
}
