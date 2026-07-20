"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { VEHICLES, VEHICLE_FILTERS, type BodyType } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO, VIEWPORT, cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";

export default function VehicleGrid() {
  const [filter, setFilter] = useState<"All" | BodyType>("All");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () =>
      filter === "All"
        ? VEHICLES
        : VEHICLES.filter((v) => v.filters.includes(filter)),
    [filter],
  );

  return (
    <section id="models" className="section-y bg-bg scroll-mt-20">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">The Range</p>
          <h2 className="text-h2 mt-3">Find your Toyota.</h2>
        </Reveal>

        <Reveal index={1} className="mt-9">
          <div
            role="tablist"
            aria-label="Filter vehicles by body type"
            className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0"
          >
            {VEHICLE_FILTERS.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "relative shrink-0 rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-200",
                    active ? "text-white" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="vehicle-filter-pill"
                      transition={{ duration: 0.4, ease: EASE_EXPO }}
                      className="absolute inset-0 rounded-full bg-ink"
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.ul
          layout={!reduced}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((v, i) => (
              <motion.li
                key={v.slug}
                layout={!reduced}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.5,
                  delay: Math.min(i, 5) * 0.06,
                  ease: EASE_EXPO,
                }}
              >
                <Link
                  href={`/models/${v.slug}`}
                  className="group flex h-full flex-col rounded-[24px] border border-hairline bg-white p-5 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] md:p-6"
                  style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-bg-tint">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-contain mix-blend-multiply p-4 transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col px-1 pt-6">
                    <p className="eyebrow">{v.bodyType}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
                      {v.name}
                    </h3>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-muted">
                      {v.description}
                    </p>

                    <div className="mt-6 flex items-end justify-between gap-4 border-t border-hairline pt-5">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                          Starting from
                        </p>
                        <p className="mt-1 text-lg font-semibold tracking-[-0.02em]">
                          {formatBDT(v.priceFrom)}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-tint text-toyota-red transition-all duration-500 group-hover:bg-toyota-red group-hover:text-white"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                      >
                        <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <p className="mt-16 text-center text-ink-muted">
            No models in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
