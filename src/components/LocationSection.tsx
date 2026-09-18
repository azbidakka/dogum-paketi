"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE } from "@/data/site";
import type { ImageContent } from "@/lib/content/schema";
import PhoneLink from "@/components/PhoneLink";
import { track } from "@/lib/track";

/**
 * Konum: adres + hastane binası fotoğrafı. Harita üçüncü taraf olduğu için yalnızca
 * ziyaretçi "Haritayı Göster" dediğinde fotoğrafın yerine yüklenir.
 */
export default function LocationSection({ image }: { image: ImageContent }) {
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <section aria-labelledby="konum" className="bg-white py-20 lg:py-24">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="section-label">Konum</p>
            <h2
              id="konum"
              className="mt-5 font-semibold tracking-[-0.02em] text-[clamp(1.4rem,5.2vw,1.7rem)] leading-[1.3] lg:text-[1.95rem]"
            >
              {SITE.name}
            </h2>

            <address className="mt-6 text-[1.0625rem] leading-relaxed not-italic text-text">
              {SITE.address.street}
              <br />
              {SITE.address.district}
            </address>

            <div className="mt-6">
              <PhoneLink
                location="location_section"
                className="text-[1.0625rem] font-medium text-green-800"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={SITE.phoneHref}
                onClick={() => track("click_phone", { location: "location_buttons" })}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-green-700 px-7 text-[0.9375rem] font-medium text-white transition-colors hover:bg-green-900"
              >
                Ara
              </a>
              <a
                href={SITE.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] px-7 text-[0.9375rem] font-medium text-green-800 transition-colors hover:bg-green-050"
              >
                Yol Tarifi
                <span className="sr-only">(yeni sekmede açılır)</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 5h10v10M19 5 6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="relative aspect-8/7 w-full overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-sand">
            {mapVisible ? (
              <iframe
                title={`${SITE.name} konumu — harita`}
                src={SITE.mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full border-0"
              />
            ) : (
              <>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/45 p-6 text-center">
                  <p className="max-w-[34ch] text-[0.875rem] text-white/90">
                    Harita, üçüncü taraf bir hizmet üzerinden yüklenir. Görüntülemeyi seçmeniz
                    halinde ilgili sağlayıcının çerezleri kullanılabilir.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMapVisible(true)}
                    className="inline-flex min-h-[48px] items-center rounded-full bg-white px-6 text-[0.9375rem] font-medium text-green-900 transition-colors hover:bg-green-050"
                  >
                    Haritayı Göster
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
