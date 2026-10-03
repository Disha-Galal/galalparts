import { createFileRoute } from "@tanstack/react-router";
import { ArticleCard, PageHeader } from "@/components/blocks";
import { Shell } from "@/components/shell";
import { articles, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/articles/")({
  head: () =>
    pageMeta(
      "مقالات وإرشادات الصيانة | جلال",
      "مقالات جلال عن أعطال الغسالات والثلاجات والسخانات، وكيفية تصوير ملصق الموديل قبل طلب قطعة الغيار.",
      "/articles",
    ),
  component: ArticlesPage,
});

function ArticlesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="المقالات"
        title="إرشادات قصيرة"
        lede="إرشادات عملية للعميل. كل مقال يشرح ما يمكن فهمه بأمان، ويحيل التشخيص النهائي إلى مراجعة الموديل."
      />
      <div className="section">
        <div className="wrap grid gap-3 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </Shell>
  );
}
