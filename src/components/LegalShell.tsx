import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import { MEDIA, SITE } from "@/data/site";

export const LEGAL_LAST_UPDATED = "Eylül 2026";

export default function LegalShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-[var(--header-h)] items-center">
          <Link href="/" className="flex min-h-[44px] items-center" aria-label={`${SITE.name} — ana sayfa`}>
            <Image
              src={MEDIA.logo}
              alt={SITE.name}
              width={196}
              height={32}
              priority
              className="h-7 w-auto lg:h-8"
            />
          </Link>
        </div>
      </header>

      <main className="bg-cream py-14 lg:py-20">
        <div className="container-page">
          <div className="max-w-[72ch]">
            <p className="section-label">{SITE.name}</p>
            <h1 className="mt-5 font-display text-[clamp(1.55rem,5.6vw,2rem)] leading-[1.25]">
              {title}
            </h1>
            <p className="mt-4 text-[0.875rem] text-muted">
              Son güncelleme: {LEGAL_LAST_UPDATED}
            </p>

            <div className="legal-body mt-10 space-y-6 text-[0.9875rem] leading-relaxed text-text">
              {children}
            </div>

            <div className="mt-14 rounded-[20px] border border-[var(--border-soft)] bg-white p-7">
              <h2 className="text-[1.0625rem] font-semibold text-ink">Başvuru ve iletişim</h2>
              <p className="mt-3">
                Bu metinde yer alan konularla ilgili taleplerinizi {SITE.address.street},{" "}
                {SITE.address.district} adresine yazılı olarak iletebilir veya{" "}
                <a
                  href={SITE.phoneHref}
                  className="font-medium text-green-800 underline underline-offset-2"
                >
                  {SITE.phoneDisplay}
                </a>{" "}
                numaralı telefondan bize ulaşabilirsiniz.
              </p>
            </div>

            <Link
              href="/"
              className="mt-10 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[var(--border-soft)] px-6 text-[0.9375rem] font-medium text-green-800 transition-colors hover:bg-green-050"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 12H6m5.5 5.5L5.5 12l6-5.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sayfaya dön
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export function LegalHeading({ children }: { children: ReactNode }) {
  return <h2 className="pt-4 text-[1.125rem] font-semibold text-ink">{children}</h2>;
}

export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 pl-5">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-green-700/60">
          {item}
        </li>
      ))}
    </ul>
  );
}
