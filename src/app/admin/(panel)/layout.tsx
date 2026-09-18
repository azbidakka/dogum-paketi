import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { MEDIA, SITE } from "@/data/site";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  return (
    <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <div>
            <Image src={MEDIA.logo} alt={SITE.name} width={196} height={32} className="h-6 w-auto" />
            <p className="mt-2 text-[0.75rem] font-medium tracking-[0.14em] text-green-700 uppercase">
              Yönetim Paneli
            </p>
          </div>
          <form action={logoutAction} className="lg:hidden">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 text-[0.875rem] text-text"
            >
              Çıkış
            </button>
          </form>
        </div>

        <AdminNav />

        <div className="mt-auto hidden space-y-3 border-t border-line px-6 py-5 lg:block">
          <p className="text-[0.8125rem] text-muted">
            Giriş yapan: <span className="font-medium text-ink">{session.username}</span>
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center justify-center rounded-full border border-line text-[0.875rem] font-medium text-green-800 hover:bg-green-050"
          >
            Siteyi görüntüle ↗
          </a>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex min-h-[44px] w-full items-center justify-center rounded-full text-[0.875rem] text-muted hover:bg-offwhite hover:text-ink"
            >
              Çıkış yap
            </button>
          </form>
        </div>
      </aside>

      <main id="icerik" className="px-4 pt-8 pb-32 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto max-w-[62rem]">{children}</div>
      </main>
    </div>
  );
}
