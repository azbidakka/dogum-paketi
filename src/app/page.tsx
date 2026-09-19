import AfterBirth from "@/components/AfterBirth";
import BirthOptions from "@/components/BirthOptions";
import ContactSection from "@/components/ContactSection";
import DoctorsSection from "@/components/DoctorsSection";
import EmotionalCTA from "@/components/EmotionalCTA";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import LocationSection from "@/components/LocationSection";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import PregnancyClass from "@/components/PregnancyClass";
import PregnancyTracking from "@/components/PregnancyTracking";
import RoomsSection from "@/components/RoomsSection";
import { getContent } from "@/lib/content/store";
import { getDoctors } from "@/lib/doctors";

// İçerik yönetim panelinden gelir; panelde kaydedildiğinde sayfa anında yeniden üretilir
// (revalidatePath). Hekim adları ayrıca resmi profillerden sunucu tarafında doğrulanır.
export const revalidate = 86400;

export default async function Page() {
  const content = await getContent();
  const doctors = await getDoctors(
    content.doctors.items.map((doctor) => ({ ...doctor, sourceUrl: doctor.profileUrl }))
  );
  const faqItems = content.faq.groups.flatMap((group) => group.items);

  return (
    <>
      <Header />

      <main id="icerik">
        <Hero hero={content.hero} image={content.images.hero} />
        <PregnancyTracking pkg={content.package} image={content.images.tracking} />
        <BirthOptions />
        <AfterBirth />
        <EmotionalCTA image={content.images.cta} />
        <DoctorsSection doctors={doctors} />
        <RoomsSection rooms={content.rooms} gallery={content.images.gallery} />
        <PregnancyClass school={content.school} image={content.images.school} />
        <FAQ groups={content.faq.groups} />
        <ContactSection />
        <LocationSection image={content.images.location} />
      </main>

      <Footer />

      {/* Mobil sticky CTA'nın footer içeriğini kapatmaması için ayrılan boşluk */}
      <div aria-hidden="true" className="h-[76px] bg-green-900 lg:hidden" />
      <MobileStickyCTA />

      <JsonLd doctors={doctors} faq={faqItems} />
    </>
  );
}
