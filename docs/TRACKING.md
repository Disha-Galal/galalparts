# Conversion events

`src/lib/tracking.ts` defines a provider-neutral, consent-gated adapter.
`src/components/tracking.tsx` emits page-view events only on actual route visits,
and listens to anchor/button activation for outbound and explicit CTA events.
Preloading routes does not count as a view. SPA navigation is supported.

Events: `spare_part_cta_click` (catalog navigation, separate from an inquiry), `maintenance_cta_click`, `spare_part_inquiry_click`, `whatsapp_click`,
`phone_click`, `product_view`, `service_page_view`, `facebook_click`, `youtube_click`.
A part inquiry may emit both its intent event and `whatsapp_click`.

Payload: `name`, pathname only (`path`), optional static service/product identifier
or CTA context (`item`). Names, fault descriptions, form values, WhatsApp text,
query strings, user IDs, and precise addresses are not collected.
No remote requests, cookies, storage, third-party SDKs, or event queue by default.
Local QA can listen to `window`'s `galalparts:event` CustomEvent.

After the owner provides the GA4 Measurement ID or Meta Dataset/Pixel ID and
approves the consent behavior, implement a client adapter using:

```ts
import { configureTracking, setTrackingConsent } from "@/lib/tracking";

// Configure your vetted adapter. It receives no historic events.
configureTracking((event) => {
  // Forward the sanitized event to the configured provider here.
});
// Only called by a real consent decision; never default this to true.
setTrackingConsent(true);
// Revocation immediately stops forwarding.
setTrackingConsent(false);
```

Do not load analytics SDKs before consent. External account setup and adapter
activation are deliberately not included in this phase. An adapter failure is
caught so that customers can still contact the business.
