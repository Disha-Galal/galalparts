import { z } from "zod";
import content from "../../content/credibility.json";
const realContent = z
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
  .parse(content);
export function RealWork() {
  const photos = realContent.workPhotos.filter((p) => p.permissionGranted);
  const reviews = realContent.reviews.filter((r) => r.permissionGranted);
  if (!photos.length && !reviews.length) return null;
  return (
    <section className="section border-t border-line">
      <div className="wrap space-y-6">
        {photos.length ? (
          <div>
            <h2 className="mb-4 text-2xl font-bold">من أعمال جلال</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((p) => (
                <figure key={p.src} className="card">
                  <img
                    src={p.src}
                    alt={p.alt}
                    width={640}
                    height={480}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                  <figcaption className="mt-3 text-sm text-muted">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
        {reviews.length ? (
          <div>
            <h2 className="mb-4 text-2xl font-bold">كلام عملائنا</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r) => (
                <figure key={`${r.name}-${r.quote}`} className="card">
                  <blockquote>{r.quote}</blockquote>
                  <figcaption className="mt-3 text-sm text-cyan">{r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
