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

let cachedVoices: SpeechSynthesisVoice[] = [];

// Some mobile browsers populate the voice list asynchronously after the page
// loads. Warm it up early so it's ready by the time the user first taps.
if (typeof window !== "undefined" && window.speechSynthesis) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

function getJapaneseVoice(synth: SpeechSynthesis) {
  if (cachedVoices.length === 0) cachedVoices = synth.getVoices();
  return (
    cachedVoices.find((v) => v.lang === "ja-JP") ??
    cachedVoices.find((v) => v.lang.startsWith("ja")) ??
    null
  );
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;

  // Mobile browsers (esp. iOS Safari) can leave the engine paused after the
  // tab was backgrounded, and cancelling right before speak() sometimes
  // cancels the new utterance too instead of just the old one.
  if (synth.speaking || synth.pending) synth.cancel();
  synth.resume();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ja-JP";
  const voice = getJapaneseVoice(synth);
  if (voice) utter.voice = voice;

  synth.speak(utter);
}
