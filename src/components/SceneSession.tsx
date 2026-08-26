"use client";

import { useState } from "react";
import Link from "next/link";
import type { Scene, ScriptMode, SessionResult } from "@/types/vocab";
import { saveSceneProgress } from "@/lib/supabase/progress";
import { ScriptModeToggle } from "./ScriptModeToggle";
import { StudyMaterial } from "./StudyMaterial";
import { RoomScene } from "./RoomScene";
import { GameMenu, type GameMode } from "./GameMenu";
import { FlashcardGame } from "./FlashcardGame";
import { MultipleChoiceGame } from "./MultipleChoiceGame";
import { MatchingGame } from "./MatchingGame";

type Phase = "study" | "menu" | GameMode;

export function SceneSession({ scene, loggedIn }: { scene: Scene; loggedIn: boolean }) {
  const [phase, setPhase] = useState<Phase>("study");
  const [scriptMode, setScriptMode] = useState<ScriptMode>("hiragana_romaji");
  const [showLoginHint, setShowLoginHint] = useState(false);

  function handleGameFinish(result: SessionResult) {
    if (loggedIn) {
      saveSceneProgress(scene.id, result);
    } else {
      setShowLoginHint(true);
    }
    setPhase("menu");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-semibold text-navy leading-tight">
            {scene.title}
          </h1>
          <p className="text-xs text-navy/50">{scene.titleJa}</p>
        </div>
        <ScriptModeToggle value={scriptMode} onChange={setScriptMode} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 text-xs font-medium">
          <span
            className={`px-2.5 py-1 rounded-full ${
              phase === "study" ? "bg-navy text-white" : "bg-navy-soft text-navy/50"
            }`}
          >
            1. Materi
          </span>
          <span
            className={`px-2.5 py-1 rounded-full ${
              phase !== "study" ? "bg-maroon text-white" : "bg-navy-soft text-navy/50"
            }`}
          >
            2. Main
          </span>
        </div>
        {phase !== "study" && phase !== "menu" && (
          <button
            onClick={() => setPhase("menu")}
            className="text-xs text-navy/40 hover:text-maroon"
          >
            ← Mode lain
          </button>
        )}
      </div>

      {phase === "study" && (
        <StudyMaterial
          scene={scene}
          scriptMode={scriptMode}
          onStart={() => setPhase("menu")}
        />
      )}

      {phase === "menu" && (
        <div>
          {showLoginHint && (
            <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-navy-soft px-3 py-2 text-xs text-navy/70">
              <span>
                Progress belum tersimpan.{" "}
                <Link href="/login" className="font-medium text-navy hover:text-maroon underline">
                  Login
                </Link>{" "}
                untuk menyimpannya.
              </span>
              <button
                onClick={() => setShowLoginHint(false)}
                className="shrink-0 text-navy/40 hover:text-navy"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
          )}
          <GameMenu onSelect={(m) => setPhase(m)} />
        </div>
      )}

      {phase === "coloring" && (
        <RoomScene scene={scene} scriptMode={scriptMode} onFinish={handleGameFinish} />
      )}
      {phase === "flashcard" && (
        <FlashcardGame scene={scene} scriptMode={scriptMode} onFinish={handleGameFinish} />
      )}
      {phase === "multiple_choice" && (
        <MultipleChoiceGame scene={scene} scriptMode={scriptMode} onFinish={handleGameFinish} />
      )}
      {phase === "matching" && (
        <MatchingGame scene={scene} scriptMode={scriptMode} onFinish={handleGameFinish} />
      )}
    </div>
  );
}
