import type { Metadata } from "next";
import DoctorsEditor from "@/components/admin/editors/DoctorsEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Hekimler" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader
        title="Hekimler"
        description="Kartlarda resmi profilde yer almayan ünvan, deneyim yılı, başarı oranı gibi bilgilere yer vermeyin."
      />
      <DoctorsEditor initial={content.doctors} defaults={DEFAULT_CONTENT.doctors} />
    </>
  );
}
