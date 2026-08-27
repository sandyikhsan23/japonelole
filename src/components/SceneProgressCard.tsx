"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Scene } from "@/types/vocab";
import { resetSceneProgress } from "@/app/dashboard/actions";

export function SceneProgressCard({
  scene,
  total,
  mastered,
  isComplete,
}: {
  scene: Scene;
  total: number;
  mastered: number;
  isComplete: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  function closeMenu() {
    setMenuOpen(false);
    setConfirming(false);
  }

  function handleReset() {
    startTransition(async () => {
      await resetSceneProgress(scene.id);
      closeMenu();
    });
  }

  return (
    <li className="relative">
      <Link
        href={`/belajar/${scene.id}`}
        className="block rounded-xl border border-navy/10 px-3.5 py-2.5 lg:px-4 lg:py-3 hover:border-maroon/40 transition-colors h-full"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="font-medium text-navy text-sm leading-tight truncate pr-5">
            {scene.title}
          </p>
          {isComplete && <span className="shrink-0 text-xs text-maroon">✓</span>}
        </div>
        <div className="h-1.5 rounded-full bg-navy-soft overflow-hidden mb-1">
          <div className="h-full bg-maroon rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[11px] text-navy/40">
          {mastered}/{total} kosakata
        </p>
      </Link>

      <div className="absolute top-2 right-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((v) => !v);
            setConfirming(false);
          }}
          aria-label="Menu level"
          className="flex h-6 w-6 items-center justify-center rounded-full text-navy/40 hover:text-navy hover:bg-navy-soft transition-colors"
        >
          ⋮
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeMenu} />
            <div className="absolute right-0 top-7 z-20 w-44 rounded-lg border border-navy/10 bg-white p-1.5 shadow-lg">
              {!confirming ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setConfirming(true);
                  }}
                  className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Reset progress
                </button>
              ) : (
                <div className="p-1">
                  <p className="text-[11px] text-navy/60 mb-1.5">Yakin reset progress level ini?</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReset();
                      }}
                      disabled={isPending}
                      className="flex-1 rounded-md bg-red-600 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isPending ? "..." : "Ya, reset"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirming(false);
                      }}
                      className="flex-1 rounded-md border border-navy/15 py-1 text-xs text-navy hover:bg-navy-soft transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
}
