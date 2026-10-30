import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";
import { getPublicEvents } from "@/lib/events";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, events] = await Promise.all([
    getProducts().catch(() => []),
    getPublicEvents().catch(() => ({ upcoming: [], past: [] })),
  ]);

  const pages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/eventos`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/nosotros`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/productos/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const eventPages: MetadataRoute.Sitemap = [...events.upcoming, ...events.past].map(
    (event) => ({
      url: `${siteConfig.url}/eventos#${event.id}`,
      lastModified: new Date(event.createdAt),
      changeFrequency: "monthly",
      priority: 0.4,
    }),
  );

  return [...pages, ...productPages, ...eventPages];
}
