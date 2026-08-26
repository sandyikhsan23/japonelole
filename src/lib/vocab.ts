import type { ScriptMode, VocabItem } from "@/types/vocab";

export function normalize(str: string) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isCorrectAnswer(input: string, item: VocabItem) {
  const n = normalize(input);
  if (!n) return false;
  return (
    n === normalize(item.romaji) ||
    n === normalize(item.hiragana) ||
    n === normalize(item.kanji)
  );
}

export function labelFor(item: VocabItem, mode: ScriptMode) {
  if (mode === "romaji") return item.romaji;
  if (mode === "hiragana_romaji") return `${item.hiragana} (${item.romaji})`;
  return `${item.kanji} · ${item.hiragana} (${item.romaji})`;
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
