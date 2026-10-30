"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button-styles";
import { siteConfig, whatsappLink } from "@/lib/config";

export function WhatsAppContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = `¡Hola! Soy ${name || "una persona curiosa"}. ${message || "Quisiera consultar por los accesorios de Maktub 💫"}`;
    const wa = whatsappLink(text);

    if (wa) {
      window.open(wa, "_blank", "noopener,noreferrer");
      return;
    }

    const subject = encodeURIComponent("Consulta desde la web de Maktub");
    const body = encodeURIComponent(text);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-line bg-cream p-6 sm:p-7"
    >
      <h3 className="font-display text-2xl">Contanos qué estás buscando</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Completá y te llevamos directo a WhatsApp con el mensaje listo.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Tu nombre
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            placeholder="¿Cómo te llamás?"
            className="h-12 w-full rounded-xl border border-line bg-cream px-4 text-sm text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-ink-soft">
            Tu mensaje
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Quisiera un collar de piedras verdes para regalar…"
            className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        className={buttonStyles("primary", "lg") + " mt-5 w-full"}
      >
        <Send className="h-4 w-4" strokeWidth={1.5} />
        Enviar por WhatsApp
      </button>
    </form>
  );
}
