"use client";

import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button-styles";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, {});
  const [visible, setVisible] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {!configured ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Falta definir <code className="font-mono">ADMIN_PASSWORD</code> en el archivo
          de variables de entorno. Sin esa clave no se puede entrar al panel.
        </p>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
        >
          {state.error}
        </p>
      ) : null}

      <label className="block">
        <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Contraseña
        </span>
        <span className="relative block">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <input
            type={visible ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            autoFocus
            placeholder="Tu contraseña secreta"
            className="h-12 w-full rounded-xl border border-line bg-cream pl-11 pr-12 text-sm text-ink placeholder:text-muted/60 focus:border-clay focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-sand"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending || !configured}
        className={buttonStyles("primary", "lg") + " w-full"}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            Entrando…
          </>
        ) : (
          "Entrar al panel"
        )}
      </button>

      <Link
        href="/"
        className="block text-center text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-clay"
      >
        Volver a la tienda
      </Link>
    </form>
  );
}
