import type { Metadata } from "next";
import LegalShell, { LegalHeading, LegalList } from "@/components/LegalShell";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "TUSA Hastanesi doğum ve gebelik bilgilendirme sayfasında hangi bilgilerin toplandığı ve nasıl kullanıldığına ilişkin gizlilik politikası.",
  alternates: { canonical: "/gizlilik" },
  robots: { index: true, follow: true },
};

const HOST = new URL(SITE.url).host;

export default function Page() {
  return (
    <LegalShell title="Gizlilik Politikası">
      <p>
        Bu gizlilik politikası, {HOST} adresini ziyaret ettiğinizde hangi bilgilerin toplandığını ve
        bu bilgilerin nasıl kullanıldığını açıklar.
      </p>

      <LegalHeading>Toplanan bilgiler</LegalHeading>
      <LegalList
        items={[
          "İletişim formunu doldurmanız halinde ilettiğiniz ad-soyad, telefon ve isteğe bağlı e-posta ile mesaj bilgileri",
          "Sayfaya hangi kampanya veya bağlantı üzerinden ulaştığınızı gösteren ve tarayıcınızın oturum belleğinde tutulan UTM parametreleri",
          "Sunucu kayıtlarında oluşan teknik bilgiler (talep zamanı, tarayıcı türü gibi)",
        ]}
      />

      <LegalHeading>Bilgilerin kullanımı</LegalHeading>
      <p>
        Toplanan bilgiler yalnızca iletişim talebinizin değerlendirilmesi, randevu ve süreç hakkında
        bilgilendirme yapılması ve hizmet kalitesinin geliştirilmesi amacıyla kullanılır. Talebiniz,
        hastanemizin kurumsal e-posta adresine bildirim olarak iletilir. Bilgileriniz pazarlama
        amacıyla üçüncü taraflara satılmaz veya kiralanmaz.
      </p>

      <LegalHeading>Üçüncü taraf içerikleri</LegalHeading>
      <p>
        Sayfadaki harita alanı yalnızca siz talep ettiğinizde yüklenir; bu durumda ilgili harita
        sağlayıcısının kendi gizlilik koşulları geçerli olur. Hekim bilgileri, ziyaretçi tarayıcısından
        değil, yalnızca sunucu tarafında {SITE.name}&rsquo;nin resmi kurumsal sitesinden
        doğrulanır.
      </p>

      <LegalHeading>Çerezler</LegalHeading>
      <p>
        Çerez kullanımına ilişkin ayrıntılar için{" "}
        <a
          href="/cerez-politikasi"
          className="font-medium text-green-800 underline underline-offset-2"
        >
          Çerez Politikası
        </a>{" "}
        sayfasını inceleyebilirsiniz.
      </p>

      <LegalHeading>Değişiklikler</LegalHeading>
      <p>
        Bu politika gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.
      </p>
    </LegalShell>
  );
}
