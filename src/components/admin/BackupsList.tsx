"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restoreBackupAction } from "@/app/admin/actions";

export type BackupRow = { name: string; label: string; sizeLabel: string };

export default function BackupsList({ backups }: { backups: BackupRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeName, setActiveName] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  if (backups.length === 0) {
    return (
      <p className="rounded-[20px] border border-dashed border-line bg-white p-6 text-[0.9375rem] text-muted">
        Henüz yedek yok. Panelden ilk kayıt yapıldıktan sonra, her kayıttan önceki sürüm burada saklanır.
      </p>
    );
  }

  function restore(name: string, label: string) {
    if (!window.confirm(`${label} tarihli yedek geri yüklensin mi? Mevcut içerik de yedeklenir.`)) return;
    setActiveName(name);
    startTransition(async () => {
      const result = await restoreBackupAction(name);
      setMessage({ ok: result.ok, text: result.message });
      setActiveName(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p
          role={message.ok ? "status" : "alert"}
          className={[
            "rounded-xl border p-3 text-[0.875rem]",
            message.ok ? "border-green-200 bg-green-050 text-green-900" : "border-red-200 bg-red-50 text-red-800",
          ].join(" ")}
        >
          {message.text}
        </p>
      ) : null}

      <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
        {backups.map((backup) => (
          <li key={backup.name} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">{backup.label}</p>
              <p className="text-[0.8125rem] text-muted">{backup.sizeLabel}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => restore(backup.name, backup.label)}
              className="inline-flex min-h-[44px] items-center rounded-full border border-line px-5 text-[0.875rem] font-medium text-green-800 hover:bg-green-050 disabled:opacity-50"
            >
              {activeName === backup.name ? "Geri yükleniyor…" : "Geri yükle"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
