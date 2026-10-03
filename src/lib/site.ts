import articlesJson from "../../content/articles.json";
import catalogJson from "../../content/catalog.json";
import siteJson from "../../content/site.json";

export type SiteConfig = {
  brandName: string;
  shortName: string;
  tagline: string;
  description: string;
  ownerName: string;
  ownerRole: string;
  BUSINESS_WHATSAPP: string;
  FACEBOOK_URL: string;
  YOUTUBE_URL: string;
  BUSINESS_EMAIL: string;
  GOOGLE_SITE_VERIFICATION: string;
  SITE_URL: string;
  serviceAreas: string[];
  shippingNote: string;
  modelRule: string;
  updated: string;
};

export type Service = {
  id: "washers" | "fridges" | "heaters" | "stoves";
  title: string;
  summary: string;
  faults: string[];
  caution: string;
};

export type PartGroup = {
  id: string;
  title: string;
  items: string[];
  note: string;
};

export type Step = { n: string; title: string; text: string };
export type Reason = { title: string; text: string };

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  summary: string;
  sections: ArticleSection[];
};

export const site = siteJson as SiteConfig;
export const services = catalogJson.services as Service[];
export const parts = catalogJson.parts as PartGroup[];
export const steps = catalogJson.steps as Step[];
export const reasons = catalogJson.reasons as Reason[];
export const articles = articlesJson as Article[];

export const ARTICLE_DISCLAIMER =
  "إرشاد للفهم الأولي فقط، ولا يغني عن فحص الجهاز. القطعة المناسبة تتحدد بعد صورة ملصق الموديل.";

export const NAV = [
  { to: "/maintenance", label: "الصيانة" },
  { to: "/parts", label: "قطع الغيار" },
  { to: "/guides", label: "الأعطال والنصائح" },
  { to: "/articles", label: "المقالات" },
  { to: "/about", label: "من نحن" },
  { to: "/areas", label: "مناطق الخدمة" },
] as const;

const DEVICES = ["غسالة", "ثلاجة", "سخان", "بوتاجاز", "أخرى"] as const;
const AREAS = ["القاهرة", "القليوبية", "شبرا الخيمة", "شحن خارج القاهرة"] as const;

export const contactDevices = DEVICES;
export const contactAreas = AREAS;

export const guideTips: Record<Service["id"], string[]> = {
  washers: [
    "افصل الكهرباء قبل الاقتراب من الفلتر أو الخرطوم.",
    "لاحظ هل المشكلة في الصرف أم في سحب المياه أم في توقف البرنامج.",
    "لا تفتح ظهر الغسالة ولا تفك الطلمبة.",
  ],
  fridges: [
    "تأكد من إحكام الباب ومسار الهواء داخل الكابينة.",
    "أبعد الجهاز قليلًا عن الحائط وعن مصادر الحرارة إن أمكن من غير مجهود خطر.",
    "لا تفك دائرة التبريد.",
  ],
  heaters: [
    "أي رائحة غاز أو شرر تعني الإيقاف والابتعاد، لا الفحص.",
    "لا تفتح غطاء السخان.",
    "لا تعيد التشغيل عدة مرات بعد فصل القاطع.",
  ],
  stoves: [
    "أغلق المحبس أو الأسطوانة عند رائحة الغاز إن كان ذلك آمنًا.",
    "لا تفك العين أو منظم الغاز.",
    "اترك الإشعال المتكرر إذا شمّيت غازًا.",
  ],
};

export const areaCopy = [
  {
    name: "القاهرة",
    text: "صيانة وقطع غيار داخل القاهرة بعد الاتفاق على نوع الجهاز وموعد الفحص أو استلام القطعة.",
  },
  {
    name: "القليوبية",
    text: "نفس الخدمة داخل القليوبية، مع تأكيد المنطقة عند التواصل حتى نعرف إمكانية الزيارة.",
  },
  {
    name: "شبرا الخيمة",
    text: "تغطية مباشرة ضمن نطاق الخدمة اليومي، للصيانة ولقِطَع الغيار.",
  },
] as const;

function safeHttps(raw: string, hosts: string[]): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    const host = url.hostname.replace(/^www\./, "");
    return hosts.includes(host) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function facebookUrl(): string | null {
  return safeHttps(site.FACEBOOK_URL, ["facebook.com", "fb.com", "m.facebook.com"]);
}

export function youtubeUrl(): string | null {
  return safeHttps(site.YOUTUBE_URL, ["youtube.com", "youtu.be", "m.youtube.com"]);
}

export function emailUrl(): string | null {
  const value = site.BUSINESS_EMAIL.trim();
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return `mailto:${value}`;
}

export function whatsappBase(): string | null {
  const raw = site.BUSINESS_WHATSAPP.trim();
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `20${digits.slice(1)}`;
  if (digits.length < 10 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

export function whatsappMessageLink(message: string): string | null {
  const base = whatsappBase();
  if (!base || !message.trim()) return null;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function siteOrigin(): string {
  const configured = site.SITE_URL.trim().replace(/\/$/, "");
  return configured || "https://galalparts.grok.me";
}

export function canonicalUrl(path: string): string {
  const origin = siteOrigin();
  if (!path || path === "/") return `${origin}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function findArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function relatedArticles(article: Article, limit = 3): Article[] {
  const same = articles.filter(
    (item) => item.slug !== article.slug && item.category === article.category,
  );
  const other = articles.filter(
    (item) => item.slug !== article.slug && item.category !== article.category,
  );
  return [...same, ...other].slice(0, limit);
}

export function publicPaths(): string[] {
  return [
    "/",
    "/maintenance",
    "/parts",
    "/guides",
    "/articles",
    "/about",
    "/areas",
    "/contact",
    "/privacy",
    ...articles.map((article) => `/articles/${article.slug}`),
  ];
}

export function pageMeta(title: string, description: string, path: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
    ],
    links: [{ rel: "canonical", href: canonicalUrl(path) }],
  };
}
