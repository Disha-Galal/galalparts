import { createFileRoute } from "@tanstack/react-router";
import { canonicalUrl, publicPaths, site } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = publicPaths()
          .map(
            (path) =>
              `  <url><loc>${canonicalUrl(path)}</loc><lastmod>${site.updated}</lastmod></url>`,
          )
          .join("\n");
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
