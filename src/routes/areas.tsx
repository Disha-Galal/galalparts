import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { areaCopy, pageMeta, site } from "@/lib/site";

export const Route = createFileRoute("/areas")({
  head: () =>
    pageMeta(
      "مناطق الخدمة والشحن | جلال",
      "نطاق خدمة جلال: القاهرة والقليوبية وشبرا الخيمة. شحن قطع الغيار خارج القاهرة بعد مطابقة موديل الجهاز. من غير عنوان منزل.",
      "/areas",
    ),
  component: AreasPage,
});

function AreasPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="النطاق"
        title="مناطق الخدمة والشحن"
        lede="الصيانة في القاهرة والقليوبية وشبرا الخيمة. أكد منطقتك معنا لتحديد إمكانية الزيارة والموعد."
      />
      <div className="section">
        <div className="wrap space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {areaCopy.map((area) => (
              <article key={area.name} className="card">
                <h2 className="text-xl font-bold">{area.name}</h2>
                <p className="mt-2 text-sm text-muted">{area.text}</p>
              </article>
            ))}
          </div>
          <article className="callout">
            <h2 className="text-lg font-bold">خارج القاهرة</h2>
            <p className="mt-2 text-sm text-muted">
              {site.shippingNote}. الشحن خاص بقطع الغيار بعد صورة الملصق، وليس بزيارة صيانة خارج
              النطاق المذكور.
            </p>
          </article>
        </div>
      </div>
    </Shell>
  );
}
