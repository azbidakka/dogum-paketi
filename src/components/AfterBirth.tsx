import { CARE_BABY, CARE_MOTHER } from "@/data/content";
import { MEDICAL_DISCLAIMER, SITE } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";

export default function AfterBirth() {
  return (
    <section id="surec" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionIntro
          label="03 · Doğum ve Sonrası"
          title="Doğumdan taburculuğa kadar anne ve bebek"
          accent="birlikte takip edilir."
          titleClassName="max-w-[24ch]"
        >
          <p>
            Doğum süreci TUSA Hastanesi&rsquo;nin ilgili klinik ve ameliyathane koşullarında,
            gerekli sağlık ekibinin takibiyle yürütülür. Doğumdan sonra anne ve yenidoğanın ilk
            değerlendirmeleri yapılır; hastanede kalış ve kontrol planı klinik duruma göre
            belirlenir.
          </p>
        </SectionIntro>

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {[CARE_MOTHER, CARE_BABY].map((group, groupIndex) => (
            <Reveal
              key={group.title}
              as="article"
              delay={groupIndex * 90}
              className="rounded-[20px] border border-[var(--border-soft)] bg-cream p-8 lg:p-10"
            >
              <h3 className="font-display text-[1.3rem] leading-snug text-ink lg:text-[1.45rem]">
                {group.title}
              </h3>
              <span aria-hidden="true" className="mt-6 block h-px w-16 bg-[var(--border-soft)]" />
              <ul className="mt-7 space-y-6">
                {group.items.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] size-2 shrink-0 rounded-full bg-green-700/70"
                    />
                    <div>
                      <p className="text-[1rem] font-semibold text-ink">{item.title}</p>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">
                        {item.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[80ch] text-[0.8125rem] leading-relaxed text-muted">
          Kaynak: TUSA Hastanesi{" "}
          <a
            href={SITE.inpatientGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-green-700"
          >
            Yatan Hasta Rehberi
          </a>{" "}
          ve{" "}
          <a
            href={SITE.pediatricsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-green-700"
          >
            Çocuk Sağlığı ve Hastalıkları
          </a>{" "}
          kliniği. {MEDICAL_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
