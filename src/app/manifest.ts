import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maktub Accesorios",
    short_name: "Maktub",
    description: "Accesorios de piedras naturales hechos a mano.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f4ec",
    theme_color: "#f9f4ec",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
