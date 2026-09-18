/**
 * Sayfa metinleri.
 *
 * Bilgi mimarisi (trimester sekmeleri, "doğum ve sonrası" ikili liste, oda donanımı,
 * genişletilmiş SSS) sektördeki doğum paketi sayfalarından esinlenmiştir; ancak İÇERİK
 * yalnızca TUSA Hastanesi'nin resmi kaynaklarına dayanır:
 *
 * - Kadın Hastalıkları ve Doğum: https://tusahastanesi.com/tibbi-birim/kadin-hastaliklari-ve-dogum
 * - Hakkımızda:                  https://tusahastanesi.com/kurumsal/hakkimizda
 * - Yatan Hasta Rehberi (PDF):   https://cdn.tusahastanesi.com/yatan-hasta-rehberi.pdf
 * - Çocuk Sağlığı ve Hastalıkları: https://tusahastanesi.com/haber-bulteni/tuzla-cocuk-sagligi-ve-hastaliklari
 * - Gebe Okulu:                  https://tusahastanesi.com/haber-bulteni/tusa-hastanesi-gebe-okulu
 * - Doğum paketi içeriği:        TUSA Hastanesi tarafından iletilen paket listesi (Eylül 2026)
 *
 * Listede yer almayan paket kalemi, fiyat, indirim veya ikram hizmeti eklenmemiştir.
 */

export const HERO_HIGHLIGHTS = [
  {
    title: "Hafta hafta gebelik takibi",
    text: "5. haftadan 38. haftaya 12 muayene, tetkikler ve NST takibi pakete dahildir.",
  },
  {
    title: "Normal & sezaryen doğum",
    text: "Doğum şekli, gebeliğin seyri ve hekim değerlendirmesi doğrultusunda planlanır.",
  },
  {
    title: "Yenidoğan Yoğun Bakım Ünitesi",
    text: "Hastanemizde 12 yataklı Yenidoğan Yoğun Bakım Ünitesi bulunur.",
  },
] as const;

/**
 * DOĞUM PAKETİ İÇERİĞİ
 * Kaynak: TUSA Hastanesi doğum paketi listesi. Test adları listeden alınmıştır; yalnızca
 * yöntem ifadeleri ("kemolüminesans veya benzeri") sadeleştirilmiş, ilk kontrol
 * laboratuvar testleri okunabilirlik için üç gruba ayrılmıştır (toplam 17 test).
 * Not: Listede "Kreatin" yazan test "Kreatinin" olarak düzeltilmiştir.
 */
export const PACKAGE_EXAM = "Kadın hastalıkları ve doğum muayenesi, ultrason eşliğinde";
export const PACKAGE_NST = "NST — kardiyotokografi ile fetal non-stres testi";

export type PackageItem = { name: string; count?: number };
export type LabGroup = { group: string; tests: string[] };
export type PackageVisit = {
  week: string;
  month?: string;
  items: PackageItem[];
  labs?: LabGroup[];
};

export type Trimester = {
  id: string;
  label: string;
  weeks: string;
  title: string;
  intro: string;
  visits: PackageVisit[];
};

export const TRIMESTERS: Trimester[] = [
  {
    id: "1",
    label: "1. Trimester",
    weeks: "1–13. hafta",
    title: "Gebeliğin ilk dönemi",
    intro:
      "İlk kontrolde muayeneyle birlikte gebeliğin başlangıç tetkikleri yapılır; 12. haftada ikili tarama testi uygulanır.",
    visits: [
      {
        month: "2. ay",
        week: "5–8. hafta",
        items: [{ name: PACKAGE_EXAM }],
        labs: [
          {
            group: "Kan ve idrar",
            tests: [
              "Tam kan sayımı (hemogram)",
              "Tam idrar tetkiki (tam otomatik idrar biyokimyası ve mikroskopisi)",
              "Aerob idrar kültürü",
              "Kan grubu",
            ],
          },
          {
            group: "Biyokimya ve hormon",
            tests: [
              "Aspartat aminotransferaz (AST - SGOT)",
              "Alanin aminotransferaz (ALT - SGPT), serum",
              "BUN, serum",
              "Kreatinin",
              "Kan şekeri (glukoz) ölçümü, serum",
              "TSH stimülasyon testi",
            ],
          },
          {
            group: "Enfeksiyon taraması",
            tests: [
              "Rubella (kızamıkçık) IgM",
              "HBsAg — Hepatit B (HBV) yüzey antijeni",
              "Toksoplazma IgM",
              "Toksoplazma IgG",
              "Anti CMV IgM",
              "VDRL, kalitatif",
              "Anti-HIV",
            ],
          },
        ],
      },
      {
        month: "3. ay",
        week: "12. hafta",
        items: [
          { name: PACKAGE_EXAM },
          { name: "İkili tarama testi (birinci trimester tarama testi)" },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "2. Trimester",
    weeks: "14–26. hafta",
    title: "Gelişim dönemi",
    intro:
      "Bebeğin gelişimi aylık muayenelerle izlenir; 24. haftada gebelik şekeri için yükleme testi yapılır.",
    visits: [
      {
        month: "4. ay",
        week: "16. hafta",
        items: [{ name: PACKAGE_EXAM }, { name: "Alfa-feto protein (AFP-MoM)" }],
      },
      { month: "5. ay", week: "22. hafta", items: [{ name: PACKAGE_EXAM }] },
      {
        month: "6. ay",
        week: "24. hafta",
        items: [
          { name: PACKAGE_EXAM },
          { name: "Tam kan sayımı (hemogram)" },
          { name: "Tam idrar tetkiki (tam otomatik idrar biyokimyası ve mikroskopisi)" },
          { name: "Oral glukoz tolerans testi (OGTT, 75 g, 2 saat) veya tokluk / açlık kan şekeri" },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "3. Trimester",
    weeks: "27–40. hafta",
    title: "Doğuma hazırlık",
    intro:
      "Son dönemde kontroller sıklaşır; 32. haftadan itibaren bebeğin kalp atışları NST ile izlenir.",
    visits: [
      { month: "7. ay", week: "28. hafta", items: [{ name: PACKAGE_EXAM }] },
      { month: "8. ay", week: "32. hafta", items: [{ name: PACKAGE_EXAM }, { name: PACKAGE_NST }] },
      { month: "8. ay", week: "34. hafta", items: [{ name: PACKAGE_EXAM }, { name: PACKAGE_NST }] },
      {
        month: "9. ay",
        week: "36. hafta",
        items: [{ name: PACKAGE_EXAM, count: 2 }, { name: PACKAGE_NST }],
      },
      { week: "38. hafta", items: [{ name: PACKAGE_EXAM, count: 2 }, { name: PACKAGE_NST }] },
    ],
  },
];

/** Doğumda pakete dahil olanlar — paket listesinin "DOĞUM" bölümü */
export const PACKAGE_BIRTH = [
  {
    title: "Sezaryen veya normal doğum",
    text: "Doğum şekli, anne ve bebeğin sağlık durumu doğrultusunda hekim tarafından belirlenir.",
  },
  {
    title: "Yenidoğan muayene ve testleri",
    text: "Bebeğinizin doğumdan sonraki ilk muayenesi ve testleri.",
  },
  {
    title: "Bebek bakım eğitimi",
    text: "Yenidoğan bakımına yönelik eğitim.",
  },
  {
    title: "Otopark (1 araç)",
    text: "Bir araç için otopark hakkı.",
  },
] as const;

export const BIRTH_OPTIONS = [
  {
    title: "Normal / Vajinal Doğum",
    text: "Vajinal doğum, uygun gebeliklerde doğum eyleminin doğal süreç içinde ilerlediği doğum şeklidir. Anne adayının ve bebeğin sağlık durumu, bebeğin pozisyonu, gebelik haftası ve doğum eyleminin seyri süreç boyunca değerlendirilir.",
    note: "Vajinal doğuma uygunluk ve süreç planlaması hekim değerlendirmesiyle belirlenir.",
  },
  {
    title: "Sezaryen Doğum",
    text: "Sezaryen doğum; anne veya bebeğe ait tıbbi gereklilikler doğrultusunda ya da doğum sürecinde ortaya çıkan klinik durumlara göre planlanabilen cerrahi bir doğum yöntemidir. Operasyon öncesi değerlendirme, anestezi planlaması ve ameliyat sonrası takip hastane ortamında yürütülür.",
    note: "Sezaryen gerekliliği ve zamanlaması kişiye özel klinik değerlendirme sonucunda belirlenir.",
  },
] as const;

export type CareGroup = { title: string; items: { title: string; text: string }[] };

/** Kaynak: Yatan Hasta Rehberi (refakatçi, beslenme, emzirme politikası, taburculuk) */
export const CARE_MOTHER: CareGroup = {
  title: "Anne için",
  items: [
    {
      title: "Refakatçili konaklama",
      text: "Refakatçi konaklaması ve yemek hizmeti oda ücretine dahildir.",
    },
    {
      title: "Diyetisyen planlı beslenme",
      text: "Hastanede beslenmeniz, hekim önerileri doğrultusunda diyetisyenler tarafından planlanır.",
    },
    {
      title: "Emzirme desteği",
      text: "Emzirmenin başlatılması, sürdürülmesi ve sık karşılaşılan güçlükler konusunda annelere destek verilir.",
    },
    {
      title: "Taburculuk bilgilendirmesi",
      text: "Taburculuk zamanı hekim tarafından belirlenir; kontrol randevuları, ilaçlar ve beslenme hakkında bilgi verilir.",
    },
  ],
};

/** Kaynak: Yatan Hasta Rehberi (emzirme politikası), Çocuk Sağlığı kliniği, Hakkımızda */
export const CARE_BABY: CareGroup = {
  title: "Bebek için",
  items: [
    {
      title: "Ten tene temas",
      text: "Tıbbi durum uygun olduğunda bebeğin doğar doğmaz anneyle ten tene temas kurması ve en kısa sürede emzirilmesi desteklenir.",
    },
    {
      title: "Anneyle aynı oda",
      text: "Tıbbi durum uygun olduğunda anne ve bebeğin günün 24 saati aynı odada kalması sağlanır.",
    },
    {
      title: "Yenidoğan takibi",
      text: "Çocuk Sağlığı ve Hastalıkları kliniğinde yenidoğan tarama testleri, kilo takibi ve sarılık kontrolleri yapılır.",
    },
    {
      title: "Yenidoğan Yoğun Bakım",
      text: "Gerektiğinde bebeğin takibi 12 yataklı Yenidoğan Yoğun Bakım Ünitesi’nde sürdürülür.",
    },
  ],
};

/** Kaynak: Hakkımızda. Sayaç/animasyon olarak değil, düz bilgi olarak gösterilir. */
export const HOSPITAL_FACTS = [
  { value: "12 yatak", label: "Yenidoğan Yoğun Bakım Ünitesi" },
  { value: "5", label: "Ameliyathane" },
  { value: "SGK · ÖSS · TSS", label: "Tüm branşlarda anlaşma" },
] as const;

/** Kaynak: Yatan Hasta Rehberi — "Hizmetlerimiz" bölümü */
export const ROOM_FEATURES = [
  "Refakatçi yatağı ve refakatçi yemeği",
  "Uzaktan kumandalı televizyon",
  "Kablosuz internet",
  "Oda içi sıcaklık kontrolü",
  "Yatak başında ve banyoda hemşire çağrı zili",
  "Günlük oda temizliği",
] as const;

export type FaqItem = {
  q: string;
  a: string;
  link?: { href: string; label: string };
};

export type FaqGroup = { id: string; title: string; items: FaqItem[] };

/**
 * Sık sorulan sorular — konu başlıklarına göre gruplu.
 * Yanıtlar paket listesi, Yatan Hasta Rehberi, Hakkımızda, Çocuk Sağlığı ve Kadın
 * Hastalıkları ve Doğum sayfalarına dayanır; genel tıbbi bilgiler hekim değerlendirmesi
 * vurgusuyla verilir.
 */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "paket",
    title: "Doğum Paketi",
    items: [
      {
        q: "Doğum paketi nedir, neleri kapsar?",
        a: "TUSA Hastanesi doğum paketi; gebeliğin 5–8. haftasından 38. haftaya kadar ultrason eşliğinde 12 kadın hastalıkları ve doğum muayenesini, ilk kontroldeki laboratuvar tetkiklerini, ikili tarama testini, AFP testini, 24. haftadaki şeker yükleme testini (OGTT), 4 NST’yi, normal veya sezaryen doğumu, yenidoğan muayene ve testlerini, bebek bakım eğitimini ve 1 araçlık otoparkı kapsar. Kişisel duruma göre hekim tarafından ek tetkik veya işlem gerekebilir; bunların kapsamı, paket ücreti ve geçerlilik koşulları için ekibimizden bilgi alabilirsiniz.",
      },
      {
        q: "Doğum paketi hangi haftadan başlar?",
        a: "Paket takvimi gebeliğin 5–8. haftasındaki muayene ve ilk laboratuvar tetkikleriyle başlar, 38. haftaya kadar planlı kontrollerle devam eder. Gebeliğin daha ileri bir haftasında başvuruyorsanız uygun seçenekler için ekibimizle görüşebilirsiniz.",
      },
      {
        q: "Pakette kaç muayene var?",
        a: "Paket takviminde gebeliğin 5–8. haftasından 38. haftaya kadar 10 kontrol haftasında toplam 12 kadın hastalıkları ve doğum muayenesi yer alır. Muayenelerin tamamı ultrason eşliğinde yapılır; 36. ve 38. haftalarda ikişer muayene planlanmıştır.",
      },
      {
        q: "Pakete hangi laboratuvar tetkikleri dahil?",
        a: "İlk kontrolde (5–8. hafta) tam kan sayımı, tam idrar tetkiki, idrar kültürü, kan grubu, karaciğer ve böbrek fonksiyon testleri, kan şekeri ve tiroid (TSH) testi ile Rubella, Hepatit B, Toksoplazma, CMV, VDRL ve HIV taramaları yapılır. 24. haftada kan sayımı ve idrar tetkiki tekrarlanır; gebelik şekeri için yükleme testi (OGTT) ya da tokluk / açlık kan şekeri ölçümü yapılır.",
      },
      {
        q: "İkili tarama ve AFP testi pakete dahil mi?",
        a: "Evet. 12. haftada ikili tarama testi (birinci trimester tarama testi), 16. haftada alfa-feto protein (AFP-MoM) testi paket kapsamındadır. Tarama testleri kesin tanı koymaz; sonuçlar hekiminiz tarafından gebeliğin diğer bulgularıyla birlikte değerlendirilir.",
      },
      {
        q: "NST nedir, pakette kaç kez yapılır?",
        a: "NST (non-stres testi), kardiyotokografi cihazıyla bebeğin kalp atışlarının ve rahim kasılmalarının bir süre boyunca kaydedildiği, ağrısız bir izlem testidir. Pakette 32, 34, 36 ve 38. haftalarda olmak üzere 4 NST yer alır.",
      },
      {
        q: "Sezaryen doğum da pakete dahil mi?",
        a: "Evet. Paket, doğum şekli normal ya da sezaryen olsun doğumu kapsar. Doğum şekli, anne ve bebeğin sağlık durumu doğrultusunda hekim tarafından belirlenir.",
      },
      {
        q: "Paket dışında ek tetkik veya işlem gerekirse ne olur?",
        a: "Kişisel duruma göre hekiminiz paket listesinde yer almayan ek tetkik, konsültasyon veya işlem önerebilir. Bunların kapsamı ve ücretlendirmesi hakkında ekibimizden önceden bilgi alabilirsiniz.",
      },
      {
        q: "Özel sağlık sigortam veya SGK geçerli mi?",
        a: "TUSA Hastanesi’nin tüm branşlarda SGK, Özel Sağlık Sigortaları (ÖSS) ve Tamamlayıcı Sağlık Sigortaları (TSS) ile anlaşması vardır. Doğum sürecine ilişkin kapsam poliçenize göre değişebileceğinden sigorta şirketinizle ve hastanemizle teyit etmeniz önerilir.",
        link: {
          href: "https://tusahastanesi.com/kurumsal/anlasmali-kurumlar",
          label: "Anlaşmalı kurumlar listesi",
        },
      },
      {
        q: "Hekimimi kendim seçebilir miyim?",
        a: "Hasta hakları kapsamında sağlık hizmeti alacağınız hekimi seçebilirsiniz. Kadın Hastalıkları ve Doğum bölümümüzde Op. Dr. Melis Koca ve Op. Dr. Esra Şahin hizmet vermektedir; randevu uygunluğu için ekibimizle görüşebilirsiniz.",
      },
    ],
  },
  {
    id: "takip",
    title: "Gebelik Takibi",
    items: [
      {
        q: "Gebelik kontrollerinin sıklığı nasıl belirlenir?",
        a: "Paket takviminde kontroller ilk dönemde yaklaşık aylık, son haftalarda daha sık planlanmıştır. Bununla birlikte kontrol aralıkları gebelik haftasına, anne adayının sağlık durumuna ve hekimin değerlendirmesine göre değişebilir.",
      },
      {
        q: "Riskli gebeliklerde takip farklı olabilir mi?",
        a: "Evet. Anne adayına veya bebeğe ait belirli risk faktörleri olduğunda kontrol sıklığı, istenen tetkikler ve takip planı değişebilir.",
      },
      {
        q: "Gebelikte hangi durumlarda hemen başvurmalıyım?",
        a: "Vajinal kanama, su gelmesi, düzenli ve sık kasılmalar, bebek hareketlerinde belirgin azalma, şiddetli baş ağrısı, görme bozukluğu, yüzde ve ellerde ani şişlik ya da yüksek ateş gibi durumlarda vakit kaybetmeden hekiminize ulaşın veya acil servise başvurun. Hastanemizde acil servis hizmeti verilmektedir.",
      },
      {
        q: "Gebelik takibim başka bir merkezde başladıysa TUSA Hastanesi’ne başvurabilir miyim?",
        a: "Mevcut gebelik kayıtlarınız ve önceki tetkiklerinizle değerlendirme için başvurabilirsiniz. Takip planı hekim tarafından mevcut bilgileriniz ve gebeliğinizin güncel durumu doğrultusunda oluşturulur.",
      },
      {
        q: "Doğuma hazırlık eğitimi var mı?",
        a: "TUSA Hastanesi’nin dönemsel Gebe Okulu programlarında gebelik süreci, gebelik ve sonrasında psikolojik süreç, beslenme, yenidoğan bakımı ve emzirme konuları sağlık profesyonelleri tarafından ele alınır. Doğum paketinde ayrıca bebek bakım eğitimi yer alır. Güncel program için hastanemizle iletişime geçebilirsiniz.",
      },
    ],
  },
  {
    id: "dogum",
    title: "Doğum",
    items: [
      {
        q: "Doğum şekline ne zaman karar verilir?",
        a: "Doğum şekli gebeliğin yalnızca tek bir döneminde verilen sabit bir karar değildir. Anne adayının ve bebeğin sağlık durumu, gebeliğin seyri ve doğuma yaklaşıldıkça ortaya çıkan klinik bulgular birlikte değerlendirilir. Nihai plan hekim değerlendirmesiyle belirlenir.",
      },
      {
        q: "Normal doğum herkes için uygun mudur?",
        a: "Hayır. Vajinal doğuma uygunluk; anne ve bebeğin sağlık durumu, bebeğin pozisyonu, gebelik haftası, önceki gebelik ve doğum öyküsü gibi birçok faktörün birlikte değerlendirilmesiyle belirlenir.",
      },
      {
        q: "Sezaryen doğum hangi durumlarda planlanabilir?",
        a: "Sezaryen; anne veya bebeğe ait tıbbi gereklilikler nedeniyle planlanabilir ya da doğum sürecinde ortaya çıkan durumlar sonucunda gerekli hale gelebilir. Karar kişiye özel klinik değerlendirmeyle verilir.",
      },
      {
        q: "Sezaryen sonrası normal doğum mümkün mü?",
        a: "Önceki doğumu sezaryen olan bazı anne adaylarında, uygun koşullar sağlandığında sezaryen sonrası normal doğum (SSVD) değerlendirilebilir. Uygunluk; önceki ameliyatın özellikleri, aradan geçen süre ve mevcut gebeliğin seyrine göre hekim tarafından belirlenir.",
      },
      {
        q: "Doğumda anestezi nasıl planlanır?",
        a: "Sezaryen planlanan durumlarda operasyon öncesinde anestezi değerlendirmesi yapılır. Uygulanacak anestezi yöntemi, anne adayının sağlık durumu ve doğumun koşullarına göre anestezi hekimiyle birlikte belirlenir.",
      },
      {
        q: "Doğuma gelirken hastaneye ne zaman başvurmalıyım?",
        a: "Başvuru zamanı kişiye ve gebeliğin özelliklerine göre değişebilir. Düzenli kasılmalar, su gelmesi, kanama veya bebeğin hareketlerinde belirgin azalma gibi durumlarda sağlık ekibiyle iletişime geçilmesi gerekir. Kişiye özel yönlendirme için takip eden hekimin önerileri esas alınmalıdır.",
      },
      {
        q: "Doğumda eşim yanımda olabilir mi?",
        a: "Doğum sırasında ve sonrasında eşlik koşulları doğum şekline ve hastane uygulamalarına göre değişebilir. Güncel bilgi için doğumdan önce ekibimize danışmanızı öneririz.",
      },
    ],
  },
  {
    id: "sonrasi",
    title: "Doğum Sonrası ve Bebek",
    items: [
      {
        q: "Doğumdan sonra bebeğim yanımda kalacak mı?",
        a: "Hastanemizin emzirme politikası doğrultusunda, tıbbi durum uygun olduğunda bebeğin doğar doğmaz anneyle ten tene temas kurması, en kısa sürede emzirmeye başlanması ve anne ile bebeğin günün 24 saati aynı odada kalması desteklenir.",
      },
      {
        q: "Emzirme konusunda destek alabilir miyim?",
        a: "Evet. Hastanemizin emzirme politikası kapsamında emzirmenin başlatılması, sürdürülmesi ve sık karşılaşılan güçlükler konusunda annelere destek verilir; biberon ve emzik kullanımı hakkında da danışmanlık sağlanır. Taburculuk öncesinde emzirme desteğine ulaşabileceğiniz merkezler hakkında bilgilendirme yapılır.",
      },
      {
        q: "Yenidoğan muayene ve testleri neleri kapsar?",
        a: "Doğum paketinde yenidoğan muayene ve testleri yer alır. Çocuk Sağlığı ve Hastalıkları kliniğimizde yenidoğan tarama testleri, kilo takibi ve sarılık kontrolleri yapılır; hangi testlerin gerekli olduğu bebeğin durumuna göre çocuk hekimi tarafından belirlenir.",
      },
      {
        q: "Taburculuktan sonra bebeğimin takibi nasıl sürer?",
        a: "Çocuk Sağlığı ve Hastalıkları kliniğimizde ilk 40 gün boyunca bebeğin sağlık gelişimi yakından izlenir. Büyüme-gelişme değerlendirmeleri, aşı uygulamaları ve beslenme danışmanlığı düzenli kontrollerle sürdürülür.",
      },
      {
        q: "Yenidoğan yoğun bakım ünitesi var mı?",
        a: "Evet. Hastanemizde 12 yataklı Yenidoğan Yoğun Bakım Ünitesi bulunur. Yoğun bakımda herhangi bir müdahale olmadığı sürece anne ve baba gün içinde bebeğini ziyaret edebilir.",
      },
      {
        q: "Bebek bakım eğitimi nedir?",
        a: "Doğum paketinde yer alan bebek bakım eğitimi, yenidoğan bakımına yönelik bilgilendirmeyi kapsar. Ayrıca dönemsel Gebe Okulu programlarında yenidoğan bakımı, anne sütünün önemi ve emzirme konuları eğitim hemşiresi tarafından ele alınır.",
      },
      {
        q: "Hastanede ne kadar kalacağım?",
        a: "Taburculuk zamanı doğum şekline, anne ve bebeğin klinik durumuna göre hekim tarafından belirlenir. Taburcu olurken kontrol randevuları, kullanılacak ilaçlar ve beslenme hakkında bilgi verilir.",
      },
      {
        q: "Doğum sonrası kontroller nasıl planlanır?",
        a: "Doğum sonrası anne ve yenidoğanın hastanedeki ilk değerlendirmeleri yapılır. Sonraki kontrol zamanı ve kapsamı doğum şekli, klinik durum ve hekim değerlendirmesine göre belirlenir.",
      },
      {
        q: "Doğum sonrası duygusal destek alabilir miyim?",
        a: "Doğum sonrası dönemde duygusal dalgalanmalar sık görülebilir. Gerektiğinde hastanemizin ruh sağlığı biriminden destek alınabilir; Gebe Okulu programlarında da gebelik ve sonrasındaki psikolojik süreç ele alınır. Uzun süren ya da günlük yaşamı etkileyen belirtilerde hekiminize başvurmanız önemlidir.",
      },
    ],
  },
  {
    id: "hastane",
    title: "Hastane ve Ziyaret",
    items: [
      {
        q: "Refakatçi kalabilir mi?",
        a: "Hekimin uygun görmesi durumunda refakatçi bulundurulabilir. Refakatçi konaklaması ve yemek hizmeti oda ücretine dahildir; gerektiğinde refakatçiniz için çarşaf, pike ve yastık temin edilir.",
      },
      {
        q: "Ziyaret saatleri nelerdir?",
        a: "Servislerde ziyaret saatleri 10:00–22:00 arasıdır. Odada aynı anda en fazla 2 ziyaretçi bulunması, ziyaretin 15 dakikayı aşmaması ve 10 yaş altı çocukların ziyarete getirilmemesi rica edilir. Yenidoğan yoğun bakımda, herhangi bir müdahale olmadığı sürece anne ve baba gün içinde bebeğini ziyaret edebilir.",
        link: {
          href: "https://cdn.tusahastanesi.com/yatan-hasta-rehberi.pdf",
          label: "Yatan Hasta Rehberi (PDF)",
        },
      },
      {
        q: "Hastaneye çiçek getirilebilir mi?",
        a: "Enfeksiyon riskine karşı hastanemize canlı çiçek kabul edilmez. Adınıza gelen çiçekler personelimiz tarafından teslim alınır, size haber verilir ve taburculuk sırasında Danışma Bankosu’ndan teslim alabilirsiniz.",
      },
      {
        q: "Odalarda neler bulunur?",
        a: "Hasta odalarında refakatçi yatağı, uzaktan kumandalı televizyon, kablosuz internet, oda içi sıcaklık kontrolü ile yatak başında ve banyoda hemşire çağrı zili bulunur; odalar her gün temizlenir. Oda tipi doğum şekline, klinik duruma ve o dönemdeki oda uygunluğuna göre belirlenir.",
      },
      {
        q: "Hastanede yemek hizmeti nasıl?",
        a: "Beslenmeniz hekim önerileri doğrultusunda diyetisyenler tarafından planlanır. Kahvaltı, öğle ve akşam yemekleri belirli saatlerde odaya servis edilir; refakatçi yemekleri de aynı saatlerde teslim edilir.",
      },
      {
        q: "Otopark var mı?",
        a: "Doğum paketinde 1 araçlık otopark yer alır. Hastanemizde hasta ve yakınları için ücretli ve ücretsiz otopark seçenekleri bulunur.",
      },
      {
        q: "Hastaneye nasıl ulaşırım?",
        a: "TUSA Hastanesi, Aydıntepe Mah. Güzin Sok. No: 6, Tuzla / İstanbul adresindedir. Sayfanın altındaki konum bölümünden yol tarifi alabilir veya 0216 581 42 00 numaralı telefondan bize ulaşabilirsiniz.",
      },
    ],
  },
];

/** Düz liste: JSON-LD (FAQPage) ve sayım için */
export const FAQ_ITEMS: FaqItem[] = FAQ_GROUPS.flatMap((group) => group.items);

/**
 * Gebe Okulu programlarında ele alınan başlıklar ve bu başlıkları sunan meslek grupları.
 * Not: Program dönemseldir; sayfada sabit bir tarih veya "sürekli aktif" ifadesi
 * kullanılmaz — güncel program için iletişime yönlendirilir.
 */
export const SCHOOL_TOPICS = [
  { title: "Gebelik süreci", by: "Kadın Hastalıkları ve Doğum Uzmanı" },
  { title: "Gebelik ve sonrasında psikolojik süreç", by: "Ruh Sağlığı ve Hastalıkları Uzmanı" },
  { title: "Gebelikte ve sonrasında beslenme", by: "Beslenme ve Diyet Uzmanı" },
  { title: "Yenidoğan bakımı ve emzirme", by: "Eğitim Hemşiresi" },
] as const;
