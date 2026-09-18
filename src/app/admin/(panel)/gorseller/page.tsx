import type { Metadata } from "next";
import ImagesEditor from "@/components/admin/editors/ImagesEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Görseller" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Görseller"
        description="Yüklenen görseller otomatik olarak küçültülüp WebP biçimine çevrilir. Hastane içi fotoğrafları yalnızca “05 · Odalar & Hastane” galerisinde kullanmanız önerilir; temsili görsellerde footer’daki “Sayfadaki bazı görseller temsilidir.” ibaresi yer alır."
      />
      <ImagesEditor initial={content.images} defaults={DEFAULT_CONTENT.images} />
    </>
  );
}
