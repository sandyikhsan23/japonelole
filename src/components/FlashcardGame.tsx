"use client";

import { useMemo, useRef, useState } from "react";
import type { Scene, ScriptMode, SessionResult } from "@/types/vocab";
import { labelFor, speak } from "@/lib/vocab";

export function FlashcardGame({
  scene,
  scriptMode,
  onFinish,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
}) {
  const [queue, setQueue] = useState<string[]>(() => scene.objects.map((o) => o.id));
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [flipped, setFlipped] = useState(false);
  const attemptsRef = useRef(0);

  const currentItem = useMemo(
    () => scene.objects.find((o) => o.id === queue[0]),
    [scene.objects, queue]
  );

  const total = scene.objects.length;
  const done = known.size;

  function next(markKnown: boolean) {
    const [current, ...rest] = queue;
    attemptsRef.current += 1;
    setFlipped(false);
    if (markKnown) {
      setKnown((prev) => new Set(prev).add(current));
      setQueue(rest);
    } else {
      setQueue([...rest, current]);
    }
  }

  if (!currentItem) {
    return (
      <div className="text-center">
        <div className="rounded-lg bg-maroon-soft border border-maroon/20 px-3.5 py-3 text-maroon text-sm font-medium">
          Semua {total} kartu sudah dihafal 🎉
        </div>
        <button
          onClick={() =>
            onFinish({
              masteredIds: scene.objects.map((o) => o.id),
              attempts: attemptsRef.current,
              correct: total,
            })
          }
          className="mt-3 w-full rounded-xl border border-navy/15 text-navy py-2.5 text-sm font-medium hover:bg-navy-soft transition-colors"
        >
          ← Pilih mode lain
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-navy/50">Sudah hafal</span>
        <span className="font-medium text-navy">
          {done}/{total}
        </span>
      </div>

      <button
        onClick={() => {
          setFlipped((f) => !f);
          if (!flipped) speak(currentItem.kanji || currentItem.hiragana);
        }}
        className="w-full rounded-xl border border-navy/10 bg-cream flex flex-col items-center justify-center gap-2 text-center px-4"
        style={{ minHeight: "220px" }}
      >
        {!flipped ? (
          <>
            <span className="text-xs text-navy/40">{currentItem.meaning}</span>
            <span className="text-sm text-navy/40 mt-2">tap untuk lihat jawaban</span>
          </>
        ) : (
          <span className="text-xl font-semibold text-navy">
            {labelFor(currentItem, scriptMode)}
          </span>
        )}
      </button>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => next(false)}
          className="flex-1 rounded-lg border border-navy/15 text-navy py-2.5 text-sm font-medium hover:bg-navy-soft transition-colors"
        >
          Belum hafal
        </button>
        <button
          onClick={() => next(true)}
          className="flex-1 rounded-lg bg-maroon text-white py-2.5 text-sm font-medium hover:bg-maroon-2 transition-colors"
        >
          Sudah hafal
        </button>
      </div>
    </div>
  );
}
