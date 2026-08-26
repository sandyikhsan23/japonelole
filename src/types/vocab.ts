export type ScriptMode = "romaji" | "hiragana_romaji" | "kanji_hiragana_romaji";

export interface VocabItem {
  id: string;
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
  // Position of the object inside the scene, in percentage (0-100) of the SVG viewbox
  x: number;
  y: number;
  // Optional width/height for the highlight box, in percentage
  w: number;
  h: number;
  // Override where the numbered badge sits, when the box's own center would
  // collide with another item's badge (e.g. a big "whole area" box). Defaults
  // to the box center when omitted.
  labelX?: number;
  labelY?: number;
}

// Satu tahap = satu gambar/foto, dengan kosakata yang ditandai di gambar itu.
// Dipakai Room Coloring untuk scene yang punya ilustrasi asli (bukan kotak abstrak).
export interface SceneStage {
  image: string;
  items: VocabItem[];
}

export interface Scene {
  id: string;
  title: string;
  titleJa: string;
  level: number;
  category: "tubuh" | "dalam-rumah" | "luar-rumah" | "publik";
  description: string;
  objects: VocabItem[];
  stages?: SceneStage[];
}

export interface SceneProgress {
  sceneId: string;
  masteredIds: string[];
  attempts: number;
  correct: number;
  updatedAt: string;
}

export interface SessionResult {
  masteredIds: string[];
  attempts: number;
  correct: number;
}
