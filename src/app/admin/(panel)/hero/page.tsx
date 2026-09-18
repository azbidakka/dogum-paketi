import type { Metadata } from "next";
import HeroEditor from "@/components/admin/editors/HeroEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Ana sayfa girişi" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Ana sayfa girişi"
        description="Sayfanın en üstündeki başlık, giriş metni ve öne çıkan maddeler. Görseli “Görseller” bölümünden değiştirebilirsiniz."
      />
      <HeroEditor initial={content.hero} defaults={DEFAULT_CONTENT.hero} />
    </>
  );
}
