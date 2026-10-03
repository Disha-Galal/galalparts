import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { channelEvent, eventNames, trackEvent, type EventName } from "@/lib/tracking";
import { products } from "@/lib/products";
import { services } from "@/lib/site";

export function Tracking() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const lastPath = useRef("");
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const service = services.find((s) => pathname === `/maintenance/${s.id}`);
    const product = products.find((p) => pathname === `/parts/${p.slug}`);
    if (service) trackEvent("service_page_view", service.id);
    if (product) trackEvent("product_view", product.slug);
  }, [pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element ? event.target.closest<HTMLElement>("a,button") : null;
      if (!target) return;
      const explicit = target.dataset.event as EventName | undefined;
      if (explicit && eventNames.includes(explicit)) trackEvent(explicit, target.dataset.item);
      const href = target.getAttribute("href");
      const channel = href ? channelEvent(href) : null;
      if (channel && channel !== explicit) trackEvent(channel);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
