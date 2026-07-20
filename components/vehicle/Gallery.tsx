"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "motion/react";
import type { GalleryShot } from "@/lib/data/vehicles";
import { EASE_EXPO, VIEWPORT } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";

/** Horizontal scroll-snap strip, drag to pan (§4.1). */
export default function Gallery({
  shots,
  modelName,
}: {
  shots: GalleryShot[];
  modelName: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section-y overflow-x-clip bg-bg-alt">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Gallery</p>
            <h2 className="text-h2 mt-3">Closer.</h2>
          </div>
          <p className="hidden text-[13px] text-ink-muted md:block">
            Drag to pan
          </p>
        </Reveal>
      </div>

      <Reveal index={1} className="mt-12">
        <div
          ref={railRef}
          className="no-scrollbar overflow-x-auto overscroll-x-contain"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <motion.ul
            drag="x"
            dragConstraints={railRef}
            dragElastic={0.06}
            className="flex w-max cursor-grab gap-5 px-6 active:cursor-grabbing lg:px-16"
          >
            {shots.map((shot, i) => (
              <motion.li
                key={`${shot.src}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE_EXPO }}
                style={{ scrollSnapAlign: "start" }}
                className="w-[min(84vw,620px)] shrink-0"
              >
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-bg-tint">
                    <Image
                      src={shot.src}
                      alt={`Toyota ${modelName} — ${shot.caption}`}
                      fill
                      draggable={false}
                      sizes="(max-width: 768px) 84vw, 620px"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 px-1 text-[14px] text-ink-muted">
                    {shot.caption}
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Reveal>
    </section>
  );
}
