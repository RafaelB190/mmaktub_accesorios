"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteForm({
  id,
  action,
  confirmText,
  label = "Eliminar",
}: {
  id: string;
  action: (formData: FormData) => void | Promise<void>;
  confirmText: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton label={label} />
    </form>
  );
}

function DeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
      {pending ? "Eliminando…" : label}
    </button>
  );
}
