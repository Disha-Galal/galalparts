import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
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
            جلال لصيانة وبيع قطع غيار الأجهزة المنزلية يجمع الخدمتين في مكان واحد: نفهم العطل، نراجع موديل الجهاز، وبعدها يتضح هل المطلوب صيانة أو قطعة متوافقة.
          </p>
          <p>
            الشغل قائم على الخبرة العملية، من غير وعود دعائية ومن غير أرقام سنوات أو تقييمات غير موثقة. لا نعرض أسعار إصلاح ثابتة لأن الحالة تختلف من جهاز لآخر، ولا نعرض أكواد قطع قبل المراجعة.
          </p>
          <p>
            نطاق الصيانة: {site.serviceAreas.join("، ")}. {site.shippingNote}.
          </p>
          <p>صور الأعمال الحقيقية ستُضاف لاحقًا من المالك. لا نستخدم صور أجهزة عامة مكان الشغل الفعلي.</p>
          <Link to="/contact" className="btn btn-primary mt-2">
            تواصل معنا
          </Link>
        </div>
      </div>
    </Shell>
  );
}
