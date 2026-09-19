import { SITE } from "@/data/site";
import HospitalGallery from "@/components/HospitalGallery";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";
import type { GalleryItem, RoomsContent } from "@/lib/content/schema";

export default function RoomsSection({
  rooms,
  gallery,
}: {
  rooms: RoomsContent;
  gallery: GalleryItem[];
}) {
  return (
    <section id="hastane" className="scroll-mt-24 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          <SectionIntro
            label="05 · Odalar & Hastane"
            title={rooms.title}
            accent={rooms.accent}
            titleClassName="max-w-[20ch]"
          >
            <p>{rooms.intro}</p>
          </SectionIntro>

          {rooms.facts.length > 0 ? (
          <Reveal delay={60}>
            {/* Spesifikasyon satırları: uzun değerler ("SGK · ÖSS · TSS") kırılmadan sığar */}
            <dl className="space-y-px overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-[var(--border-soft)]">
              {rooms.facts.map((fact, index) => (
                <div
                  key={`${fact.label}-${index}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 bg-white px-6 py-5"
                >
                  <dt className="text-[0.9375rem] text-muted">{fact.label}</dt>
                  <dd className="font-display text-[1.3rem] leading-tight whitespace-nowrap text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.8125rem] text-muted">
              Kaynak:{" "}
              <a
                href={SITE.aboutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-green-700"
              >
                tusahastanesi.com — Hakkımızda
              </a>
            </p>
          </Reveal>
          ) : null}
        </div>

        <HospitalGallery rooms={rooms} items={gallery} />
      </div>
    </section>
  );
}
