"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_EXPO, VIEWPORT, cn } from "@/lib/utils";

/**
 * Word-by-word mask-up reveal (§3.2). Each word rides in its own
 * overflow-hidden clip so the letters appear to rise out of the line.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: React.ElementType;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      {/* Screen readers get the whole string; the split is presentational. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom pb-[0.12em]"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={VIEWPORT}
              transition={{
                duration: 1.1,
                delay: delay + i * stagger,
                ease: EASE_EXPO,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * The standard block reveal: opacity 0→1, y 32→0 (§2).
 * `index` drives the 0.08s stagger between siblings.
 */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.08,
        ease: EASE_EXPO,
      }}
    >
      {children}
    </motion.div>
  );
}
