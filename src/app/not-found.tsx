import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-cream py-20">
      <div className="container-page">
        <div className="max-w-[46ch]">
          <p className="section-label">404</p>
          <h1 className="mt-5 font-display text-[clamp(1.55rem,5.6vw,2rem)] leading-[1.25]">
            Aradığınız sayfa bulunamadı.
          </h1>
          <p className="mt-5 text-text">
            Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Gebelik ve doğum süreci hakkındaki
            bilgilere ana sayfadan ulaşabilirsiniz.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-green-700 px-7 text-[0.9375rem] font-medium text-white"
            >
              Ana sayfaya dön
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[var(--border-soft)] px-7 text-[0.9375rem] font-medium text-green-800"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
