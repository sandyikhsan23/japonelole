"use client";

import type { Scene, ScriptMode } from "@/types/vocab";
import { speak } from "@/lib/vocab";

export function StudyMaterial({
  scene,
  scriptMode,
  onStart,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onStart: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-navy/60 mb-3">
        Pelajari {scene.objects.length} kosakata berikut dulu, baru mulai game.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {scene.objects.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-navy/10 px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm text-navy/50">{item.meaning}</p>
              <p className="font-medium text-navy leading-tight">
                {scriptMode !== "romaji" && (
                  <span className="mr-1.5">
                    {scriptMode === "kanji_hiragana_romaji" ? item.kanji : item.hiragana}
                  </span>
                )}
                <span className={scriptMode === "romaji" ? "" : "text-navy/50 text-sm"}>
                  {item.romaji}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => speak(item.kanji || item.hiragana)}
              aria-label={`Dengarkan ${item.romaji}`}
              className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full border border-maroon/25 text-maroon hover:bg-maroon-soft transition-colors"
            >
              🔊
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={onStart}
        className="mt-4 w-full rounded-xl bg-maroon text-white py-3 font-medium hover:bg-maroon-2 transition-colors"
      >
        Mulai Game →
      </button>

      <div className="hidden lg:flex fixed left-0 top-0 h-full w-[calc(50%-24rem)] flex-col items-center justify-center gap-1 pointer-events-none text-navy/40">
        <span className="text-[11px] font-medium tracking-wide">Mainkan game</span>
        <span className="animate-bounce text-xl leading-none">↓</span>
      </div>
    </div>
  );
}
