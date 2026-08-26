import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSceneById, isFreeScene } from "@/data/scenes";
import { SceneSession } from "@/components/SceneSession";
import { createClient } from "@/lib/supabase/server";

export default async function ScenePage({
  params,
}: {
  params: Promise<{ sceneId: string }>;
}) {
  const { sceneId } = await params;
  const scene = getSceneById(sceneId);
  if (!scene) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isFreeScene(sceneId)) {
    redirect("/login?locked=1");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
      <div className="max-w-md sm:max-w-xl lg:max-w-3xl mx-auto">
        <Link href={user ? "/dashboard" : "/"} className="text-xs text-navy/40 hover:text-maroon">
          ← Semua level
        </Link>
        <div className="mt-3">
          <SceneSession scene={scene} loggedIn={!!user} />
        </div>
      </div>
    </main>
  );
}
