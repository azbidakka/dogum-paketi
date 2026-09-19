import type { Metadata } from "next";
import RoomsEditor from "@/components/admin/editors/RoomsEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Odalar & Hastane" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Odalar & Hastane"
        description="“05 · Odalar & Hastane” bölümünün metinleri. Bu bölümdeki oda ve hastane fotoğrafları Görseller sayfasındaki “Odalar & Hastane galerisi”nden düzenlenir."
      />
      <RoomsEditor initial={content.rooms} defaults={DEFAULT_CONTENT.rooms} />
    </>
  );
}
