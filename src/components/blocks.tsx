import { Link } from "@tanstack/react-router";
import {
  facebookUrl,
  site,
  whatsappBase,
  type Article,
} from "@/lib/site";

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-line">
      <div className="wrap py-10 md:py-14">
        <p className="text-sm font-semibold text-cyan">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-muted">{lede}</p>
      </div>
    </header>
  );
}

export function ModelCallout() {
  return (
    <aside className="callout">
      <p>
        {site.modelRule}. لا نعرض أسعارًا أو أكوادًا ثابتة قبل هذه الصورة.
      </p>
    </aside>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to="/articles/$slug"
      params={{ slug: article.slug }}
      className="card card-link"
    >
      <span className="text-xs font-semibold text-cyan">{article.categoryLabel}</span>
      <span className="text-lg font-bold">{article.title}</span>
      <span className="text-sm text-muted">{article.summary}</span>
    </Link>
  );
}

export function ContactActions({ align = "start" }: { align?: "start" | "center" }) {
  const facebook = facebookUrl();
  const whatsapp = whatsappBase();
  const centered = align === "center";
  return (
    <div className={`flex flex-col gap-3 ${centered ? "items-center" : "items-start"}`}>
      <div className={`flex flex-wrap gap-3 ${centered ? "justify-center" : "justify-start"}`}>
        {facebook ? (
          <a className="btn btn-primary" href={facebook} target="_blank" rel="noreferrer">
            راسلنا على فيسبوك
          </a>
        ) : (
          <Link to="/contact" className="btn btn-primary">
            طرق التواصل
          </Link>
        )}
        {whatsapp ? (
          <a className="btn btn-ghost" href={whatsapp} target="_blank" rel="noreferrer">
            واتساب الأعمال
          </a>
        ) : null}
        <Link to="/parts" className="btn btn-ghost">
          قطع الغيار
        </Link>
      </div>
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
