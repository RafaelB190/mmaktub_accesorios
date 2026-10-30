import { ArrowUpRight, Database, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminNav } from "@/components/admin/AdminNav";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Maktub" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-cream-deep/35">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink px-5 py-7 lg:flex">
        <Link href="/admin" aria-label="Panel de Maktub">
          <Logo tone="light" align="start" />
        </Link>

        <div className="mt-10 flex-1">
          <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.24em] text-cream/35">
            Administración
          </p>
          <AdminNav />
        </div>

        <div className="space-y-2 border-t border-cream/10 pt-5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            Ver la tienda
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs text-cream/60 transition-colors hover:bg-cream/5 hover:text-cream"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-30 bg-ink text-cream lg:hidden">
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" aria-label="Panel de Maktub">
            <Logo tone="light" align="start" />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Cerrar sesión"
              className="grid h-9 w-9 place-items-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        </div>
        <div className="px-4 pb-3">
          <AdminNav orientation="horizontal" />
        </div>
      </header>

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
          {!isSupabaseConfigured ? (
            <div className="mb-6 flex gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-3.5 text-xs leading-relaxed text-amber-950">
              <Database className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
              <p>
                <strong className="font-medium">Estás en modo demostración.</strong>{" "}
                Se ve el catálogo de ejemplo, pero los cambios no se guardan. Completá{" "}
                <code className="font-mono text-[11px]">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
                <code className="font-mono text-[11px]">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
                para activar el panel de verdad.
              </p>
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
