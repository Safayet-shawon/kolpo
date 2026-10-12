import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { articles } from "@/data/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/architecture", "/interior-design", "/construction", "/projects", "/about", "/contact", "/journal", "/privacy"];
  return [
    ...staticRoutes.map((r) => ({ url: `${site.url}${r}`, changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7 })),
    ...projects.map((p) => ({ url: `${site.url}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, lastModified: a.date, priority: 0.4 })),
  ];
}
