"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function noopSubscribe() {
  return () => {};
}

function getStandaloneSnapshot() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}
function getStandaloneServerSnapshot() {
  return false;
}

function getIsIosSnapshot() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}
function getIsIosServerSnapshot() {
  return false;
}

export function InstallAppButton() {
  const isStandalone = useSyncExternalStore(
    noopSubscribe,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );
  const isIos = useSyncExternalStore(noopSubscribe, getIsIosSnapshot, getIsIosServerSnapshot);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installedThisSession, setInstalledThisSession] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function handleAppInstalled() {
      setInstalledThisSession(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installed = isStandalone || installedThisSession;
  if (installed || (!deferredPrompt && !isIos)) return null;

  async function handleClick() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") setInstalledThisSession(true);
      setDeferredPrompt(null);
      return;
    }
    setShowIosHint((v) => !v);
  }

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1 rounded-full border border-navy/20 px-2.5 py-1 text-[11px] font-medium text-navy hover:border-maroon hover:text-maroon transition-colors"
      >
        📲 Pasang App
      </button>
      {showIosHint && (
        <div className="absolute right-0 top-8 z-20 w-60 rounded-lg border border-navy/10 bg-white p-3 text-xs leading-relaxed text-navy/70 shadow-lg">
          <p className="mb-1 font-medium text-navy">Cara pasang di iPhone:</p>
          <p>
            Tap ikon <strong>Share</strong> (kotak dengan panah ke atas) di Safari, lalu pilih{" "}
            <strong>&quot;Add to Home Screen&quot;</strong>.
          </p>
          <button
            type="button"
            onClick={() => setShowIosHint(false)}
            className="mt-2 text-navy/40 hover:text-navy"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
