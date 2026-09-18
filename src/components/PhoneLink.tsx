"use client";

import { SITE } from "@/data/site";
import { track } from "@/lib/track";

type PhoneLinkProps = {
  location: string;
  className?: string;
  /** Ekran okuyucular için ek bağlam */
  label?: string;
};

export default function PhoneLink({ location, className, label }: PhoneLinkProps) {
  return (
    <a
      href={SITE.phoneHref}
      onClick={() => track("click_phone", { location })}
      aria-label={label ?? `Telefonla ara: ${SITE.phoneDisplay}`}
      className={["inline-flex min-h-[44px] items-center gap-2 transition-colors hover:text-green-700", className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.6 2.5h2.2l1.6 4-1.9 1.4a12.4 12.4 0 0 0 5.6 5.6l1.4-1.9 4 1.6v2.2a2.6 2.6 0 0 1-2.9 2.6C10.2 17.4 6.6 13.8 4 8.4A2.6 2.6 0 0 1 6.6 2.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      <span>{SITE.phoneDisplay}</span>
    </a>
  );
}
