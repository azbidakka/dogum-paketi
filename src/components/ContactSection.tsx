import { SITE } from "@/data/site";
import LeadForm from "@/components/LeadForm";
import PhoneLink from "@/components/PhoneLink";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";

export default function ContactSection() {
  return (
    <section id="iletisim" className="scroll-mt-24 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionIntro
              label="07 · İletişim"
              title="Gebelik ve doğum süreci hakkında"
              accent="bilgi almak ister misiniz?"
              titleClassName="max-w-[18ch]"
            >
              <p>
                Doğum paketi kapsamı, sigorta anlaşmaları, hekimlerimiz ve TUSA
                Hastanesi&rsquo;ndeki gebelik-doğum süreci hakkında bilgi almak için iletişim
                bilgilerinizi bırakabilirsiniz.
              </p>
            </SectionIntro>

            <Reveal delay={80} className="mt-10 rounded-[20px] border border-[var(--border-soft)] bg-white p-7 lg:p-8">
              <p className="text-xs font-medium tracking-[0.14em] text-green-700 uppercase">
                Telefonla ulaşın
              </p>
              <PhoneLink
                location="contact_section"
                className="mt-3 font-display text-[1.4rem] text-ink lg:text-[1.6rem]"
              />
              <div aria-hidden="true" className="my-6 h-px bg-[var(--border-soft)]" />
              <address className="text-[0.9375rem] not-italic text-muted">
                {SITE.name}
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.district}
              </address>
            </Reveal>
          </div>

          <Reveal delay={60}>
            <LeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
