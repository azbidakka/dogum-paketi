"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveMailSettingsAction,
  testMailAction,
  type SettingsState,
} from "@/app/admin/actions";
import type { MailSettings } from "@/lib/settings";

const field =
  "mt-2 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-green-700";
const labelClass = "block text-[0.875rem] font-medium text-ink";
const hintClass = "mt-1.5 text-[0.8125rem] leading-relaxed text-muted";

function Feedback({ state }: { state: SettingsState }) {
  const { pending } = useFormStatus();
  if (pending) return null;

  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-3 text-[0.875rem] leading-relaxed text-red-800"
      >
        {state.error}
      </p>
    );
  }

  if (state.ok && state.message) {
    return (
      <p className="rounded-xl border border-green-200 bg-green-050 p-3 text-[0.875rem] text-green-900">
        ✓ {state.message}
      </p>
    );
  }

  return null;
}

function Buttons({ testAction }: { testAction: (formData: FormData) => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[48px] items-center rounded-full bg-green-700 px-7 text-[0.9375rem] font-medium text-white transition-colors hover:bg-green-900 disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : "Ayarları kaydet"}
      </button>
      <button
        type="submit"
        formAction={testAction}
        disabled={pending}
        className="inline-flex min-h-[48px] items-center rounded-full border border-line px-6 text-[0.9375rem] font-medium text-green-800 transition-colors hover:bg-green-050 disabled:opacity-60"
      >
        Test e-postası gönder
      </button>
    </div>
  );
}

export default function MailSettingsForm({
  settings,
  hasPassword,
}: {
  settings: MailSettings;
  hasPassword: boolean;
}) {
  const [saveState, saveAction] = useActionState<SettingsState, FormData>(
    saveMailSettingsAction,
    {}
  );
  const [testState, testAction] = useActionState<SettingsState, FormData>(testMailAction, {});
  const [port, setPort] = useState(String(settings.port));

  return (
    <form action={saveAction} className="space-y-6">
      <section className="rounded-[20px] border border-line bg-white p-5 sm:p-7">
        <label className="flex items-start gap-3 rounded-2xl bg-green-050 p-4">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={settings.enabled}
            className="mt-0.5 size-4 shrink-0 accent-green-700"
          />
          <span className="text-[0.875rem] leading-relaxed text-text">
            <span className="font-medium text-ink">Form talepleri e-posta ile bildirilsin</span>
            <br />
            Kapalıyken form gönderimi ziyaretçiyi telefonla aramaya yönlendirir.
          </span>
        </label>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="mail-host" className={labelClass}>
              Sunucu adresi
            </label>
            <input
              id="mail-host"
              name="host"
              type="text"
              required
              defaultValue={settings.host}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="mail-port" className={labelClass}>
              Port
            </label>
            <input
              id="mail-port"
              name="port"
              type="number"
              min={1}
              max={65535}
              required
              list="mail-port-secenekleri"
              value={port}
              onChange={(event) => setPort(event.target.value)}
              className={field}
            />
            <datalist id="mail-port-secenekleri">
              <option value="587">STARTTLS (önerilen)</option>
              <option value="465">Örtük TLS</option>
              <option value="25">Şifresiz / iç relay</option>
            </datalist>
            <p className={hintClass}>
              587 standarttır ve TUSA sunucusunda açıktır. 465 seçilirse örtük TLS kullanılır.
            </p>
          </div>

          <div>
            <label htmlFor="mail-user" className={labelClass}>
              Kullanıcı adı
            </label>
            <input
              id="mail-user"
              name="user"
              type="text"
              required
              autoComplete="off"
              defaultValue={settings.user}
              className={field}
            />
            <p className={hintClass}>
              E-posta adresi değil, <strong>oturum açma adı</strong> girilir. Sunucunun Active
              Directory alan adı <code>gisbirhastanesi.local</code> olduğu için doğru biçim{" "}
              <code>kullanici@gisbirhastanesi.local</code> veya{" "}
              <code>GISBIRHASTANESI\kullanici</code> olur.
            </p>
          </div>

          <div>
            <label htmlFor="mail-pass" className={labelClass}>
              Şifre
            </label>
            <input
              id="mail-pass"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder={hasPassword ? "•••••••• (kayıtlı)" : "Posta kutusu şifresi"}
              className={field}
            />
            <p className={hintClass}>
              {hasPassword
                ? "Boş bırakırsanız kayıtlı şifre korunur."
                : "Şifre sunucuda şifrelenerek saklanır."}
            </p>
          </div>

          <div>
            <label htmlFor="mail-from-name" className={labelClass}>
              Gönderen adı
            </label>
            <input
              id="mail-from-name"
              name="fromName"
              type="text"
              defaultValue={settings.fromName}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="mail-from" className={labelClass}>
              Gönderen adresi
            </label>
            <input
              id="mail-from"
              name="fromAddress"
              type="email"
              defaultValue={settings.fromAddress}
              className={field}
            />
            <p className={hintClass}>Oturum açan posta kutusuyla aynı olmalıdır.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="mail-to" className={labelClass}>
              Bildirim alacak adresler
            </label>
            <input
              id="mail-to"
              name="to"
              type="text"
              defaultValue={settings.to}
              className={field}
            />
            <p className={hintClass}>Birden fazla adres için virgülle ayırın.</p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="mail-subject" className={labelClass}>
              Konu ön eki
            </label>
            <input
              id="mail-subject"
              name="subjectPrefix"
              type="text"
              defaultValue={settings.subjectPrefix}
              className={field}
            />
            <p className={hintClass}>
              Outlook kurallarıyla klasörlemeyi kolaylaştırır. Örn. [Doğum Paketi]
            </p>
          </div>
        </div>

        <fieldset className="mt-6 space-y-3 border-t border-line pt-5">
          <legend className="sr-only">Bağlantı seçenekleri</legend>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="requireTls"
              defaultChecked={settings.requireTls}
              className="mt-0.5 size-4 shrink-0 accent-green-700"
            />
            <span className="text-[0.875rem] leading-relaxed text-text">
              STARTTLS zorunlu olsun{" "}
              <span className="text-muted">
                — 587 portu için açık kalmalı, şifreler şifreli kanaldan gider.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="rejectUnauthorized"
              defaultChecked={settings.rejectUnauthorized}
              className="mt-0.5 size-4 shrink-0 accent-green-700"
            />
            <span className="text-[0.875rem] leading-relaxed text-text">
              Sertifika doğrulamasını zorunlu tut{" "}
              <span className="text-muted">
                — sunucunun sertifikası geçerli olduğu için açık bırakılmalı.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="replyToSubmitter"
              defaultChecked={settings.replyToSubmitter}
              className="mt-0.5 size-4 shrink-0 accent-green-700"
            />
            <span className="text-[0.875rem] leading-relaxed text-text">
              Yanıtla, talebi bırakan kişiye gitsin{" "}
              <span className="text-muted">
                — yalnızca e-posta paylaşan kişiler için geçerlidir.
              </span>
            </span>
          </label>
        </fieldset>
      </section>

      <div className="sticky bottom-4 z-10 space-y-4 rounded-[20px] border border-line bg-white/95 p-4 shadow-[0_8px_30px_rgba(23,35,28,0.08)] backdrop-blur sm:p-5">
        <Buttons testAction={testAction} />
        <Feedback state={saveState} />
        <Feedback state={testState} />
      </div>
    </form>
  );
}
