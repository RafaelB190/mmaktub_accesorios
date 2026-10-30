import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { siteConfig } from "@/lib/config";
import "./globals.css";

const display = localFont({
  src: [
    {
      path: "../assets/fonts/cormorant-garamond-normal.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../assets/fonts/cormorant-garamond-italic.woff2",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: [
    {
      path: "../assets/fonts/jost.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-jost",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · Piedras naturales hechas a mano`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "accesorios",
    "collares",
    "pulseras",
    "piedras naturales",
    "hecho a mano",
    "aros",
    "anillos",
    "Maktub",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: siteConfig.name,
    title: `${siteConfig.name} · Piedras naturales hechas a mano`,
    description: siteConfig.description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/brand/og.jpg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f4ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Saltear al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
