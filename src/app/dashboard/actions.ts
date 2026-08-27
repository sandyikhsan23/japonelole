"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function resetSceneProgress(sceneId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("scene_progress")
    .update({
      mastered_ids: [],
      attempts: 0,
      correct: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("scene_id", sceneId);

  revalidatePath("/dashboard");
}
