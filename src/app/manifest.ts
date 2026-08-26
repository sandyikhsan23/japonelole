import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Japonelole",
    short_name: "Japonelole",
    description: "Belajar kosakata bahasa Jepang lewat ruangan interaktif.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1b2340",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "1387x1387",
        type: "image/jpeg",
      },
      {
        src: "/apple-icon.jpg",
        sizes: "1387x1387",
        type: "image/jpeg",
      },
    ],
  };
}
