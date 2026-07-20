"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Counts from 0 to `value` once the element scrolls into view.
 * Reduced motion jumps straight to the final number.
 */
export default function CountUp({
  value,
  duration = 1.6,
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced motion never animates, so it needs no effect at all — the final
    // value is substituted at render time instead.
    if (!inView || reduced) return;

    let raf = 0;
    const start = performance.now();
    // Same expo-out curve as every other transition on the site.
    const ease = (t: number) => 1 - Math.pow(2, -10 * t);

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setDisplay(value * (t === 1 ? 1 : ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={className}>
      {shown.toFixed(decimals)}
    </span>
  );
}
