import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[0.14em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-clay text-cream hover:bg-clay-dark",
  outline: "border border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink/5",
  light: "bg-cream text-ink hover:bg-white",
  ghost: "bg-transparent text-ink hover:bg-sand",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-6 py-3 text-[11px]",
  lg: "px-8 py-4 text-xs",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
}
