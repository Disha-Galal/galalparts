import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import {
  contactAreas,
  contactDevices,
  emailUrl,
  facebookUrl,
  pageMeta,
  site,
  whatsappBase,
  whatsappMessageLink,
  youtubeUrl,
} from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta(
      "اتصل بنا | جلال",
      "جهّز رسالة إلى جلال: نوع الجهاز، وصف العطل، وصورة ملصق الموديل. الإرسال يتم من جهازك.",
      "/contact",
    ),
  component: ContactPage,
});

function ContactPage() {
  const facebook = facebookUrl();
  const whatsapp = whatsappBase();
  const youtube = youtubeUrl();
  const email = emailUrl();
  const channels = [
    facebook ? { title: "فيسبوك", href: facebook, label: "راسلنا على فيسبوك" } : null,
    whatsapp ? { title: "واتساب الأعمال", href: whatsapp, label: "مراسلة واتساب الأعمال" } : null,
    email ? { title: "البريد", href: email, label: site.BUSINESS_EMAIL } : null,
    youtube ? { title: "يوتيوب", href: youtube, label: "قناة يوتيوب" } : null,
  ].filter((item): item is { title: string; href: string; label: string } => item !== null);

  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const device = String(data.get("device") ?? "").trim();
    const fault = String(data.get("fault") ?? "").trim();
    const area = String(data.get("area") ?? "").trim();
    if (!device || !fault) {
      setError("اكتب نوع الجهاز ووصف العطل أو القطعة.");
      setMessage("");
      return;
    }
    const lines = [
      "رسالة إلى جلال لصيانة وبيع قطع غيار الأجهزة المنزلية",
      name ? `الاسم: ${name}` : "",
      `نوع الجهاز: ${device}`,
      `النطاق: ${area}`,
      `الوصف: ${fault}`,
      "سأرفق صورة ملصق الموديل مع الرسالة.",
    ].filter(Boolean);
    setError("");
    setCopied(false);
    setMessage(lines.join("\n"));
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("تعذّر النسخ التلقائي. ظلل النص وانسخه يدويًا.");
    }
  }

  const whatsappReady = whatsappMessageLink(message);

  return (
    <Shell>
      <PageHeader
        eyebrow="التواصل"
        title="اتصل بنا"
        lede="جهّز نوع الجهاز ووصف العطل وصورة الملصق. الرسالة تتكوّن عندك في المتصفح ولا تُرسل إلى خادم."
      />
      <div className="section">
        <div className={`wrap grid gap-6 ${channels.length ? "lg:grid-cols-2" : ""}`}>
          {channels.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-bold">القنوات</h2>
              {channels.map((channel) => (
                <article key={channel.title} className="card">
                  <h3 className="font-bold">{channel.title}</h3>
                  <a
                    className="mt-2 inline-flex text-sm font-bold text-cyan"
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {channel.label}
                  </a>
                </article>
              ))}
            </section>
          ) : null}
          <section>
            <h2 className="text-xl font-bold">جهّز رسالتك</h2>
            <form className="mt-4 space-y-3" onSubmit={onSubmit} noValidate>
              <label className="field">
                <span>الاسم</span>
                <input name="name" autoComplete="name" />
              </label>
              <label className="field">
                <span>نوع الجهاز</span>
                <select name="device" defaultValue="غسالة" required>
                  {contactDevices.map((device) => (
                    <option key={device}>{device}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>النطاق</span>
                <select name="area" defaultValue="القاهرة">
                  {contactAreas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>وصف العطل أو القطعة</span>
                <textarea name="fault" required placeholder="مثال: الغسالة لا تصرف المياه بعد الشطف" />
              </label>
              {error ? (
                <p className="text-sm text-cyan" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary">
                تكوين الرسالة
              </button>
            </form>
            {message ? (
              <div className="mt-4 space-y-3">
                <label className="field">
                  <span>الرسالة جاهزة للنسخ</span>
                  <textarea readOnly value={message} />
                </label>
                <div className="flex flex-wrap gap-3">
                  <button type="button" className="btn btn-ghost" onClick={copyMessage}>
                    {copied ? "تم النسخ" : "نسخ الرسالة"}
                  </button>
                  {facebook ? (
                    <a className="btn btn-primary" href={facebook} target="_blank" rel="noreferrer">
                      افتح فيسبوك لإرسالها
                    </a>
                  ) : null}
                  {whatsappReady ? (
                    <a className="btn btn-primary" href={whatsappReady} target="_blank" rel="noreferrer">
                      إرسال عبر واتساب
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </Shell>
  );
}
