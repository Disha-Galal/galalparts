import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { pageMeta, services } from "@/lib/site";

export const Route = createFileRoute("/maintenance")({
  head: () =>
    pageMeta(
      "صيانة الغسالات والثلاجات والسخانات والبوتاجازات | جلال",
      "أقسام صيانة الغسالات والثلاجات والسخانات والبوتاجازات عند جلال، مع أمثلة أعطال شائعة وتنبيه سلامة، من غير أسعار ثابتة.",
      "/maintenance",
    ),
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="الصيانة"
        title="صيانة الأجهزة المنزلية"
        lede="تشخيص حسب نوع الجهاز والعطل. الأمثلة هنا للفهم، والنتيجة الفعلية بعد المراجعة."
      />
      <div className="section">
        <div className="wrap space-y-8">
          {services.map((service) => (
            <section key={service.id} id={service.id} className="scroll-mt-24">
              <h2 className="text-2xl font-bold">{service.title}</h2>
              <p className="mt-2 text-muted">{service.summary}</p>
              <Link
                to="/maintenance/$service"
                params={{ service: service.id }}
                data-event="maintenance_cta_click"
                data-item={service.id}
                className="btn btn-primary mt-4"
              >
                اطلب صيانة {service.title}
              </Link>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {service.faults.map((fault) => (
                  <li key={fault} className="card text-sm">
                    {fault}
                  </li>
                ))}
              </ul>
              <p className="callout mt-4 text-sm">{service.caution}</p>
            </section>
          ))}
          <p className="text-sm text-muted">
            لإرشادات أولية أطول، راجع{" "}
            <Link to="/guides" className="text-cyan">
              الأعطال والنصائح
            </Link>{" "}
            أو{" "}
            <Link to="/articles" className="text-cyan">
              المقالات
            </Link>
            .
          </p>
        </div>
      </div>
    </Shell>
  );
}
