import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-clay">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-4xl leading-none">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
