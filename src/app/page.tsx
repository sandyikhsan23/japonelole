import Link from "next/link";
import { redirect } from "next/navigation";
import { scenesByCategory, scenes } from "@/data/scenes";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const groups = scenesByCategory();
  const freeCount = groups.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto">
          <p className="text-xs lg:text-sm text-navy/50 mb-5 lg:mb-8">
            Belajar kosakata Jepang lewat ruangan interaktif
          </p>

          <div className="space-y-5 lg:space-y-8">
            {groups.map((group) => {
              const freeScene = group.scenes[0];
              if (!freeScene) return null;
              return (
                <section key={group.category}>
                  <h2 className="text-[11px] lg:text-xs font-semibold text-maroon uppercase tracking-wide mb-1.5 lg:mb-2.5">
                    {group.label}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 lg:gap-3">
                    <li>
                      <Link
                        href={`/belajar/${freeScene.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-navy/10 px-3.5 py-2.5 lg:px-4 lg:py-3.5 hover:border-maroon/40 transition-colors h-full"
                      >
                        <p className="font-medium text-navy leading-tight truncate">
                          {freeScene.title}
                          <span className="text-navy/40 font-normal ml-1.5 text-sm">
                            {freeScene.titleJa}
                          </span>
                        </p>
                        <span className="shrink-0 text-xs text-navy/40">
                          {freeScene.objects.length} kata →
                        </span>
                      </Link>
                    </li>
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-6 lg:mt-10 rounded-xl border border-maroon/20 bg-maroon-soft px-4 py-4 lg:py-5 text-center">
            <p className="text-sm font-medium text-maroon">
              Ini baru {freeCount} dari {scenes.length} level.
            </p>
            <p className="text-xs text-maroon/70 mt-1">
              Daftar akun gratis untuk membuka semua level & menyimpan progress belajarmu.
            </p>
            <Link
              href="/login"
              className="inline-block mt-3 rounded-lg bg-maroon text-white px-4 py-2 text-sm font-medium hover:bg-maroon-2 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
