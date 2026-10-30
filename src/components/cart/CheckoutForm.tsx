"use client";

import { ArrowRight, Loader2, Lock, MapPin, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonStyles } from "@/components/ui/button-styles";
import { checkoutAction } from "@/lib/actions/checkout";
import { siteConfig, whatsappLink } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  error,
  className,
}: FieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <label className={cn("block", className)} htmlFor={id}>
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
        {label}
        {required ? <span className="ml-1 text-clay">*</span> : null}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-12 w-full rounded-xl border bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:outline-none",
          error ? "border-red-400" : "border-line focus:border-clay",
        )}
      />
      {error ? (
        <span id={errorId} className="mt-1 block text-[11px] text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function CheckoutForm({ demo = false }: { demo?: boolean }) {
  const { items, hydrated, subtotal, itemCount } = useCart();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(checkoutAction, {});
  const [shippingMethod, setShippingMethod] = useState<"envio" | "retiro">("envio");

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/carrito");
  }, [hydrated, items.length, router]);

  useEffect(() => {
    if (state.url) window.location.assign(state.url);
  }, [state.url]);

  if (!hydrated || items.length === 0) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[420px] animate-pulse rounded-3xl bg-sand/60" />
        <div className="h-[320px] animate-pulse rounded-3xl bg-sand/60" />
      </div>
    );
  }

  const shippingCost =
    shippingMethod === "retiro"
      ? 0
      : subtotal >= siteConfig.shipping.freeFrom
        ? 0
        : siteConfig.shipping.cost;
  const total = subtotal + shippingCost;
  const waLink = whatsappLink("¡Hola! Necesito ayuda para finalizar mi compra 💫");
  const disabled = pending || demo;

  return (
    <form
      action={formAction}
      className="grid items-start gap-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12"
    >
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        )}
      />

      <div className="space-y-8">
        {demo ? (
          <div className="rounded-2xl border border-clay/25 bg-clay/5 px-5 py-4 text-sm leading-relaxed text-ink-soft">
            <strong className="font-medium text-clay">Modo demostración.</strong> Los
            pagos todavía no están habilitados. Podés recorrer el formulario, pero
            para completar una compra escribinos por WhatsApp.
          </div>
        ) : null}

        {state.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800"
          >
            {state.error}
          </div>
        ) : null}

        <section>
          <div className="flex items-baseline gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] text-cream">
              1
            </span>
            <h2 className="font-display text-2xl">Tus datos</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre y apellido"
              name="customerName"
              autoComplete="name"
              placeholder="Juli Pérez"
              required
              error={state.fieldErrors?.customerName?.[0]}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="juli@email.com"
              required
              error={state.fieldErrors?.email?.[0]}
            />
            <Field
              label="Teléfono / WhatsApp"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="11 2345 6789"
              required
              className="sm:col-span-2"
              error={state.fieldErrors?.phone?.[0]}
            />
          </div>
        </section>

        <section>
          <div className="flex items-baseline gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] text-cream">
              2
            </span>
            <h2 className="font-display text-2xl">Entrega</h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label
              className={cn(
                "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
                shippingMethod === "envio"
                  ? "border-clay bg-clay/5"
                  : "border-line hover:border-ink/30",
              )}
            >
              <input
                type="radio"
                name="shippingMethod"
                value="envio"
                checked={shippingMethod === "envio"}
                onChange={() => setShippingMethod("envio")}
                className="mt-1 accent-[#96573a]"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Truck className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  Envío a domicilio
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                  {subtotal >= siteConfig.shipping.freeFrom
                    ? "Gratis en este pedido"
                    : `${formatPrice(siteConfig.shipping.cost)} · Gratis desde ${formatPrice(siteConfig.shipping.freeFrom)}`}
                </span>
              </span>
            </label>

            <label
              className={cn(
                "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
                shippingMethod === "retiro"
                  ? "border-clay bg-clay/5"
                  : "border-line hover:border-ink/30",
              )}
            >
              <input
                type="radio"
                name="shippingMethod"
                value="retiro"
                checked={shippingMethod === "retiro"}
                onChange={() => setShippingMethod("retiro")}
                className="mt-1 accent-[#96573a]"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Package className="h-4 w-4 text-clay" strokeWidth={1.5} />
                  Retiro a coordinar
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                  Sin costo. Coordinamos por WhatsApp.
                </span>
              </span>
            </label>
          </div>

          {shippingMethod === "envio" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <Field
                label="Dirección"
                name="address"
                autoComplete="street-address"
                placeholder="Calle, número, piso, depto"
                required
                error={state.fieldErrors?.address?.[0]}
              />
              <Field
                label="Ciudad"
                name="city"
                autoComplete="address-level2"
                placeholder="CABA"
                required
                error={state.fieldErrors?.city?.[0]}
              />
            </div>
          ) : (
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream-deep/70 px-4 py-3 text-xs leading-relaxed text-muted">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-clay" strokeWidth={1.5} />
              Después del pago te escribimos por WhatsApp para coordinar el punto y
              horario de retiro.
            </p>
          )}
        </section>

        <section>
          <div className="flex items-baseline gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] text-cream">
              3
            </span>
            <h2 className="font-display text-2xl">Un detalle más</h2>
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              Nota para nosotras{" "}
              <span className="normal-case tracking-normal text-muted">(opcional)</span>
            </span>
            <textarea
              name="notes"
              rows={3}
              maxLength={500}
              placeholder="¿Es un regalo? ¿Querés que te avisemos algo en particular?"
              className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
            />
          </label>
        </section>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={disabled}
            className={cn(buttonStyles("primary", "lg"), "w-full")}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                Preparando el pago…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" strokeWidth={1.5} />
                Pagar {formatPrice(total)} con Mercado Pago
              </>
            )}
          </button>
          <p className="text-center text-[10px] leading-relaxed text-muted">
            Te vamos a redirigir a Mercado Pago para completar el pago de forma
            segura. No guardamos los datos de tu tarjeta.
          </p>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-line bg-cream-deep/60 p-6 lg:sticky lg:top-28 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl">Tu pedido</h2>
          <Link
            href="/carrito"
            className="text-[10px] uppercase tracking-[0.14em] text-clay underline decoration-clay/30 underline-offset-4"
          >
            Editar
          </Link>
        </div>

        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[9px] text-cream">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-tight text-ink">{item.name}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="text-xs text-ink-soft">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
          <div className="flex justify-between gap-3 text-muted">
            <dt>Subtotal ({itemCount})</dt>
            <dd className="text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3 text-muted">
            <dt>Envío</dt>
            <dd className="text-ink">
              {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-line pt-5">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">Total</span>
          <span className="font-display text-3xl text-ink">{formatPrice(total)}</span>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5">
          <Lock className="h-3.5 w-3.5 text-sage-dark" strokeWidth={1.5} />
          <p className="text-[10px] text-muted">Pago encriptado y protegido</p>
        </div>

        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            ¿Dudas? Escribinos
          </a>
        ) : null}

        <Link
          href="/productos"
          className="mt-4 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-ink-soft"
        >
          Seguir comprando
          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </aside>
    </form>
  );
}
