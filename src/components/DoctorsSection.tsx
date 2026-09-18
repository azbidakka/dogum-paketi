import type { Doctor } from "@/data/doctors";
import { MEDICAL_DISCLAIMER, SITE } from "@/data/site";
import DoctorCard from "@/components/DoctorCard";
import Reveal from "@/components/Reveal";
import SectionIntro from "@/components/SectionIntro";

export default function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  return (
    <section id="hekimler" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container-page">
        <SectionIntro
          label="04 · Hekimlerimiz"
          title="Gebelik ve doğum sürecinde Kadın Hastalıkları ve Doğum hekimlerimiz."
          titleClassName="max-w-[24ch]"
        />

        <div className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {doctors.map((doctor, index) => (
            <Reveal key={`${index}-${doctor.profileUrl}`} delay={index * 90} className="h-full">
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[68ch] text-[0.8125rem] text-muted">
          Hekim bilgileri{" "}
          <a
            href={SITE.corporateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-green-700"
          >
            tusahastanesi.com
          </a>{" "}
          resmi profil sayfalarından alınmıştır. {MEDICAL_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
