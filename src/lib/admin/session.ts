/**
 * Yönetim paneli oturumu: HMAC-SHA256 ile imzalı, süreli çerez.
 * Web Crypto kullanır; hem middleware (edge) hem sunucu tarafında çalışır.
 */

export const SESSION_COOKIE = "tusa_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 saat

export type AdminSession = { username: string; expiresAt: number };

export function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

/** Panel ancak kullanıcı adı, şifre özeti ve oturum anahtarı tanımlıysa açılır. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && getSessionSecret());
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function sign(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(new Uint8Array(signature));
}

/** Uzunluğa bağlı olmayan karşılaştırma (zamanlama saldırılarına karşı). */
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index++) {
    diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return diff === 0;
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET tanımlı değil veya 32 karakterden kısa.");

  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })
    )
  );
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  const secret = getSessionSecret();
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!constantTimeEqual(signature, await sign(secret, payload))) return null;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      u?: unknown;
      exp?: unknown;
    };
    if (typeof data.u !== "string" || typeof data.exp !== "number") return null;
    if (data.exp < Date.now() / 1000) return null;
    // Kullanıcı adı değiştirilirse eski oturumlar geçersiz olur.
    if (data.u !== process.env.ADMIN_USERNAME) return null;
    return { username: data.u, expiresAt: data.exp };
  } catch {
    return null;
  }
}
