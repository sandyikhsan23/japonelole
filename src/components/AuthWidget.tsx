import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/login/actions";

export function AuthWidget({ user }: { user: User | null }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="shrink-0 text-xs font-medium text-white bg-navy rounded-full px-3 py-1.5 hover:bg-navy-2 transition-colors"
      >
        Masuk
      </Link>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-2.5">
      <span className="text-xs text-navy/50 truncate max-w-[110px] hidden sm:inline">
        {user.email}
      </span>
      <form action={logout}>
        <button type="submit" className="text-xs font-medium text-maroon hover:underline">
          Keluar
        </button>
      </form>
    </div>
  );
}
