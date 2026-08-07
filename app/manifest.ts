import type { MetadataRoute } from "next";
import { COMMITTEE_NAME } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMMITTEE_NAME,
    short_name: "GU26",
    description: "Door-to-door donation collection for Ganesh Utsav 2026",
    start_url: "/collect",
    display: "standalone",
    background_color: "#fff8ee",
    theme_color: "#7b1e26",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
