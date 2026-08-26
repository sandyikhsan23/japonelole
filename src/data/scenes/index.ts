import type { Scene } from "@/types/vocab";
import anggotaTubuh from "./anggota-tubuh.json";
import kamarTidur from "./kamar-tidur.json";
import kamarMandi from "./kamar-mandi.json";
import ruangTamu from "./ruang-tamu.json";
import dapur from "./dapur.json";
import halamanRumah from "./halaman-rumah.json";
import teras from "./teras.json";
import garasi from "./garasi.json";
import jalanRaya from "./jalan-raya.json";
import taman from "./taman.json";
import stasiun from "./stasiun.json";
import rumahSakit from "./rumah-sakit.json";
import sekolah from "./sekolah.json";

// Scene dengan `stages` (ilustrasi asli per tahap) tidak perlu menulis `objects`
// sendiri di JSON — di-generate dari gabungan item semua stage-nya di sini.
function normalizeScene(scene: Scene): Scene {
  if (scene.stages) {
    return { ...scene, objects: scene.stages.flatMap((stage) => stage.items) };
  }
  return scene;
}

// Urutan sesuai metode belajar: tubuh -> dalam rumah -> luar rumah -> publik
export const scenes: Scene[] = (
  [
    anggotaTubuh,
    kamarTidur,
    kamarMandi,
    ruangTamu,
    dapur,
    halamanRumah,
    teras,
    garasi,
    jalanRaya,
    taman,
    stasiun,
    rumahSakit,
    sekolah,
  ] as Scene[]
).map(normalizeScene);

export function getSceneById(id: string): Scene | undefined {
  return scenes.find((s) => s.id === id);
}

export const categoryOrder: Scene["category"][] = [
  "tubuh",
  "dalam-rumah",
  "luar-rumah",
  "publik",
];

export const categoryLabels: Record<Scene["category"], string> = {
  tubuh: "Anggota Tubuh",
  "dalam-rumah": "Di Dalam Rumah",
  "luar-rumah": "Di Luar Rumah",
  publik: "Tempat Publik",
};

export function scenesByCategory() {
  return categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    scenes: scenes.filter((s) => s.category === cat),
  }));
}

// Satu scene pertama tiap kategori bisa dicoba tanpa akun; sisanya butuh daftar.
export const freeSceneIds: string[] = scenesByCategory()
  .map((group) => group.scenes[0]?.id)
  .filter((id): id is string => Boolean(id));

export function isFreeScene(sceneId: string): boolean {
  return freeSceneIds.includes(sceneId);
}
