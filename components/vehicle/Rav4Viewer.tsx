"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, X, MoveHorizontal } from "lucide-react";
import { EASE_EXPO, cn } from "@/lib/utils";
import type { VehicleColor } from "@/lib/data/vehicles";

const FRAME_COUNT = 36;
const FRAMES = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/rav4/360/${String(i + 1).padStart(3, "0")}.webp`,
);

const FRICTION = 0.94;      // momentum decay per tick (§4.3)
const MIN_VELOCITY = 0.015; // below this the spin is considered settled
const PX_PER_FRAME = 8;     // drag sensitivity (§4.3)
// Caps the release velocity. A fast flick can otherwise report a huge
// frames-per-tick figure and coast for several full turns, which reads as the
// viewer spinning by itself. ~2 frames/tick settles within about one turn.
const MAX_VELOCITY = 2;

interface Hotspot {
  id: string;
  title: string;
  body: string;
  x: number;
  y: number;
  /** 1-based inclusive frame window; may wrap past 36. */
  frames: [number, number];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "headlamps",
    title: "Full-LED Headlamps",
    body: "Projector LEDs with an automatic levelling function and integrated daytime running lights.",
    x: 0.29,
    y: 0.55,
    frames: [30, 8],
  },
  {
    id: "wheels",
    title: "19-inch Alloy Wheels",
    body: "Machined two-tone alloys on 235/55 R19 tyres, sized for ride comfort over broken surfaces.",
    x: 0.7,
    y: 0.72,
    frames: [4, 16],
  },
  {
    id: "roof",
    title: "Panoramic Moonroof",
    body: "A tilt-and-slide glass roof with a powered sunshade, spanning both seat rows.",
    x: 0.5,
    y: 0.33,
    frames: [1, 36],
  },
  {
    id: "spoiler",
    title: "Rear Roof Spoiler",
    body: "A body-coloured spoiler that smooths airflow off the tailgate, cutting lift and wind noise.",
    x: 0.74,
    y: 0.4,
    frames: [14, 26],
  },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Rav4Viewer({ colors }: { colors: VehicleColor[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const posRef = useRef(0);
  const velRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStart = useRef({ x: 0, pos: 0 });
  const lastMove = useRef({ t: 0, pos: 0 });
  const interactedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [frame, setFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [openHotspot, setOpenHotspot] = useState<string | null>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const reduced = useReducedMotion();

  // Preload every frame before enabling interaction (§4.3).
  useEffect(() => {
    let cancelled = false;
    let settled = 0;
    let failed = 0;

    const imgs = FRAMES.map((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
      return img;
    });

    const onSettle = (ok: boolean) => {
      if (cancelled) return;
      settled += 1;
      if (!ok) failed += 1;
      setProgress(settled / FRAME_COUNT);
      if (settled < FRAME_COUNT) return;
      if (failed > 0) {
        setStatus("error");
      } else {
        imagesRef.current = imgs;
        setStatus("ready");
      }
    };

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth) {
        onSettle(true);
        return;
      }
      img.onload = () => onSettle(true);
      img.onerror = () => onSettle(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[mod(Math.round(posRef.current), FRAME_COUNT)];
    if (!canvas || !ctx || !img?.naturalWidth) return;
    const { width: cw, height: ch } = canvas;
    // Contain, not cover — the whole car must stay in frame at every angle.
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // Size the backing store to device pixels so the car isn't soft on retina.
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(entry.contentRect.width * dpr);
      canvas.height = Math.round(entry.contentRect.height * dpr);
      draw();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // Single rAF loop: drag momentum and render. Rotation is manual only — the
  // viewer never moves on its own.
  useEffect(() => {
    if (status !== "ready") return;
    let raf = 0;

    const tick = () => {
      if (!draggingRef.current) {
        if (Math.abs(velRef.current) > MIN_VELOCITY) {
          posRef.current += velRef.current;
          velRef.current *= FRICTION;
        } else {
          velRef.current = 0;
        }
      }
      draw();
      const current = mod(Math.round(posRef.current), FRAME_COUNT);
      setFrame((prev) => (prev === current ? prev : current));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, draw]);

  const markInteracted = () => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    setInteracted(true);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (status !== "ready") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    markInteracted();
    setOpenHotspot(null);
    velRef.current = 0;
    dragStart.current = { x: e.clientX, pos: posRef.current };
    lastMove.current = { t: performance.now(), pos: posRef.current };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    const next =
      dragStart.current.pos - (e.clientX - dragStart.current.x) / PX_PER_FRAME;
    const now = performance.now();
    const dt = now - lastMove.current.t;
    if (dt > 0) {
      // Smooth the instantaneous velocity so a jittery pointer doesn't fling.
      const instant = ((next - lastMove.current.pos) / dt) * (1000 / 60);
      const blended = velRef.current * 0.6 + instant * 0.4;
      velRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, blended));
    }
    lastMove.current = { t: now, pos: next };
    posRef.current = next;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    draggingRef.current = false;
    setDragging(false);
    if (reduced) velRef.current = 0; // no momentum under reduced motion
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (status !== "ready") return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    markInteracted();
    velRef.current = 0;
    posRef.current = Math.round(posRef.current) + (e.key === "ArrowRight" ? 1 : -1);
  };

  const visibleHotspots = useMemo(() => {
    if (status !== "ready" || !interacted) return [];
    const f = frame + 1;
    return HOTSPOTS.filter(({ frames: [a, b] }) =>
      a <= b ? f >= a && f <= b : f >= a || f <= b,
    );
  }, [frame, status, interacted]);

  const activeColor = colors[colorIndex];

  // Static fallback if any frame failed to load.
  if (status === "error") {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-bg-tint">
        <Image
          src={activeColor.image ?? FRAMES[0]}
          alt="Toyota RAV4 exterior"
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="360 degree view of the RAV4. Drag, or press the left and right arrow keys, to rotate."
        aria-valuemin={1}
        aria-valuemax={FRAME_COUNT}
        aria-valuenow={frame + 1}
        aria-valuetext={`Frame ${frame + 1} of ${FRAME_COUNT}`}
        onKeyDown={onKeyDown}
        className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-[24px] md:aspect-[16/9]"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            "absolute inset-0 size-full",
            status !== "ready"
              ? "cursor-default"
              : dragging
                ? "cursor-grabbing"
                : "cursor-grab",
          )}
          style={{ touchAction: "none" }}
        />

        {/* Hotspots — §4.3 */}
        {visibleHotspots.map((h) => (
          <div
            key={h.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
          >
            <button
              type="button"
              aria-label={h.title}
              aria-expanded={openHotspot === h.id}
              onClick={() => setOpenHotspot((c) => (c === h.id ? null : h.id))}
              className="hit-44 relative flex size-8 items-center justify-center rounded-full bg-toyota-red text-white shadow-[0_2px_10px_rgba(235,10,30,0.4)] transition-transform duration-200 hover:scale-110"
            >
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-toyota-red"
                  animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <Plus className="relative size-4" strokeWidth={2.5} />
            </button>

            <AnimatePresence>
              {openHotspot === h.id && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: EASE_EXPO }}
                  className="glass absolute left-1/2 top-full z-20 mt-3 w-60 -translate-x-1/2 rounded-[16px] p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[15px] font-medium leading-snug">
                      {h.title}
                    </p>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setOpenHotspot(null)}
                      className="hit-44 shrink-0 text-ink-muted hover:text-ink"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                    {h.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Drag affordance — fades out after first interaction (§4.3) */}
        <AnimatePresence>
          {status === "ready" && !interacted && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center"
            >
              <span className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium">
                <MoveHorizontal className="size-4" strokeWidth={1.75} />
                Drag to explore
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preload progress — thin red line + label (§4.3) */}
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-tint">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Loading the 360 degree experience"
              className="h-[2px] w-56 overflow-hidden rounded-full bg-ink/10"
            >
              <div
                className="h-full bg-toyota-red transition-[width] duration-150"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-[13px] text-ink-muted">
              Loading experience — {Math.round(progress * 100)}%
            </p>
          </div>
        )}
      </div>

      {/* Colour swatches. NOTE: the 36-frame rotation sequence exists in
          silver only for this demo — selecting another colour cross-fades the
          static hero shot rather than re-rotating the car. */}
      <div className="mt-7 flex flex-col items-center gap-4">
        <div className="glass inline-flex items-center gap-1.5 rounded-full p-1.5">
          {colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setColorIndex(i)}
              aria-label={c.name}
              aria-pressed={i === colorIndex}
              title={c.name}
              className={cn(
                "hit-44 relative flex size-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105",
                i === colorIndex && "ring-2 ring-toyota-red ring-offset-2",
              )}
              style={{ backgroundColor: c.hex }}
            >
              <span className="sr-only">{c.name}</span>
            </button>
          ))}
        </div>
        <p className="text-[13px] text-ink-muted">
          {activeColor.name}
          {colorIndex !== 0 && (
            <span className="ml-2 text-ink-muted/70">
              — 360° rotation shown in Silver Metallic
            </span>
          )}
        </p>
      </div>

      {/* Static colour shot, cross-fading on swatch change (§4.3) */}
      <AnimatePresence mode="wait">
        {colorIndex !== 0 && activeColor.image && (
          <motion.div
            key={activeColor.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
            className="relative mt-7 aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-bg-tint"
          >
            <Image
              src={activeColor.image}
              alt={`Toyota RAV4 in ${activeColor.name}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
