"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { EASE_EXPO } from "@/lib/utils";
import { HERO } from "@/lib/data/hero";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Full-bleed cinematic video hero (Porsche-style): a muted, looping, object-cover
 * clip behind a dark scrim, with the headline and CTAs overlaid bottom-left. The
 * poster frame covers first paint, reduced-motion, and any decode failure. A
 * play/pause control satisfies WCAG 2.2.2 (pause for motion > 5s). The video is
 * decorative (aria-hidden) and carries no audio, so no captions are required.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Autoplay is attempted from JS (more reliable than the attribute alone) and
  // is skipped entirely for reduced-motion users — the poster stands in.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      setPlaying(false);
      return;
    }
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [reduced]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-black"
      aria-label="Toyota Bangladesh"
    >
      {/* Decorative background video — object-cover so it fills any viewport. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={HERO.poster}
        src={HERO.video}
        muted
        loop
        playsInline
        autoPlay={!reduced}
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Scrim — vertical for the bottom copy, horizontal to seat it left. Keeps
          white text legible over bright frames without dimming the whole clip. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent"
      />
      {/* Top veil so the white nav keeps contrast over bright frames. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent"
      />

      {/* Copy — bottom-left, over the scrim. */}
      <div className="container-site relative z-10 pb-24 pt-[120px] md:pb-28">
        <div className="max-w-2xl [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_EXPO }}
            className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/80 md:text-[13px]"
          >
            {HERO.eyebrow}
          </motion.p>

          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE_EXPO }}
            className="mt-3 text-[clamp(2.5rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white"
          >
            {HERO.heading}
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_EXPO }}
            className="mt-5 max-w-md text-[17px] leading-relaxed text-white/80 md:text-lg"
          >
            {HERO.subhead}
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE_EXPO }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton href="/models/rav4" variant="red">
              Explore the RAV4 Hybrid
            </MagneticButton>
            <MagneticButton href="/book-test-drive" variant="glass">
              Book a Test Drive
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Play / pause — accessibility control for the auto-playing clip. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background video" : "Play background video"}
        className="absolute bottom-6 right-6 z-20 flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        {playing ? (
          <Pause className="size-4" strokeWidth={2} />
        ) : (
          <Play className="size-4 translate-x-[1px]" strokeWidth={2} />
        )}
      </button>
    </section>
  );
}
