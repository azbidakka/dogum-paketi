import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { MEDIA, SITE } from "@/data/site";
import { SESSION_COOKIE, isAdminConfigured, verifySessionToken } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Panel Girişi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (session) redirect("/admin");

  const { next } = await searchParams;
  const configured = isAdminConfigured();

  return (
    <main id="icerik" className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-[26rem] rounded-[20px] border border-[var(--border-soft)] bg-white p-7 sm:p-9">
        <Image src={MEDIA.logo} alt={SITE.name} width={196} height={32} priority className="h-7 w-auto" />

        <h1 className="mt-8 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
          Yönetim <span className="font-display text-green-700">Paneli</span>
        </h1>
        <p className="mt-2 text-[0.9375rem] text-muted">
          Doğum Paketi sayfasının içeriğini düzenlemek için giriş yapın.
        </p>

        {configured ? (
          <LoginForm next={next} />
        ) : (
          <div role="alert" className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[0.875rem] leading-relaxed text-amber-900">
            Panel henüz yapılandırılmamış. Sunucuda <code>ADMIN_USERNAME</code>,{" "}
            <code>ADMIN_PASSWORD_HASH</code> ve <code>ADMIN_SESSION_SECRET</code> ortam
            değişkenlerinin tanımlanması gerekir (bkz. README).
          </div>
        )}

        <p className="mt-8 text-[0.8125rem] text-muted">Bu alan yalnızca yetkili personel içindir.</p>
      </div>
    </main>
  );
}
