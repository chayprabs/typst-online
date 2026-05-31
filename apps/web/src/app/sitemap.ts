import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://typstbox.dev";
  const routes = [
    "",
    "/privacy",
    "/terms",
    "/typst-playground",
    "/typst-resume",
    "/typst-invoice",
    "/typst-paper",
    "/typst-to-pdf",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
