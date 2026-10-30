"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel = "Guardando…",
  disabled = false,
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(buttonStyles("primary", "md"), className)}
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
