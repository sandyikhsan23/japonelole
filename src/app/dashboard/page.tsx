import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scenesByCategory } from "@/data/scenes";
import { Navbar } from "@/components/Navbar";
import { SceneProgressCard } from "@/components/SceneProgressCard";

type ProgressRow = {
  scene_id: string;
  mastered_ids: string[];
  attempts: number;
  correct: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: rows } = await supabase
    .from("scene_progress")
    .select("scene_id, mastered_ids, attempts, correct")
    .eq("user_id", user.id);

  const progressByScene = new Map<string, ProgressRow>(
    ((rows ?? []) as ProgressRow[]).map((r) => [r.scene_id, r])
  );

  const groups = scenesByCategory();

  const groupStats = groups.map((group) => {
    const sceneStats = group.scenes.map((scene) => {
      const progress = progressByScene.get(scene.id);
      const total = scene.objects.length;
      const mastered = Math.min(progress?.mastered_ids.length ?? 0, total);
      const isComplete = total > 0 && mastered === total;
      return { scene, total, mastered, isComplete };
    });

    const categoryCompleted = sceneStats.filter((s) => s.isComplete).length;

    return { ...group, sceneStats, categoryCompleted };
  });

  const allSceneStats = groupStats.flatMap((g) => g.sceneStats);
  const totalVocab = allSceneStats.reduce((sum, s) => sum + s.total, 0);
  const totalMastered = allSceneStats.reduce((sum, s) => sum + s.mastered, 0);
  const totalScenes = allSceneStats.length;
  const scenesCompleted = allSceneStats.filter((s) => s.isComplete).length;

  const overallPct = totalVocab > 0 ? Math.round((totalMastered / totalVocab) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto">
        <header className="mb-5 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold text-navy tracking-tight">Dashboard</h1>
          <p className="text-xs lg:text-sm text-navy/50 mt-0.5">{user.email}</p>
        </header>

        <div className="rounded-xl border border-navy/10 bg-navy-soft px-4 py-4 mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-navy">Progress keseluruhan</p>
            <p className="text-sm font-semibold text-maroon">{overallPct}%</p>
          </div>
          <div className="h-2 rounded-full bg-white overflow-hidden">
            <div
              className="h-full bg-maroon rounded-full transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-navy/60">
            <span>{scenesCompleted}/{totalScenes} level selesai</span>
            <span>{totalMastered}/{totalVocab} kosakata dikuasai</span>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {groupStats.map((group) => (
            <section key={group.category}>
              <div className="flex items-center justify-between mb-1.5 lg:mb-2.5">
                <h2 className="text-[11px] lg:text-xs font-semibold text-maroon uppercase tracking-wide">
                  {group.label}
                </h2>
                <span className="text-[11px] text-navy/40">
                  {group.categoryCompleted}/{group.sceneStats.length} selesai
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {group.sceneStats.map(({ scene, total, mastered }) => (
                  <SceneProgressCard
                    key={scene.id}
                    scene={scene}
                    total={total}
                    mastered={mastered}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
        </div>
      </main>
    </>
  );
}
