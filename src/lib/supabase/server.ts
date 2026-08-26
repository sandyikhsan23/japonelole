import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(rememberMe = true) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Supabase always hands back a ~400 day maxAge here. When "remember me"
              // is off, strip it so the cookie dies with the browser session instead.
              // Skip removals (empty value) so they still delete immediately.
              const finalOptions =
                rememberMe || value === ""
                  ? options
                  : { ...options, maxAge: undefined, expires: undefined };
              cookieStore.set(name, value, finalOptions);
            });
          } catch {
            // Called from a Server Component; safe to ignore if middleware
            // is refreshing the session.
          }
        },
      },
    }
  );
}
