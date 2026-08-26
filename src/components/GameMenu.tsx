"use client";

import { InfoTooltip } from "./InfoTooltip";

const modes = [
  {
    id: "coloring",
    label: "Room Coloring",
    desc: "Ketik jawaban, warnai ruangan",
    info: "Ketik kosakata untuk mewarnai bagian yang ditunjuk. Kalau ada nomor urutan, jawab dari yang terkecil dulu.",
  },
  {
    id: "flashcard",
    label: "Flashcard",
    desc: "Hafalan bolak-balik kartu",
    info: "Tap kartu untuk lihat jawabannya. Tandai 'Sudah hafal' kalau sudah ingat, atau 'Belum hafal' supaya diulang lagi nanti.",
  },
  {
    id: "multiple_choice",
    label: "Pilihan Ganda",
    desc: "Pilih arti yang tepat",
    info: "Lihat/dengar kosakatanya, lalu pilih satu dari 4 pilihan arti yang paling tepat.",
  },
  {
    id: "matching",
    label: "Matching",
    desc: "Cocokkan kata & arti",
    info: "Klik satu kartu kata Jepang lalu satu kartu arti (atau sebaliknya) untuk mencocokkan pasangan yang benar.",
  },
] as const;

export type GameMode = (typeof modes)[number]["id"];

export function GameMenu({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {modes.map((m) => (
        <div
          key={m.id}
          className="relative rounded-xl border border-navy/10 hover:border-maroon/40 transition-colors"
        >
          <button onClick={() => onSelect(m.id)} className="w-full h-full px-3 py-3 text-left">
            <p className="font-medium text-navy text-sm leading-tight pr-5">{m.label}</p>
            <p className="text-xs text-navy/45 mt-0.5">{m.desc}</p>
          </button>
          <div className="absolute top-2 right-2">
            <InfoTooltip text={m.info} />
          </div>
        </div>
      ))}
    </div>
  );
}
