import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { articles, guideTips, pageMeta, services } from "@/lib/site";

export const Route = createFileRoute("/guides")({
  head: () =>
    pageMeta(
      "أعطال ونصائح الأجهزة المنزلية | جلال",
      "فحوصات أولية آمنة لأعطال الغسالات والثلاجات والسخانات والبوتاجازات، مع روابط لأدلة أطول. ليست تشخيصًا نهائيًا.",
      "/guides",
    ),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="الأعطال والنصائح"
        title="تشخيص أولي آمن"
        lede="خطوات يقدر العميل يلاحظها من غير فك الجهاز. إذا ظهرت علامة خطر، أوقف الاستخدام واطلب فنيًا."
      />
      <div className="section">
        <div className="wrap space-y-6">
          {services.map((service) => (
            <section key={service.id} className="card">
              <h2 className="text-xl font-bold">{service.title}</h2>
              <ul className="mt-3 list-disc space-y-2 pe-5 text-sm text-muted">
                {guideTips[service.id].map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm">{service.caution}</p>
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold">أدلة أطول</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link to="/articles/$slug" params={{ slug: article.slug }} className="card card-link">
                    <span className="font-bold">{article.title}</span>
                    <span className="text-sm text-muted">{article.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}
