import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/reset-password",
        "/cart",
        "/success",
        "/checkout",
      ],
    },
    sitemap: "https://thelocalloopfl.com/sitemap.xml",
    host: "https://thelocalloopfl.com",
  };
}
