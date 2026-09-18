"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

/**
 * Mobilde ekranın altında sabit aksiyon çubuğu.
 * - iPhone safe-area desteklenir (`env(safe-area-inset-bottom)`).
 * - İletişim bölümü ekrandayken gizlenir; formu kapatmaz.
 * - Sayfa altına ayrılan boşluk için bkz. `page.tsx` içindeki spacer.
 */
export default function MobileStickyCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("iletisim");
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setHidden(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-soft)] bg-white/95 backdrop-blur-md transition-transform duration-300 lg:hidden",
        hidden ? "translate-y-full" : "translate-y-0",
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-hidden={hidden}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <a
          href={SITE.phoneHref}
          onClick={() => track("click_phone", { location: "sticky_bar" })}
          tabIndex={hidden ? -1 : undefined}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] text-[0.9375rem] font-medium text-green-800"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 2.5h2.2l1.6 4-1.9 1.4a12.4 12.4 0 0 0 5.6 5.6l1.4-1.9 4 1.6v2.2a2.6 2.6 0 0 1-2.9 2.6C10.2 17.4 6.6 13.8 4 8.4A2.6 2.6 0 0 1 6.6 2.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Ara
        </a>
        <a
          href="#iletisim"
          onClick={() => track("click_contact_cta", { location: "sticky_bar" })}
          tabIndex={hidden ? -1 : undefined}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-green-700 text-[0.9375rem] font-medium text-white"
        >
          Bilgi Al
        </a>
      </div>
    </div>
  );
}
