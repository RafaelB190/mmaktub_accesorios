const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "America/Argentina/Buenos_Aires",
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Argentina/Buenos_Aires",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatEventDate(value: string) {
  const date = new Date(value);
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)} hs`;
}

export function formatEventDay(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatEventTime(value: string) {
  return `${timeFormatter.format(new Date(value))} hs`;
}

export function formatShortDate(value: string) {
  return shortDateFormatter.format(new Date(value)).replace(".", "");
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

/** Converts an ISO date into the value expected by <input type="datetime-local">. */
export function toArgentinaInputValue(value: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).formatToParts(new Date(value));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "00";

  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

/** Argentina has no daylight saving time, so a fixed offset is safe. */
export function argentinaInputToIso(value: string) {
  return new Date(`${value}:00-03:00`).toISOString();
}
