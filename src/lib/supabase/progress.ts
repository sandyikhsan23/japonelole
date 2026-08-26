import { createClient } from "./client";
import type { SessionResult } from "@/types/vocab";

export async function saveSceneProgress(sceneId: string, result: SessionResult) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: existing } = await supabase
    .from("scene_progress")
    .select("mastered_ids, attempts, correct")
    .eq("user_id", user.id)
    .eq("scene_id", sceneId)
    .maybeSingle();

  const masteredIds = Array.from(
    new Set([...(existing?.mastered_ids ?? []), ...result.masteredIds])
  );

  const { error } = await supabase.from("scene_progress").upsert(
    {
      user_id: user.id,
      scene_id: sceneId,
      mastered_ids: masteredIds,
      attempts: (existing?.attempts ?? 0) + result.attempts,
      correct: (existing?.correct ?? 0) + result.correct,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,scene_id" }
  );

  return !error;
}
