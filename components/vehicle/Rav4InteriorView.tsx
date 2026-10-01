"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, X } from "lucide-react";
import {
  RAV4_COCKPIT,
  RAV4_INTERIOR_HOTSPOTS as HOTSPOTS,
} from "@/lib/data/rav4-interior";
import { EASE_EXPO } from "@/lib/utils";

/** Inside view: cockpit photo, "+" hotspots, and a detail modal per hotspot. */
export default function Rav4InteriorView({ onExit }: { onExit: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const open = HOTSPOTS.find((h) => h.id === openId) ?? null;

  const close = () => {
    setOpenId(null);
    triggerRef.current?.focus();
  };

  // Esc closes, and the page behind stays put while the modal is open.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenId(null);
        triggerRef.current?.focus();
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openId]);

  return (
    <div className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-[24px] bg-black">
      <Image
        src={RAV4_COCKPIT.src}
        alt={RAV4_COCKPIT.alt}
        fill
        priority
        sizes="(max-width: 1440px) 100vw, 1440px"
        className="object-cover"
      />

      {HOTSPOTS.map((h) => (
        <button
          key={h.id}
          type="button"
          aria-label={h.title}
          aria-haspopup="dialog"
          onClick={(e) => {
            triggerRef.current = e.currentTarget;
            setOpenId(h.id);
          }}
          style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
          className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white before:absolute before:-inset-2 before:content-[''] ring-2 ring-white backdrop-blur-sm transition-transform duration-200 hover:scale-110 md:size-10"
        >
          {!reduced && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-white"
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <Plus className="relative size-4 md:size-5" strokeWidth={2.25} />
        </button>
      ))}

      {/* Back to the exterior */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Back to exterior view"
        className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-full bg-white text-[13px] font-semibold tracking-wide text-ink shadow-lg transition-transform duration-200 hover:scale-105 md:bottom-6 md:left-6 md:size-14"
      >
        EXT
      </button>

      <p className="pointer-events-none absolute bottom-5 right-5 hidden rounded-full bg-black/45 px-4 py-2 text-[13px] text-white/90 backdrop-blur-sm md:block">
        Select a + to explore
      </p>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={open.title}
                data-lenis-prevent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_EXPO }}
                onClick={close}
                className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 md:p-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: EASE_EXPO }}
                  onClick={(e) => e.stopPropagation()}
                  className="grid w-full max-w-[1100px] overflow-hidden bg-ink md:grid-cols-[1.6fr_1fr]"
                >
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px]">
                    <Image
                      src={open.image}
                      alt={`Toyota RAV4 — ${open.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 760px"
                      style={{ objectPosition: open.position }}
                      className="object-cover"
                    />
                  </div>

                  <div className="relative bg-gradient-to-b from-[#26262a] to-ink p-7 pt-8 md:p-10">
                    <button
                      type="button"
                      autoFocus
                      onClick={close}
                      aria-label="Close"
                      className="absolute right-4 top-4 flex size-11 items-center justify-center bg-white text-ink transition-colors hover:bg-white/85 md:right-5 md:top-5"
                    >
                      <X className="size-5" />
                    </button>
                    <span
                      aria-hidden
                      className="block h-[3px] w-10 bg-toyota-red"
                    />
                    <h3 className="mt-5 pr-14 text-[26px] font-medium leading-tight text-white md:mt-8 md:text-[30px]">
                      {open.title}
                    </h3>
                    <p className="mt-4 text-[16px] leading-relaxed text-white/80 md:text-[17px]">
                      {open.body}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
