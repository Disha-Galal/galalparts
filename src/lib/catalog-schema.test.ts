import test from "node:test";
import assert from "node:assert/strict";
import { catalogSchema, filterProducts, normalizeSearch, productSchema } from "./catalog-schema.ts";
import { buildInquiry } from "./inquiry.ts";
import { channelEvent, configureTracking, setTrackingConsent, trackEvent } from "./tracking.ts";

// Test fixtures live only in tests and are never customer content.
const fixture = productSchema.parse({
  nameAr: "قطعة اختبار",
  slug: "test-only",
  category: "washers",
  description: "بيانات اختبار",
  brand: "Test",
  partCode: "TEST-01",
  compatibleModels: ["TEST-MODEL"],
  published: true,
});
test("optional product information stays unknown; drafts do not enter search", () => {
  assert.equal(fixture.price, null);
  assert.equal(fixture.availability, "unknown");
  assert.equal(filterProducts([{ ...fixture, published: false }], "").length, 0);
});
test("search handles Arabic variants, models, codes and combined filters", () => {
  assert.equal(normalizeSearch("إِشعَال"), normalizeSearch("اشعال"));
  assert.equal(filterProducts([fixture], "test-model", "washers", "Test").length, 1);
  assert.equal(filterProducts([fixture], "TEST-01", "fridges").length, 0);
  assert.equal(filterProducts([fixture], "test", "", "", "unavailable").length, 0);
});
test("catalog rejects duplicate slugs, invalid prices, invalid photos and broken related links", () => {
  assert.equal(catalogSchema.safeParse({ products: [fixture, fixture] }).success, false);
  assert.equal(productSchema.safeParse({ ...fixture, price: -1 }).success, false);
  assert.equal(
    productSchema.safeParse({ ...fixture, photos: [{ src: "javascript:alert(1)", alt: "x" }] })
      .success,
    false,
  );
  assert.equal(
    catalogSchema.safeParse({ products: [{ ...fixture, relatedParts: ["missing"] }] }).success,
    false,
  );
});
test("maintenance message includes the selected appliance and supplied information", () => {
  const message = buildInquiry({
    intent: "maintenance",
    device: "ثلاجة",
    brand: "ماركة اختبار",
    model: "TEST",
    description: "ضعف تبريد",
    area: "شبرا الخيمة",
  });
  for (const value of [
    "أريد طلب صيانة",
    "نوع الجهاز: ثلاجة",
    "الماركة: ماركة اختبار",
    "الموديل إن وجد: TEST",
    "العطل: ضعف تبريد",
    "المنطقة: شبرا الخيمة",
  ])
    assert.ok(message.includes(value));
});
test("part inquiry requires model and old-part photos and compatibility confirmation", () => {
  const message = buildInquiry({
    intent: "part",
    device: "غسالة",
    description: "قطعة اختبار",
    partCode: "TEST-01",
  });
  for (const value of [
    "صورة واضحة لملصق",
    "صورة القطعة القديمة",
    "تأكيد التوافق",
    "كود القطعة: TEST-01",
  ])
    assert.ok(message.includes(value));
  assert.equal(decodeURIComponent(encodeURIComponent(message)), message);
});
test("channel detection does not treat a different host as an official channel", () => {
  assert.equal(channelEvent("https://wa.me/201129328230"), "whatsapp_click");
  assert.equal(channelEvent("tel:+201129328230"), "phone_click");
  assert.equal(channelEvent("https://www.facebook.com/Galal.Parts/"), "facebook_click");
  assert.equal(channelEvent("https://www.youtube.com/@GalalParts"), "youtube_click");
  assert.equal(channelEvent("https://wa.me.evil.test/"), null);
});
test("analytics runs only after consent and revocation stops transmission", () => {
  const original = globalThis.window;
  const target = new EventTarget();
  Object.assign(target, { location: { pathname: "/maintenance/washers" } });
  globalThis.window = target as unknown as Window & typeof globalThis;
  let calls = 0;
  try {
    configureTracking(() => {
      calls++;
    });
    trackEvent("service_page_view", "washers");
    assert.equal(calls, 0);
    setTrackingConsent(true);
    trackEvent("service_page_view", "washers");
    assert.equal(calls, 1);
    setTrackingConsent(false);
    trackEvent("whatsapp_click");
    assert.equal(calls, 1);
    setTrackingConsent(true);
    configureTracking(() => {
      throw new Error("adapter unavailable");
    });
    assert.doesNotThrow(() => trackEvent("whatsapp_click"));
  } finally {
    configureTracking(null);
    setTrackingConsent(false);
    globalThis.window = original;
  }
});
