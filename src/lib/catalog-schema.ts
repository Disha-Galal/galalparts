import { z } from "zod";

export const categorySchema = z.enum(["washers", "fridges", "heaters", "stoves"]);
const photoSchema = z.object({
  src: z
    .string()
    .regex(/^\/(?!\/)[a-zA-Z0-9/_\-.]+\.(?:webp|png|jpe?g)$/i, "استخدم مسار صورة محلية"),
  alt: z.string().trim().min(1),
});
export const productSchema = z.object({
  nameAr: z.string().trim().min(1),
  nameEn: z.string().default(""),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: categorySchema,
  brand: z.string().default(""),
  partCode: z.string().default(""),
  compatibleModels: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().min(1),
  photos: z.array(photoSchema).default([]),
  availability: z.enum(["available", "on-request", "unavailable", "unknown"]).default("unknown"),
  price: z.number().positive().nullable().default(null),
  notes: z.string().default(""),
  relatedParts: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});
export const catalogSchema = z
  .object({ products: z.array(productSchema) })
  .superRefine((data, ctx) => {
    const slugs = new Set<string>();
    data.products.forEach((product, index) => {
      if (slugs.has(product.slug))
        ctx.addIssue({ code: "custom", path: ["products", index, "slug"], message: "slug مكرر" });
      slugs.add(product.slug);
    });
    data.products.forEach((product, index) => {
      for (const slug of product.relatedParts) {
        if (!slugs.has(slug) || slug === product.slug)
          ctx.addIssue({
            code: "custom",
            path: ["products", index, "relatedParts"],
            message: "رابط قطعة مرتبطة غير صحيح",
          });
      }
    });
  });
export type Product = z.infer<typeof productSchema>;
export const availabilityLabels: Record<Product["availability"], string> = {
  available: "متاح — التأكيد عند التواصل",
  "on-request": "حسب الطلب",
  unavailable: "غير متاح حاليًا",
  unknown: "التوفر يحتاج تأكيدًا",
};
export function normalizeSearch(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}
export function filterProducts(
  products: Product[],
  query: string,
  category = "",
  brand = "",
  availability = "",
): Product[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return products.filter(
    (p) =>
      p.published &&
      (!category || p.category === category) &&
      (!brand || p.brand === brand) &&
      (!availability || p.availability === availability) &&
      terms.every((term) =>
        normalizeSearch(
          [p.nameAr, p.nameEn, p.partCode, p.brand, p.description, ...p.compatibleModels].join(" "),
        ).includes(term),
      ),
  );
}
