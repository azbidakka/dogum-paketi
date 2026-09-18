import "server-only";
import type { Transporter } from "nodemailer";
import { formatPhone, type LeadInput } from "@/lib/lead";
import { decryptSecret, getSettings, type MailSettings } from "@/lib/settings";
import { SITE } from "@/data/site";

/**
 * TUSA Hastanesi Exchange sunucusu üzerinden gönderim
 * (sanalanjiyo.tusahastanesi.com kurulumuyla aynı ayarlar).
 *
 *  - 587 + STARTTLS zorunlu; 465 seçilirse örtük TLS
 *  - Oturum açma adı Active Directory alanındadır: kullanici@gisbirhastanesi.local
 *  - Gönderen adres posta alanındadır: info@tusahastanesi.com
 *  - Alan adının SPF kaydı bu sunucuyu yetkilendirir, DKIM imzası sunucuda üretilir;
 *    bu yüzden gönderim doğrudan web sunucusundan değil, buradan yapılır.
 */

export type MailResult = { ok: true } | { ok: false; error: string };
export type MailOverride = Partial<MailSettings> & { password?: string };

/** Exchange 2010 için transport kurar. */
function createTransport(settings: MailSettings, password: string): Promise<Transporter> {
  return import("nodemailer").then((nodemailer) =>
    nodemailer.default.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      requireTLS: !settings.secure && settings.requireTls,
      auth: { user: settings.user, pass: password },
      tls: {
        servername: settings.host,
        rejectUnauthorized: settings.rejectUnauthorized,
        // Exchange 2010 eski TLS sürümlerinde kalmış olabilir.
        minVersion: "TLSv1",
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    })
  );
}

type Prepared = { transport: Transporter; settings: MailSettings };

async function prepare(override?: MailOverride): Promise<Prepared | { error: string }> {
  const stored = await getSettings();
  const settings: MailSettings = { ...stored.mail, ...override };

  if (!settings.host || !settings.user) {
    return { error: "Sunucu adresi ve kullanıcı adı tanımlı değil." };
  }

  // Öncelik: formdan gelen şifre → kayıtlı (şifreli) şifre → ortam değişkeni.
  const password =
    (override?.password && override.password.length > 0 ? override.password : null) ??
    decryptSecret(settings.passwordEnc) ??
    process.env.SMTP_PASS ??
    "";

  if (!password) {
    return { error: "E-posta şifresi kayıtlı değil. Panelde E-posta sayfasından şifreyi girin." };
  }

  return { transport: await createTransport(settings, password), settings };
}

function friendlyError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string })?.code ?? "";

  if (/535|authentication unsuccessful|5\.7\.3/i.test(raw)) {
    return "Kimlik doğrulama reddedildi. Kullanıcı adı ve şifreyi kontrol edin (Exchange'de kullanıcı adı kullanici@gisbirhastanesi.local ya da GISBIRHASTANESI\\kullanici biçiminde olabilir).";
  }
  if (code === "ETIMEDOUT" || code === "ECONNECTION" || /timeout/i.test(raw)) {
    return `Sunucuya bağlanılamadı (${code || "zaman aşımı"}). Sunucu adresi, port ve güvenlik duvarı iznini kontrol edin.`;
  }
  if (/self.signed|unable to verify|certificate/i.test(raw)) {
    return "Sertifika doğrulanamadı. Ayarlarda “Sertifika doğrulamasını zorunlu tut” seçeneğini kapatmayı deneyin.";
  }
  if (/5\.7\.1|not permitted|relay/i.test(raw)) {
    return "Sunucu göndermeye izin vermedi. Gönderen adresin bu hesaba ait olduğundan emin olun.";
  }

  return raw;
}

/** Ayarların doğruluğunu sunucuya bağlanarak sınar (e-posta göndermez). */
export async function verifyMailSettings(override?: MailOverride): Promise<MailResult> {
  const prepared = await prepare(override);
  if ("error" in prepared) return { ok: false, error: prepared.error };

  try {
    await prepared.transport.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  } finally {
    prepared.transport.close();
  }
}

type MailInput = { subject: string; html: string; text: string; replyTo?: string; to?: string };

export async function sendMail(input: MailInput, override?: MailOverride): Promise<MailResult> {
  const prepared = await prepare(override);
  if ("error" in prepared) return { ok: false, error: prepared.error };

  const { transport, settings } = prepared;
  const recipients = (input.to ?? settings.to)
    .split(/[,;]/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) return { ok: false, error: "Alıcı adresi tanımlı değil." };

  const prefix = settings.subjectPrefix ? `${settings.subjectPrefix} ` : "";

  try {
    await transport.sendMail({
      from: { name: settings.fromName, address: settings.fromAddress },
      to: recipients,
      replyTo: input.replyTo,
      subject: `${prefix}${input.subject}`,
      text: input.text,
      html: input.html,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: friendlyError(error) };
  } finally {
    transport.close();
  }
}

/** Panelde/dağıtımda "e-posta ayarlı mı" bilgisini göstermek için (sır içermez). */
export async function getMailStatus() {
  const { mail } = await getSettings();
  const hasPassword = Boolean(mail.passwordEnc) || Boolean(process.env.SMTP_PASS);

  if (mail.enabled && mail.host && mail.user && hasPassword) {
    return {
      mode: "smtp" as const,
      detail: `${mail.host}:${mail.port} · ${mail.to}`,
      ready: true,
    };
  }
  if (process.env.LEAD_WEBHOOK_URL) {
    return { mode: "webhook" as const, detail: "CRM/otomasyon webhook’u", ready: true };
  }
  return {
    mode: "none" as const,
    detail: mail.enabled && !hasPassword ? "Şifre girilmemiş" : "Kapalı",
    ready: false,
  };
}

/* ------------------------------------------------------------- şablonlar */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(title: string, rows: string, footer: string): string {
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px;background:#f7f8f6;font-family:Segoe UI,Arial,sans-serif;color:#323834;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dde5df;border-radius:14px;overflow:hidden;">
    <tr><td bgcolor="#0a5135" style="background:#0a5135;padding:20px 28px;">
      <p style="margin:0;color:#ffffff;font-size:16px;font-weight:600;">${escapeHtml(title)}</p>
      <p style="margin:4px 0 0;color:#bcd6c8;font-size:13px;">TUSA Hastanesi · Doğum Paketi sayfası</p>
    </td></tr>
    <tr><td bgcolor="#ffffff" style="padding:8px 28px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}</table>
    </td></tr>
    <tr><td bgcolor="#f4f8f5" style="padding:16px 28px;background:#f4f8f5;border-top:1px solid #dde5df;">
      <p style="margin:0;font-size:12px;line-height:1.6;color:#6e756f;">${footer}</p>
    </td></tr>
  </table>
</body></html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #eef2ef;width:150px;vertical-align:top;color:#6e756f;font-size:12px;text-transform:uppercase;letter-spacing:.08em;">${escapeHtml(label)}</td>
    <td style="padding:12px 0;border-bottom:1px solid #eef2ef;color:#141816;">${value}</td>
  </tr>`;
}

/** Formdan gelen talebi hastane adresine bildirir. */
export async function sendLeadNotification(lead: LeadInput): Promise<MailResult> {
  const { mail } = await getSettings();
  if (!mail.enabled) return { ok: false, error: "E-posta gönderimi kapalı." };

  const created = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
  const phone = formatPhone(lead.phone);

  const rows = [
    row("Ad Soyad", escapeHtml(lead.name)),
    row(
      "Telefon",
      `<a href="tel:${escapeHtml(phone.replace(/\s/g, ""))}" style="color:#0d6734;font-weight:600;text-decoration:none;">${escapeHtml(phone)}</a>`
    ),
    lead.email
      ? row(
          "E-posta",
          `<a href="mailto:${escapeHtml(lead.email)}" style="color:#0d6734;text-decoration:none;">${escapeHtml(lead.email)}</a>`
        )
      : "",
    lead.message
      ? row("Mesaj", `<span style="white-space:pre-line;">${escapeHtml(lead.message)}</span>`)
      : "",
    row("Tarih", escapeHtml(created)),
    lead.utm ? row("Kampanya", escapeHtml(lead.utm)) : "",
  ].join("");

  const text = [
    "Doğum Paketi sayfasından yeni bir bilgi talebi alındı.",
    "",
    `Ad Soyad : ${lead.name}`,
    `Telefon  : ${phone}`,
    lead.email ? `E-posta  : ${lead.email}` : null,
    lead.message ? `Mesaj    : ${lead.message}` : null,
    `Tarih    : ${created}`,
    lead.utm ? `Kampanya : ${lead.utm}` : null,
    "",
    `Bu bildirim ${new URL(SITE.url).hostname} üzerinden otomatik gönderilmiştir.`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({
    subject: `Yeni bilgi talebi — ${lead.name}`,
    html: layout(
      "Yeni bilgi talebi",
      rows,
      `Bu bildirim ${new URL(SITE.url).hostname} iletişim formundan otomatik olarak gönderilmiştir. Kişisel verileri yalnızca talebin değerlendirilmesi amacıyla kullanın.`
    ),
    text,
    replyTo: mail.replyToSubmitter && lead.email ? lead.email : undefined,
  });
}

/** Ayarların doğrulanması için örnek bildirim gönderir. */
export async function sendTestMail(override?: MailOverride): Promise<MailResult> {
  const now = new Date().toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });

  return sendMail(
    {
      subject: "Test e-postası",
      html: layout(
        "Test e-postası",
        row("Durum", "E-posta ayarları çalışıyor.") + row("Tarih", escapeHtml(now)),
        "Bu ileti yönetim panelindeki “Test e-postası gönder” düğmesiyle oluşturulmuştur."
      ),
      text: `E-posta ayarları çalışıyor.\nTarih: ${now}\n\nBu ileti yönetim panelindeki test düğmesiyle gönderilmiştir.`,
    },
    override
  );
}
