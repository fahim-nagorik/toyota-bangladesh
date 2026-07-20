"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import type { Vehicle } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ModelHero({
  vehicle,
  image,
}: {
  vehicle: Vehicle;
  /** Driven by the colour selector when the model has per-colour shots. */
  image: string;
}) {
  return (
    <section className="bg-bg-tint pb-14 pt-[112px] md:pb-20 md:pt-[136px]">
      <div className="container-site">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="eyebrow"
            >
              {vehicle.bodyType}
            </motion.p>

            <RevealText
              text={vehicle.name}
              as="h1"
              className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
              delay={0.05}
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE_EXPO }}
              className="measure mt-5 text-[17px] leading-relaxed text-ink-muted md:text-xl"
            >
              {vehicle.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: EASE_EXPO }}
              className="mt-8"
            >
              <p className="text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                Starting from
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-[-0.03em]">
                {formatBDT(vehicle.priceFrom)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: EASE_EXPO }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <MagneticButton href="/book-test-drive" variant="red">
                Book Test Drive
              </MagneticButton>
              <MagneticButton href="/service" variant="glass">
                <Download className="size-4" strokeWidth={1.75} />
                Download Brochure
              </MagneticButton>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-9 flex flex-wrap gap-2"
            >
              {vehicle.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-full border border-hairline bg-white/70 px-3.5 py-1.5 text-[13px] text-ink-muted"
                >
                  {h}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_EXPO }}
            className="relative aspect-[16/11] w-full"
          >
            <Image
              key={image}
              src={image}
              alt={`Toyota ${vehicle.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 92vw, 55vw"
              className="object-contain mix-blend-multiply"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
