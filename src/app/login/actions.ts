"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string | null; message?: string | null };

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rememberMe = formData.get("remember") === "on";

  const supabase = await createClient(rememberMe);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau password salah." };
  }

  const cookieStore = await cookies();
  if (rememberMe) {
    cookieStore.delete("japonelole-remember");
  } else {
    cookieStore.set("japonelole-remember", "0", { path: "/", sameSite: "lax" });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message === "User already registered" ? "Email sudah terdaftar." : "Gagal mendaftar, coba lagi." };
  }

  if (!data.session) {
    return {
      error: null,
      message: "Akun dibuat. Cek email kamu untuk konfirmasi sebelum masuk.",
    };
  }

  (await cookies()).delete("japonelole-remember");
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  (await cookies()).delete("japonelole-remember");
  revalidatePath("/", "layout");
  redirect("/");
}
