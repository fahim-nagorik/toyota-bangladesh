"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { FeatureRow } from "@/lib/data/vehicles";
import { EASE_EXPO, VIEWPORT, cn } from "@/lib/utils";

/** Three alternating rows; the image enters from the side opposite the text. */
export default function FeatureRows({
  features,
  modelName,
}: {
  features: FeatureRow[];
  modelName: string;
}) {
  const reduced = useReducedMotion();

  return (
    // Rows enter from x: ±48, which would widen the page until the reveal
    // fires — clip horizontally so the off-screen start can't cause overflow.
    <section className="section-y overflow-x-clip bg-bg">
      <div className="container-site space-y-24 md:space-y-32">
        {features.map((f, i) => {
          const imageFirst = i % 2 === 1;
          return (
            <div
              key={f.title}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <motion.div
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, x: imageFirst ? -48 : 48 }
                }
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, ease: EASE_EXPO }}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-[20px] bg-bg-tint",
                  imageFirst ? "md:order-1" : "md:order-2",
                )}
              >
                <Image
                  src={f.image}
                  alt={`Toyota ${modelName} — ${f.title}`}
                  fill
                  sizes="(max-width: 768px) 92vw, 46vw"
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
                className={imageFirst ? "md:order-2" : "md:order-1"}
              >
                <p className="eyebrow">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
                  {f.title}
                </h3>
                <p className="measure mt-5 text-[17px] leading-relaxed text-ink-muted">
                  {f.body}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
