import type { Metadata } from "next";
import LegalShell, { LegalHeading, LegalList } from "@/components/LegalShell";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Aydınlatma Metni",
  description:
    "TUSA Hastanesi doğum ve gebelik bilgilendirme sayfasındaki iletişim formu aracılığıyla paylaşılan kişisel verilere ilişkin KVKK aydınlatma metni.",
  alternates: { canonical: "/aydinlatma-metni" },
  robots: { index: true, follow: true },
};

const HOST = new URL(SITE.url).host;

export default function Page() {
  return (
    <LegalShell title="Aydınlatma Metni">
      <p>
        Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
        kapsamında, {HOST} adresinde yer alan iletişim formu aracılığıyla paylaştığınız kişisel
        verilerin hangi amaçla işlendiği konusunda sizi bilgilendirmek amacıyla hazırlanmıştır. Veri
        sorumlusu {SITE.name}&rsquo;dir.
      </p>

      <LegalHeading>İşlenen kişisel veriler</LegalHeading>
      <LegalList
        items={[
          "Kimlik bilgisi: ad ve soyad",
          "İletişim bilgisi: telefon numarası ve (paylaşmanız halinde) e-posta adresi",
          "Talep içeriği: form üzerinden ilettiğiniz mesaj metni",
          "İşlem güvenliği ve kampanya takibi amacıyla oturum boyunca saklanan bağlantı kaynağı (UTM) bilgileri",
        ]}
      />

      <LegalHeading>İşleme amaçları</LegalHeading>
      <LegalList
        items={[
          "İletişim talebinizin değerlendirilmesi ve size geri dönüş yapılması",
          "Randevu ve süreç hakkında bilgilendirme yapılması",
          "Talep ve şikâyetlerin takibi ile hizmet kalitesinin geliştirilmesi",
        ]}
      />

      <LegalHeading>Hukuki sebep</LegalHeading>
      <p>
        Kişisel verileriniz; KVKK m.5/2-(c) kapsamında bir sözleşmenin kurulması veya ifasıyla
        doğrudan doğruya ilgili olması, m.5/2-(f) kapsamında veri sorumlusunun meşru menfaati ve
        talebinizi iletirken vermiş olduğunuz açık rıza çerçevesinde işlenmektedir.
      </p>

      <LegalHeading>Özel nitelikli veriler</LegalHeading>
      <p>
        İletişim formu üzerinden sağlık durumunuza ilişkin özel nitelikli kişisel veri paylaşmanız
        gerekmemektedir. Tanı ve tedaviye yönelik değerlendirme yalnızca hekim muayenesi ile yapılır.
        Formda paylaştığınız bilgiler yalnızca sizinle iletişime geçilmesi amacıyla kullanılır.
      </p>

      <LegalHeading>Aktarım</LegalHeading>
      <p>
        Kişisel verileriniz, yalnızca yukarıdaki amaçlarla sınırlı olmak üzere hastanemizin kurumsal
        e-posta altyapısında saklanır; hizmet aldığımız bilgi teknolojileri ve çağrı yönetimi
        tedarikçilerine, yasal yükümlülükler kapsamında ise yetkili kamu kurum ve kuruluşlarına
        aktarılabilir.
      </p>

      <LegalHeading>Saklama süresi</LegalHeading>
      <p>
        Talebinizin sonuçlandırılması için gerekli süre boyunca ve ilgili mevzuatta öngörülen saklama
        süreleri dikkate alınarak muhafaza edilir; sürenin sona ermesi halinde silinir, yok edilir
        veya anonim hale getirilir.
      </p>

      <LegalHeading>İlgili kişi hakları</LegalHeading>
      <p>
        KVKK m.11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna
        ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını
        öğrenme, eksik veya yanlış işlenmiş verilerin düzeltilmesini, silinmesini veya yok edilmesini
        isteme ve işlemenin kanuna aykırı olması nedeniyle zarara uğramanız halinde zararın
        giderilmesini talep etme haklarına sahipsiniz.
      </p>
    </LegalShell>
  );
}
