import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phishproof — Learn to spot phishing",
    short_name: "Phishproof",
    description: "A free, interactive phishing-awareness course with simulators, quizzes and certificates.",
    id: "/",
    start_url: "/dashboard?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f7f9",
    theme_color: "#2346e8",
    categories: ["education", "security"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcuts: [
      { name: "Continue learning", url: "/learn", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Spot the Phish", url: "/practice/inbox", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Password lab", url: "/practice/passwords", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
