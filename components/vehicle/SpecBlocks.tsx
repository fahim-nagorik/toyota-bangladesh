"use client";

import { motion } from "motion/react";
import type { Vehicle } from "@/lib/data/vehicles";
import { EASE_EXPO, VIEWPORT } from "@/lib/utils";
import CountUp from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/RevealText";

export default function SpecBlocks({ vehicle }: { vehicle: Vehicle }) {
  const { specs } = vehicle;

  const blocks = [
    { ...specs.power, kind: "number" as const },
    { ...specs.torque, kind: "number" as const },
    { ...specs.fuelEconomy, kind: "number" as const },
    { ...specs.seats, kind: "number" as const },
  ];

  return (
    <section className="section-y bg-bg">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Specification</p>
          <h2 className="text-h2 mt-3">The numbers.</h2>
        </Reveal>

        <dl className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_EXPO }}
              className="border-t border-hairline pt-6"
            >
              <dd className="text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none tracking-[-0.03em]">
                <CountUp value={b.value} />
                <span className="ml-1.5 text-[0.36em] font-medium tracking-normal text-ink-muted">
                  {b.unit}
                </span>
              </dd>
              <dt className="mt-3 text-[15px] text-ink-muted">{b.label}</dt>
            </motion.div>
          ))}
        </dl>

        <Reveal className="mt-16">
          <dl className="grid gap-x-12 gap-y-0 border-t border-hairline sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Engine", value: specs.engine },
              { label: "Transmission", value: specs.transmission },
              { label: "Drivetrain", value: specs.drivetrain },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-b border-hairline py-5"
              >
                <dt className="text-[15px] text-ink-muted">{row.label}</dt>
                <dd className="text-right text-[15px] font-medium">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
