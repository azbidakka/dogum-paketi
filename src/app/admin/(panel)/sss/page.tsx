import type { Metadata } from "next";
import FaqEditor from "@/components/admin/editors/FaqEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Sık sorulanlar" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Sık sorulanlar"
        description="Sorular hem sayfada hem de arama motorları için yapısal veride (FAQPage) kullanılır. Tıbbi yanıtlarda kesin söz vermekten kaçının; kişiye özel durumlar için hekim değerlendirmesine yönlendirin."
      />
      <FaqEditor initial={content.faq} defaults={DEFAULT_CONTENT.faq} />
    </>
  );
}
