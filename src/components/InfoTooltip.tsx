"use client";

import { useEffect, useRef, useState } from "react";

const TOOLTIP_WIDTH = 224; // matches w-56

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [align, setAlign] = useState<"left" | "right">("right");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceToRight = window.innerWidth - rect.left;
    setAlign(spaceToRight >= TOOLTIP_WIDTH + 16 ? "left" : "right");
  }, [open]);

  return (
    <div className="relative inline-block shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-label="Cara bermain"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-navy/25 text-[11px] font-semibold text-navy/50 transition-colors hover:border-maroon hover:text-maroon"
      >
        i
      </button>
      {open && (
        <div
          className={`absolute top-6 z-10 w-56 max-w-[85vw] rounded-lg border border-navy/10 bg-white p-2.5 text-xs leading-relaxed text-navy/70 shadow-lg ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
