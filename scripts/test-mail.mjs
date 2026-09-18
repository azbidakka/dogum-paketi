/**
 * Panelde kayıtlı e-posta ayarlarını sunucuda doğrular.
 *
 *   npm run mail:test                      → yalnızca bağlantı + kimlik doğrulama
 *   npm run mail:test -- ornek@tusa.com    → ayrıca bu adrese test e-postası gönderir
 *
 * Ayarları <CONTENT_DIR|storage>/settings.json dosyasından okur; şifre
 * ADMIN_SESSION_SECRET ile çözülür. Panelde şifre kayıtlı değilse SMTP_PASS kullanılır.
 */
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // dosya yoksa sorun değil
  }
}

const storageDir = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(process.cwd(), "storage");

let stored = {};
try {
  stored = JSON.parse(readFileSync(path.join(storageDir, "settings.json"), "utf8")).mail ?? {};
} catch {
  console.log(`Kayıtlı ayar bulunamadı (${storageDir}); varsayılanlar ve ortam değişkenleri kullanılacak.`);
}

function decryptSecret(value) {
  if (!value || !process.env.ADMIN_SESSION_SECRET) return null;
  try {
    const [version, iv, tag, data] = value.split(":");
    if (version !== "v1") return null;
    const key = crypto.scryptSync(process.env.ADMIN_SESSION_SECRET, "tusa-settings-v1", 32);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"));
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

const host = stored.host ?? process.env.SMTP_HOST ?? "mail.tusahastanesi.com";
const port = Number(stored.port ?? process.env.SMTP_PORT ?? 587);
const secure = stored.secure ?? port === 465;
const user = stored.user ?? process.env.SMTP_USER ?? "";
const password = decryptSecret(stored.passwordEnc) ?? process.env.SMTP_PASS ?? "";
const from = stored.fromAddress ?? process.env.LEAD_FROM_EMAIL ?? user;
const to = process.argv[2] || stored.to || process.env.LEAD_TO_EMAIL;

console.log(`Sunucu   : ${host}:${port} (${secure ? "örtük TLS" : "STARTTLS"})`);
console.log(`Kullanıcı: ${user || "(tanımsız)"}`);
console.log(`Şifre    : ${password ? "kayıtlı" : "YOK"}`);
console.log(`Gönderen : ${from || "-"}`);
console.log(`Alıcı    : ${to || "-"}`);
console.log("");

if (!user || !password) {
  console.error("Kullanıcı adı veya şifre eksik. Panelde E-posta sayfasından ayarları kaydedin.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure && (stored.requireTls ?? true),
  auth: { user, pass: password },
  tls: {
    servername: host,
    rejectUnauthorized: stored.rejectUnauthorized ?? true,
    minVersion: "TLSv1",
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  logger: process.env.SMTP_DEBUG === "1",
  debug: process.env.SMTP_DEBUG === "1",
});

function explain(error) {
  const raw = error.message ?? String(error);
  if (/535|5\.7\.3|authentication unsuccessful/i.test(raw)) {
    return "Kullanıcı adı veya şifre kabul edilmedi. Exchange oturum açma adı genelde kullanici@gisbirhastanesi.local biçimindedir.";
  }
  if (/ETIMEDOUT|ECONNECTION|timeout/i.test(raw)) return "Sunucuya bağlanılamadı: port veya güvenlik duvarı.";
  if (/certificate|self.signed/i.test(raw)) return "Sertifika doğrulanamadı.";
  if (/5\.7\.1|relay|not permitted/i.test(raw)) return "Sunucu göndermeye izin vermedi; gönderen adres bu hesaba ait olmalı.";
  return "";
}

try {
  await transporter.verify();
  console.log("✓ Bağlantı ve kimlik doğrulama başarılı.");
} catch (error) {
  console.error("✗ Bağlantı/kimlik doğrulama başarısız:", error.message);
  const hint = explain(error);
  if (hint) console.error("  → " + hint);
  process.exit(2);
}

if (!process.argv[2]) {
  console.log("Test e-postası gönderilmedi (alıcı adresi verilmedi).");
  process.exit(0);
}

try {
  const info = await transporter.sendMail({
    to,
    from: { name: stored.fromName ?? "TUSA Doğum Paketi", address: from },
    subject: `${stored.subjectPrefix ?? "[Doğum Paketi]"} Test e-postası`,
    text: "Bu bir test e-postasıdır. Bu mesajı aldıysanız form gönderimleri de bu adrese ulaşacaktır.",
  });
  console.log(`✓ Test e-postası gönderildi: ${info.messageId}`);
} catch (error) {
  console.error("✗ Gönderim başarısız:", error.message);
  const hint = explain(error);
  if (hint) console.error("  → " + hint);
  process.exit(3);
}
