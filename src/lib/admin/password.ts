import "server-only";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

/**
 * ADMIN_PASSWORD_HASH biçimi: "scrypt:<salt-base64>:<hash-base64>"
 * Üretmek için: npm run admin:hash -- "şifre"
 */
export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored) return false;

  const [scheme, saltBase64, hashBase64] = stored.split(":");
  if (scheme !== "scrypt" || !saltBase64 || !hashBase64) return false;

  const expected = Buffer.from(hashBase64, "base64");
  if (expected.length === 0) return false;

  const actual = await scrypt(password, Buffer.from(saltBase64, "base64"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
