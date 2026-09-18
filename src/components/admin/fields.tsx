"use client";

import Image from "next/image";
import { useId, useState, type ChangeEvent, type ReactNode } from "react";
import { uploadImageAction } from "@/app/admin/actions";

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-muted/70 focus:border-green-700";

/** Dizideki öğeyi bir yukarı/aşağı taşır (yerinde). */
export function moveItem<T>(list: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return;
  const [item] = list.splice(index, 1);
  if (item !== undefined) list.splice(target, 0, item);
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[20px] border border-line bg-white p-5 sm:p-7">
      <h2 className="text-[1.0625rem] font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-1 max-w-[72ch] text-[0.875rem] text-muted">{description}</p> : null}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

type TextFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
  type?: "text" | "url";
  optional?: boolean;
};

export function TextField({
  label,
  value,
  onChange,
  hint,
  multiline,
  rows = 4,
  maxLength,
  placeholder,
  type = "text",
  optional,
}: TextFieldProps) {
  const id = useId();
  const current = value ?? "";
  const describedBy = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-[0.875rem] font-medium text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(isteğe bağlı)</span> : null}
      </label>
      {hint ? (
        <p id={describedBy} className="mt-0.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={current}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={current}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      )}
      {maxLength ? (
        <p className="mt-1 text-right text-[0.75rem] text-muted">
          {current.length}/{maxLength}
        </p>
      ) : null}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  hint,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      {hint ? <p className="mt-0.5 text-[0.8125rem] text-muted">{hint}</p> : null}
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? undefined : Number(event.target.value))
        }
        className={`${inputClass} max-w-[8rem]`}
      />
    </div>
  );
}

const normalizeLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/** Her satır bir öğe olan liste alanı (ör. testler, ilgi alanları). */
export function LinesField({
  label,
  value,
  onChange,
  hint,
  rows = 5,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  rows?: number;
}) {
  const id = useId();
  const [text, setText] = useState(value.join("\n"));
  const [previous, setPrevious] = useState(value);

  // Dışarıdan gelen değişiklikte (sıfırlama, taşıma) metni eşitle.
  if (value !== previous) {
    setPrevious(value);
    if (normalizeLines(text).join("\n") !== value.join("\n")) setText(value.join("\n"));
  }

  return (
    <div>
      <label htmlFor={id} className="block text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <p className="mt-0.5 text-[0.8125rem] text-muted">{hint ?? "Her satıra bir öğe yazın."}</p>
      <textarea
        id={id}
        rows={rows}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          onChange(normalizeLines(event.target.value));
        }}
        className={`${inputClass} resize-y leading-relaxed`}
      />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex size-9 items-center justify-center rounded-full text-[0.9375rem] transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        tone === "danger" ? "text-red-700 hover:bg-red-50" : "text-muted hover:bg-white hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** Sıralanabilir, açılır-kapanır öğe listesi. */
export function ListEditor<T>({
  items,
  itemTitle,
  renderItem,
  onAdd,
  onRemove,
  onMove,
  addLabel = "Ekle",
  minItems = 0,
  maxItems = 50,
  emptyText = "Henüz öğe yok.",
}: {
  items: T[];
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  addLabel?: string;
  minItems?: number;
  maxItems?: number;
  emptyText?: string;
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-4 text-[0.875rem] text-muted">
          {emptyText}
        </p>
      ) : null}

      {items.map((item, index) => (
        <details key={index} className="rounded-2xl border border-line bg-offwhite/70">
          <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 py-2 pr-2 pl-4">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[0.75rem] font-medium text-muted">
                {index + 1}
              </span>
              <span className="truncate text-[0.9375rem] font-medium text-ink">
                {itemTitle(item, index)}
              </span>
            </span>
            {/* Düğmelere tıklamak öğeyi açıp kapatmasın */}
            <span className="flex shrink-0 items-center" onClick={(event) => event.preventDefault()}>
              <IconButton label="Yukarı taşı" disabled={index === 0} onClick={() => onMove(index, -1)}>
                ↑
              </IconButton>
              <IconButton
                label="Aşağı taşı"
                disabled={index === items.length - 1}
                onClick={() => onMove(index, 1)}
              >
                ↓
              </IconButton>
              <IconButton
                label="Sil"
                tone="danger"
                disabled={items.length <= minItems}
                onClick={() => {
                  if (window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) onRemove(index);
                }}
              >
                ✕
              </IconButton>
            </span>
          </summary>
          <div className="space-y-4 rounded-b-2xl border-t border-line bg-white p-4 sm:p-5">
            {renderItem(item, index)}
          </div>
        </details>
      ))}

      {items.length < maxItems ? (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dashed border-green-700/40 px-4 text-[0.875rem] font-medium text-green-800 hover:bg-green-050"
        >
          + {addLabel}
        </button>
      ) : null}
    </div>
  );
}

/** Görsel önizleme + yükleme + (isteğe bağlı) alt metin. */
export function ImageField({
  label,
  src,
  onSrcChange,
  alt,
  onAltChange,
  slot,
  hint,
  aspect = "aspect-4/3",
}: {
  label: string;
  src: string | undefined;
  onSrcChange: (src: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  slot: string;
  hint?: string;
  aspect?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setError(null);
    setBusy(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("slot", slot);
      const result = await uploadImageAction(formData);
      if (result.ok) onSrcChange(result.src);
      else setError(result.message);
    } catch {
      setError("Yükleme sırasında bir hata oluştu. Dosya boyutunu kontrol edip tekrar deneyin.");
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-sand`}>
        {src ? (
          <Image src={src} alt="" fill sizes="220px" className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[0.8125rem] text-muted">
            Görsel yok
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[0.875rem] font-medium text-ink">{label}</p>
          {hint ? <p className="mt-0.5 text-[0.8125rem] text-muted">{hint}</p> : null}
        </div>

        <label
          className={[
            "inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-line bg-white px-5 text-[0.875rem] font-medium text-green-800 hover:bg-green-050",
            busy ? "pointer-events-none opacity-60" : "",
          ].join(" ")}
        >
          {busy ? "Yükleniyor…" : "Yeni görsel yükle"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={busy}
            onChange={handleFile}
          />
        </label>
        <p className="text-[0.75rem] break-all text-muted">
          {src ?? "—"} · JPG, PNG, WebP veya AVIF, en fazla 10 MB
        </p>

        {error ? (
          <p role="alert" className="text-[0.8125rem] text-red-700">
            {error}
          </p>
        ) : null}

        {onAltChange ? (
          <TextField
            label="Görsel açıklaması (alt metin)"
            hint="Görme engelli ziyaretçiler ve arama motorları için görseli kısaca anlatın."
            value={alt}
            onChange={onAltChange}
            maxLength={300}
          />
        ) : null}
      </div>
    </div>
  );
}
