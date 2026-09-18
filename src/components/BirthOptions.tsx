import { BIRTH_OPTIONS } from "@/data/content";
import { MEDICAL_DISCLAIMER } from "@/data/site";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";

export default function BirthOptions() {
  return (
    <section id="dogum-secenekleri" className="scroll-mt-24 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <SectionIntro
          label="02 · Doğum Planlaması"
          title="Doğum şekli, anne ve bebeğin sağlık durumu"
          accent="birlikte değerlendirilerek belirlenir."
          titleClassName="max-w-[26ch]"
        />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {BIRTH_OPTIONS.map((option, index) => (
            <Reveal
              key={option.title}
              as="article"
              delay={index * 90}
              className="flex flex-col rounded-[20px] border border-[var(--border-soft)] bg-white p-8 lg:p-10"
            >
              <h3 className="font-display text-[1.3rem] leading-snug text-ink lg:text-[1.45rem]">
                {option.title}
              </h3>
              <span aria-hidden="true" className="mt-6 h-px w-16 bg-[var(--border-soft)]" />
              <p className="mt-6 flex-1 text-[0.9875rem] leading-relaxed text-text">{option.text}</p>
              <p className="mt-7 rounded-2xl bg-green-050 p-5 text-[0.875rem] leading-relaxed text-green-900">
                {option.note}
              </p>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[62ch] text-[0.8125rem] text-muted">{MEDICAL_DISCLAIMER}</p>
      </div>
    </section>
  );
}
