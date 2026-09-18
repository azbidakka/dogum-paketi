import Image from "next/image";
import { ROOM_FEATURES } from "@/data/content";
import { GALLERY, SITE } from "@/data/site";
import Reveal from "@/components/Reveal";

/**
 * Oda donanımı + hastane ortamı galerisi.
 * Görseller TUSA Hastanesi resmi galerisinden; donanım listesi Yatan Hasta Rehberi'nden.
 */
export default function HospitalGallery() {
  const [feature, ...rest] = GALLERY;

  return (
    <div className="mt-16 lg:mt-20">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
        <Reveal>
          <p className="section-label">Odalar</p>
          <h3 className="mt-4 max-w-[20ch] font-display text-[clamp(1.25rem,4.4vw,1.45rem)] leading-[1.3] text-ink">
            Doğum sonrası kalınan odalar
          </h3>
          <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-text">
            Odaya yerleştiğinizde servis ekibi odanın ve donanımının tanıtımını yapar. Hasta
            odalarında şunlar bulunur:
          </p>

          <ul className="mt-6 space-y-3">
            {ROOM_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-text">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-green-700"
                >
                  <path
                    d="m5 12.5 4.2 4.2L19 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-[52ch] text-[0.8125rem] leading-relaxed text-muted">
            Kaynak:{" "}
            <a
              href={SITE.inpatientGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-green-700"
            >
              Yatan Hasta Rehberi
            </a>
            . Oda tipi ve hastanede kalış süresi; doğum şekline, anne ve bebeğin klinik durumuna
            ve o dönemdeki oda uygunluğuna göre belirlenir.
          </p>
        </Reveal>

        {feature ? (
          <Reveal delay={80}>
            <figure className="overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white">
              <div className="relative aspect-4/3 w-full bg-sand">
                <Image
                  src={feature.src}
                  alt={feature.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-5 py-4 text-[0.9375rem] font-medium text-ink">
                {feature.title}
              </figcaption>
            </figure>
          </Reveal>
        ) : null}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-8 lg:gap-6">
        {rest.map((item, index) => (
          <li key={item.src}>
            <Reveal delay={(index % 3) * 70}>
              <figure className="overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white">
                <div className="relative aspect-4/3 w-full bg-sand">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 640px) 30vw, 46vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-[0.875rem] font-medium text-ink sm:px-5 sm:py-4 sm:text-[0.9375rem]">
                  {item.title}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.8125rem] text-muted">
          Görseller TUSA Hastanesi resmi galerisinden alınmıştır.
        </p>
        <a
          href={SITE.galleryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 text-[0.9375rem] font-medium text-green-800 underline underline-offset-4 hover:text-green-700"
        >
          Tüm galeriyi görün
          <span className="sr-only">(tusahastanesi.com, yeni sekmede açılır)</span>
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
  );
}
