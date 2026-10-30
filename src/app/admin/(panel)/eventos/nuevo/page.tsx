import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { createEventAction } from "@/lib/actions/events";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Nuevo evento" };

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda"
        title="Nuevo evento"
        description="La fecha decide sola si aparece en próximos eventos o en la galería de recuerdos."
        action={
          <Link
            href="/admin/eventos"
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-clay"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            Volver
          </Link>
        }
      />
      <EventForm action={createEventAction} demo={!isSupabaseConfigured} />
    </div>
  );
}
