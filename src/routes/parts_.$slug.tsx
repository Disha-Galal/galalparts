import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { JsonLd, ModelCallout, PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { InquiryForm } from "@/components/inquiry-form";
import { ProductCard } from "@/components/product-card";
import { availabilityLabels } from "@/lib/catalog-schema";
import { findProduct, relatedProducts } from "@/lib/products";
import { canonicalUrl, missingPageMeta, pageMeta, services, site } from "@/lib/site";
export const Route = createFileRoute("/parts_/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageMeta(
          `${loaderData.product.nameAr} | قطع غيار جلال`,
          loaderData.product.description,
          `/parts/${loaderData.product.slug}`,
        )
      : missingPageMeta(),
  component: ProductPage,
});
function ProductPage() {
  const { product } = Route.useLoaderData();
  const service = services.find((s) => s.id === product.category)!;
  const related = relatedProducts(product);
  const device = { washers: "غسالة", fridges: "ثلاجة", heaters: "سخان", stoves: "بوتاجاز" }[
    product.category
  ];
  return (
    <Shell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.nameAr,
          description: product.description,
          url: canonicalUrl(`/parts/${product.slug}`),
          image: product.photos.map((p) => canonicalUrl(p.src)),
          ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
          ...(product.partCode ? { mpn: product.partCode } : {}),
        }}
      />
      <PageHeader eyebrow={service.title} title={product.nameAr} lede={product.description} />
      <div className="section">
        <div className="wrap space-y-6">
          <Link to="/parts" className="inline-flex min-h-11 items-center text-cyan">
            كل قطع الغيار
          </Link>
          <ModelCallout />
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="space-y-4">
              {product.photos.length ? (
                product.photos.map((p, i) => (
                  <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    width={800}
                    height={600}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="aspect-[4/3] w-full rounded-xl bg-bg object-contain"
                  />
                ))
              ) : (
                <p className="card text-muted">
                  صورة القطعة لم تُضف بعد. أرسل صورة قطعتك القديمة للمطابقة.
                </p>
              )}
              <dl className="card space-y-3">
                {[
                  ["الماركة", product.brand || "تُراجع مع بيانات الجهاز"],
                  ["كود القطعة", product.partCode || "غير موثّق بالموقع"],
                  ["التوفر", availabilityLabels[product.availability]],
                  [
                    "السعر",
                    product.price === null
                      ? "يُؤكد عند التواصل"
                      : `${product.price.toLocaleString("ar-EG")} جنيه مصري`,
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-bold">{label}</dt>
                    <dd className="text-muted break-words">{value}</dd>
                  </div>
                ))}
              </dl>
              <section className="card">
                <h2 className="font-bold">الموديلات المتوافقة</h2>
                {product.compatibleModels.length ? (
                  <ul className="mt-3 space-y-2">
                    {product.compatibleModels.map((model) => (
                      <li key={model} dir="auto">
                        {model}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-muted">
                    لا توجد قائمة توافق موثقة هنا. التأكيد بعد صورة ملصق الجهاز.
                  </p>
                )}
                <p className="mt-3 text-sm text-muted">
                  حتى مع وجود موديل بالقائمة، نراجع الملصق وإصدار الجهاز قبل الطلب.
                </p>
              </section>
              {product.notes ? <p className="callout">{product.notes}</p> : null}
            </section>
            <section className="card self-start">
              <h2 className="mb-4 text-xl font-bold">
                {product.availability === "unavailable"
                  ? "استفسر عن بديل متوافق"
                  : "تأكد من التوافق واطلب"}
              </h2>
              <InquiryForm
                intent="part"
                device={device}
                partName={product.nameAr}
                partCode={product.partCode}
                brand={product.brand}
              />
              <p className="mt-4 text-sm text-muted">{site.shippingNote}.</p>
            </section>
          </div>
          {related.length ? (
            <section>
              <h2 className="mb-4 text-2xl font-bold">قطع مرتبطة</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
