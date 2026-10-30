import type { Metadata } from "next";

import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { isStoreConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Completá tus datos y pagá de forma segura con Mercado Pago.",
};

export default function CheckoutPage() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mb-9 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-clay">
            Último paso
          </p>
          <h1 className="mt-3 text-5xl leading-none sm:text-6xl">Finalizar compra</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Completá tus datos y pagá con Mercado Pago. Después del pago te
            escribimos para coordinar el envío o el retiro.
          </p>
        </div>
        <CheckoutForm demo={!isStoreConfigured} />
      </Container>
    </section>
  );
}
