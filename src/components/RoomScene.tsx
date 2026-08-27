"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Scene, ScriptMode, SessionResult, SceneStage, VocabItem } from "@/types/vocab";
import { isCorrectAnswer, labelFor, speak } from "@/lib/vocab";

export function RoomScene(props: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
}) {
  if (props.scene.stages && props.scene.stages.length > 0) {
    return <StagedRoomScene {...props} stages={props.scene.stages} />;
  }
  return <LegacyRoomScene {...props} />;
}

function AnswerForm({
  placeholder,
  input,
  setInput,
  feedback,
  onSubmit,
}: {
  placeholder: string;
  input: string;
  setInput: (v: string) => void;
  feedback: "idle" | "correct" | "wrong";
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-3 flex gap-2">
      <input
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
          feedback === "correct"
            ? "border-green-500 bg-green-50"
            : feedback === "wrong"
            ? "border-red-400 bg-red-50"
            : "border-navy/15 focus:border-navy"
        }`}
      />
      <button
        type="submit"
        className="rounded-lg bg-navy text-white px-4 py-2.5 text-sm font-medium hover:bg-navy-2 transition-colors"
      >
        Cek
      </button>
    </form>
  );
}

function StagedRoomScene({
  scene,
  scriptMode,
  onFinish,
  stages,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
  stages: SceneStage[];
}) {
  const maskId = useId();
  const filterId = useId();

  const [stageIndex, setStageIndex] = useState(0);
  const [posInStage, setPosInStage] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [lastCorrect, setLastCorrect] = useState<VocabItem | null>(null);
  const wrongCountRef = useRef(0);

  const stage = stages[stageIndex];
  const stageComplete = posInStage >= stage.items.length;
  const isLastStage = stageIndex === stages.length - 1;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || stageComplete) return;

    const current = stage.items[posInStage];
    if (isCorrectAnswer(input, current)) {
      speak(current.kanji || current.hiragana);
      setFeedback("correct");
      setLastCorrect(current);
      setInput("");
      setPosInStage((p) => p + 1);
      setTimeout(() => setFeedback("idle"), 600);
    } else {
      wrongCountRef.current += 1;
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 450);
    }
  }

  function handleNextStage() {
    if (isLastStage) {
      onFinish({
        masteredIds: scene.objects.map((o) => o.id),
        attempts: scene.objects.length + wrongCountRef.current,
        correct: scene.objects.length,
      });
      return;
    }
    setStageIndex((i) => i + 1);
    setPosInStage(0);
  }

  const currentItem = stage.items[posInStage];

  return (
    <div key={stageIndex}>
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-navy/50">
          Tahap {stageIndex + 1}/{stages.length} — sebutkan sesuai urutan nomor
        </span>
        <span className="font-medium text-navy">
          {posInStage}/{stage.items.length}
        </span>
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden border border-navy/10 bg-cream"
        style={{ aspectRatio: "2816 / 1536" }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            {!stage.imageGray && (
              <filter id={filterId}>
                <feColorMatrix type="saturate" values="0" />
              </filter>
            )}
            <mask id={maskId} maskContentUnits="objectBoundingBox" maskUnits="objectBoundingBox">
              <rect x="0" y="0" width="1" height="1" fill="white" />
              {!stageComplete &&
                stage.items.slice(0, posInStage).map((item) => (
                  <rect
                    key={item.id}
                    x={item.x / 100}
                    y={item.y / 100}
                    width={item.w / 100}
                    height={item.h / 100}
                    fill="black"
                  />
                ))}
            </mask>
          </defs>

          <image
            href={stage.image}
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="none"
          />
          {!stageComplete && (
            <image
              href={stage.imageGray ?? stage.image}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="none"
              filter={stage.imageGray ? undefined : `url(#${filterId})`}
              mask={`url(#${maskId})`}
            />
          )}
        </svg>

        {!stageComplete &&
          stage.items.map((item, i) => {
            if (i < posInStage) return null;
            const isCurrent = i === posInStage;
            return (
              <div
                key={item.id}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${item.labelX ?? item.x + item.w / 2}%`,
                  top: `${item.labelY ?? item.y + item.h / 2}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={`flex items-center justify-center rounded-full font-semibold shadow-sm transition-all ${
                    isCurrent
                      ? "h-7 w-7 bg-maroon text-white text-sm ring-2 ring-white"
                      : "h-5 w-5 bg-navy-soft text-navy/60 text-[10px] border border-navy/20"
                  }`}
                >
                  {i + 1}
                </span>
              </div>
            );
          })}
      </div>

      {!stageComplete && currentItem ? (
        <>
          <AnswerForm
            placeholder={`Nomor ${posInStage + 1}: ketik kosakata...`}
            input={input}
            setInput={setInput}
            feedback={feedback}
            onSubmit={handleSubmit}
          />
          {feedback === "correct" && lastCorrect && (
            <p className="mt-1.5 text-xs text-green-600">✓ {labelFor(lastCorrect, scriptMode)}</p>
          )}
          {feedback === "wrong" && (
            <p className="mt-1.5 text-xs text-red-500">Belum tepat, coba lagi.</p>
          )}
        </>
      ) : (
        <div className="mt-3">
          <div className="rounded-lg bg-maroon-soft border border-maroon/20 px-3.5 py-2.5 text-maroon text-center text-sm font-medium">
            {isLastStage ? "Semua bagian tubuh selesai diwarnai 🎉" : "Bagian ini selesai diwarnai 🎉"}
          </div>
          <button
            onClick={handleNextStage}
            className="mt-2 w-full rounded-xl bg-navy text-white py-2.5 text-sm font-medium hover:bg-navy-2 transition-colors"
          >
            {isLastStage ? "← Pilih mode lain" : "Lanjut ke bagian berikutnya →"}
          </button>
        </div>
      )}
    </div>
  );
}

function LegacyRoomScene({
  scene,
  scriptMode,
  onFinish,
}: {
  scene: Scene;
  scriptMode: ScriptMode;
  onFinish: (result: SessionResult) => void;
}) {
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);
  const wrongCountRef = useRef(0);

  const total = scene.objects.length;
  const done = matched.size;
  const isComplete = done === total;

  const remaining = useMemo(
    () => scene.objects.filter((o) => !matched.has(o.id)),
    [scene.objects, matched]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const hit = remaining.find((item) => isCorrectAnswer(input, item));
    if (hit) {
      const next = new Set(matched).add(hit.id);
      setMatched(next);
      setFeedback("correct");
      setActiveId(hit.id);
      setInput("");
      setTimeout(() => setFeedback("idle"), 600);
    } else {
      wrongCountRef.current += 1;
      setFeedback("wrong");
      setTimeout(() => setFeedback("idle"), 450);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-navy/50">Sebutkan nama bendanya</span>
        <span className="font-medium text-navy">
          {done}/{total}
        </span>
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden border border-navy/10 bg-cream"
        style={{ paddingTop: "58%" }}
      >
        <div className="absolute inset-0">
          {scene.objects.map((item: VocabItem) => {
            const isMatched = matched.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => isMatched && speak(item.kanji || item.hiragana)}
                className="absolute rounded-md border flex items-end justify-center transition-all duration-500 ease-out"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.w}%`,
                  height: `${item.h}%`,
                  backgroundColor: isMatched ? "#9c2b3a" : "#d4d4d4",
                  borderColor: isMatched ? "#7a1f2b" : "#a8a8a8",
                  filter: isMatched ? "grayscale(0)" : "grayscale(1)",
                  boxShadow:
                    activeId === item.id && isMatched
                      ? "0 0 0 3px rgba(156,43,58,0.3)"
                      : "none",
                  cursor: isMatched ? "pointer" : "default",
                }}
                title={isMatched ? "Klik untuk dengar pengucapan" : undefined}
              >
                {isMatched && (
                  <span className="mb-1 px-1.5 py-0.5 rounded bg-white/95 text-[10px] sm:text-xs font-medium text-navy shadow-sm">
                    {labelFor(item, scriptMode)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {!isComplete ? (
        <AnswerForm
          placeholder="Ketik kosakata..."
          input={input}
          setInput={setInput}
          feedback={feedback}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="mt-3">
          <div className="rounded-lg bg-maroon-soft border border-maroon/20 px-3.5 py-2.5 text-maroon text-center text-sm font-medium">
            Ruangan selesai diwarnai 🎉
          </div>
          <button
            onClick={() =>
              onFinish({
                masteredIds: Array.from(matched),
                attempts: total + wrongCountRef.current,
                correct: total,
              })
            }
            className="mt-2 w-full rounded-xl border border-navy/15 text-navy py-2.5 text-sm font-medium hover:bg-navy-soft transition-colors"
          >
            ← Pilih mode lain
          </button>
        </div>
      )}

      {feedback === "wrong" && (
        <p className="mt-1.5 text-xs text-red-500">Belum tepat, coba lagi.</p>
      )}
    </div>
  );
}
