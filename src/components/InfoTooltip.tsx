"use client";

import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block shrink-0">
      <button
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
        <div className="absolute right-0 top-6 z-10 w-56 rounded-lg border border-navy/10 bg-white p-2.5 text-xs leading-relaxed text-navy/70 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}
