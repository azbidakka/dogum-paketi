import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/kvkk`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/gizlilik`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/cerez-politikasi`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/aydinlatma-metni`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
