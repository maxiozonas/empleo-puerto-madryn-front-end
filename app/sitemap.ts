import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.madrynempleos.com";

  const staticPages = [
    {
      url: `${baseUrl}/`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/avisos`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categorias`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contactanos`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly" as const,
      priority: 0.5,
    },
  ];

  return staticPages;
}