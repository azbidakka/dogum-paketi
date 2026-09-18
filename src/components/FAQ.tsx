"use client";

import { useState } from "react";
import type { FaqContent } from "@/lib/content/schema";
import SectionIntro from "@/components/SectionIntro";

export default function FAQ({ groups }: { groups: FaqContent["groups"] }) {
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  // Anahtar: "<grupId>-<index>". İlk soru açık başlar.
  const [openId, setOpenId] = useState<string | null>(groups[0] ? `${groups[0].id}-0` : null);

  return (
    <section id="sss" className="scroll-mt-24 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
            <SectionIntro
              label="06 · Sık Sorulanlar"
              title="Gebelik ve doğum süreci hakkında"
              accent="merak edilenler."
              titleClassName="max-w-[18ch]"
            >
              <p>
                {total} soruyu konu başlıklarına göre grupladık. Aradığınız yanıtı bulamazsanız
                ekibimize ulaşabilirsiniz.
              </p>
            </SectionIntro>

            <nav aria-label="Soru başlıkları" className="mt-8">
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
                {groups.map((group) => (
                  <li key={group.id}>
                    <a
                      href={`#sss-${group.id}`}
                      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-[var(--border-soft)] bg-white px-4 text-[0.875rem] font-medium text-green-800 transition-colors hover:bg-green-050 lg:w-full lg:justify-between lg:rounded-xl lg:px-5"
                    >
                      {group.title}
                      <span className="text-[0.8125rem] font-normal text-muted">{group.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="space-y-10">
            {groups.map((group) => (
              <div key={group.id} id={`sss-${group.id}`} className="scroll-mt-[calc(var(--header-h)+24px)]">
                <h3 className="mb-4 text-xs font-medium tracking-[0.14em] text-green-700 uppercase">
                  {group.title}
                </h3>

                <div className="overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-white">
                  {group.items.map((item, index) => {
                    const id = `${group.id}-${index}`;
                    const isOpen = openId === id;
                    const panelId = `sss-panel-${id}`;
                    const buttonId = `sss-button-${id}`;

                    return (
                      <div
                        key={`${index}-${item.q}`}
                        className="border-b border-[var(--border-soft)] last:border-b-0"
                      >
                        <h4>
                          <button
                            id={buttonId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpenId(isOpen ? null : id)}
                            className="flex w-full items-start justify-between gap-5 px-6 py-5 text-left text-[1rem] leading-snug font-medium text-ink transition-colors hover:bg-green-050/60 lg:px-8 lg:py-6"
                          >
                            <span>{item.q}</span>
                            <span
                              aria-hidden="true"
                              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-soft)] text-green-700"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M12 5v14M5 12h14"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  className={[
                                    "origin-center transition-transform duration-300",
                                    isOpen ? "rotate-45" : "rotate-0",
                                  ].join(" ")}
                                />
                              </svg>
                            </span>
                          </button>
                        </h4>

                        <div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          hidden={!isOpen}
                          className="px-6 pb-6 lg:px-8 lg:pb-7"
                        >
                          <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed whitespace-pre-line text-muted">
                            {item.a}
                          </p>
                          {item.link ? (
                            <a
                              href={item.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-[0.875rem] font-medium text-green-800 underline underline-offset-4 hover:text-green-700"
                            >
                              {item.link.label}
                              <span className="sr-only">(yeni sekmede açılır)</span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
