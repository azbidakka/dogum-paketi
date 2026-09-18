import type { Metadata } from "next";
import PackageEditor from "@/components/admin/editors/PackageEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Doğum paketi" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Doğum paketi"
        description="Trimester sekmelerindeki kontrol haftaları, pakete dahil kalemler ve laboratuvar tetkikleri. Özetteki sayılar (kontrol, muayene, NST) bu listeden otomatik hesaplanır."
      />
      <PackageEditor initial={content.package} defaults={DEFAULT_CONTENT.package} />
    </>
  );
}
