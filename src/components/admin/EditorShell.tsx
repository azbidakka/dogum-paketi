"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { saveSectionAction } from "@/app/admin/actions";
import type { SectionKey, SiteContent } from "@/lib/content/schema";

type Status =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string; issues?: string[] };

type Props<K extends SectionKey> = {
  section: K;
  initial: SiteContent[K];
  defaults: SiteContent[K];
  /** Kayıttan önce boş/geçici değerleri temizler (ör. boş bağlantı). */
  normalize?: (value: SiteContent[K]) => SiteContent[K];
  children: (
    value: SiteContent[K],
    update: (mutate: (draft: SiteContent[K]) => void) => void
  ) => ReactNode;
};

/**
 * Bir bölümün düzenleme durumunu yönetir: taslak, kaydetme, geri alma, varsayılana
 * dönme ve kaydedilmemiş değişiklik uyarısı.
 */
export default function EditorShell<K extends SectionKey>({
  section,
  initial,
  defaults,
  normalize,
  children,
}: Props<K>) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(mutate: (draft: SiteContent[K]) => void) {
    setValue((previous) => {
      const next = structuredClone(previous);
      mutate(next);
      return next;
    });
    setStatus({ type: "idle" });
  }

  function save() {
    const payload = normalize ? normalize(structuredClone(value)) : value;
    startTransition(async () => {
      try {
        const result = await saveSectionAction(section, payload);
        if (result.ok) {
          setValue(payload);
          setSaved(payload);
          setStatus({ type: "success", message: result.message });
        } else {
          setStatus({ type: "error", message: result.message, issues: result.issues });
        }
      } catch {
        setStatus({ type: "error", message: "Sunucuya ulaşılamadı. Oturumunuz sona ermiş olabilir." });
      }
    });
  }

  return (
    <div className="space-y-6">
      {children(value, update)}

      <div className="sticky bottom-4 z-10 rounded-[20px] border border-line bg-white/95 p-4 shadow-[0_8px_30px_rgba(23,35,28,0.08)] backdrop-blur sm:p-5">
        {status.type === "error" ? (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[0.875rem] text-red-800">
            <p className="font-medium">{status.message}</p>
            {status.issues?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {status.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-[0.875rem] text-muted">
            {status.type === "success" ? (
              <span className="font-medium text-green-800">✓ {status.message}</span>
            ) : dirty ? (
              "Kaydedilmemiş değişiklikler var."
            ) : (
              "Tüm değişiklikler kayıtlı."
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Bu bölüm başlangıçtaki varsayılan içeriğe döndürülsün mü? Kaydetmeden yayına girmez.")) {
                  update((draft) => Object.assign(draft, structuredClone(defaults)));
                }
              }}
              className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[0.875rem] text-muted hover:bg-offwhite hover:text-ink"
            >
              Varsayılana döndür
            </button>
            <button
              type="button"
              disabled={!dirty || pending}
              onClick={() => {
                setValue(saved);
                setStatus({ type: "idle" });
              }}
              className="inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-[0.875rem] font-medium text-text hover:bg-offwhite disabled:opacity-40"
            >
              Değişiklikleri geri al
            </button>
            <button
              type="button"
              disabled={!dirty || pending}
              onClick={save}
              className="inline-flex min-h-[44px] items-center rounded-full bg-green-700 px-6 text-[0.875rem] font-medium text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Kaydediliyor…" : "Kaydet ve yayınla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
