import { MetadataRoute } from "next";
import { client } from "../../lib/sanity";

const BASE = "https://thelocalloopfl.com";

type BlogRef = { _id: string; _updatedAt: string };

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/home`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/event`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/local-spotlight`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/newsletter`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/advertise`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs: BlogRef[] = await client.fetch(
      `*[_type == "blog" && !(_id in path("drafts.**"))]{ _id, _updatedAt }`,
      {},
      { next: { revalidate: 3600 } }
    );
    blogRoutes = blogs.map((b) => ({
      url: `${BASE}/blog/${b._id}`,
      lastModified: b._updatedAt ? new Date(b._updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // If Sanity is unreachable at build/revalidate time, still serve the static routes.
    blogRoutes = [];
  }

  return [...staticRoutes, ...blogRoutes];
}
