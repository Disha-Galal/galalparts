import { useState } from "react";
import { buildInquiry } from "@/lib/inquiry";
import { contactDevices, site, whatsappMessageLink } from "@/lib/site";

export function InquiryForm({
  intent,
  device,
  partName = "",
  partCode = "",
  brand = "",
}: {
  intent: "maintenance" | "part";
  device?: string;
  partName?: string;
  partCode?: string;
  brand?: string;
}) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    device: device ?? contactDevices[0],
    brand,
    model: "",
    description: partName,
    area: "",
    name: "",
  });
  const field = (name: keyof typeof values, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setMessage("");
    setCopied(false);
    setError("");
  };
  const prepare = () => {
    const ready = buildInquiry({ intent, ...values, partCode });
    setMessage(ready);
    setCopied(false);
    setError("");
    return ready;
  };
  const href = whatsappMessageLink(buildInquiry({ intent, ...values, partCode }));
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {intent === "maintenance"
          ? `الصيانة في ${site.serviceAreas.join("، ")} بعد تأكيد المنطقة والموعد.`
          : "التوافق أولًا: صورة الملصق وصورة القطعة القديمة تساعدان في تحديد البديل الصحيح."}
      </p>
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          prepare();
        }}
      >
        <label className="field">
          <span>نوع الجهاز</span>
          <select value={values.device} onChange={(e) => field("device", e.target.value)}>
            {contactDevices.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>الماركة إن عُرفت</span>
          <input
            maxLength={100}
            value={values.brand}
            onChange={(e) => field("brand", e.target.value)}
          />
        </label>
        <label className="field">
          <span>الموديل إن وجد</span>
          <input
            maxLength={150}
            value={values.model}
            onChange={(e) => field("model", e.target.value)}
            placeholder="أو أرسل صورة الملصق في واتساب"
          />
        </label>
        <label className="field">
          <span>المنطقة</span>
          <input
            maxLength={150}
            value={values.area}
            onChange={(e) => field("area", e.target.value)}
            placeholder="المدينة والمنطقة"
          />
        </label>
        <label className="field sm:col-span-2">
          <span>{intent === "maintenance" ? "وصف العطل" : "القطعة المطلوبة"}</span>
          <textarea
            maxLength={1500}
            value={values.description}
            onChange={(e) => field("description", e.target.value)}
            placeholder={
              intent === "maintenance" ? "ما الذي يحدث؟ ومتى بدأ؟" : "اسم القطعة أو وصفها"
            }
          />
        </label>
        <label className="field sm:col-span-2">
          <span>الاسم (اختياري)</span>
          <input
            maxLength={100}
            autoComplete="name"
            value={values.name}
            onChange={(e) => field("name", e.target.value)}
          />
        </label>
        <p className="text-xs text-muted sm:col-span-2">
          الصور تُرفق داخل واتساب. البيانات تبقى في جهازك؛ فتح الرسالة لا يرسلها تلقائيًا.
        </p>
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
          {href ? (
            <a
              className="btn btn-primary"
              href={href}
              target="_blank"
              rel="noreferrer"
              data-event={
                intent === "maintenance" ? "maintenance_cta_click" : "spare_part_inquiry_click"
              }
              data-item={intent}
              onClick={prepare}
            >
              {intent === "maintenance" ? "جهّز طلب الصيانة على واتساب" : "تأكد من التوافق واطلب"}
            </a>
          ) : (
            <p className="callout">راجع صفحة التواصل لاختيار قناة متاحة.</p>
          )}
          <button className="btn btn-ghost" type="submit">
            تكوين الرسالة للنسخ
          </button>
        </div>
      </form>
      {message ? (
        <div className="space-y-3" aria-live="polite">
          <label className="field">
            <span>الرسالة الجاهزة</span>
            <textarea readOnly value={message} rows={10} />
          </label>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(message);
                setCopied(true);
              } catch {
                setError("تعذر النسخ. يمكنك تحديد الرسالة ونسخها يدويًا.");
              }
            }}
          >
            {copied ? "تم النسخ" : "نسخ الرسالة"}
          </button>
        </div>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
