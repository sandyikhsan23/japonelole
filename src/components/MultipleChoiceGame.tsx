"use client";

import { useState } from "react";
import type { Scene, ScriptMode, SessionResult, VocabItem } from "@/types/vocab";
import { labelFor, speak } from "@/lib/vocab";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(scene: Scene) {
  return shuffle(scene.objects).map((item) => {
    const distractors = shuffle(scene.objects.filter((o) => o.id !== item.id)).slice(0, 3);
    const options = shuffle([item, ...distractors]);
    return { item, options };
  });
}

export function MultipleChoiceGame({
  scene,
  scriptMode,
  onFinish,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
}) {
  const [questions] = useState(() => buildQuestions(scene));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());
  const [picked, setPicked] = useState<string | null>(null);

  const total = questions.length;
  const q = questions[index];

  function pick(opt: VocabItem) {
    if (picked) return;
    setPicked(opt.id);
    if (opt.id === q.item.id) {
      setScore((s) => s + 1);
      setCorrectIds((prev) => new Set(prev).add(q.item.id));
    }
    setTimeout(() => {
      setPicked(null);
      setIndex((i) => i + 1);
    }, 650);
  }

  if (index >= total) {
    return (
      <div className="text-center">
        <div className="rounded-lg bg-maroon-soft border border-maroon/20 px-3.5 py-3 text-maroon text-sm font-medium">
          Skor: {score}/{total} 🎉
        </div>
        <button
          onClick={() =>
            onFinish({
              masteredIds: Array.from(correctIds),
              attempts: total,
              correct: score,
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
        <span className="text-navy/50">Soal {index + 1}/{total}</span>
        <span className="font-medium text-navy">Skor: {score}</span>
      </div>

      <button
        onClick={() => speak(q.item.kanji || q.item.hiragana)}
        className="w-full rounded-xl border border-navy/10 bg-cream flex flex-col items-center justify-center gap-1 px-4 py-8"
      >
        <span className="text-xl font-semibold text-navy">{labelFor(q.item, scriptMode)}</span>
        <span className="text-xs text-navy/40">tap untuk dengar 🔊</span>
      </button>

      <p className="mt-3 mb-2 text-xs text-navy/50">Artinya apa?</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt) => {
          const isPicked = picked === opt.id;
          const isCorrect = opt.id === q.item.id;
          const showState = picked !== null;
          return (
            <button
              key={opt.id}
              onClick={() => pick(opt)}
              disabled={picked !== null}
              className={`rounded-lg border px-3 py-3 text-sm font-medium text-left transition-colors ${
                showState && isCorrect
                  ? "bg-green-50 border-green-500 text-green-700"
                  : showState && isPicked
                  ? "bg-red-50 border-red-300 text-red-500"
                  : "border-navy/15 text-navy hover:border-navy/40"
              }`}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>
    </div>
  );
}
