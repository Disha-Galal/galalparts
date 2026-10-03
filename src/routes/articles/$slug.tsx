import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArticleCard } from "@/components/blocks";
import { Shell } from "@/components/shell";
import {
  ARTICLE_DISCLAIMER,
  canonicalUrl,
  findArticle,
  pageMeta,
  relatedArticles,
  site,
} from "@/lib/site";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const article = findArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData ? `${loaderData.article.title} | جلال` : "مقال | جلال",
      loaderData?.article.description ?? site.description,
      loaderData ? `/articles/${loaderData.article.slug}` : "/articles",
    ),
  notFoundComponent: ArticleMissing,
  component: ArticlePage,
});

function ArticleMissing() {
  return (
    <Shell>
      <section className="section">
        <div className="wrap">
          <h1 className="text-3xl font-bold">المقال غير موجود</h1>
          <Link to="/articles" className="btn btn-primary mt-5">
            كل المقالات
          </Link>
        </div>
      </section>
    </Shell>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = relatedArticles(article);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    inLanguage: "ar",
    mainEntityOfPage: canonicalUrl(`/articles/${article.slug}`),
    author: { "@type": "Person", name: site.ownerName },
    publisher: { "@type": "Organization", name: site.brandName },
  };
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <article className="section">
        <div className="wrap max-w-3xl">
          <p className="text-sm font-semibold text-cyan">{article.categoryLabel}</p>
          <h1 className="mt-2 text-3xl font-bold">{article.title}</h1>
          <p className="mt-3 text-muted">{article.summary}</p>
          <div className="mt-8 space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-muted">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-3 list-disc space-y-2 pe-5 text-muted">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <p className="callout mt-8 text-sm">{ARTICLE_DISCLAIMER}</p>
          <p className="mt-4 text-sm">
            <Link to="/contact" className="font-bold text-cyan">
              ابعت صورة الموديل ووصف العطل
            </Link>
          </p>
        </div>
      </article>
      <section className="section border-t border-line">
        <div className="wrap">
          <h2 className="text-xl font-bold">مقالات قريبة</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
