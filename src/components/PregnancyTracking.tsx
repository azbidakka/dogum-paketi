import Image from "next/image";
import type { ImageContent, PackageContent } from "@/lib/content/schema";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";
import TrimesterTabs from "@/components/TrimesterTabs";

/** Özet sayılar paket verisinden hesaplanır; panelde liste değişirse kendiliğinden güncellenir. */
function summarize(pkg: PackageContent) {
  const visits = pkg.trimesters.flatMap((trimester) => trimester.visits);
  const count = (matches: (name: string) => boolean) =>
    visits.reduce(
      (total, visit) =>
        total +
        visit.items
          .filter((item) => matches(item.name))
          .reduce((sum, item) => sum + (item.count ?? 1), 0),
      0
    );

  return [
    { value: String(visits.length), label: "planlı kontrol haftası" },
    { value: String(count((name) => /muayene/i.test(name))), label: "ultrason eşliğinde muayene" },
    { value: String(count((name) => /\bNST\b/.test(name))), label: "NST (fetal non-stres testi)" },
  ];
}

export default function PregnancyTracking({ pkg, image }: { pkg: PackageContent; image: ImageContent }) {
  const summary = summarize(pkg);

  return (
    <section id="gebelik-dogum" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div>
            <SectionIntro
              label="01 · Doğum Paketi"
              title={pkg.title}
              accent={pkg.accent}
              titleClassName="max-w-[22ch]"
            >
              <p>{pkg.intro}</p>
            </SectionIntro>

            <Reveal delay={60}>
              <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-[var(--border-soft)]">
                {summary.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse bg-white p-4 sm:p-5">
                    <dt className="mt-1 text-[0.8125rem] leading-snug text-muted">{item.label}</dt>
                    <dd className="font-display text-[1.6rem] leading-none text-green-800 sm:text-[1.9rem]">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-sand lg:aspect-4/3">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <Reveal className="mt-14 lg:mt-16">
          <TrimesterTabs trimesters={pkg.trimesters} />
        </Reveal>

        {/* Paket listesinin "DOĞUM" bölümü */}
        <Reveal className="mt-6 rounded-[20px] border border-[var(--border-soft)] bg-green-050 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-12">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-green-700 uppercase">Doğum</p>
              <h3 className="mt-3 font-display text-[clamp(1.25rem,4.4vw,1.45rem)] leading-[1.3] text-ink">
                Doğumda pakete dahil olanlar
              </h3>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--border-soft)] sm:grid-cols-2">
              {pkg.birth.map((item, index) => (
                <li key={`${index}-${item.title}`} className="flex items-start gap-3 bg-white p-5 lg:p-6">
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
                  <div>
                    <p className="text-[1rem] font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-[0.9rem] leading-relaxed text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="mt-6 max-w-[84ch] text-[0.8125rem] leading-relaxed text-muted">{pkg.footnote}</p>
      </div>
    </section>
  );
}
