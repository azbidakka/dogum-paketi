import Image from "next/image";
import type { ImageContent } from "@/lib/content/schema";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/Reveal";

export default function EmotionalCTA({ image }: { image: ImageContent }) {
  return (
    <section aria-labelledby="yeni-baslangic" className="bg-cream py-20 lg:py-24">
      <div className="container-page">
        <div className="grid overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white lg:grid-cols-2">
          <div className="relative order-last min-h-[280px] bg-sand lg:order-first lg:min-h-[520px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <Reveal className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="section-label">Yeni bir başlangıç</p>
            <h2
              id="yeni-baslangic"
              className="mt-5 max-w-[20ch] font-semibold tracking-[-0.02em] text-[clamp(1.4rem,5.2vw,1.7rem)] leading-[1.3] lg:text-[1.95rem]"
            >
              Doğum yalnızca bir gün değil, aylar süren bir yolculuğun{" "}
              <span className="font-display text-green-700">en özel adımlarından biridir.</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-[0.9875rem] leading-relaxed text-text">
              Bu süreçte amaç; anne adayının kendini bilgilendirilmiş ve güvende hissetmesi,
              gebeliğin her aşamasının tıbbi gereklilikler doğrultusunda takip edilmesi ve doğum
              planının anne ile bebeğin sağlık durumuna göre şekillendirilmesidir.
            </p>
            <div className="mt-8">
              <CtaLink href="#iletisim" location="emotional_cta">
                Ekibimizden Bilgi Al
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
