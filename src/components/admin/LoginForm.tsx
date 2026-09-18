"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink transition-colors focus:border-green-700";

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />

      <div>
        <label htmlFor="admin-username" className="block text-[0.875rem] font-medium text-ink">
          Kullanıcı adı
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="block text-[0.875rem] font-medium text-ink">
          Şifre
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-[0.875rem] text-red-800">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-green-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
