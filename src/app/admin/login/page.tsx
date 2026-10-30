import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { isAdmin, isAdminConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen bg-cream lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src="/brand/hero.jpg"
          alt="Accesorios Maktub"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Logo tone="light" align="start" />
          <div className="max-w-sm">
            <p className="font-display text-4xl leading-tight text-cream">
              Tu tienda, en tus manos.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">
              Cargá productos, cambiá precios, subí fotos y organizá los próximos
              eventos desde un solo lugar.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-10 lg:mt-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-clay">
              Panel Maktub
            </p>
            <h1 className="mt-3 text-4xl">Hola de nuevo</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Ingresá tu contraseña para administrar la tienda.
            </p>
          </div>
          <div className="mt-8">
            <LoginForm configured={isAdminConfigured} />
          </div>
        </div>
      </section>
    </main>
  );
}
