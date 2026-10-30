import { cn } from "@/lib/utils";

export function Logo({
  tone = "dark",
  align = "center",
  className,
}: {
  tone?: "dark" | "light";
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex flex-col leading-none",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <span
        className={cn(
          "font-display text-[1.9rem] font-medium tracking-[0.18em]",
          tone === "light" ? "text-cream" : "text-ink",
        )}
      >
        maktub
      </span>
      <span
        className={cn(
          "mt-1 text-[0.5rem] uppercase tracking-[0.5em]",
          tone === "light" ? "text-cream/65" : "text-muted",
        )}
      >
        accesorios
      </span>
    </span>
  );
}
