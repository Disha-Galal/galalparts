import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArticleCard, JsonLd, PageHeader } from "@/components/blocks";
import { InquiryForm } from "@/components/inquiry-form";
import { Shell } from "@/components/shell";
import { articles, canonicalUrl, missingPageMeta, pageMeta, services, site } from "@/lib/site";
export const Route = createFileRoute("/maintenance_/$service")({
  loader: ({ params }) => {
    const service = services.find((s) => s.id === params.service);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageMeta(
          `صيانة ${loaderData.service.title} في القاهرة والقليوبية وشبرا الخيمة | جلال`,
          loaderData.service.summary,
          `/maintenance/${loaderData.service.id}`,
        )
      : missingPageMeta(),
  component: ServicePage,
});
function ServicePage() {
  const { service } = Route.useLoaderData();
  const related = articles.filter((a) => a.category === service.id).slice(0, 3);
  const device = { washers: "غسالة", fridges: "ثلاجة", heaters: "سخان", stoves: "بوتاجاز" }[
    service.id
  ];
  return (
    <Shell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `صيانة ${service.title}`,
          description: service.summary,
          url: canonicalUrl(`/maintenance/${service.id}`),
          serviceType: "صيانة أجهزة منزلية",
          provider: { "@type": "Organization", name: site.brandName, url: canonicalUrl("/") },
          areaServed: site.serviceAreas,
        }}
      />
      <PageHeader eyebrow="صيانة الأجهزة" title={`صيانة ${service.title}`} lede={service.summary} />
      <div className="section">
        <div className="wrap space-y-8">
          <Link to="/maintenance" className="inline-flex min-h-11 items-center text-cyan">
            كل خدمات الصيانة
          </Link>
          <section>
            <h2 className="text-2xl font-bold">أعطال نراجعها</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.faults.map((fault) => (
                <li key={fault} className="card">
                  {fault}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              وصف العطل يساعدنا نبدأ، لكنه لا يكفي للتشخيص النهائي. إمكانية الإصلاح والتكلفة تتحدد
              بعد المراجعة أو الفحص.
            </p>
            <p className="callout mt-4">{service.caution}</p>
          </section>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">جهّز المعلومات دي</h2>
              <ul className="list-disc space-y-3 ps-5 text-muted">
                <li>ماركة الجهاز وصورة واضحة لملصق الموديل.</li>
                <li>وصف العطل ومتى بدأ، وأي كود خطأ ظاهر.</li>
                <li>المدينة والمنطقة لتأكيد إمكانية الزيارة.</li>
                <li>صورة أو فيديو للعطل إن أمكن بدون تشغيل الجهاز عند وجود خطر.</li>
              </ul>
              <h3 className="text-xl font-bold">نطاق الصيانة</h3>
              <p className="text-muted">
                {site.serviceAreas.join("، ")}. نؤكد المنطقة والموعد عند التواصل.
              </p>
              <Link
                to="/articles/$slug"
                params={{ slug: "find-model-label" }}
                className="inline-flex min-h-11 items-center text-cyan"
              >
                طريقة معرفة موديل الجهاز
              </Link>
            </section>
            <section className="card" id="service-inquiry">
              <h2 className="mb-4 text-2xl font-bold">اطلب صيانة {service.title}</h2>
              <InquiryForm intent="maintenance" device={device} />
            </section>
          </div>
          {related.length ? (
            <section>
              <h2 className="mb-4 text-2xl font-bold">إرشادات مفيدة</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
