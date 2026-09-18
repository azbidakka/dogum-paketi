# TUSA Hastanesi — Gebelik ve Doğum Landing Page

`dogumpaketi.tusahastanesi.com` için tek sayfalık, statik olarak üretilen bilgilendirme sayfası.
Mevcut TUSA landing page ailesiyle (rinoplasti, sanal anjiyo) aynı teknoloji ve tasarım token
sistemini kullanır.

## Teknoloji

- Next.js 15 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4 (`@theme` token'ları — `src/app/globals.css`)
- Fontlar: Poppins (gövde) + Merriweather Bold Italic (başlıklar ve vurgu metinleri), `next/font` ile self-host
- Ek UI kütüphanesi veya animasyon kütüphanesi yok; tek çalışma zamanı bağımlılığı `nodemailer`

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build && npm start
```

## Kurulumda yapılması gereken tek şey

`.env.example` dosyasını `.env` olarak kopyalayın ve **form teslimat bilgilerini** doldurun:

- **SMTP ile (önerilen, mevcut sayfalarla aynı yaklaşım):** `SMTP_HOST`, `SMTP_PORT`,
  `SMTP_USER`, `SMTP_PASS` ve taleplerin düşeceği `LEAD_TO_EMAIL`.
- **veya webhook ile:** `LEAD_WEBHOOK_URL` (JSON POST).

Hiçbiri tanımlı değilse uygulama sorunsuz build alır ve çalışır; yalnızca form gönderimi
`503` döner ve ziyaretçiye telefonla ulaşması söylenir.

## Görseller

- **Hastane içi fotoğraflar** yalnızca TUSA'nın resmi galerisinden alınır ve **yalnızca
  "05 · Odalar & Hastane" bölümünde** kullanılır.
- **Diğer bölümlerdeki anne–bebek görselleri** (hero, 01 gebelik takibi, duygusal CTA, Gebe
  Okulu) Magnific (Seedream 5 Pro) ile üretilmiş **temsili görsellerdir**; hastane içini
  göstermez. Footer'da "Sayfadaki bazı görseller temsilidir." ibaresi yer alır.

| Kaynak | Kullanım |
| --- | --- |
| Magnific · Seedream 5 Pro (temsili) | `hero.webp`, `surec.webp`, `cta-banner.webp`, `gebe-okulu.webp` |
| `tusahastanesi.com/kurumsal/galeri` → HASTA SERVİSİ | 05 galerisi (oda/refakatçi/dinlenme/servis bankosu/koridor) |
| `tusahastanesi.com/kurumsal/galeri` → GİRİŞ KATI VE POLİKLİNİKLER | 05 galerisi (hasta kabul) |
| `tusahastanesi.com/kurumsal/galeri` → AMELİYATHANE | galeri (ameliyathane) |
| Mevcut TUSA landing page ailesi | logo, hastane dış cephe (tusa-bina.webp; Kızılay kulübesi Magnific ile kaldırıldı, bisiklet yolu yeşile çevrildi — orijinali .cache/tusa-bina-original.webp) |
| `tusahastanesi.com/doktor/...` | hekim profil fotoğrafları |

Görselleri yeniden üretmek (indirir, kırpar, webp'ye çevirir):

```bash
node scripts/prepare-images.mjs      # 05 bölümü hastane görselleri (resmi galeri)
node scripts/prepare-ai-images.mjs   # temsili görseller (.cache/magnific kaynaklı)
node scripts/generate-og.mjs      # Open Graph görseli
```

`scripts/prepare-images.mjs` içindeki `JOBS` tablosu hangi kaynak dosyanın hangi hedefe ve
hangi kırpma ile gittiğini gösterir; farklı bir fotoğraf kullanmak için tek satır değiştirmek
yeterlidir. İndirilen orijinaller `.cache/tusa-galeri/` altında tutulur (git'e girmez).

Sayfa içi yollar tek noktadan `src/data/site.ts` içindeki `MEDIA` ve `GALLERY` sabitlerinde
yönetilir.

**Not:** Galerideki giriş katı ve ameliyathane görselleri, hastanenin kendi yayımladığı
mimari görselleştirmelerdir; hasta servisi görselleri ise gerçek fotoğraflardır. Kurum
elinde daha güncel fotoğraf varsa aynı hedef dosya adlarıyla değiştirilebilir.

## Hekim verisi

`src/data/doctors.ts` içindeki veriler resmi profil sayfalarından doğrulanmıştır:

- https://tusahastanesi.com/doktor/melis-koca
- https://tusahastanesi.com/doktor/esra-sahin

`src/lib/doctors.ts`, build/ISR sırasında (günde bir) bu sayfalardan hekim ad ve ünvanını
yeniden doğrular. Bu istek **yalnızca sunucu tarafında** çalışır — ziyaretçi tarayıcısından
`tusahastanesi.com`'a hiçbir istek gitmez. Kaynak ulaşılamazsa veya beklenmeyen bir HTML
gelirse lokal veri kullanılır; sayfa hiçbir koşulda bu nedenle çökmez. Build çıktısında
`[doctors] 2/2 hekim resmi profil sayfasından doğrulandı.` satırı sonucu gösterir.

`DOCTOR_SOURCE_SYNC=0` ile bu doğrulama kapatılabilir (ağ erişimi olmayan CI için).

## Analytics

Proje kendi analytics sistemini kurmaz. `src/lib/track.ts`, sayfaya (ör. bir GTM konteyneri
üzerinden) halihazırda `dataLayer` veya `gtag` enjekte edilmişse şu olayları iletir; yoksa
sessizce hiçbir şey yapmaz:

`click_phone` · `click_contact_cta` · `view_doctor` · `submit_lead_form` · `lead_form_success`

Olay parametrelerine **hiçbir zaman** ad, telefon, e-posta veya sağlık bilgisi eklenmez.

## İçerik ve uyum notları

- Sayfada fiyat, kampanya, indirim, sonuç garantisi, hasta yorumu, puan veya doğrulanmamış
  sayı bulunmaz. "Doğum paketi" ifadesi hero'da değil; paket içeriği bölümünde, SSS'de ve
  metadata'da kullanılır.
- Sayfanın bilgi mimarisi (trimester sekmeleri, "anne için / bebek için" listeleri, oda
  donanımı, genişletilmiş SSS) sektördeki doğum paketi sayfalarından esinlenmiştir; **içerik
  ise yalnızca TUSA'nın resmi kaynaklarına dayanır** (`src/data/content.ts` başındaki kaynak
  listesi). Başka kurumların metinleri, muayene adetleri, fiyat/indirim ve ikram kalemleri
  (hediye çanta, kuaför, kutlama yemeği vb.) alınmamıştır.
- **Doğum paketi içeriği** (01 bölümündeki hafta hafta takvim ve "Doğumda pakete dahil
  olanlar" kartı) TUSA Hastanesi'nin ilettiği paket listesinden alınmıştır (`TRIMESTERS`,
  `PACKAGE_BIRTH`). Özet sayılar (kontrol haftası, muayene, NST) bu veriden hesaplanır; liste
  değişirse sayfa kendiliğinden güncellenir. Refakatçi, beslenme, emzirme politikası, ziyaret
  ve taburculuk bilgileri Yatan Hasta Rehberi'nden; yenidoğan yoğun bakım, ameliyathane ve
  sigorta bilgileri Hakkımızda sayfasından alınmıştır.
- Gebe Okulu başlıkları resmi duyurudan alınmıştır; duyurudaki geçmiş tarih bilinçli olarak
  sayfaya yazılmamış, güncel program için iletişime yönlendirilmiştir.
- Normal doğum ve sezaryen karşılaştırmalı biçimde sunulmaz; ikisi de hekim değerlendirmesine
  bağlanır.
- Yasal sayfalar (`/kvkk`, `/gizlilik`, `/cerez-politikasi`, `/aydinlatma-metni`) mevcut TUSA
  landing page ailesindeki yapıyla aynıdır ve bu alan adına göre uyarlanmıştır.
- Harita yalnızca ziyaretçi "Haritayı Göster" dediğinde yüklenir (üçüncü taraf istek yok).
- Yapısal veri: `Hospital` + `MedicalOrganization`, `Physician` ×2, `FAQPage`, `WebPage`.
  Review/rating şeması bilinçli olarak eklenmemiştir.

## Yapı

```text
src/
  app/            layout, page, yasal sayfalar, /api/lead, sitemap, robots, 404
  components/     Header, Hero, PregnancyTracking + TrimesterTabs, BirthOptions,
                  AfterBirth, EmotionalCTA, DoctorsSection/DoctorCard, RoomsSection +
                  HospitalGallery, PregnancyClass, FAQ, ContactSection/LeadForm,
                  LocationSection, Footer, MobileStickyCTA, JsonLd, Reveal, SectionIntro
  data/           site.ts (sabitler, resmi kaynak URL'leri, MEDIA/GALLERY), doctors.ts,
                  content.ts (TRIMESTERS + PACKAGE_BIRTH, CARE_MOTHER/CARE_BABY, HOSPITAL_FACTS,
                  ROOM_FEATURES, FAQ_ITEMS, SCHOOL_TOPICS)
  lib/            doctors.ts (kaynak doğrulama), lead.ts (validasyon),
                  rate-limit.ts, track.ts
scripts/          prepare-images.mjs (resmi galeriden görsel hazırlama),
                  generate-og.mjs
```

## Yönetim paneli

Adres: `/admin` (giriş: `/admin/login`). Kardeş sayfalardaki (ör. Sanal Anjiyo) panelle aynı
yaklaşım: kullanıcı adı + şifre ile giriş, sayfa içeriğini düzenleme.

### Kurulum

```bash
npm run admin:hash -- "en-az-12-karakterli-güçlü-şifre"
```

Çıktıdaki `ADMIN_PASSWORD_HASH` ve `ADMIN_SESSION_SECRET` satırlarını, `ADMIN_USERNAME` ile
birlikte sunucudaki `.env` dosyasına ekleyin. Üçü tanımlı değilse giriş ekranı
"yapılandırılmamış" uyarısı gösterir; site bundan etkilenmez.

### Panelden düzenlenebilenler

| Bölüm | İçerik |
| --- | --- |
| Ana sayfa girişi | Üst etiket, başlık + yeşil bitiş, giriş metni, ana düğme, öne çıkan maddeler |
| Doğum paketi | Bölüm başlığı, 3 trimester sekmesi, kontrol haftaları, kalemler (adet), laboratuvar grupları, doğumda dahil olanlar, alt not |
| Sık sorulanlar | Gruplar, sorular, yanıtlar, isteğe bağlı kaynak bağlantısı (FAQPage yapısal verisi de güncellenir) |
| Hekimler | Kartlar, fotoğraf yükleme, ad/ünvan/branş, açıklama, ilgi alanları |
| Gebe Okulu | Açıklama ve program başlıkları |
| Görseller | 5 görsel alanı (yükleme + alt metin) |
| Yedekler | Son 30 sürüm, tek tıkla geri yükleme |

Telefon, adres, yasal metinler, "05 · Odalar & Hastane" galerisi ve bölüm başlıklarının
bir kısmı kod içinde yönetilir (`src/data/site.ts`, `src/data/content.ts`).

### Nasıl çalışır

- **Kayıt:** "Kaydet ve yayınla" → içerik zod ile doğrulanır, `storage/content.json` dosyasına
  atomik olarak yazılır ve `revalidatePath("/")` ile sayfa anında yeniden üretilir.
- **Varsayılanlar:** Panelden hiç kayıt yapılmamışsa (ya da bir bölüm geçersizse) sayfa
  `src/data` altındaki doğrulanmış içerikle çalışır.
- **Yedekler:** Her kayıttan önce mevcut sürüm `storage/backups/` altına kopyalanır (son 30).
- **Görseller:** Yüklenen dosya JPG/PNG/WebP/AVIF ve en fazla 10 MB olmalıdır; sunucuda
  küçültülüp WebP'ye çevrilir, `storage/uploads/` altına yazılır ve `/media/...` adresinden sunulur.

### Güvenlik

- Şifre scrypt özeti olarak saklanır; düz şifre sunucuda tutulmaz.
- Oturum: HMAC-SHA256 imzalı, `httpOnly`, `sameSite=lax`, üretimde `secure` çerez (8 saat).
  `ADMIN_SESSION_SECRET` veya `ADMIN_USERNAME` değişirse tüm oturumlar kapanır.
- `/admin` middleware ile korunur; her kaydetme/yükleme işlemi oturumu ayrıca doğrular.
- Giriş denemeleri IP başına 10 dakikada 5 ile sınırlıdır.
- `/admin` arama motorlarına kapalıdır (`robots.txt`, `X-Robots-Tag`, `noindex`).

### Deploy notları

- `storage/` klasörü kalıcı olmalı ve her deploy'da silinmemelidir. Önerilen:
  `CONTENT_DIR=/var/lib/dogumpaketi` (Node sürecinin yazma izni olmalı).
- nginx arkasında `proxy_set_header Host $host;` ve `X-Forwarded-For` başlıkları iletilmelidir
  (server action origin kontrolü ve giriş deneme sınırı için).

## E-posta (form teslimatı)

Form talepleri TUSA Hastanesi'nin kendi Exchange sunucusu üzerinden bildirilir; ayarlar
**panelden** yönetilir (`/admin/eposta`). Kurulum, sanalanjiyo.tusahastanesi.com ile aynıdır.

### Sunucu bilgileri

| Ayar | Değer |
| --- | --- |
| Sunucu | `mail.tusahastanesi.com` |
| Port | 587 · STARTTLS zorunlu (465 seçilirse örtük TLS) |
| Kullanıcı adı | `kullanici@gisbirhastanesi.local` — **oturum açma adı**, Active Directory alanıdır |
| Gönderen | `info@tusahastanesi.com` — posta alan adı |
| Sertifika | `*.tusahastanesi.com`, doğrulama açık |
| TLS | Exchange 2010 olduğu için `minVersion: TLSv1` |

Alan adının DNS kayıtları: MX `mail.tusahastanesi.com`, SPF yalnızca bu sunucuyu
yetkilendirir, DKIM `mail._domainkey`, DMARC `p=none`. Bu yüzden gönderim doğrudan web
sunucusundan değil, hastane sunucusu üzerinden yapılır.

### Panelden yapılan ayarlar

`/admin/eposta` sayfasında: bildirim açık/kapalı, sunucu, port, kullanıcı adı, şifre,
gönderen adı ve adresi, bildirim alacak adresler (virgülle çoklu), konu ön eki
(`[Doğum Paketi]`), STARTTLS zorunluluğu, sertifika doğrulaması ve "Yanıtla talebi bırakan
kişiye gitsin" seçeneği. Sayfadaki **Test e-postası gönder** düğmesi önce bağlantıyı
doğrular, sonra örnek bildirimi yollar.

Şifre `ADMIN_SESSION_SECRET` ile AES-256-GCM kullanılarak şifrelenip
`storage/settings.json` (0600) içine yazılır; panelde bir daha görüntülenmez. İçerik
yedeklerine dahil değildir.

### Sunucuda doğrulama

```bash
npm run mail:test                       # bağlantı + kimlik doğrulama (e-posta göndermez)
npm run mail:test -- hedef@ornek.com    # ayrıca test e-postası gönderir
```

Hatalar Türkçe açıklanır (535 → kullanıcı/şifre, 5.7.1 → relay izni, zaman aşımı → port
veya güvenlik duvarı). Ayrıntılı SMTP trafiği için `SMTP_DEBUG=1`.

### Notlar

- E-posta kapalıysa veya şifre girilmemişse form ziyaretçiyi telefonla aramaya yönlendirir
  (503) ve sunucu günlüğüne not düşer.
- Panelde şifre girilmediyse `SMTP_PASS` ortam değişkeni yedek olarak kullanılır.
- Mail sunucusunun TLS sertifikası 10 Ekim 2026'da doluyor; yenilenmesi gerekir.
