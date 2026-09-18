import type { Metadata } from "next";
import MailSettingsForm from "@/components/admin/MailSettingsForm";
import PageHeader from "@/components/admin/PageHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "E-posta" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const { mail } = await getSettings();

  return (
    <>
      <PageHeader
        title="E-posta"
        description="Formdan gelen talepler TUSA Hastanesi’nin kendi mail sunucusu üzerinden bildirilir. Şifre sunucuda şifrelenerek saklanır; panelde bir daha görüntülenmez."
      />
      <MailSettingsForm settings={mail} hasPassword={Boolean(mail.passwordEnc)} />
    </>
  );
}
