import { readFileSync, existsSync } from "node:fs";
import { z } from "zod";
import { catalogSchema } from "../src/lib/catalog-schema.ts";
const read = (file: string) =>
  JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), "utf8"));
const catalog = catalogSchema.parse(read("products.json"));
for (const product of catalog.products)
  for (const photo of product.photos) {
    if (!existsSync(new URL(`../public${photo.src}`, import.meta.url)))
      throw new Error(`Missing product photo: ${photo.src}`);
  }
z.array(
  z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    categoryLabel: z.string().min(1),
    summary: z.string().min(1),
    sections: z
      .array(
        z.object({
          heading: z.string().min(1),
          paragraphs: z.array(z.string()),
          bullets: z.array(z.string()).optional(),
        }),
      )
      .min(1),
  }),
)
  .superRefine((items, context) => {
    if (new Set(items.map((item) => item.slug)).size !== items.length)
      context.addIssue({ code: "custom", message: "Duplicate article slug" });
  })
  .parse(read("articles.json"));
const credibility = z
  .object({
    workPhotos: z.array(
      z.object({
        src: z.string().regex(/^\/(?!\/)[\w/.-]+\.(webp|png|jpe?g)$/i),
        alt: z.string().min(1),
        caption: z.string().min(1),
        permissionGranted: z.boolean(),
      }),
    ),
    reviews: z.array(
      z.object({
        name: z.string().min(1),
        quote: z.string().min(1),
        permissionGranted: z.boolean(),
      }),
    ),
  })
  .parse(read("credibility.json"));
for (const photo of credibility.workPhotos)
  if (!existsSync(new URL(`../public${photo.src}`, import.meta.url)))
    throw new Error(`Missing work photo: ${photo.src}`);
const site = read("site.json");
if (site.SITE_URL !== "https://galalparts.netlify.app/")
  throw new Error("Canonical production URL must remain https://galalparts.netlify.app/");
if (!existsSync(new URL("../public/google7b77a1134d8b36f5.html", import.meta.url)))
  throw new Error("Google verification file is missing");
console.log(
  `Content validated: ${catalog.products.filter((p) => p.published).length} published products. No generated product inventory.`,
);
