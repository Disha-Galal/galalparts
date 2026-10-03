import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
import { RealWork } from "@/components/real-work";
import { Shell } from "@/components/shell";
import { pageMeta, site } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta(
      "من نحن | جلال لصيانة الأجهزة",
      "مصطفى جلال، فني صيانة أجهزة منزلية. الموقع يجمع تشخيص الأعطال وبيع قطع الغيار بعد التأكد من موديل الجهاز.",
      "/about",
    ),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Shell>
      <PageHeader eyebrow="من نحن" title={site.ownerName} lede={site.ownerRole} />
      <div className="section">
        <div className="wrap max-w-3xl space-y-4 text-muted">
          <p>
            جلال لصيانة وبيع قطع غيار الأجهزة المنزلية يجمع الخدمتين في مكان واحد: نفهم العطل، نراجع
            موديل الجهاز، وبعدها يتضح هل المطلوب صيانة أو قطعة متوافقة.
          </p>
          <p>
            مصطفى جلال، فني صيانة أجهزة منزلية. نراجع بيانات الجهاز قبل تحديد القطعة، ونوضح هل
            الحالة تحتاج فحصًا. تكلفة الصيانة تختلف حسب العطل وحالة الجهاز، وتُناقَش بعد مراجعة
            المعلومات.
          </p>
          <p>
            نطاق الصيانة: {site.serviceAreas.join("، ")}. {site.shippingNote}.
          </p>

          <Link to="/contact" className="btn btn-primary mt-2">
            تواصل معنا
          </Link>
        </div>
      </div>
      <RealWork />
    </Shell>
  );
}
