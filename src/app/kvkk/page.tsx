import type { Metadata } from "next";
import LegalShell, { LegalHeading, LegalList } from "@/components/LegalShell";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Kişisel Verilerin Korunması",
  description:
    "TUSA Hastanesi'nin 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki temel ilkeleri ve bu web sitesinde işlenen veriler hakkında bilgilendirme.",
  alternates: { canonical: "/kvkk" },
  robots: { index: true, follow: true },
};

const HOST = new URL(SITE.url).host;

export default function Page() {
  return (
    <LegalShell title="Kişisel Verilerin Korunması">
      <p>
        {SITE.name}, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) kapsamında
        veri sorumlusu sıfatıyla hareket eder ve hasta, refakatçi, ziyaretçi ve çalışanlarına ait
        kişisel verileri hukuka uygun biçimde işlemeyi taahhüt eder.
      </p>

      <LegalHeading>Temel ilkeler</LegalHeading>
      <LegalList
        items={[
          "Hukuka ve dürüstlük kurallarına uygun işleme",
          "Doğru ve gerektiğinde güncel olma",
          "Belirli, açık ve meşru amaçlar için işleme",
          "İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma",
          "Mevzuatta öngörülen veya işlendikleri amaç için gerekli süre kadar muhafaza",
        ]}
      />

      <LegalHeading>Bu web sitesi kapsamında işlenen veriler</LegalHeading>
      <p>
        {HOST} bir bilgilendirme sayfasıdır. Bu sayfa üzerinden yalnızca iletişim formunda
        paylaştığınız ad-soyad, telefon ve isteğe bağlı olarak e-posta ile mesaj bilgileri işlenir.
        Detaylı bilgilendirme için{" "}
        <a href="/aydinlatma-metni" className="font-medium text-green-800 underline underline-offset-2">
          Aydınlatma Metni
        </a>{" "}
        sayfasını inceleyebilirsiniz.
      </p>

      <LegalHeading>Veri güvenliği</LegalHeading>
      <p>
        Kişisel verilerin hukuka aykırı olarak işlenmesini ve verilere hukuka aykırı erişimi önlemek
        amacıyla uygun teknik ve idari tedbirler alınır; erişim yetkileri görev tanımlarıyla
        sınırlandırılır.
      </p>

      <LegalHeading>İlgili kişi başvurusu</LegalHeading>
      <p>
        KVKK m.11 kapsamındaki haklarınıza ilişkin taleplerinizi yazılı olarak hastanemize
        iletebilirsiniz. Başvurunuz, talebin niteliğine göre en geç otuz gün içinde sonuçlandırılır.
      </p>
    </LegalShell>
  );
}
