"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_EXPO, cn } from "@/lib/utils";
import { HERO_SLIDES } from "@/lib/data/hero";
import MagneticButton from "@/components/ui/MagneticButton";

/** Auto-advance interval for the hero carousel. */
const SLIDE_MS = 5500;

// A large hero image is a "complex" transition (ui-ux-pro-max: 500–800ms,
// expo.inOut), so the car eases in and out rather than snapping.
const EASE_SLIDE = [0.87, 0, 0.13, 1] as const;
const SLIDE_DURATION = 0.8;
/** Drag distance/velocity past which a swipe commits to the next/prev slide. */
const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

// Directional slide for the car: the incoming render enters from the side you
// are heading toward, the outgoing one leaves the opposite way (transform-only,
// stays on the compositor). Reduced-motion collapses this to a plain fade.
const carVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-60%" : "60%", opacity: 0 }),
};
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Homepage hero — a RAV4 product carousel. Text (eyebrow colour, headline,
 * supporting line) changes with the car on the right. With one slide it stays a
 * still hero; two or more turn on the slide transition, arrows and dots.
 * Controls are never swipe-only — arrows and dots are always present.
 */
export default function Hero() {
  const reduced = useReducedMotion();

  const isSlideshow = HERO_SLIDES.length > 1;
  const count = HERO_SLIDES.length;

  // [current index, direction of last move] — direction drives the slide side.
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const slide = HERO_SLIDES[index];

  const paginate = (dir: number) =>
    setPage(([i]) => [(i + dir + count) % count, dir]);
  const goTo = (i: number) => setPage(([cur]) => [i, i > cur ? 1 : -1]);

  // Autoplay via a per-slide timeout (resets on every index change, so a manual
  // nav gets the full dwell). Paused on hover/focus, off for reduced-motion.
  useEffect(() => {
    if (reduced || !isSlideshow || paused) return;
    const id = setTimeout(() => paginate(1), SLIDE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, isSlideshow, paused, index]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
      paginate(1);
    } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
      paginate(-1);
    }
  };

  return (
    <section
      /* Pure white to match the studio render's matte — any tint would frame
         the car in a visible rectangle. */
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pb-24 pt-[112px] md:pb-16 md:pt-0"
      aria-label="Toyota Bangladesh — featured models"
      style={{ background: "#FFFFFF" }}
      role={isSlideshow ? "region" : undefined}
      aria-roledescription={isSlideshow ? "carousel" : undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-site grid w-full items-center gap-6 md:grid-cols-2 md:gap-8">
        {/* LEFT — copy that changes with the slide. Re-keyed by index so it
            re-animates in; the outgoing copy unmounts (no overlap jump). */}
        <div className="relative z-20 order-2 max-w-xl md:order-1">
          <motion.div
            key={index}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-toyota-red md:text-[13px]">
              RAV4 Hybrid · {slide.color}
            </p>

            <h1 className="mt-4 text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.02em] text-ink">
              {slide.heading}
            </h1>

            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-muted md:text-lg">
              {slide.subhead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href="/models/rav4" variant="red">
                Explore the RAV4 Hybrid
              </MagneticButton>
              <MagneticButton href="/book-test-drive" variant="glass">
                Book a Test Drive
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — the car render. Directional slide + swipe. object-contain /
            mix-blend-multiply so the white matte drops onto the page. */}
        <div className="relative order-1 h-[38vh] min-h-[240px] w-full md:order-2 md:h-[68vh]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={reduced ? fadeVariants : carVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: SLIDE_DURATION, ease: EASE_SLIDE },
                opacity: { duration: reduced ? 0.25 : 0.5, ease: EASE_SLIDE },
              }}
              drag={isSlideshow && !reduced ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={onDragEnd}
              className="absolute inset-0 touch-pan-y"
              role={isSlideshow ? "group" : undefined}
              aria-roledescription={isSlideshow ? "slide" : undefined}
              aria-label={
                isSlideshow ? `${slide.label}, ${index + 1} of ${count}` : undefined
              }
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 55vw"
                draggable={false}
                className="object-contain mix-blend-multiply"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev / next — circular affordance at the edges (md+), on top of swipe
          and dots. size-11 is already a 44px target. */}
      {isSlideshow && (
        <>
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous model"
            className="absolute left-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-ink backdrop-blur transition-colors hover:border-toyota-red hover:text-toyota-red lg:flex"
          >
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next model"
            className="absolute right-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-ink backdrop-blur transition-colors hover:border-toyota-red hover:text-toyota-red lg:flex"
          >
            <ChevronRight className="size-5" strokeWidth={1.75} />
          </button>
        </>
      )}

      {/* Dots — always present so the carousel is never swipe-only. */}
      {isSlideshow && (
        <div className="absolute inset-x-0 bottom-8 z-30 flex justify-center">
          <div
            role="radiogroup"
            aria-label="Choose featured model"
            className="flex items-center gap-2"
          >
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.image}
                type="button"
                role="radio"
                aria-checked={i === index}
                aria-label={`Show ${s.label}`}
                onClick={() => goTo(i)}
                className="hit-44 flex items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    i === index
                      ? "w-6 bg-toyota-red"
                      : "w-2 bg-ink/25 hover:bg-ink/45",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
