import Image from "next/image";
import { SITE } from "@/data/site";
import type { HeroContent, ImageContent } from "@/lib/content/schema";
import CtaLink from "@/components/CtaLink";
import PhoneLink from "@/components/PhoneLink";

export default function Hero({ hero, image }: { hero: HeroContent; image: ImageContent }) {
  return (
    <section id="top" className="relative overflow-hidden bg-cream pt-[var(--header-h)]">
      {/* Yumuşak zemin formu — dekoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-24 hidden size-[680px] rounded-full bg-sage/60 blur-3xl lg:block"
      />

      <div className="container-page relative py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="max-w-[36rem]">
            <p className="section-label">{hero.label}</p>

            <h1 className="mt-6 font-semibold tracking-[-0.02em] text-[clamp(1.7rem,7.4vw,2.2rem)] leading-[1.24] lg:text-[2.5rem] xl:text-[2.8rem]">
              {hero.title}
              {hero.accent ? (
                <>
                  {" "}
                  <span className="font-display text-green-700">{hero.accent}</span>
                </>
              ) : null}
            </h1>

            <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-text">{hero.lead}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CtaLink href="#iletisim" location="hero">
                {hero.primaryCta}
              </CtaLink>
              <CtaLink href="#hekimler" variant="secondary" location="hero">
                Hekimlerimizi İncele
              </CtaLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <PhoneLink location="hero" className="font-medium text-green-800" />
              <span className="flex items-center gap-2 text-muted">
                <PinIcon />
                {SITE.name} · {SITE.address.district}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-[20px] bg-sand sm:aspect-3/2 lg:aspect-4/5">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>

            {/* İnce çizgi + mini etiket: hero'yu kart yapmadan çerçeveler */}
            <div className="mt-4 flex items-center gap-4">
              <span aria-hidden="true" className="h-px flex-1 bg-[var(--border-soft)]" />
              <span className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
                Kadın Hastalıkları ve Doğum
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-[var(--border-soft)] sm:mt-16 md:grid-cols-3">
          {hero.highlights.map((item, index) => (
            <li key={`${index}-${item.title}`} className="bg-cream p-6 lg:p-7">
              <p className="font-display text-[1.05rem] leading-snug text-ink">{item.title}</p>
              <p className="mt-2 text-[0.9375rem] text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10.4" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
