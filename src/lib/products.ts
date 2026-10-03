import catalog from "../../content/products.json";
import { catalogSchema, type Product } from "./catalog-schema";

// Invalid owner content fails the build instead of silently publishing wrong data.
export const allProducts = catalogSchema.parse(catalog).products;
export const products = allProducts.filter((product) => product.published);
export function findProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
export function relatedProducts(product: Product): Product[] {
  const explicit = products.filter(
    (p) => product.relatedParts.includes(p.slug) && p.slug !== product.slug,
  );
  const others = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug && !explicit.includes(p),
  );
  return [...explicit, ...others].slice(0, 3);
}
