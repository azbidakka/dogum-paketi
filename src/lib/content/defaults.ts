import {
  FAQ_GROUPS,
  HERO_HIGHLIGHTS,
  PACKAGE_BIRTH,
  SCHOOL_TOPICS,
  TRIMESTERS,
} from "@/data/content";
import { DOCTORS } from "@/data/doctors";
import { MEDIA, SITE } from "@/data/site";
import type { SiteContent } from "./schema";

/**
 * Panelden henüz kayıt yapılmamışsa (veya kayıtlı bir bölüm geçersizse) sitede
 * gösterilen içerik. Kaynak: src/data altındaki doğrulanmış metinler.
 */
export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    label: "TUSA Hastanesi · Kadın Hastalıkları ve Doğum",
    title: "Gebeliğin ilk gününden bebeğinize kavuştuğunuz ana kadar",
    accent: "yanınızdayız.",
    lead: "Gebelik takibinden doğum planlamasına kadar süreç; anne adayının sağlık durumu, gebeliğin seyri ve hekim değerlendirmesi doğrultusunda kişiye özel olarak ele alınır. TUSA Hastanesi Kadın Hastalıkları ve Doğum ekibi, anne ve bebeğin sağlığını merkeze alan bir yaklaşımla süreci takip eder.",
    primaryCta: "Doğum Süreci Hakkında Bilgi Al",
    highlights: HERO_HIGHLIGHTS.map((item) => ({ title: item.title, text: item.text })),
  },
  package: {
    title: "Gebeliğin 5. haftasından doğuma kadar paketinize",
    accent: "neler dahil?",
    intro:
      "TUSA Hastanesi doğum paketi; gebeliğin 5–8. haftasından 38. haftaya kadar planlı kontrolleri, tetkikleri ve doğumu kapsar. Aşağıda her dönemde pakete dahil olan muayene ve testleri bulabilirsiniz.",
    trimesters: structuredClone(TRIMESTERS),
    birth: PACKAGE_BIRTH.map((item) => ({ title: item.title, text: item.text })),
    footnote:
      "Paket içeriği TUSA Hastanesi doğum paketi listesine göre hazırlanmıştır. Kişisel duruma göre hekim tarafından ek tetkik veya işlem gerekebilir; bunların kapsamı, paket ücreti ve geçerlilik koşulları için ekibimizden bilgi alabilirsiniz.",
  },
  faq: { groups: structuredClone(FAQ_GROUPS) },
  doctors: {
    items: DOCTORS.map((doctor) => ({
      name: doctor.name,
      displayName: doctor.displayName,
      title: doctor.title,
      department: doctor.department,
      image: doctor.image,
      profileUrl: doctor.profileUrl,
      summary: doctor.summary,
      interests: [...doctor.interests],
    })),
  },
  school: {
    intro:
      "TUSA Hastanesi’nin dönemsel Gebe Okulu çalışmaları; anne adaylarının gebelik, doğuma hazırlık ve doğum sonrası süreç hakkında sağlık profesyonellerinden bilgi almasına yönelik içerikler sunabilir. Başlıklar döneme göre değişebilir; güncel program ve katılım bilgileri için hastanemizle iletişime geçebilirsiniz.",
    topics: SCHOOL_TOPICS.map((topic) => ({ title: topic.title, by: topic.by })),
  },
  images: {
    hero: {
      src: MEDIA.hero,
      alt: "Yenidoğan bebeğini göğsüne yaslayarak şefkatle kucaklayan anne",
    },
    tracking: {
      src: MEDIA.process,
      alt: "Bir eli karnında, diğer elinde ultrason görüntüsü tutan anne adayı",
    },
    cta: {
      src: MEDIA.ctaBanner,
      alt: "Yenidoğan bebekleriyle birlikte anne ve baba; bebek babasının parmağını tutuyor",
    },
    school: {
      src: MEDIA.pregnancySchool,
      alt: "Gebe Okulu programında defterine not alan anne adayı",
    },
    location: {
      src: MEDIA.hospital,
      alt: `${SITE.name} binası ve ana girişi — ${SITE.address.street}, ${SITE.address.district}`,
    },
  },
};
