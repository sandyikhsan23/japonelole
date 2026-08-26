"use client";

import type { ScriptMode } from "@/types/vocab";

const options: { value: ScriptMode; label: string }[] = [
  { value: "romaji", label: "Romaji" },
  { value: "hiragana_romaji", label: "Hiragana" },
  { value: "kanji_hiragana_romaji", label: "Kanji" },
];

export function ScriptModeToggle({
  value,
  onChange,
}: {
  value: ScriptMode;
  onChange: (v: ScriptMode) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-navy/15 bg-white p-0.5 text-xs">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            value === opt.value
              ? "bg-navy text-white"
              : "text-navy/60 hover:text-navy"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
