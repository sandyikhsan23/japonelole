"use client";

import { useMemo, useRef, useState } from "react";
import type { Scene, ScriptMode, SessionResult } from "@/types/vocab";
import { labelFor, speak } from "@/lib/vocab";

type Card = { key: string; itemId: string; text: string; kind: "word" | "meaning" };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchingGame({
  scene,
  scriptMode,
  onFinish,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
}) {
  // Batasi maksimal 6 pasang biar grid tetap ringkas di layar kecil
  const pool = useMemo(() => scene.objects.slice(0, 6), [scene.objects]);

  const [cards] = useState<Card[]>(() =>
    shuffle([
      ...pool.map((o) => ({ key: `w-${o.id}`, itemId: o.id, text: labelFor(o, scriptMode), kind: "word" as const })),
      ...pool.map((o) => ({ key: `m-${o.id}`, itemId: o.id, text: o.meaning, kind: "meaning" as const })),
    ])
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string[]>([]);
  const wrongAttemptsRef = useRef(0);

  const total = pool.length;
  const done = matched.size;

  function handleClick(card: Card) {
    if (matched.has(card.itemId) || selected.includes(card.key) || wrongPair.length) return;
    const next = [...selected, card.key];
    setSelected(next);

    if (next.length === 2) {
      const [firstKey, secondKey] = next;
      const first = cards.find((c) => c.key === firstKey)!;
      const second = cards.find((c) => c.key === secondKey)!;

      if (first.itemId === second.itemId && first.kind !== second.kind) {
        setMatched((prev) => new Set(prev).add(first.itemId));
        speak(pool.find((o) => o.id === first.itemId)?.kanji || "");
        setSelected([]);
      } else {
        wrongAttemptsRef.current += 1;
        setWrongPair(next);
        setTimeout(() => {
          setWrongPair([]);
          setSelected([]);
        }, 500);
      }
    }
  }

  const isComplete = done === total;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-navy/50">Cocokkan kata &amp; arti</span>
        <span className="font-medium text-navy">{done}/{total}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {cards.map((card) => {
          const isMatched = matched.has(card.itemId);
          const isSelected = selected.includes(card.key) || wrongPair.includes(card.key);
          return (
            <button
              key={card.key}
              onClick={() => handleClick(card)}
              disabled={isMatched}
              className={`rounded-lg border px-2.5 py-3 text-xs sm:text-sm font-medium text-center transition-colors min-h-[52px] ${
                isMatched
                  ? "bg-maroon-soft border-maroon text-maroon"
                  : wrongPair.includes(card.key)
                  ? "bg-red-50 border-red-300 text-red-500"
                  : isSelected
                  ? "bg-navy-soft border-navy text-navy"
                  : "border-navy/15 text-navy hover:border-navy/40"
              }`}
            >
              {card.text}
            </button>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-3">
          <div className="rounded-lg bg-maroon-soft border border-maroon/20 px-3.5 py-2.5 text-maroon text-center text-sm font-medium">
            Semua pasangan cocok 🎉
          </div>
          <button
            onClick={() =>
              onFinish({
                masteredIds: Array.from(matched),
                attempts: total + wrongAttemptsRef.current,
                correct: total,
              })
            }
            className="mt-2 w-full rounded-xl border border-navy/15 text-navy py-2.5 text-sm font-medium hover:bg-navy-soft transition-colors"
          >
            ← Pilih mode lain
          </button>
        </div>
      )}
    </div>
  );
}
