"use client";

import Image from "next/image";
import type { Doctor } from "@/data/doctors";
import { track } from "@/lib/track";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white">
      <div className="relative aspect-4/5 w-full bg-green-050 sm:aspect-3/2 lg:aspect-4/5">
        {doctor.image ? (
          <Image
            src={doctor.image}
            alt={`${doctor.displayName} — ${doctor.department}`}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 46vw, 100vw"
            /* object-top: portrelerde yüzün kırpılmaması için */
            className="object-cover object-top"
          />
        ) : (
          <DoctorPlaceholder name={doctor.displayName} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-7 lg:p-8">
        <p className="text-xs font-medium tracking-[0.14em] text-green-700 uppercase">
          {doctor.department}
        </p>
        <h3 className="mt-3 font-display text-[1.25rem] leading-snug text-ink lg:text-[1.4rem]">
          {doctor.displayName}
        </h3>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{doctor.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {doctor.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full border border-[var(--border-soft)] bg-green-050 px-3.5 py-1.5 text-[0.8125rem] text-green-900"
            >
              {interest}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 pt-1 sm:flex-row">
          <a
            href={doctor.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("view_doctor", { doctor: doctor.name })}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] px-5 text-[0.9375rem] font-medium text-green-800 transition-colors hover:bg-green-050"
          >
            Profili İncele
            <span className="sr-only">({doctor.displayName}, yeni sekmede açılır)</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5h10v10M19 5 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#iletisim"
            onClick={() => track("click_contact_cta", { location: "doctor_card" })}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-green-700 px-5 text-[0.9375rem] font-medium text-white transition-colors hover:bg-green-900"
          >
            Bilgi Al
          </a>
        </div>
      </div>
    </article>
  );
}

/** Fotoğraf tanımlı değilse: bozuk görsel yerine kurumsal nötr yüzey. */
function DoctorPlaceholder({ name }: { name: string }) {
  const initials = name
    .replace(/(Op\.|Uzm\.|Prof\.|Doç\.|Dr\.)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");

  return (
    <div className="flex size-full items-center justify-center bg-green-050" aria-hidden="true">
      <span className="font-display text-[2rem] text-green-700/40">{initials}</span>
    </div>
  );
}
