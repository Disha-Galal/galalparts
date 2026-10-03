import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Tracking } from "@/components/tracking";
import { site } from "@/lib/site";
import appCss from "../styles.css?url";

const fontHref =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.brandName },
      { name: "description", content: site.description },
      { name: "theme-color", content: "#0e1114" },
      { name: "robots", content: "index, follow" },
      ...(site.GOOGLE_SITE_VERIFICATION.trim()
        ? [{ name: "google-site-verification", content: site.GOOGLE_SITE_VERIFICATION.trim() }]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: fontHref },
    ],
  }),
  component: () => (
    <html lang="ar" dir="rtl" className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
          <Tracking />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
