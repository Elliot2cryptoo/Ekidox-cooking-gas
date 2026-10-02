import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ekidox.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/account/", "/orders/", "/checkout/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
