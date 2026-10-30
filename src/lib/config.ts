export const siteConfig = {
  name: "Maktub Accesorios",
  shortName: "Maktub",
  description:
    "Accesorios de piedras naturales hechos a mano. Collares, pulseras, combitos y aros únicos, creados por Juli y Vero.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
  instagram: "https://www.instagram.com/mmaktub_accesorios/",
  instagramHandle: "@mmaktub_accesorios",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hola@mmaktubaccesorios.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  shipping: {
    cost: 6_500,
    freeFrom: 80_000,
    pickupLabel: "Retiro a coordinar",
  },
  payments: {
    provider: "Mercado Pago",
  },
} as const;

export function whatsappLink(message?: string) {
  const phone = siteConfig.whatsapp.replace(/\D/g, "");
  if (!phone) return null;

  const text = message ?? "¡Hola! Quisiera consultar por los accesorios de Maktub 💫";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
