# Japonelole — Checkpoint & Handoff

Dokumen ini merangkum semua keputusan yang sudah dibuat untuk project ini, apa yang sudah jadi, dan apa yang masih perlu dikerjakan. Dibuat untuk lanjutan pengerjaan di Claude Code.

## 1. Visi & Konsep

Web belajar kosakata bahasa Jepang untuk **penggunaan pribadi sekaligus dirilis ke publik**. Bukan kamus — fokusnya **quiz interaktif dan game** yang membantu mengingat kosakata.

Metode belajar mengikuti tips dari mentor: hafal kosakata dimulai dari skala terkecil ke terbesar —
**Anggota Tubuh → Di Dalam Rumah (per ruangan) → Di Luar Rumah → Tempat Publik.**

Fitur andalan: **"Room Coloring"** — sebuah scene visual (ilustrasi ruangan/tempat) tampil abu-abu/monoton, lalu pengguna mengetik nama benda dalam bahasa Jepang di textbox; kalau benar, benda itu berubah warna jadi normal. Berlaku di semua level, dari anggota tubuh sampai tempat publik.

## 2. Keputusan Desain

| Aspek | Keputusan |
|---|---|
| Nama web | **Japonelole** |
| Palet warna | Putih, Navy, Merah Maroon |
| Gaya UI | Minimalis, modern, hemat tempat (nggak boros ruang/padding) |
| Alur per level | **Materi (belajar dulu) → pilih mode game → main** — user harus lihat kosakata dulu sebelum terjun ke game |
| Tampilan kosakata | Bisa toggle: Romaji saja / Hiragana+Romaji / Kanji+Hiragana+Romaji |
| Audio | Pakai Web Speech API (`speechSynthesis`, gratis, tanpa file audio manual) |
| Progress user | Perlu **akun/login** biar tersimpan (bukan cuma localStorage) |
| Backend/Auth | **Supabase** (Postgres + Auth, free tier) |

## 3. Struktur Konten (13 level, sudah dibuat)

**Anggota Tubuh** (1): Anggota Tubuh

**Di Dalam Rumah** (4): Kamar Tidur, Kamar Mandi, Ruang Tamu, Dapur

**Di Luar Rumah** (3): Halaman Rumah, Teras, Garasi

**Tempat Publik** (5): Jalan Raya, Taman, Stasiun, Rumah Sakit, Sekolah

Tiap scene: 6-8 kosakata dengan kanji, hiragana, romaji, arti Indonesia, dan posisi (x/y/w/h) di dalam scene.

## 4. Mode Game (4, semua sudah jadi)

1. **Room Coloring** — ketik jawaban, objek berubah warna (fitur utama)
2. **Flashcard** — tap untuk lihat jawaban, tandai sudah/belum hafal
3. **Pilihan Ganda** — pilih arti yang benar dari 4 opsi
4. **Matching** — cocokkan kartu kata Jepang dengan artinya

Semua mode pakai data scene yang sama, otomatis kepakai di 13 level.

## 5. Tech Stack

- **Next.js** (App Router, TypeScript) + **Tailwind CSS v4**
- Data kosakata: file JSON statis per scene (`src/data/scenes/`)
- **Supabase** untuk auth + database (skema SQL sudah dibuat di `supabase/schema.sql`, tabel `scene_progress` dengan RLS)
- Audio: `window.speechSynthesis` (browser native, `lang: "ja-JP"`)
- Rencana deploy: **Vercel**

## 6. Status: Sudah Selesai ✅

- [x] Setup project Next.js + Tailwind + palet warna custom
- [x] 13 scene/level lengkap dengan data kosakata
- [x] Landing page (list level dikelompokkan per kategori)
- [x] Halaman per-level: Materi → Menu pilih mode → Main
- [x] 4 mode game berfungsi penuh (Room Coloring, Flashcard, Pilihan Ganda, Matching)
- [x] Toggle tampilan script (romaji/hiragana/kanji)
- [x] Audio pengucapan
- [x] Skema database Supabase (SQL, belum dijalankan/dihubungkan)

## 7. Status: Belum Dikerjakan ⏳ (next steps)

- [ ] **Integrasi Supabase Auth** ke UI — login/register, session handling
- [ ] **Simpan progress user** ke tabel `scene_progress` (mastered_ids, attempts, correct) tiap kali main
- [ ] **Dashboard** — ringkasan progress user: level mana yang sudah selesai, skor per kategori, dsb.
- [ ] Cek & rapikan posisi objek visual di tiap scene (masih perkiraan awal, belum divalidasi langsung di browser)
- [ ] Deploy ke Vercel + sambungkan domain (opsional)
- [ ] Pertimbangkan: state "level terkunci/terbuka" mengikuti urutan progresif (sesuai metode belajar berjenjang)

## 8. Struktur File Penting

```
src/
  types/vocab.ts              # Tipe data Scene, VocabItem, ScriptMode
  data/scenes/                # 13 file JSON + index.ts
  lib/vocab.ts                # Helper: normalize, cek jawaban, label, speak()
  lib/supabase/               # client.ts (browser) & server.ts (server component)
  components/
    SceneSession.tsx          # Orkestrator alur: study -> menu -> game mode
    StudyMaterial.tsx         # Fase "Materi"
    GameMenu.tsx              # Menu pilih mode
    RoomScene.tsx             # Mode Room Coloring
    FlashcardGame.tsx
    MultipleChoiceGame.tsx
    MatchingGame.tsx
    ScriptModeToggle.tsx
  app/
    page.tsx                  # Landing page
    belajar/[sceneId]/page.tsx
supabase/schema.sql            # Skema tabel scene_progress + RLS policies
.env.local(.example)           # NEXT_PUBLIC_SUPABASE_URL & ANON_KEY (kosong, perlu diisi)
```

## 9. Catatan untuk Claude Code

- Belum ada `node_modules`/`.next` di zip — jalankan `npm install` dulu
- `.env.local` masih kosong, perlu diisi URL & anon key dari project Supabase yang dibuat sendiri
- Jalankan isi `supabase/schema.sql` di SQL Editor Supabase sebelum menghubungkan auth
- Prioritas kerja yang disarankan: (1) coba jalan lokal & validasi tampilan tiap scene, (2) setup Supabase + auth, (3) simpan progress, (4) dashboard, (5) deploy
