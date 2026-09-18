import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { getContent, STORAGE_DIR } from "@/lib/content/store";
import { getMailStatus } from "@/lib/mail";

export const metadata: Metadata = { title: "Genel bakış" };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

export default async function AdminHomePage() {
  const content = await getContent();
  const mail = await getMailStatus();
  const visits = content.package.trimesters.reduce((total, trimester) => total + trimester.visits.length, 0);
  const questions = content.faq.groups.reduce((total, group) => total + group.items.length, 0);

  const cards = [
    {
      href: "/admin/hero",
      title: "Ana sayfa girişi",
      meta: `${content.hero.highlights.length} öne çıkan madde`,
      text: "Ana başlık, giriş metni, düğme ve öne çıkan maddeler.",
    },
    {
      href: "/admin/paket",
      title: "Doğum paketi",
      meta: `${visits} kontrol haftası · ${content.package.birth.length} doğum kalemi`,
      text: "Trimester takvimi, muayeneler, laboratuvar tetkikleri ve doğumda dahil olanlar.",
    },
    {
      href: "/admin/sss",
      title: "Sık sorulanlar",
      meta: `${content.faq.groups.length} grup · ${questions} soru`,
      text: "Soru grupları, sorular, yanıtlar ve kaynak bağlantıları.",
    },
    {
      href: "/admin/hekimler",
      title: "Hekimler",
      meta: `${content.doctors.items.length} hekim`,
      text: "Hekim kartları, fotoğraflar, açıklamalar ve ilgi alanları.",
    },
    {
      href: "/admin/gebe-okulu",
      title: "Gebe Okulu",
      meta: `${content.school.topics.length} program başlığı`,
      text: "Gebe Okulu açıklaması ve program başlıkları.",
    },
    {
      href: "/admin/gorseller",
      title: "Görseller",
      meta: "5 görsel alanı",
      text: "Sayfadaki ana görseller ve açıklama (alt) metinleri.",
    },
  ];

  return (
    <>
      <PageHeader
        title="Genel bakış"
        description="Buradan Doğum Paketi sayfasının içeriğini düzenleyebilirsiniz. “Kaydet ve yayınla” dediğiniz anda değişiklikler sitede yayına girer; her kayıttan önceki sürüm otomatik yedeklenir."
      />

      <div className="mb-6 rounded-[20px] border border-line bg-white p-5 sm:p-6">
        <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-green-700 uppercase">Son güncelleme</p>
        <p className="mt-2 text-[0.9375rem] text-ink">
          {content.updatedAt
            ? `${dateFormat.format(new Date(content.updatedAt))}${content.updatedBy ? ` · ${content.updatedBy}` : ""}`
            : "Henüz panelden değişiklik yapılmadı; sitede varsayılan içerik gösteriliyor."}
        </p>
      </div>

      <div className="mb-6 rounded-[20px] border border-line bg-white p-5 sm:p-6">
        <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-green-700 uppercase">
          Form e-postası
        </p>
        <p className="mt-2 text-[0.9375rem] text-ink">
          {mail.mode === "smtp"
            ? `Kurumsal mail sunucusu üzerinden iletiliyor — ${mail.detail}`
            : mail.mode === "webhook"
              ? `Talepler webhook’a iletiliyor — ${mail.detail}`
              : `E-posta bildirimi kapalı (${mail.detail}). Form gönderimi şu anda ziyaretçiyi telefonla aramaya yönlendiriyor.`}
        </p>
        <Link
          href="/admin/eposta"
          className="mt-3 inline-flex min-h-[44px] items-center text-[0.875rem] font-medium text-green-800 underline underline-offset-4"
        >
          E-posta ayarlarını düzenle →
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="flex h-full flex-col rounded-[20px] border border-line bg-white p-5 transition-colors hover:border-green-700/40 hover:bg-green-050/40 sm:p-6"
            >
              <span className="text-[1.0625rem] font-semibold text-ink">{card.title}</span>
              <span className="mt-1 text-[0.8125rem] font-medium text-green-800">{card.meta}</span>
              <span className="mt-3 text-[0.875rem] text-muted">{card.text}</span>
              <span className="mt-4 text-[0.875rem] font-medium text-green-800">Düzenle →</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-[0.8125rem] text-muted">
        Telefon, adres, yasal metinler ve “05 · Odalar &amp; Hastane” galerisi kod içinde yönetilir.
        İçerik dosyası: <code className="break-all">{STORAGE_DIR}</code>
      </p>
    </>
  );
}
