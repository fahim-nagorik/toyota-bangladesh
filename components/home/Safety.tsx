"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "@/components/ui/RevealText";
import CountUp from "@/components/ui/CountUp";
import { EASE_EXPO, VIEWPORT } from "@/lib/utils";

const STATS = [
  { value: 5, suffix: "★", label: "ASEAN NCAP", note: "Adult occupant protection" },
  { value: 8, suffix: "", label: "SRS Airbags", note: "Front, side and curtain" },
  { value: 360, suffix: "°", label: "Camera", note: "Panoramic view monitor" },
  { value: 100, suffix: "%", label: "Pre-Collision", note: "Standard across the range" },
];

const TSS_FEATURES = [
  {
    name: "Pre-Collision System",
    body: "Millimetre-wave radar and a monocular camera scan for vehicles, pedestrians and cyclists — and brake for you if you don't.",
  },
  {
    name: "Dynamic Radar Cruise Control",
    body: "Holds a set gap to the car ahead, down to a standstill in traffic and back up to speed without touching a pedal.",
  },
  {
    name: "Lane Tracing Assist",
    body: "Reads lane markings and the vehicle ahead, applying gentle steering corrections to keep the car centred.",
  },
  {
    name: "Automatic High Beam",
    body: "Switches between high and low beam as oncoming traffic appears, so you keep the light without dazzling anyone.",
  },
];

export default function Safety() {
  return (
    <section id="safety" className="section-y scroll-mt-20 bg-bg">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Safety</p>
          <h2 className="text-h2 mt-3">
            The safest place on a Bangladeshi road.
          </h2>
        </Reveal>
      </div>

      <Reveal index={1} className="mt-14">
        <div className="container-site">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-bg-tint md:aspect-[21/9]">
            <Image
              src="/tech/safety-sense.webp"
              alt="Toyota Safety Sense sensing the road ahead"
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Soft radial vignette — §3.5 */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-4 md:gap-8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dd className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-none tracking-[-0.03em] text-white">
                      <CountUp value={s.value} />
                      {s.suffix}
                    </dd>
                    <dt className="mt-2 text-[15px] font-medium text-white">
                      {s.label}
                    </dt>
                    <p className="mt-0.5 text-[13px] leading-snug text-white/60">
                      {s.note}
                    </p>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="container-site mt-16">
        <p className="eyebrow mb-2">Toyota Safety Sense</p>
        <ul>
          {TSS_FEATURES.map((f, i) => (
            <motion.li
              key={f.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_EXPO }}
              className="grid gap-2 border-b border-hairline py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12"
            >
              <h3 className="text-xl font-medium tracking-[-0.02em]">
                {f.name}
              </h3>
              <p className="measure text-[15px] leading-relaxed text-ink-muted">
                {f.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
