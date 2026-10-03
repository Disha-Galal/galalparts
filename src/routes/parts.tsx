import { createFileRoute } from "@tanstack/react-router";
import { ModelCallout, PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { pageMeta, parts, site } from "@/lib/site";

export const Route = createFileRoute("/parts")({
  head: () =>
    pageMeta(
      "قطع غيار الأجهزة المنزلية | جلال",
      "فئات قطع غيار الغسالات والثلاجات والسخانات والبوتاجازات. للتأكد من التوافق ابعت صورة موديل الجهاز قبل الطلب. ليس متجرًا إلكترونيًا.",
      "/parts",
    ),
  component: PartsPage,
});

function PartsPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="قطع الغيار"
        title="قطع غيار حسب نوع الجهاز"
        lede="فئات حسب نوع الجهاز. لا يوجد سلة شراء أو دفع من الموقع."
      />
      <div className="section">
        <div className="wrap space-y-6">
          <ModelCallout />
          <div className="grid gap-3 md:grid-cols-2">
            {parts.map((group) => (
              <section key={group.id} id={group.id} className="card scroll-mt-24">
                <h2 className="text-xl font-bold">{group.title}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-line pb-2 last:border-0">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted">{group.note}</p>
              </section>
            ))}
          </div>
          <aside className="card">
            <h2 className="text-lg font-bold">الشحن</h2>
            <p className="mt-2 text-sm text-muted">
              داخل القاهرة والقليوبية وشبرا الخيمة نوفر الصيانة والقطع. {site.shippingNote}.
            </p>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
