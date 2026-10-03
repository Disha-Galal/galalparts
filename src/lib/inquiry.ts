export type Inquiry = {
  intent: "maintenance" | "part";
  device: string;
  brand?: string;
  model?: string;
  description?: string;
  area?: string;
  name?: string;
  partCode?: string;
};
export function buildInquiry(data: Inquiry): string {
  return [
    data.intent === "maintenance" ? "أريد طلب صيانة" : "أريد التأكد من توافق قطعة غيار وطلبها",
    data.name?.trim() ? `الاسم: ${data.name.trim()}` : "",
    `نوع الجهاز: ${data.device.trim()}`,
    `الماركة: ${data.brand?.trim() || "غير محددة"}`,
    `الموديل إن وجد: ${data.model?.trim() || "سأرسل صورة الملصق"}`,
    data.intent === "maintenance"
      ? `العطل: ${data.description?.trim() || "سأوضح العطل"}`
      : `القطعة المطلوبة: ${data.description?.trim() || "أحتاج مساعدة في تحديد القطعة"}`,
    data.partCode?.trim() ? `كود القطعة: ${data.partCode.trim()}` : "",
    `المنطقة: ${data.area?.trim() || "سأحدد المنطقة عند التواصل"}`,
    "سأرفق صورة واضحة لملصق الموديل/بيانات الجهاز من واتساب.",
    data.intent === "part"
      ? "سأرفق صورة القطعة القديمة إن توفرت. يرجى تأكيد التوافق والتوفر والسعر والشحن قبل الطلب."
      : "يرجى تأكيد إمكانية الزيارة والموعد بعد مراجعة الحالة.",
  ]
    .filter(Boolean)
    .join("\n");
}
