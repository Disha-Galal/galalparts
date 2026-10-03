import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModelCallout, PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { InquiryForm } from "@/components/inquiry-form";
import { ProductCard } from "@/components/product-card";
import { availabilityLabels, filterProducts, normalizeSearch } from "@/lib/catalog-schema";
import { products } from "@/lib/products";
import { pageMeta, parts, services, site } from "@/lib/site";

export const Route = createFileRoute("/parts")({
  head: () =>
    pageMeta(
      "قطع غيار الأجهزة المنزلية وتأكيد التوافق | جلال",
      "اختر نوع الجهاز وابحث عن القطعة، وأرسل الموديل وصورة الملصق لتأكيد التوافق والتوفر قبل الطلب. شحن خارج نطاق الصيانة بعد المطابقة.",
      "/parts",
    ),
  component: PartsPage,
});
function PartsPage() {
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("");
  const [requestedPart, setRequestedPart] = useState("");
  const brands = [
    ...new Set(
      products
        .filter((p) => !category || p.category === category)
        .map((p) => p.brand)
        .filter(Boolean),
    ),
  ].sort();
  const result = filterProducts(products, query, category, brand, availability);
  const groups = parts
    .filter((g) => !category || category === g.id)
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) => !query || normalizeSearch(item).includes(normalizeSearch(query)),
      ),
    }))
    .filter((g) => g.items.length);
  const device = (
    { washers: "غسالة", fridges: "ثلاجة", heaters: "سخان", stoves: "بوتاجاز" } as Record<
      string,
      string
    >
  )[category];
  return (
    <Shell>
      <PageHeader
        eyebrow="قطع الغيار"
        title="اختار القطعة، والتوافق علينا نراجعه"
        lede="نوع الجهاز ← الماركة والموديل ← القطعة ← تأكيد التوافق والتوفر قبل الاتفاق على الطلب."
      />
      <div className="section">
        <div className="wrap space-y-6">
          <ModelCallout />
          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            role="search"
            aria-label="البحث عن قطع الغيار"
          >
            <label className="field">
              <span>نوع الجهاز</span>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setBrand("");
                  setRequestedPart("");
                }}
              >
                <option value="">كل الأجهزة</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>ابحث عن قطعة</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اسم القطعة، كودها أو الموديل"
              />
            </label>
            <label className="field">
              <span>الماركة</span>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                disabled={!brands.length}
              >
                <option value="">
                  {brands.length ? "كل الماركات" : "أضف الماركة في رسالة الطلب"}
                </option>
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>التوفر</span>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                disabled={!products.length}
              >
                <option value="">الكل</option>
                {Object.entries(availabilityLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {products.length ? (
            <section aria-label="نتائج المنتجات">
              <p className="mb-4 text-sm text-muted" role="status">
                {result.length} قطعة مطابقة
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
              {!result.length ? (
                <p className="callout">
                  لا توجد قطعة مطابقة في الكتالوج. أرسل بيانات الجهاز للتحقق من إمكانية توفيرها.
                </p>
              ) : null}
            </section>
          ) : (
            <p className="callout">
              الطلب متاح بالاستفسار عن القطعة. الفئات التالية للتعريف؛ التوفر والتوافق والسعر
              يُؤكَّدون عند التواصل.
            </p>
          )}
          <section aria-label="فئات القطع">
            <h2 className="mb-4 text-xl font-bold">أمثلة القطع حسب الجهاز</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {groups.map((group) => (
                <section key={group.id} id={group.id} className="card scroll-mt-24">
                  <h3 className="text-xl font-bold">{group.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#part-inquiry"
                          className="flex min-h-11 items-center justify-between gap-3 border-b border-line py-2 text-sm hover:text-cyan"
                          onClick={() => {
                            setCategory(group.id);
                            setBrand("");
                            setRequestedPart(item);
                          }}
                        >
                          <span>{item}</span>
                          <span className="text-cyan">استفسر</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-muted">{group.note}</p>
                </section>
              ))}
            </div>
            {!groups.length ? (
              <p className="text-muted">لم نجد اسم القطعة ضمن الأمثلة. اكتب وصفها في الطلب.</p>
            ) : null}
          </section>
          <section id="part-inquiry" className="card scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold">تأكد من التوافق واطلب</h2>
            <InquiryForm
              key={`${category}-${requestedPart}-${brand}-${query}`}
              intent="part"
              device={device}
              partName={requestedPart || query}
              brand={brand}
            />
          </section>
          <aside className="card">
            <h2 className="text-lg font-bold">الشحن بعد المطابقة</h2>
            <p className="mt-2 text-sm text-muted">
              {site.shippingNote}. نؤكد التوفر والسعر وتكلفة الشحن قبل الطلب.
            </p>
            <Link
              to="/articles/$slug"
              params={{ slug: "find-model-label" }}
              className="mt-3 inline-flex min-h-11 items-center text-cyan"
            >
              إزاي تعرف موديل جهازك وتصوّر الملصق؟
            </Link>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
