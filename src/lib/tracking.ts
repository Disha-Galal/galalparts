export const eventNames = [
  "spare_part_cta_click",
  "maintenance_cta_click",
  "spare_part_inquiry_click",
  "whatsapp_click",
  "phone_click",
  "product_view",
  "service_page_view",
  "facebook_click",
  "youtube_click",
] as const;
export type EventName = (typeof eventNames)[number];
export type BusinessEvent = { name: EventName; path: string; item?: string };
type Sink = (event: BusinessEvent) => void;
let sink: Sink | null = null;
let consent = false;

// Adapter is deliberately inactive until both an adapter AND consent are supplied.
// No cookies, visitor IDs, localStorage, network requests, or replay of past events.
export function configureTracking(adapter: Sink | null) {
  sink = adapter;
}
export function setTrackingConsent(granted: boolean) {
  consent = granted;
}
export function trackEvent(name: EventName, item?: string): void {
  if (typeof window === "undefined") return;
  const event: BusinessEvent = { name, path: window.location.pathname, ...(item ? { item } : {}) };
  window.dispatchEvent(new CustomEvent("galalparts:event", { detail: event }));
  if (consent && sink) {
    try {
      sink(event);
    } catch {
      /* Analytics must never block an inquiry. */
    }
  }
}
export function channelEvent(href: string): EventName | null {
  try {
    const url = new URL(href);
    if (url.protocol === "tel:") return "phone_click";
    if (url.hostname === "wa.me") return "whatsapp_click";
    if (url.hostname === "www.facebook.com") return "facebook_click";
    if (url.hostname === "www.youtube.com") return "youtube_click";
  } catch {
    /* Internal links aren't outbound channels. */
  }
  return null;
}
