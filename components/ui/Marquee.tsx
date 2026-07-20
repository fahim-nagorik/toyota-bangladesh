"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Seamless ticker. Renders the child set twice and translates -50%, so the
 * second copy is exactly where the first began when the loop restarts.
 */
export default function Marquee({
  items,
  speed = 40,
  className,
}: {
  items: string[];
  /** Seconds for one full pass. */
  speed?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div
      className={cn("relative overflow-hidden py-6", className)}
      aria-hidden
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-14 whitespace-nowrap"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="text-[13px] font-medium uppercase tracking-[0.18em] text-ink-muted"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
