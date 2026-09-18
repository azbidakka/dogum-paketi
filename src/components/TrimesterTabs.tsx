"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Trimester } from "@/data/content";

/**
 * Doğum paketinin trimester bazlı kontrol takvimi.
 * Erişilebilir sekme yapısı (WAI-ARIA tabs): ok tuşları, Home/End, roving tabindex.
 *
 * JS kapalıyken: sekme listesi gizlenir ve üç dönem alt alta görünür. Gizleme
 * yalnızca `html.js` altında CSS ile yapıldığı için hidrasyonda kayma olmaz
 * (bkz. globals.css → [data-tabpanel]).
 */
export default function TrimesterTabs({ trimesters }: { trimesters: Trimester[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = trimesters.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--border-soft)] bg-cream">
      <div
        role="tablist"
        aria-label="Trimesterlere göre doğum paketi içeriği"
        data-tablist
        className="grid grid-cols-3 border-b border-[var(--border-soft)]"
      >
        {trimesters.map((trimester, index) => {
          const selected = index === active;
          return (
            <button
              key={trimester.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`trimester-tab-${trimester.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`trimester-panel-${trimester.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={[
                "relative flex min-h-[64px] flex-col items-start justify-center gap-0.5 px-2 py-3 text-left transition-colors sm:px-6 sm:py-4 lg:px-8 lg:py-5",
                index > 0 ? "border-l border-[var(--border-soft)]" : "",
                selected ? "bg-white" : "hover:bg-white/60",
              ].join(" ")}
            >
              <span
                className={[
                  "text-[0.875rem] font-semibold sm:text-[1.0625rem]",
                  selected ? "text-green-800" : "text-ink",
                ].join(" ")}
              >
                {/* Dar ekranda "Trimester" kelimesi iki satıra kırılmasın */}
                <span className="sm:hidden">{index + 1}. Dönem</span>
                <span className="hidden sm:inline">{trimester.label}</span>
              </span>
              <span className="text-[0.75rem] text-muted sm:text-[0.8125rem]">
                {trimester.weeks}
                <span className="hidden sm:inline"> · {trimester.visits.length} kontrol</span>
              </span>
              <span
                aria-hidden="true"
                className={[
                  "absolute inset-x-0 bottom-0 h-0.5 transition-colors",
                  selected ? "bg-green-700" : "bg-transparent",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>

      {trimesters.map((trimester, index) => (
        <div
          key={trimester.id}
          id={`trimester-panel-${trimester.id}`}
          role="tabpanel"
          aria-labelledby={`trimester-tab-${trimester.id}`}
          data-tabpanel
          data-active={index === active ? "true" : "false"}
          tabIndex={0}
          className="border-t border-[var(--border-soft)] bg-white p-5 first-of-type:border-t-0 sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-12">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-green-700 uppercase">
                {trimester.label} · {trimester.weeks}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.25rem,4.4vw,1.45rem)] leading-[1.3] text-ink">
                {trimester.title}
              </h3>
              <p className="mt-4 max-w-[40ch] text-[0.9375rem] leading-relaxed text-text">
                {trimester.intro}
              </p>
            </div>

            <ol className="space-y-px overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--border-soft)]">
              {trimester.visits.map((visit) => (
                <li
                  key={visit.week}
                  className="grid gap-3 bg-white p-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6 lg:p-6"
                >
                  <div>
                    <p className="text-[1rem] font-semibold text-green-800">{visit.week}</p>
                    {visit.month ? (
                      <p className="text-[0.8125rem] text-muted">{visit.month}</p>
                    ) : null}
                  </div>

                  <div>
                    <ul className="space-y-2.5">
                      {visit.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-start gap-2.5 text-[0.9375rem] leading-snug text-text"
                        >
                          <CheckIcon />
                          <span>
                            {item.name}
                            {item.count ? (
                              <span className="ml-2 inline-block rounded-full bg-green-050 px-2 py-0.5 align-middle text-[0.75rem] font-medium text-green-800">
                                {item.count} kez
                              </span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {visit.labs ? (
                      <div className="mt-5 rounded-2xl bg-cream p-4 sm:p-5">
                        <p className="text-[0.875rem] font-semibold text-ink">
                          Laboratuvar tetkikleri ·{" "}
                          {visit.labs.reduce((total, group) => total + group.tests.length, 0)} test
                        </p>
                        <div className="mt-4 space-y-4">
                          {visit.labs.map((group) => (
                            <div key={group.group}>
                              <p className="text-[0.75rem] font-medium tracking-[0.12em] text-green-700 uppercase">
                                {group.group}
                              </p>
                              <ul className="mt-2 flex flex-wrap gap-1.5">
                                {group.tests.map((test) => (
                                  <li
                                    key={test}
                                    className="rounded-full border border-[var(--border-soft)] bg-white px-3 py-1 text-[0.8125rem] text-text"
                                  >
                                    {test}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-green-700"
    >
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
