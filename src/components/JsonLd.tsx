import type { FaqItem } from "@/data/content";
import type { Doctor } from "@/data/doctors";
import { SITE } from "@/data/site";

/**
 * Yalnızca doğrulanmış bilgilerle yapısal veri.
 * Bilinçli olarak EKLENMEYENLER: aggregateRating, review, fiyat, deneyim yılı,
 * doğum sayısı veya resmi kaynakta bulunmayan hiçbir iddia.
 */
export default function JsonLd({ doctors, faq }: { doctors: Doctor[]; faq: FaqItem[] }) {
  const hospital = {
    "@type": ["Hospital", "MedicalOrganization"],
    "@id": `${SITE.url}#hastane`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    telephone: "+90 216 581 42 00",
    email: SITE.email,
    medicalSpecialty: "Obstetric",
    sameAs: [SITE.corporateUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
  };

  const physicians = doctors.map((doctor, index) => ({
    "@type": "Physician",
    "@id": `${SITE.url}#hekim-${doctor.profileUrl.split("/").filter(Boolean).pop() ?? index}`,
    name: `${doctor.title} ${doctor.name}`,
    url: doctor.profileUrl,
    medicalSpecialty: "Obstetric",
    ...(doctor.image ? { image: `${SITE.url}${doctor.image}` } : {}),
    worksFor: { "@id": `${SITE.url}#hastane` },
    memberOf: { "@id": `${SITE.url}#hastane` },
  }));

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE.url}#sss`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${SITE.url}#sayfa`,
    url: SITE.url,
    name: "Doğum Paketi ve Gebelik Takibi | TUSA Hastanesi Tuzla",
    inLanguage: "tr-TR",
    isPartOf: { "@id": `${SITE.url}#hastane` },
    about: { "@id": `${SITE.url}#hastane` },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [hospital, ...physicians, faqPage, webPage],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify çıktısındaki `<` kaçırılarak script bağlamı güvenliği sağlanır.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
