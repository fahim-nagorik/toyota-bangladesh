"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { EASE_EXPO } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Light product hero in the Apple mould. The RAV4 studio render is shot on
 * white, so it is composited on a light band with object-contain rather than
 * bled full-frame under a dark scrim — cropping a studio render looks wrong.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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

      {/* The car sits in the lower band. The studio render is matted on white,
          so multiply blending drops its background into the gradient instead
          of stamping a white rectangle over it. */}
      <motion.div
        style={reduced ? undefined : { y: carY, scale: carScale }}
        className="relative z-10 -mt-10 flex-1 md:-mt-20"
      >
        <Image
          src="/rav4/colors/silver.webp"
          alt="Toyota RAV4 Hybrid in Silver Metallic"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom mix-blend-multiply"
        />
      </motion.div>

      {/* Grounding shadow so the render doesn't float on the gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40"
        style={{
          background:
            "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

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
    </section>
  );
}
