import type { Metadata } from "next";
import LegalShell, { LegalHeading, LegalList } from "@/components/LegalShell";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "TUSA Hastanesi doğum ve gebelik bilgilendirme sayfasında çerez ve benzeri teknolojilerin nasıl kullanıldığına ilişkin bilgilendirme.",
  alternates: { canonical: "/cerez-politikasi" },
  robots: { index: true, follow: true },
};

const HOST = new URL(SITE.url).host;

export default function Page() {
  return (
    <LegalShell title="Çerez Politikası">
      <p>
        Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza kaydedilen küçük metin
        dosyalarıdır. Bu sayfa, {HOST} adresinde çerez ve benzeri teknolojilerin nasıl kullanıldığını
        açıklar.
      </p>

      <LegalHeading>Kullanılan teknolojiler</LegalHeading>
      <LegalList
        items={[
          "Zorunlu kayıtlar: Sayfanın çalışması ve güvenliği için gereken teknik kayıtlar.",
          "Oturum belleği (sessionStorage): Sayfaya hangi kampanya bağlantısı üzerinden ulaştığınızı gösteren UTM bilgileri, yalnızca tarayıcı sekmeniz açık olduğu sürece saklanır ve sekme kapandığında silinir.",
          "Üçüncü taraf içerik: Harita alanını görüntülemeyi seçmeniz halinde ilgili sağlayıcı kendi çerezlerini kullanabilir.",
        ]}
      />

      <LegalHeading>Reklam ve profilleme</LegalHeading>
      <p>
        Bu sayfada, ziyaretçilerin sağlık durumuna ilişkin profil oluşturmaya yönelik çerez
        kullanılmaz. Gebelik ve doğum süreciyle ilgili hiçbir bilgi reklam amacıyla işlenmez.
      </p>

      <LegalHeading>Çerez tercihlerinizi yönetme</LegalHeading>
      <p>
        Tarayıcınızın ayarlar bölümünden çerezleri silebilir, engelleyebilir veya çerez
        kaydedildiğinde uyarı almayı seçebilirsiniz. Zorunlu kayıtların engellenmesi halinde sayfanın
        bazı bölümleri beklendiği gibi çalışmayabilir.
      </p>

      <LegalHeading>Diğer metinler</LegalHeading>
      <p>
        {SITE.name} tarafından işlenen kişisel verilere ilişkin ayrıntılar için{" "}
        <a
          href="/aydinlatma-metni"
          className="font-medium text-green-800 underline underline-offset-2"
        >
          Aydınlatma Metni
        </a>{" "}
        ve{" "}
        <a href="/gizlilik" className="font-medium text-green-800 underline underline-offset-2">
          Gizlilik Politikası
        </a>{" "}
        sayfalarını inceleyebilirsiniz.
      </p>
    </LegalShell>
  );
}
