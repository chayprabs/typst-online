import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://typstbox.dev";
  const routes = [
    "",
    "/faq",
    "/privacy",
    "/terms",
    "/typst-playground",
    "/typst-resume",
    "/typst-invoice",
    "/typst-paper",
    "/typst-to-pdf",
    "/t/resume-modern",
    "/t/paper-ieee",
    "/t/invoice",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
