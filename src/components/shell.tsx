import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NAV, phoneUrl, emailUrl, facebookUrl, site, whatsappBase, youtubeUrl } from "@/lib/site";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 no-underline"
      aria-label="جلال، الصفحة الرئيسية"
    >
      <img
        src="/brand/logo-mark.webp"
        alt=""
        width={375}
        height={451}
        className={compact ? "h-11 w-auto" : "h-12 w-auto"}
      />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold text-fg">جلال</span>
        <span className="mt-1 hidden text-xs whitespace-nowrap text-muted sm:block">
          صيانة وقطع غيار
        </span>
      </span>
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const facebook = facebookUrl();
  const youtube = youtubeUrl();
  const email = emailUrl();
  const whatsapp = whatsappBase();
  const phone = phoneUrl();
  const channels = [
    phone ? { href: phone, label: "اتصل هاتفيًا", external: false } : null,
    facebook ? { href: facebook, label: "راسلنا على فيسبوك", external: true } : null,
    whatsapp ? { href: whatsapp, label: "واتساب الأعمال", external: true } : null,
    youtube ? { href: youtube, label: "يوتيوب", external: true } : null,
    email ? { href: email, label: site.BUSINESS_EMAIL, external: false } : null,
  ].filter((item): item is { href: string; label: string; external: boolean } => item !== null);

  return (
    <div className="metal min-h-screen">
      <a href="#content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="wrap flex items-center justify-between gap-3 py-3">
          <Logo compact />
          <nav className="hidden items-center gap-4 lg:flex" aria-label="الأقسام">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link"
                activeProps={{ "data-active": "true" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn btn-primary">
              تواصل
            </Link>
            <button
              type="button"
              className="btn btn-ghost px-3 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
              <span className="sr-only">{open ? "إغلاق القائمة" : "فتح القائمة"}</span>
            </button>
          </div>
        </div>
        {open ? (
          <nav
            id="mobile-nav"
            className="border-t border-line bg-bg-elevated lg:hidden"
            aria-label="القائمة"
          >
            <div className="wrap flex flex-col py-2">
              <Link to="/" className="nav-link" onClick={() => setOpen(false)}>
                الرئيسية
              </Link>
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/contact" className="nav-link" onClick={() => setOpen(false)}>
                اتصل بنا
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
      <main id="content">{children}</main>
      <footer className="border-t border-line bg-bg-elevated">
        <div className="wrap grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted">{site.tagline}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold">الصفحات</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-muted no-underline hover:text-cyan">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-muted no-underline hover:text-cyan">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted no-underline hover:text-cyan">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold">نطاق الخدمة</h2>
            <ul className="mt-3 space-y-1 text-sm text-muted">
              {site.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
              <li>{site.shippingNote}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold">التواصل</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    className="text-cyan no-underline"
                    href={channel.href}
                    {...(channel.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-cyan no-underline">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <p className="wrap py-4 text-xs text-muted">© {site.brandName}</p>
        </div>
      </footer>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <Shell>
      <section className="section">
        <div className="wrap max-w-xl">
          <p className="text-sm font-semibold text-cyan">٤٠٤</p>
          <h1 className="mt-2 text-3xl font-bold">الصفحة غير موجودة</h1>
          <p className="mt-3 text-muted">
            الرابط غير صحيح، أو الصفحة اتنقلت. ارجع للرئيسية أو لاختيار الخدمة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary">
              الرئيسية
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
