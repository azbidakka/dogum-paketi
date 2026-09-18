"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MEDIA, NAV, SITE } from "@/data/site";
import { track } from "@/lib/track";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Menü açıkken arka planın kaymasını engelle + Escape ile kapat
  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-white/92 backdrop-blur-md"
          : "border-b border-transparent bg-cream/80 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          className="flex min-h-[44px] shrink-0 items-center"
          aria-label={`${SITE.name} — sayfa başına dön`}
        >
          <Image
            src={MEDIA.logo}
            alt={SITE.name}
            width={196}
            height={32}
            priority
            className="h-7 w-auto lg:h-8"
          />
        </a>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.9375rem] text-text transition-colors hover:text-green-700"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={SITE.phoneHref}
            onClick={() => track("click_phone", { location: "header" })}
            className="hidden items-center gap-2 rounded-full border border-[var(--border-soft)] px-4 py-2.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-050 sm:inline-flex lg:hidden xl:inline-flex"
          >
            <PhoneIcon />
            {SITE.phoneDisplay}
          </a>

          <a
            href="#iletisim"
            onClick={() => track("click_contact_cta", { location: "header" })}
            className="hidden rounded-full bg-green-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-900 sm:inline-block"
          >
            Bilgi Al
          </a>

          {/* Mobil: telefon her zaman tek dokunuş uzakta */}
          <a
            href={SITE.phoneHref}
            onClick={() => track("click_phone", { location: "header_mobile" })}
            aria-label={`Telefon: ${SITE.phoneDisplay}`}
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--border-soft)] text-green-800 sm:hidden"
          >
            <PhoneIcon />
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--border-soft)] text-ink lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        id="mobil-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-line bg-white lg:hidden"
      >
        <nav aria-label="Mobil menü" className="container-page py-4">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="flex min-h-[52px] items-center border-b border-line text-base text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 pb-2">
            <a
              href="#iletisim"
              onClick={() => {
                track("click_contact_cta", { location: "mobile_menu" });
                close();
              }}
              className="flex min-h-[52px] items-center justify-center rounded-full bg-green-700 px-6 text-base font-medium text-white"
            >
              Bilgi Al
            </a>
            <a
              href={SITE.phoneHref}
              onClick={() => track("click_phone", { location: "mobile_menu" })}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[var(--border-soft)] px-6 text-base font-medium text-green-800"
            >
              <PhoneIcon />
              {SITE.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 2.5h2.2l1.6 4-1.9 1.4a12.4 12.4 0 0 0 5.6 5.6l1.4-1.9 4 1.6v2.2a2.6 2.6 0 0 1-2.9 2.6C10.2 17.4 6.6 13.8 4 8.4A2.6 2.6 0 0 1 6.6 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
