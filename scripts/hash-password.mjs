/**
 * Yönetim paneli şifre özeti ve oturum anahtarı üretir.
 * Kullanım:  npm run admin:hash -- "en-az-12-karakterli-güçlü-şifre"
 * Çıktıdaki iki satırı sunucudaki .env dosyasına ekleyin (ADMIN_USERNAME ile birlikte).
 */
import { randomBytes, scrypt } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 12) {
  console.error('Kullanım: npm run admin:hash -- "en-az-12-karakterli-güçlü-şifre"');
  process.exit(1);
}

const salt = randomBytes(16);
scrypt(password, salt, 64, (error, key) => {
  if (error) throw error;
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64")}:${key.toString("base64")}`);
  console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
});
