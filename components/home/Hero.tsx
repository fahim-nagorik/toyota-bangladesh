"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_EXPO, cn } from "@/lib/utils";
import { HERO_SLIDES } from "@/lib/data/hero";
import { RevealText } from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

/** Auto-advance interval for the hero carousel. */
const SLIDE_MS = 5500;
/** Drag distance/velocity past which a swipe commits to the next/prev slide. */
const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

// Directional slide: the incoming slide enters from the side you're heading
// toward and the outgoing one leaves the opposite way (transform-only, so it
// stays on the compositor). Reduced-motion collapses this to a plain fade.
const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
};
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Light product hero in the Apple mould. The RAV4 studio render is shot on
 * white, so it is composited on a light band with object-contain rather than
 * bled full-frame under a dark scrim — cropping a studio render looks wrong.
 *
 * With more than one slide (see lib/data/hero.ts) it becomes a carousel:
 * directional slide, autoplay, arrows, dots and touch swipe. A single slide
 * stays a still hero. Controls are never swipe-only — arrows and dots are
 * always present (UX: don't rely on horizontal swipe alone).
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
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
  // nav gets the full dwell). Paused on hover/focus and off entirely for
  // reduced-motion users.
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const carY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      /* Background is pure white to match the studio render's matte — any
         tint would frame the car in a visible rectangle. */
      className="relative flex h-[100svh] min-h-[620px] w-full flex-col overflow-hidden"
      aria-label="Toyota Bangladesh"
      style={{ background: "#FFFFFF" }}
    >
      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-site relative z-20 pt-[124px] md:pt-[152px]"
      >
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE_EXPO }}
            className="eyebrow"
          >
            Toyota Bangladesh
          </motion.p>

          <RevealText
            text="Let's Go Places"
            as="h1"
            className="text-hero mt-4"
            delay={0.2}
            stagger={0.09}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE_EXPO }}
            className="measure mt-5 text-[17px] leading-relaxed text-ink-muted md:text-xl"
          >
            Engineered for Bangladesh&apos;s roads. Built to last a lifetime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE_EXPO }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton href="/models" variant="red">
              Explore Models
            </MagneticButton>
            <MagneticButton href="/book-test-drive" variant="glass">
              Book a Test Drive
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Carousel viewport. Sits in the lower band and inherits the scroll
          parallax. Every slide keeps object-contain / object-bottom /
          mix-blend-multiply so its white matte drops into the gradient instead
          of stamping a rectangle. Pauses autoplay while hovered or focused. */}
      <motion.div
        style={reduced ? undefined : { y: carY, scale: carScale }}
        className="relative z-10 -mt-10 flex-1 md:-mt-20"
        role={isSlideshow ? "region" : undefined}
        aria-roledescription={isSlideshow ? "carousel" : undefined}
        aria-label={isSlideshow ? "Featured models" : undefined}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={reduced ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.6, ease: EASE_EXPO },
              opacity: { duration: reduced ? 0.25 : 0.35, ease: EASE_EXPO },
            }}
            drag={isSlideshow && !reduced ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            className="absolute inset-0 touch-pan-y"
            role={isSlideshow ? "group" : undefined}
            aria-roledescription={isSlideshow ? "slide" : undefined}
            aria-label={isSlideshow ? `${slide.label}, ${index + 1} of ${count}` : undefined}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              draggable={false}
              className="object-contain object-bottom mix-blend-multiply"
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / next — pointer affordance on top of swipe + dots (md+). */}
        {isSlideshow && (
          <>
            {/* size-11 is already a 44px target, so no hit-44 here — hit-44
                forces position:relative and would break the absolute pinning. */}
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous model"
              className="glass absolute left-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/80 md:flex"
            >
              <ChevronLeft className="size-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next model"
              className="glass absolute right-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/80 md:flex"
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          </>
        )}
      </motion.div>

      {/* Dots — always present so the carousel is never swipe-only. Radiogroup
          so the set is keyboard- and screen-reader navigable. */}
      {isSlideshow && (
        <div
          className="absolute inset-x-0 bottom-7 z-20 flex justify-center"
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            role="radiogroup"
            aria-label="Choose hero image"
            className="glass flex items-center gap-1 rounded-full px-2.5 py-2"
          >
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.image}
                type="button"
                role="radio"
                aria-checked={i === index}
                aria-label={`Show ${s.label}`}
                onClick={() => goTo(i)}
                className="hit-44 flex items-center justify-center px-1"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    i === index
                      ? "w-5 bg-toyota-red"
                      : "w-2 bg-ink/25 hover:bg-ink/45",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grounding shadow so the render doesn't float on the gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Scroll cue — hidden when the dots occupy the same bottom-centre slot. */}
      {!isSlideshow && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute inset-x-0 bottom-7 z-20 hidden justify-center md:flex"
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-11 w-7 items-start justify-center rounded-full border border-ink/20 pt-2"
          >
            <span className="block h-1.5 w-1 rounded-full bg-ink/40" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
