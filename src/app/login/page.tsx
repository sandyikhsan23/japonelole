"use client";

import { use, useActionState, useState } from "react";
import Link from "next/link";
import { login, signup, type AuthState } from "./actions";

const initialState: AuthState = { error: null };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = use(searchParams);
  const [mode, setMode] = useState<"login" | "signup">(locked ? "signup" : "login");
  const [loginState, loginAction, loginPending] = useActionState(login, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signup, initialState);

  const action = mode === "login" ? loginAction : signupAction;
  const state = mode === "login" ? loginState : signupState;
  const pending = mode === "login" ? loginPending : signupPending;

  return (
    <main className="min-h-screen bg-white px-4 py-6 flex items-center">
      <div className="max-w-sm w-full mx-auto">
        <Link href="/" className="text-xs text-navy/40 hover:text-maroon">
          ← Kembali
        </Link>

        <h1 className="text-xl font-logo italic text-navy tracking-tight mt-3">
          Japon<span className="text-maroon">elole</span>
        </h1>
        <p className="text-xs text-navy/50 mt-0.5 mb-5">
          {mode === "login" ? "Masuk untuk lanjutkan progress belajarmu." : "Buat akun untuk menyimpan progress belajarmu."}
        </p>

        {locked && (
          <p className="text-xs text-maroon bg-maroon-soft border border-maroon/20 rounded-lg px-3 py-2 mb-4">
            Level ini butuh akun. Daftar dulu untuk membuka semua level pembelajaran.
          </p>
        )}

        <div className="flex gap-1.5 text-xs font-medium mb-4">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`px-2.5 py-1 rounded-full ${
              mode === "login" ? "bg-navy text-white" : "bg-navy-soft text-navy/50"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`px-2.5 py-1 rounded-full ${
              mode === "signup" ? "bg-maroon text-white" : "bg-navy-soft text-navy/50"
            }`}
          >
            Daftar
          </button>
        </div>

        <form action={action} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-navy/60 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy/60 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-navy"
            />
          </div>

          {mode === "login" && (
            <label className="flex items-center gap-2 text-xs text-navy/60 select-none">
              <input
                type="checkbox"
                name="remember"
                defaultChecked
                className="h-3.5 w-3.5 rounded border-navy/30 accent-navy"
              />
              Ingat saya
            </label>
          )}

          {state.error && (
            <p className="text-xs text-red-500">{state.error}</p>
          )}
          {state.message && (
            <p className="text-xs text-maroon">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-navy text-white px-4 py-2.5 text-sm font-medium hover:bg-navy-2 transition-colors disabled:opacity-50"
          >
            {pending ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
          </button>
        </form>
      </div>
    </main>
  );
}
