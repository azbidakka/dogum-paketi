"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/track";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  /** Analytics'te CTA'nın hangi bölümden tıklandığını ayırt etmek için (PII içermez) */
  location: string;
  className?: string;
};

const BASE =
  "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 text-center text-[0.9375rem] font-medium transition-colors";

const VARIANTS = {
  primary: "bg-green-700 text-white hover:bg-green-900",
  secondary:
    "border border-[var(--border-soft)] bg-transparent text-green-800 hover:bg-green-050",
} as const;

export default function CtaLink({
  href,
  children,
  variant = "primary",
  location,
  className,
}: CtaLinkProps) {
  return (
    <a
      href={href}
      onClick={() => track("click_contact_cta", { location, variant })}
      className={[BASE, VARIANTS[variant], className].filter(Boolean).join(" ")}
    >
      {children}
      {variant === "primary" ? <ArrowIcon /> : null}
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h13m-5.5-5.5L18.5 12 12.5 17.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
