import { Link } from "@tanstack/react-router";
import { availabilityLabels, type Product } from "@/lib/catalog-schema";
export function ProductCard({ product }: { product: Product }) {
  const photo = product.photos[0];
  return (
    <article className="card flex flex-col gap-3">
      {photo ? (
        <img
          src={photo.src}
          alt={photo.alt}
          width={640}
          height={480}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-lg object-contain bg-bg"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-line text-sm text-muted">
          صورة القطعة لم تُضف بعد
        </div>
      )}
      <h2 className="text-xl font-bold">
        <Link to="/parts/$slug" params={{ slug: product.slug }} className="hover:text-cyan">
          {product.nameAr}
        </Link>
      </h2>
      {product.brand ? <p className="text-sm text-muted">{product.brand}</p> : null}
      <p className="text-sm text-muted">{product.description}</p>
      <p className="text-sm text-cyan">{availabilityLabels[product.availability]}</p>
      {product.price !== null ? <p>{product.price.toLocaleString("ar-EG")} جنيه مصري</p> : null}
      <Link className="btn btn-ghost mt-auto" to="/parts/$slug" params={{ slug: product.slug }}>
        التفاصيل وتأكيد التوافق
      </Link>
    </article>
  );
}
