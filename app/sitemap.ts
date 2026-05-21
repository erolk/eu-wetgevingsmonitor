import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { THEMAS } from "@/lib/themas";

export default function sitemap(): MetadataRoute.Sitemap {
  const nu = new Date();

  const vast: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: nu, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/zoeken`, lastModified: nu, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/hoe-het-werkt`, lastModified: nu, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/over`, lastModified: nu, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, lastModified: nu, changeFrequency: "yearly", priority: 0.3 },
  ];

  const terreinen: MetadataRoute.Sitemap = THEMAS.map((t) => ({
    url: `${SITE_URL}/beleidsterrein/${t.slug}`,
    lastModified: nu,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...vast, ...terreinen];
}
