export function Marquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line/70 bg-sand/45 py-4">
      <div className="marquee-track flex w-max items-center">
        {repeated.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 px-8 text-[10px] font-medium uppercase tracking-[0.28em] text-ink-soft"
            aria-hidden={index >= items.length}
          >
            {item}
            <span className="text-clay/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
