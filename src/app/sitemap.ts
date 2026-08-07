import type { MetadataRoute } from "next";
import { listarSlugs } from "@/lib/sitios";
import { ANUNCIOS_SITIOS } from "@/lib/anuncios-seo";
import { VALORES_SITIOS } from "@/lib/valores-seo";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listarSlugs();
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/promociones`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...ANUNCIOS_SITIOS.filter((s) => slugs.includes(s)).map((slug) => ({
      url: `${SITE_URL}/anuncios-${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...VALORES_SITIOS.filter((s) => slugs.includes(s)).map((slug) => ({
      url: `${SITE_URL}/${slug}-valores`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
