import type { MetadataRoute } from "next";
import { modules } from "@/content";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/learn", "/practice", "/practice/inbox", "/practice/sms", "/practice/browser", "/practice/urls", "/practice/passwords", "/privacy", "/leaderboard", "/teach", "/verify"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...modules.flatMap((m) => [
      { url: `${SITE_URL}/learn/${m.id}`, changeFrequency: "monthly" as const, priority: 0.8 },
      ...m.lessons.map((l) => ({ url: `${SITE_URL}/learn/${m.id}/${l.id}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ]),
  ];
}
