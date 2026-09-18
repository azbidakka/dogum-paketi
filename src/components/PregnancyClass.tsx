import Image from "next/image";
import type { ImageContent, SchoolContent } from "@/lib/content/schema";
import CtaLink from "@/components/CtaLink";
import Reveal from "@/components/Reveal";

export default function PregnancyClass({ school, image }: { school: SchoolContent; image: ImageContent }) {
  return (
    <section aria-labelledby="gebe-okulu" className="bg-white py-16 lg:py-20">
      <div className="container-page">
        <div className="grid items-center gap-8 rounded-[20px] border border-[var(--border-soft)] bg-green-050 p-8 sm:p-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:p-12">
          <Reveal>
            <p className="section-label">Gebe Okulu</p>
            <h2
              id="gebe-okulu"
              className="mt-5 max-w-[22ch] font-semibold tracking-[-0.02em] text-[clamp(1.35rem,5vw,1.6rem)] leading-[1.3] lg:text-[1.8rem]"
            >
              Doğuma hazırlanırken bilgi, sürecin{" "}
              <span className="font-display text-green-700">önemli bir parçasıdır.</span>
            </h2>
            <p className="mt-6 max-w-[56ch] text-[0.9875rem] leading-relaxed text-text">{school.intro}</p>

            {school.topics.length > 0 ? (
              <ul className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {school.topics.map((topic, index) => (
                  <li key={`${index}-${topic.title}`} className="border-l-2 border-green-200 pl-4">
                    <p className="text-[0.9375rem] font-medium text-ink">{topic.title}</p>
                    <p className="mt-0.5 text-[0.8125rem] text-muted">{topic.by}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8">
              <CtaLink href="#iletisim" location="gebe_okulu">
                Güncel Bilgi Al
              </CtaLink>
            </div>
          </Reveal>

          <Reveal
            delay={80}
            className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-sand lg:aspect-4/5"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
