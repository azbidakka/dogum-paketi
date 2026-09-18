/**
 * Analytics köprüsü.
 *
 * Bu proje kendi analytics sistemini KURMAZ. Yalnızca sayfaya (ör. GTM konteyneri
 * üzerinden) halihazırda bir `dataLayer` veya `gtag` enjekte edilmişse olayı iletir;
 * yoksa sessizce hiçbir şey yapmaz.
 *
 * KVKK: buradan asla ad, telefon, e-posta veya sağlık bilgisi gönderilmez —
 * yalnızca olay adı ve tıklanan alanın etiketi gibi PII içermeyen parametreler.
 */
type TrackParams = Record<string, string | number | boolean>;

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export type TrackEvent =
  | "click_phone"
  | "click_contact_cta"
  | "view_doctor"
  | "submit_lead_form"
  | "lead_form_success";

export function track(event: TrackEvent, params: TrackParams = {}): void {
  if (typeof window === "undefined") return;

  const w = window as DataLayerWindow;

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...params });
    return;
  }

  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
}
