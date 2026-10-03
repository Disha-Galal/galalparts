import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { resolve, extname } from "node:path";
import { chromium } from "playwright";

const remote = process.env.GALAL_TEST_URL;
let server;
let browser;
const site = JSON.parse(readFileSync("content/site.json", "utf8"));
const articles = JSON.parse(readFileSync("content/articles.json", "utf8"));
const catalog = JSON.parse(readFileSync("content/products.json", "utf8"));
const products = catalog.products.filter((p) => p.published);
const allPaths = [
  "/",
  "/maintenance",
  "/parts",
  "/guides",
  "/articles",
  "/about",
  "/areas",
  "/contact",
  "/privacy",
  ...["washers", "fridges", "heaters", "stoves"].map((id) => `/maintenance/${id}`),
  ...articles.map((a) => `/articles/${a.slug}`),
  ...products.map((p) => `/parts/${p.slug}`),
];
const paths =
  process.env.GALAL_FIXTURE_ONLY === "1"
    ? ["/", "/parts", ...products.map((p) => `/parts/${p.slug}`)]
    : allPaths;
const assets = new Set();
const report = {
  pages: [],
  responsive: [],
  consoleErrors: [],
  externalResourceFailures: [],
  links: 0,
  messages: false,
  tracking: false,
};
const mime = {
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".html": "text/html",
  ".webmanifest": "application/manifest+json",
};
try {
  let base = remote;
  if (!base) {
    const entry = (await import("../dist/server/server.js")).default;
    const root = resolve("dist/client");
    server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://localhost");
        const file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
        if (file.startsWith(`${root}/`) && existsSync(file) && statSync(file).isFile()) {
          res.setHeader("content-type", mime[extname(file)] ?? "application/octet-stream");
          res.end(readFileSync(file));
          return;
        }
        const result = await entry.fetch(
          new Request(`http://${req.headers.host}${req.url}`, { headers: req.headers }),
        );
        res.statusCode = result.status;
        for (const [key, value] of result.headers) res.setHeader(key, value);
        res.end(Buffer.from(await result.arrayBuffer()));
      } catch (error) {
        res.statusCode = 500;
        res.end(String(error));
      }
    });
    await new Promise((done) => server.listen(0, "127.0.0.1", done));
    base = `http://127.0.0.1:${server.address().port}`;
  }
  base = base.replace(/\/$/, "");
  for (const path of paths) {
    const r = await fetch(`${base}${path}`);
    const html = await r.text();
    assert.equal(r.status, 200, path);
    assert.ok(!/noindex/i.test(r.headers.get("x-robots-tag") ?? ""), path);
    assert.ok(
      html.includes(`href="${site.SITE_URL.replace(/\/$/, "")}${path === "/" ? "/" : path}"`),
      `${path} canonical`,
    );
    assert.ok(html.includes('property="og:title"'), `${path} OG`);
    assert.ok(html.includes('name="description"'), `${path} description`);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g))
      assets.add(href.replace(/&amp;/g, "&"));
    report.pages.push({ path, status: r.status });
  }
  for (const href of assets) {
    const r = await fetch(base + href);
    assert.equal(r.status, 200, `broken internal link/asset ${href}`);
    report.links++;
  }
  for (const path of [
    "/not-a-real-page",
    "/maintenance/missing",
    "/parts/missing",
    "/articles/missing",
  ])
    assert.equal((await fetch(base + path)).status, 404, path);
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  for (const path of paths)
    assert.ok(
      sitemap.includes(
        `<loc>${site.SITE_URL.replace(/\/$/, "")}${path === "/" ? "/" : path}</loc>`,
      ),
      `sitemap ${path}`,
    );
  assert.ok(!sitemap.includes("grok.me"));
  assert.ok(
    (await (await fetch(base + "/robots.txt")).text()).includes(`${site.SITE_URL}sitemap.xml`),
  );
  assert.equal(
    (await (await fetch(base + "/google7b77a1134d8b36f5.html")).text()).trim(),
    "google-site-verification: google7b77a1134d8b36f5.html",
  );
  const manifestR = await fetch(base + "/__grok/manifest.webmanifest");
  assert.equal(manifestR.status, 200);
  assert.equal((await manifestR.json()).lang, "ar");
  if (process.env.GALAL_HTTP_ONLY === "1") {
    console.log(JSON.stringify(report, null, 2));
  } else {
    browser = await chromium.launch({
      executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    const context = await browser.newContext();
    await context.addInitScript(() => {
      window.__galalEvents = [];
      window.addEventListener("galalparts:event", (event) =>
        window.__galalEvents.push(event.detail),
      );
      document.addEventListener(
        "click",
        (event) => {
          const a = event.target.closest?.("a");
          if (a?.href.startsWith("https://wa.me")) event.preventDefault();
        },
        true,
      );
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => report.consoleErrors.push(error.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().includes("net::ERR_"))
        report.consoleErrors.push(m.text());
    });
    page.on("requestfailed", (req) => {
      if (/fonts\.google/.test(req.url())) report.externalResourceFailures.push(req.url());
      else if (!req.failure()?.errorText.includes("ABORTED"))
        report.consoleErrors.push(`${req.url()}: ${req.failure()?.errorText}`);
    });
    mkdirSync("artifacts", { recursive: true });
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(base + path, { waitUntil: "networkidle" });
        assert.equal(await page.locator("h1").count(), 1, `${path} heading`);
        assert.ok(
          !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)),
          `${path} overflows at ${width}`,
        );
        report.responsive.push({ path, width, overflow: false });
      }
      await page.goto(base + "/", { waitUntil: "networkidle" });
      await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true });
    }
    if (process.env.GALAL_FIXTURE_ONLY === "1") {
      await page.goto(base + "/parts", { waitUntil: "networkidle" });
      await page.getByRole("search").getByLabel("الماركة").selectOption("QA TEST ONLY");
      assert.equal(await page.getByRole("article").count(), 2);
      assert.equal(await page.getByText("QA DRAFT", { exact: true }).count(), 0);
      await page.getByRole("link", { name: "QA PRODUCT ONE", exact: true }).click();
      assert.ok(page.url().endsWith("/parts/qa-test-one"));
      await page
        .getByRole("heading", { name: "QA PRODUCT ONE", exact: true })
        .waitFor({ state: "visible" });
      assert.ok((await page.locator("main").innerText()).includes("TEST-MODEL"));
      assert.equal(await page.getByRole("img", { name: "QA ONLY" }).count(), 1);
      assert.equal(
        await page.getByRole("link", { name: "QA PRODUCT TWO", exact: true }).count(),
        1,
      );
      assert.ok(
        (await page.evaluate(() => window.__galalEvents)).some(
          (e) => e.name === "product_view" && e.item === "qa-test-one",
        ),
      );
      assert.equal((await fetch(base + "/parts/qa-draft")).status, 404);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "فتح القائمة" }).click();
    assert.equal(
      await page.getByRole("button", { name: "إغلاق القائمة" }).getAttribute("aria-expanded"),
      "true",
    );
    await page.locator("#mobile-nav").getByRole("link", { name: "الصيانة", exact: true }).click();
    await page.getByRole("link", { name: "اطلب صيانة غسالات", exact: true }).click();
    assert.ok(page.url().endsWith("/maintenance/washers"));
    await page.getByLabel("الماركة إن عُرفت").fill("ماركة اختبار");
    await page.getByLabel("الموديل إن وجد").fill("TEST MODEL");
    await page.getByLabel("المنطقة", { exact: true }).fill("شبرا الخيمة");
    await page.getByLabel("وصف العطل").fill("لا تصرف مياه");
    const wa = page.getByRole("link", { name: "جهّز طلب الصيانة على واتساب" });
    const url = new URL(await wa.getAttribute("href"));
    assert.equal(url.pathname, "/201129328230");
    for (const text of [
      "أريد طلب صيانة",
      "غسالة",
      "ماركة اختبار",
      "TEST MODEL",
      "شبرا الخيمة",
      "لا تصرف مياه",
    ])
      assert.ok(url.searchParams.get("text").includes(text));
    await wa.click();
    assert.ok((await page.getByLabel("الرسالة الجاهزة").inputValue()).includes("لا تصرف مياه"));
    await page.getByLabel("وصف العطل").fill("لا تعصر");
    assert.equal(await page.getByLabel("الرسالة الجاهزة").count(), 0, "stale message cleared");
    await page.goto(base + "/parts", { waitUntil: "networkidle" });
    await page.getByRole("search").getByLabel("نوع الجهاز").selectOption("washers");
    await page.getByRole("search").getByLabel("ابحث عن قطعة").fill("طلمبة");
    await page.getByRole("link", { name: "طلمبة صرف استفسر", exact: true }).click();
    assert.equal(await page.getByLabel("القطعة المطلوبة").inputValue(), "طلمبة صرف");
    const partUrl = new URL(
      await page
        .getByRole("link", { name: "تأكد من التوافق واطلب", exact: true })
        .getAttribute("href"),
    );
    for (const text of [
      "تأكيد التوافق",
      "صورة القطعة القديمة",
      "صورة واضحة لملصق",
      "طلمبة صرف",
      "غسالة",
    ])
      assert.ok(partUrl.searchParams.get("text").includes(text));
    await page.getByRole("link", { name: "تأكد من التوافق واطلب", exact: true }).click();
    await page.screenshot({ path: "artifacts/part-inquiry-mobile.png", fullPage: true });
    const events = await page.evaluate(() => window.__galalEvents);
    assert.ok(events.some((e) => e.name === "spare_part_inquiry_click"));
    assert.ok(events.some((e) => e.name === "whatsapp_click"));
    assert.ok(!JSON.stringify(events).includes("طلمبة صرف"), "no form data in tracking");
    report.messages = true;
    report.tracking = true;
    assert.deepEqual(report.consoleErrors, []);
    console.log(
      JSON.stringify(
        { ...report, externalResourceFailures: [...new Set(report.externalResourceFailures)] },
        null,
        2,
      ),
    );
  }
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((done) => server.close(done));
}
