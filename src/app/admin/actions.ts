"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken, type AdminSession } from "@/lib/admin/session";
import { SECTION_KEYS, type SectionKey } from "@/lib/content/schema";
import { restoreBackup, saveSection, saveUpload } from "@/lib/content/store";
import { sendTestMail, verifyMailSettings } from "@/lib/mail";
import { encryptSecret, getSettings, saveSettings } from "@/lib/settings";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; issues?: string[] };

export type UploadResult = { ok: true; src: string } | { ok: false; message: string };

/** Middleware'e ek olarak her işlem oturumu kendisi doğrular. */
async function requireSession(): Promise<AdminSession> {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  return session;
}

/** Değişiklikleri sitede anında yayına alır. */
function publish() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function saveSectionAction(section: SectionKey, data: unknown): Promise<ActionResult> {
  const session = await requireSession();
  if (!SECTION_KEYS.includes(section)) return { ok: false, message: "Geçersiz bölüm." };

  const result = await saveSection(section, data, session.username);
  if (!result.ok) return { ok: false, message: result.error, issues: result.issues };

  publish();
  return { ok: true, message: "Kaydedildi. Değişiklikler sitede yayında." };
}

export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Lütfen bir görsel seçin." };
  }

  const result = await saveUpload(file, String(formData.get("slot") ?? "gorsel"));
  return result.ok ? { ok: true, src: result.src } : { ok: false, message: result.error };
}

export async function restoreBackupAction(name: string): Promise<ActionResult> {
  const session = await requireSession();
  const result = await restoreBackup(name, session.username);
  if (!result.ok) return { ok: false, message: result.error };

  publish();
  return { ok: true, message: "Yedek geri yüklendi ve sitede yayına alındı." };
}

/* --------------------------------------------------------- e-posta ayarları */

export type SettingsState = { ok?: boolean; error?: string; message?: string };

function toBool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

/** Ayarlar formundan gelen değerleri okur. */
function readMailForm(formData: FormData) {
  const port = Number(formData.get("port") ?? 587) || 587;

  return {
    enabled: toBool(formData.get("enabled")),
    host: String(formData.get("host") ?? "").trim(),
    port,
    secure: port === 465,
    requireTls: toBool(formData.get("requireTls")),
    rejectUnauthorized: toBool(formData.get("rejectUnauthorized")),
    user: String(formData.get("user") ?? "").trim(),
    fromName: String(formData.get("fromName") ?? "").trim(),
    fromAddress: String(formData.get("fromAddress") ?? "").trim(),
    to: String(formData.get("to") ?? "").trim(),
    subjectPrefix: String(formData.get("subjectPrefix") ?? "").trim(),
    replyToSubmitter: toBool(formData.get("replyToSubmitter")),
    password: String(formData.get("password") ?? ""),
  };
}

export async function saveMailSettingsAction(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  try {
    await requireSession();

    const input = readMailForm(formData);
    if (!input.host || !input.user) {
      return { error: "Sunucu adresi ve kullanıcı adı zorunludur." };
    }

    const settings = await getSettings();
    const { password, ...mail } = input;

    settings.mail = {
      ...settings.mail,
      ...mail,
      // Şifre alanı boş bırakıldıysa kayıtlı şifre korunur.
      passwordEnc: password ? encryptSecret(password) : settings.mail.passwordEnc,
    };

    await saveSettings(settings);
    revalidatePath("/admin", "layout");

    return { ok: true, message: "E-posta ayarları kaydedildi." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Ayarlar kaydedilemedi." };
  }
}

export async function testMailAction(
  _previous: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  try {
    await requireSession();

    const { password, ...mail } = readMailForm(formData);
    const override = { ...mail, password: password || undefined };

    const connection = await verifyMailSettings(override);
    if (!connection.ok) return { error: `Bağlantı kurulamadı — ${connection.error}` };

    const sent = await sendTestMail(override);
    if (!sent.ok) return { error: `Gönderim başarısız — ${sent.error}` };

    return { ok: true, message: `Test e-postası ${mail.to} adresine gönderildi.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Test gönderilemedi." };
  }
}

export async function logoutAction() {
  (await cookies()).set(SESSION_COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/login");
}
