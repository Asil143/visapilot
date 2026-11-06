import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified: string }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0, lastModified: "2026-10-13" },
    { path: "/about", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-10-13" },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-10-13" },
    { path: "/faq", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-13" },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-13" },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-10-13" },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-10-13" },
    { path: "/guides", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/f1-visa", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/opt-stem-opt", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/h1b-visa", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/green-card", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/family-green-card", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/guides/j1-visa", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-13" },
    { path: "/guides/travel-advisory", changeFrequency: "weekly", priority: 0.8, lastModified: "2026-10-13" },
    { path: "/visa-finder", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-11-03" },
    { path: "/dashboard/tools/checklists", changeFrequency: "monthly", priority: 0.9, lastModified: "2026-10-13" },
    { path: "/dashboard/tools/opt-tracker", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-13" },
    { path: "/dashboard/tools/fee-calculator", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-10-13" },
    { path: "/visa-bulletin", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-10-01" },
    { path: "/visa-comparison", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-10-13" },
    { path: "/glossary", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-10-13" },
    { path: "/employer-lookup", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-10-13" },
    { path: "/lawyers", changeFrequency: "monthly", priority: 0.6, lastModified: "2026-10-13" },
    { path: "/blog", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-10-13" },
    { path: "/events", changeFrequency: "monthly", priority: 0.4, lastModified: "2026-11-03" },
    { path: "/success-stories", changeFrequency: "monthly", priority: 0.4, lastModified: "2026-11-03" },
  ];

  return pages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
