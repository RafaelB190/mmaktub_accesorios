import { cn } from "@/lib/utils";

const variants = {
  sale: "bg-clay text-cream",
  new: "bg-sage text-cream",
  soldout: "bg-ink text-cream",
  soft: "bg-cream/90 text-ink backdrop-blur",
} as const;

export function Badge({
  children,
  variant = "soft",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
