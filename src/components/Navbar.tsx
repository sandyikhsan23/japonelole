import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthWidget } from "./AuthWidget";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-navy/10">
      <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-logo italic text-lg sm:text-xl text-navy tracking-tight"
        >
          Japon<span className="text-maroon">elole</span>
        </Link>

        <AuthWidget user={user} />
      </div>
    </header>
  );
}
