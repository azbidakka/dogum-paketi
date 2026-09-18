import type { Metadata } from "next";
import BackupsList from "@/components/admin/BackupsList";
import PageHeader from "@/components/admin/PageHeader";
import { listBackups } from "@/lib/content/store";

export const metadata: Metadata = { title: "Yedekler" };
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "medium",
  timeZone: "Europe/Istanbul",
});

export default async function Page() {
  const backups = (await listBackups()).map((backup) => ({
    name: backup.name,
    label: dateFormat.format(new Date(backup.createdAt)),
    sizeLabel: `${(backup.size / 1024).toFixed(1)} KB`,
  }));

  return (
    <>
      <PageHeader
        title="Yedekler"
        description="Her kayıttan önce sayfanın o anki içeriği yedeklenir (son 30 sürüm). Bir yedeği geri yüklediğinizde mevcut içerik de ayrıca yedeklenir."
      />
      <BackupsList backups={backups} />
    </>
  );
}
