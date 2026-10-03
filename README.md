# جلال لصيانة وبيع قطع غيار الأجهزة المنزلية

المصدر القابل للتعديل لموقع [galalparts.netlify.app](https://galalparts.netlify.app/).

النسخة المنشورة السابقة (ملفات HTML والبناء فقط) محفوظة على الوسم `published-baseline` حتى يمكن الرجوع إليها.

## تشغيل المشروع

```bash
npm ci
npm run dev
```

التطوير يستمع على المنفذ `8080`.

```bash
npm run typecheck
npm run build
```

## أين تُعدَّل البيانات

- [`content/site.json`](content/site.json): الاسم، الروابط، رقم واتساب، البريد، رابط الموقع، ورمز تحقق Google Search Console.
- [`content/catalog.json`](content/catalog.json): خدمات الصيانة وقطع الغيار وخطوات العمل.
- [`content/articles.json`](content/articles.json): المقالات.
- [`content/products.json`](content/products.json): المنتجات الحقيقية المنشورة والمسودات.
- [`content/credibility.json`](content/credibility.json): صور الأعمال وآراء العملاء بإذن نشر.

دليل المالك: [`docs/OWNER_GUIDE_AR.md`](docs/OWNER_GUIDE_AR.md).
طبقة القياس: [`docs/TRACKING.md`](docs/TRACKING.md).

فرع الإنتاج: `netlify-deploy`؛ فرع `main` محفوظ كنسخة سابقة.

حقول التواصل في `site.json`:

| الحقل                      | الاستخدام                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| `FACEBOOK_URL`             | يظهر زر فيسبوك في التذييل وصفحة اتصل بنا وأزرار الدعوة                                      |
| `YOUTUBE_URL`              | يظهر في التذييل وصفحة اتصل بنا                                                              |
| `BUSINESS_WHATSAPP`        | رقم فقط. يتحول إلى رابط `https://wa.me/…` مع نص الرسالة. اتركه فارغًا إذا لم يُضف الرقم بعد |
| `BUSINESS_EMAIL`           | بريد اختياري                                                                                |
| `GOOGLE_SITE_VERIFICATION` | رمز تحقق Search Console. فارغ حتى يُضاف الرمز، ويُطبع في وسم meta عند وجوده                 |
| `SITE_URL`                 | الرابط الأساسي للصفحات القانونية و`sitemap.xml` و`robots.txt`                               |

لا تُضاف أسعار أو تقييمات أو عنوان سكن من غير بيانات حقيقية.

## الصفحات

الرئيسية، الصيانة، قطع الغيار، الأعطال والنصائح، المقالات، من نحن، مناطق الخدمة، اتصل بنا، سياسة الخصوصية، و`/sitemap.xml` و`/robots.txt`.
