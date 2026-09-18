export type Doctor = {
  /** Resmi kaynaktaki yazım (tusahastanesi.com) */
  name: string;
  /** UI'da okunabilir gösterim */
  displayName: string;
  title: string;
  department: string;
  image?: string;
  profileUrl: string;
  sourceUrl: string;
  summary: string;
  /** Yalnızca resmi profilde yer alan, doğumla ilgili tıbbi ilgi alanları */
  interests: string[];
};

/**
 * Veriler https://tusahastanesi.com/doktor/... resmi profil sayfalarından doğrulanmıştır.
 * `interests` listesi, resmi profildeki "Tıbbi İlgi Alanları" başlığından yalnızca
 * gebelik/doğum ile ilgili maddeler seçilerek oluşturulmuştur; yeni iddia eklenmemiştir.
 */
export const DOCTORS: Doctor[] = [
  {
    name: "Melis KOCA",
    displayName: "Op. Dr. Melis Koca",
    title: "Op. Dr.",
    department: "Kadın Hastalıkları ve Doğum",
    image: "/images/doctors/melis-koca.webp",
    profileUrl: "https://tusahastanesi.com/doktor/melis-koca",
    sourceUrl: "https://tusahastanesi.com/doktor/melis-koca",
    summary:
      "Kadın Hastalıkları ve Doğum Uzmanı. Gebelik takibi, riskli gebelik değerlendirmesi, normal doğum, sezaryen doğum ve kadın sağlığı alanlarında hizmet vermektedir.",
    interests: [
      "Gebelik Takibi",
      "Riskli Gebelik",
      "Normal Doğum",
      "Sezaryen Doğum",
      "Sezaryen Sonrası Normal Doğum (SSVD)",
    ],
  },
  {
    name: "Esra ŞAHİN",
    displayName: "Op. Dr. Esra Şahin",
    title: "Op. Dr.",
    department: "Kadın Hastalıkları ve Doğum",
    image: "/images/doctors/esra-sahin.webp",
    profileUrl: "https://tusahastanesi.com/doktor/esra-sahin",
    sourceUrl: "https://tusahastanesi.com/doktor/esra-sahin",
    summary:
      "Kadın Hastalıkları ve Doğum Uzmanı. Vajinal doğum, sezaryen doğum ve kadın sağlığı alanlarında değerlendirme ve takip hizmeti sunmaktadır.",
    interests: ["Vajinal Doğum", "Sezaryen Doğum"],
  },
];
