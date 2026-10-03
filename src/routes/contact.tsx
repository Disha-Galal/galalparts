import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { InquiryForm } from "@/components/inquiry-form";
import {
  emailUrl,
  facebookUrl,
  pageMeta,
  phoneUrl,
  site,
  whatsappBase,
  youtubeUrl,
} from "@/lib/site";
export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta(
      "اتصل بنا وطلب الصيانة أو قطعة غيار | جلال",
      "جهّز طلب الصيانة أو قطعة غيار بالموديل ووصف العطل والمنطقة. تواصل مع جلال على واتساب أو الهاتف أو فيسبوك.",
      "/contact",
    ),
  component: ContactPage,
});
function ContactPage() {
  const [intent, setIntent] = useState<"maintenance" | "part">("maintenance");
  const channels = [
    { title: "واتساب الأعمال", href: whatsappBase(), label: "مراسلة واتساب الأعمال" },
    { title: "الهاتف", href: phoneUrl(), label: site.BUSINESS_WHATSAPP },
    { title: "فيسبوك", href: facebookUrl(), label: "صفحة جلال الرسمية" },
    { title: "يوتيوب", href: youtubeUrl(), label: "قناة جلال" },
    { title: "البريد", href: emailUrl(), label: site.BUSINESS_EMAIL },
  ].filter((c) => c.href);
  return (
    <Shell>
      <PageHeader
        eyebrow="التواصل"
        title="اتصل بنا"
        lede="اختار طلبك وجهّز الرسالة. الإرسال بإيدك من واتساب، وبيانات الطلب تبقى في جهازك."
      />
      <div className="section">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-4 text-xl font-bold">جهّز رسالتك</h2>
            <fieldset className="mb-5">
              <legend className="mb-3 font-bold">نوع الطلب</legend>
              <div className="flex flex-wrap gap-4">
                {(["maintenance", "part"] as const).map((value) => (
                  <label key={value} className="flex min-h-11 items-center gap-2">
                    <input
                      type="radio"
                      name="intent"
                      checked={intent === value}
                      onChange={() => setIntent(value)}
                    />
                    {value === "maintenance" ? "أريد صيانة جهاز" : "أريد قطعة غيار"}
                  </label>
                ))}
              </div>
            </fieldset>
            <InquiryForm key={intent} intent={intent} />
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">قنوات التواصل الرسمية</h2>
            {channels.map((channel) => (
              <article key={channel.title} className="card">
                <h3 className="font-bold">{channel.title}</h3>
                <a
                  className="mt-2 inline-flex min-h-11 items-center text-cyan"
                  href={channel.href!}
                  {...(channel.href!.startsWith("https:")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {channel.label}
                </a>
              </article>
            ))}
          </section>
        </div>
      </div>
    </Shell>
  );
}
