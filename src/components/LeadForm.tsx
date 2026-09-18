"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { formatPhone, validateLead, type LeadErrors, MESSAGE_MAX } from "@/lib/lead";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY = { name: "", phone: "", email: "", message: "" };

export default function LeadForm() {
  const id = useId();
  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [utm, setUtm] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Kampanya kaynağını yalnızca oturum boyunca sakla (bkz. Çerez Politikası).
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("tusa_utm");
      const params = new URLSearchParams(window.location.search);
      const fromUrl = ["utm_source", "utm_medium", "utm_campaign"]
        .map((key) => params.get(key))
        .filter(Boolean)
        .join(" / ");

      if (fromUrl) {
        sessionStorage.setItem("tusa_utm", fromUrl);
        setUtm(fromUrl);
      } else if (stored) {
        setUtm(stored);
      }
    } catch {
      // sessionStorage kullanılamıyorsa kaynak bilgisi olmadan devam et.
    }
  }, []);

  // Durum mesajını odağa taşı (role zaten ekran okuyucuya bildirir).
  useEffect(() => {
    if (status === "success" || status === "error") statusRef.current?.focus();
  }, [status]);

  function update(field: keyof typeof EMPTY, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return; // çift gönderimi engelle

    const payload = { ...values, consent, website: honeypotRef.current?.value ?? "" };
    const nextErrors = validateLead(payload);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(id + "-" + firstField)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    setServerMessage("");
    track("submit_lead_form", { form: "iletisim" });

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, utm }),
      });

      const data: { ok?: boolean; message?: string; errors?: LeadErrors } = await response
        .json()
        .catch(() => ({}));

      if (response.ok && data.ok) {
        setStatus("success");
        setValues(EMPTY);
        setConsent(false);
        track("lead_form_success", { form: "iletisim" });
        return;
      }

      if (data.errors) setErrors(data.errors);
      setStatus("error");
      setServerMessage(
        data.message ??
          "Talebiniz iletilemedi. Lütfen tekrar deneyin veya " +
            SITE.phoneDisplay +
            " numaralı telefondan bize ulaşın."
      );
    } catch {
      setStatus("error");
      setServerMessage(
        "Bağlantı kurulamadı. Lütfen tekrar deneyin veya " +
          SITE.phoneDisplay +
          " numaralı telefondan bize ulaşın."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-[20px] border border-[var(--border-soft)] bg-green-050 p-8 lg:p-10"
      >
        <h3 className="font-display text-[1.3rem] text-ink">Talebiniz alındı.</h3>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-text">
          İletişim bilgileriniz TUSA Hastanesi&rsquo;ne iletildi. Ekibimiz en kısa sürede size dönüş
          yapacaktır. Acil bir durumunuz varsa lütfen doğrudan {SITE.phoneDisplay} numaralı
          telefondan bize ulaşın.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 inline-flex min-h-[48px] items-center rounded-full border border-[var(--border-soft)] bg-white px-6 text-[0.9375rem] font-medium text-green-800"
        >
          Yeni bir talep gönder
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-[20px] border border-[var(--border-soft)] bg-white p-6 sm:p-8 lg:p-10"
    >
      {/* Bot tuzağı — ekran okuyuculardan ve klavyeden gizli */}
      <div aria-hidden="true" className="absolute size-px overflow-hidden opacity-0">
        <label htmlFor={id + "-website"}>Web sitesi</label>
        <input
          ref={honeypotRef}
          id={id + "-website"}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={id + "-name"}
          label="Ad Soyad"
          required
          error={errors.name}
          value={values.name}
          onChange={(value) => update("name", value)}
          autoComplete="name"
        />

        <Field
          id={id + "-phone"}
          label="Telefon"
          required
          type="tel"
          inputMode="tel"
          placeholder="0532 123 45 67"
          error={errors.phone}
          value={values.phone}
          onChange={(value) => update("phone", formatPhone(value))}
          autoComplete="tel"
        />

        <Field
          id={id + "-email"}
          label="E-posta"
          type="email"
          inputMode="email"
          optional
          error={errors.email}
          value={values.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
          className="sm:col-span-2"
        />

        <Field
          id={id + "-message"}
          label="Mesaj"
          optional
          multiline
          maxLength={MESSAGE_MAX}
          error={errors.message}
          value={values.message}
          onChange={(value) => update("message", value)}
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            id={id + "-consent"}
            type="checkbox"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (errors.consent) setErrors((previous) => ({ ...previous, consent: undefined }));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? id + "-consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-green-700"
          />
          <label htmlFor={id + "-consent"} className="text-[0.875rem] leading-relaxed text-text">
            Kişisel verilerimin, iletişim talebimin değerlendirilmesi amacıyla işlenmesine ilişkin{" "}
            <a
              href="/aydinlatma-metni"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-green-800 underline underline-offset-2"
            >
              Aydınlatma Metni
            </a>
            &rsquo;ni okudum.
          </label>
        </div>
        {errors.consent ? (
          <p id={id + "-consent-error"} className="mt-2 pl-8 text-[0.8125rem] text-red-700">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-green-700 px-8 text-[0.9375rem] font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Gönderiliyor…
          </>
        ) : (
          "Bilgi Al"
        )}
      </button>

      {status === "error" && serverMessage ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-[0.875rem] text-red-800"
        >
          {serverMessage}
        </div>
      ) : null}

      <p className="mt-6 max-w-[62ch] text-[0.8125rem] leading-relaxed text-muted">
        Bu form üzerinden sağlık durumunuza ilişkin özel nitelikli kişisel veri paylaşmanız
        gerekmez. Tanı ve tedaviye yönelik kişisel değerlendirme yalnızca hekim muayenesi ile
        yapılır.
      </p>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  optional,
  multiline,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
  maxLength,
  className,
}: FieldProps) {
  const errorId = id + "-error";
  const inputClassName = [
    "w-full rounded-2xl border bg-white px-4 py-3.5 text-[0.9375rem] text-ink transition-colors placeholder:text-muted/70",
    error ? "border-red-400" : "border-line focus:border-green-700",
  ].join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.875rem] font-medium text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(isteğe bağlı)</span> : null}
        {required ? (
          <span className="ml-1 text-green-700" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {multiline ? (
        <textarea
          id={id}
          name={id}
          value={value}
          rows={4}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName + " resize-y"}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          inputMode={inputMode}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      )}

      {error ? (
        <p id={errorId} className="mt-2 text-[0.8125rem] text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
