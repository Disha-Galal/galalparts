import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard, ContactActions, JsonLd } from "@/components/blocks";
import { FlameIcon, FridgeIcon, StoveIcon, WasherIcon } from "@/components/icons";
import { RealWork } from "@/components/real-work";
import { Shell } from "@/components/shell";
import {
  articles,
  pageMeta,
  parts,
  reasons,
  services,
  site,
  siteOrigin,
  steps,
  type Service,
} from "@/lib/site";

const icons: Record<Service["id"], typeof WasherIcon> = {
  washers: WasherIcon,
  fridges: FridgeIcon,
  heaters: FlameIcon,
  stoves: StoveIcon,
};

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      site.brandName,
      "جلال لصيانة وبيع قطع غيار الأجهزة المنزلية. تشخيص فني وقطعة متوافقة بعد التأكد من موديل جهازك في القاهرة والقليوبية وشبرا الخيمة.",
      "/",
    ),
  component: Home,
});

function serviceSchema() {
  const origin = siteOrigin();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brandName,
    description: site.description,
    url: origin,
    image: `${origin}/brand/logo-mark.webp`,
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: [site.FACEBOOK_URL, site.YOUTUBE_URL].filter(Boolean),
    telephone: site.BUSINESS_WHATSAPP,
    founder: { "@type": "Person", name: site.ownerName },
    knowsLanguage: "ar",
    makesOffer: [
      ...services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: `صيانة ${service.title}`,
          areaServed: site.serviceAreas.join("، "),
          serviceType: "صيانة أجهزة منزلية",
        },
      })),
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "بيع قطع غيار الأجهزة المنزلية",
          description: site.modelRule,
        },
      },
    ],
  };
  return data;
}

function Home() {
  const latest = articles.slice(0, 3);
  return (
    <Shell>
      <JsonLd data={serviceSchema()} />
      <section className="border-b border-line">
        <div className="wrap flex flex-col items-center py-12 text-center md:py-16">
          <img
            src="/brand/logo-mark.webp"
            alt="شعار جلال: عين داخل شكل سداسي مع عدسة فحص"
            width={375}
            height={451}
            fetchPriority="high"
            className="h-40 w-auto md:h-48"
          />
          <h1 className="mt-6 max-w-3xl text-3xl font-bold md:text-5xl">{site.brandName}</h1>
          <span className="cyan-rule mt-4" />
          <p className="max-w-xl text-lg text-fg">{site.tagline}</p>
          <p className="mt-3 max-w-2xl text-muted">
            صيانة وقطع غيار في القاهرة والقليوبية وشبرا الخيمة. شحن القطع خارج القاهرة يتم بعد
            مطابقة الموديل فقط.
          </p>
          <div className="mt-7 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
            <Link
              to="/maintenance"
              className="card card-link items-center border-cyan py-6"
              data-event="maintenance_cta_click"
              data-item="home"
            >
              <span className="text-2xl font-bold text-cyan">أريد صيانة جهاز</span>
              <span className="text-sm text-muted">اختار الجهاز وجهّز طلب الزيارة</span>
            </Link>
            <Link
              to="/parts"
              className="card card-link items-center py-6"
              data-event="spare_part_cta_click"
              data-item="home"
            >
              <span className="text-2xl font-bold text-cyan">أريد قطعة غيار</span>
              <span className="text-sm text-muted">اختار القطعة ونأكد توافقها مع الموديل</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="wrap">
          <h2 id="services-title" className="text-2xl font-bold">
            الخدمات
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            أربع مجموعات، وفي كل مجموعة أمثلة أعطال شائعة للفهم وليست تشخيصًا نهائيًا.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = icons[service.id];
              return (
                <Link
                  key={service.id}
                  to="/maintenance/$service"
                  params={{ service: service.id }}
                  data-event="maintenance_cta_click"
                  data-item={service.id}
                  className="card card-link"
                >
                  <span className="icon-badge">
                    <Icon />
                  </span>
                  <span className="text-xl font-bold">{service.title}</span>
                  <span className="text-sm text-muted">{service.summary}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="parts-title">
        <div className="wrap grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="parts-title" className="text-2xl font-bold">
              قطع الغيار
            </h2>
            <p className="mt-3 text-muted">
              اختر نوع الجهاز والقطعة، ثم أرسل بيانات الموديل لتأكيد التوافق والتوفر قبل الشراء.
            </p>
            <Link to="/parts" className="btn btn-primary mt-5">
              تصفح الفئات
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {parts.map((group) => (
              <li key={group.id} className="card text-sm">
                <span className="font-bold">{group.title}</span>
                <span className="mt-1 block text-muted">{group.items.slice(0, 3).join("، ")}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="steps-title">
        <div className="wrap">
          <h2 id="steps-title" className="text-2xl font-bold">
            كيف نشتغل؟
          </h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-4">
            {steps.map((step) => (
              <li key={step.n} className="card">
                <span className="font-bold text-cyan">{step.n}</span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="trust-title">
        <div className="wrap">
          <h2 id="trust-title" className="text-2xl font-bold">
            لماذا جلال
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {reasons.map((reason) => (
              <article key={reason.title} className="card">
                <h3 className="text-lg font-bold">{reason.title}</h3>
                <p className="mt-2 text-sm text-muted">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RealWork />
      <section className="section border-t border-line" aria-labelledby="articles-title">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="articles-title" className="text-2xl font-bold">
              أحدث النصائح
            </h2>
            <Link to="/articles" className="text-sm font-bold text-cyan no-underline">
              كل المقالات
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-line" aria-labelledby="areas-title">
        <div className="wrap">
          <h2 id="areas-title" className="text-2xl font-bold">
            مناطق الخدمة
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {site.serviceAreas.map((area) => (
              <li key={area} className="card font-bold">
                {area}
                <span className="mt-1 block text-sm font-normal text-muted">صيانة وقطع غيار</span>
              </li>
            ))}
          </ul>
          <Link to="/areas" className="btn btn-ghost mt-4">
            تفاصيل النطاق والشحن
          </Link>
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="wrap">
          <div className="card md:p-8">
            <h2 className="text-2xl font-bold">راسلنا الآن</h2>
            <p className="mt-2 max-w-2xl text-muted">
              ابعت نوع الجهاز وصورة الموديل ووصف العطل. نرد عليك بالمسار المناسب: فحص، أو قطعة بعد
              التأكد من التوافق.
            </p>
            <div className="mt-5">
              <ContactActions />
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
