"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/admin/password";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  constantTimeEqual,
  createSessionToken,
  isAdminConfigured,
} from "@/lib/admin/session";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Panel henüz yapılandırılmamış. Lütfen sistem yöneticinizle iletişime geçin." };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(`admin-login:${ip}`);
  if (!limit.allowed) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterSeconds / 60));
    return { error: `Çok fazla deneme yapıldı. Lütfen ${minutes} dakika sonra tekrar deneyin.` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const usernameOk = constantTimeEqual(username, process.env.ADMIN_USERNAME ?? "");
  const passwordOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  if (!usernameOk || !passwordOk) {
    return { error: "Kullanıcı adı veya şifre hatalı." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin");
}
