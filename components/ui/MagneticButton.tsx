"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/* Created once at module scope — building these during render would reset
   their state on every pass. */
const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;

type Variant = "red" | "glass" | "ink" | "ghost";

const VARIANTS: Record<Variant, string> = {
  red: "bg-toyota-red text-white hover:bg-toyota-red-dark shadow-[0_4px_16px_rgba(235,10,30,0.24)]",
  glass: "glass text-ink hover:bg-white/80",
  ink: "bg-ink text-white hover:bg-ink/85",
  ghost: "text-ink hover:bg-ink/5 border border-hairline",
};

interface Props {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Pill button with magnetic cursor pull on fine pointers (§2). Touch devices
 * get the scale-on-tap only — magnetism has no meaning without a cursor.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "red",
  className,
  type = "button",
  disabled,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 20, mass: 0.4 });
  const y = useSpring(my, { stiffness: 250, damping: 20, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    // Pull up to ~22% of the button's own size toward the cursor.
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full",
    "px-7 py-3.5 text-[15px] font-medium tracking-[-0.01em]",
    "min-h-[44px] transition-colors duration-200 select-none",
    "disabled:opacity-40 disabled:pointer-events-none",
    VARIANTS[variant],
    className,
  );

  const motionProps = {
    style: reduced ? undefined : { x, y },
    whileTap: reduced ? undefined : { scale: 0.97 },
    onMouseMove: handleMove,
    onMouseLeave: reset,
    className: classes,
  };

  if (href) {
    // In-page anchors stay plain <a>; everything else routes through Link.
    const Tag = href.startsWith("#") ? MotionAnchor : MotionLink;
    return (
      <Tag ref={ref as never} href={href} aria-label={ariaLabel} {...motionProps}>
        {children}
      </Tag>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
