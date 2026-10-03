import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta(
      "سياسة الخصوصية | جلال",
      "سياسة خصوصية موقع جلال: لا حسابات عملاء، ولا دفع، ونموذج الرسالة يبقى في المتصفح ولا يُخزَّن على خادم النشاط.",
      "/privacy",
    ),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="الخصوصية"
        title="سياسة الخصوصية"
        lede="نسخة مبسطة تناسب موقعًا تعريفيًا بلا متجر وبلا حسابات."
      />
      <div className="section">
        <div className="wrap max-w-3xl space-y-4 text-muted">
          <p>الموقع يعرض خدمات الصيانة وقطع الغيار. لا يوجد إنشاء حساب، ولا سلة، ولا دفع إلكتروني.</p>
          <p>
            نموذج «جهّز رسالتك» يعمل داخل جهازك فقط. النص لا يُرسل إلى خادم خاص بالنشاط، ولا نحتفظ به. إذا ظهر زر واتساب بعد إضافة رقم العمل، يفتح واتساب برسالتك الجاهزة من جهازك.
          </p>
          <p>لا نطلب عنوان السكن، ولا ننشر عنوان منزل. نطاق الخدمة المذكور هو القاهرة والقليوبية وشبرا الخيمة.</p>
          <p>إذا استخدمت رابط تواصل يظهر في صفحة اتصل بنا، تسري سياسات تلك الخدمة على ما ترسله إليها. لا نبيع بيانات الزوار.</p>
          <p>إذا تغيّرت طريقة التواصل سنحدّث هذه الصفحة مع البيانات الظاهرة في صفحة اتصل بنا.</p>
        </div>
      </div>
    </Shell>
  );
}
