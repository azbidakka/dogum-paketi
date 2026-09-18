import type { Metadata } from "next";
import SchoolEditor from "@/components/admin/editors/SchoolEditor";
import PageHeader from "@/components/admin/PageHeader";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { getContent } from "@/lib/content/store";

export const metadata: Metadata = { title: "Gebe Okulu" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageHeader title="Gebe Okulu" description="Gebe Okulu bölümünün açıklaması ve program başlıkları." />
      <SchoolEditor initial={content.school} defaults={DEFAULT_CONTENT.school} />
    </>
  );
}
