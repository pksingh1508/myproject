import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/site";

const marketingRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: MetadataRoute.Sitemap[number]["priority"];
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/hackathons", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/notifications", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/cancellation-policy", changeFrequency: "yearly", priority: 0.4 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return marketingRoutes.map(({ path, ...rest }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    ...rest
  }));
}
