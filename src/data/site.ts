export const SITE = {
  name: "TUSA Hastanesi",
  page: "Gebelik ve Doğum",
  url: "https://dogumpaketi.tusahastanesi.com",
  corporateUrl: "https://tusahastanesi.com",
  departmentUrl: "https://tusahastanesi.com/tibbi-birim/kadin-hastaliklari-ve-dogum",
  phoneDisplay: "0216 581 42 00",
  phoneHref: "tel:+902165814200",
  email: "info@tusahastanesi.com",
  legalName: "Özel Tusa Hastanesi",
  galleryUrl: "https://tusahastanesi.com/kurumsal/galeri",
  aboutUrl: "https://tusahastanesi.com/kurumsal/hakkimizda",
  insurersUrl: "https://tusahastanesi.com/kurumsal/anlasmali-kurumlar",
  inpatientGuideUrl: "https://cdn.tusahastanesi.com/yatan-hasta-rehberi.pdf",
  pediatricsUrl: "https://tusahastanesi.com/haber-bulteni/tuzla-cocuk-sagligi-ve-hastaliklari",
  address: {
    street: "Aydıntepe Mah. Güzin Sok. No: 6",
    district: "Tuzla / İstanbul",
    locality: "Tuzla",
    region: "İstanbul",
    country: "TR",
    postalCode: "34959",
  },
  /** Google Maps embed is loaded only after an explicit click (see LocationSection). */
  mapEmbedSrc:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("TUSA Hastanesi, Aydıntepe Mah. Güzin Sok. No:6, Tuzla, İstanbul") +
    "&output=embed",
  mapDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("TUSA Hastanesi, Aydıntepe Mah. Güzin Sok. No:6, Tuzla, İstanbul"),
} as const;

export const NAV = [
  { href: "#gebelik-dogum", label: "Paket İçeriği" },
  { href: "#dogum-secenekleri", label: "Doğum" },
  { href: "#hastane", label: "Odalar" },
  { href: "#hekimler", label: "Hekimlerimiz" },
  { href: "#sss", label: "Sık Sorulanlar" },
] as const;

export const LEGAL_LINKS = [
  { href: "/kvkk", label: "KVKK" },
  { href: "/gizlilik", label: "Gizlilik" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
  { href: "/aydinlatma-metni", label: "Aydınlatma Metni" },
] as const;

export const MEDICAL_DISCLAIMER =
  "Bu içerik genel bilgilendirme amaçlıdır; muayene veya kişiye özel tıbbi değerlendirme yerine geçmez.";

/**
 * Görsel yolları tek noktadan yönetilir. Gerçek TUSA fotoğrafları hazır olduğunda
 * dosyayı aynı yola kopyalamak (veya buradaki yolu değiştirmek) yeterlidir.
 * Şu an `placeholder: true` olan görseller kurumsal renklerde soyut yer tutuculardır.
 */
export const MEDIA = {
  logo: "/images/brand/tusa-logo.png",
  logoWhite: "/images/brand/tusa-logo-white.png",
  hospital: "/images/tusa-bina.webp",
  og: "/images/og.jpg",
  hero: "/images/hero.webp",
  process: "/images/surec.webp",
  ctaBanner: "/images/cta-banner.webp",
  pregnancySchool: "/images/gebe-okulu.webp",
} as const;

/** Hastane ortamı galerisi — tümü TUSA Hastanesi resmi galerisinden. İlk öğe büyük gösterilir. */
export const GALLERY = [
  {
    src: "/images/galeri/hasta-odasi.webp",
    title: "Hasta odası",
    alt: "TUSA Hastanesi hasta odası; hasta yatağı, ahşap dolap ve refakatçi koltuğu",
  },
  {
    src: "/images/galeri/refakatci-alani.webp",
    title: "Refakatçi alanı",
    alt: "Hasta odasında refakatçi için ayrılmış çalışma ve oturma alanı",
  },
  {
    src: "/images/galeri/dinlenme-alani.webp",
    title: "Dinlenme köşesi",
    alt: "Hasta odasındaki koltuklu dinlenme köşesi",
  },
  {
    src: "/images/galeri/servis-bankosu.webp",
    title: "Servis bankosu",
    alt: "TUSA Hastanesi hasta servisindeki hemşire ve danışma bankosu",
  },
  {
    src: "/images/galeri/hasta-servisi.webp",
    title: "Hasta servisi",
    alt: "TUSA Hastanesi hasta servisi koridoru ve oda yönlendirmeleri",
  },
  {
    src: "/images/galeri/hasta-kabul.webp",
    title: "Hasta kabul",
    alt: "TUSA Hastanesi giriş katındaki hasta kabul ve danışma bankosu",
  },
  {
    src: "/images/galeri/ameliyathane.webp",
    title: "Ameliyathane",
    alt: "TUSA Hastanesi ameliyathanesi — sezaryen doğumun gerçekleştirildiği hastane koşulları",
  },
] as const;
