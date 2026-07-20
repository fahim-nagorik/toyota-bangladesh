"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO, VIEWPORT } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";

export default function RelatedModels({ models }: { models: Vehicle[] }) {
  if (models.length === 0) return null;

  return (
    <section className="section-y bg-bg-alt">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">Also consider</p>
          <h2 className="text-h2 mt-3">Related models.</h2>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((v, i) => (
            <motion.li
              key={v.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_EXPO }}
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
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
                    {v.name}
                  </h3>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-hairline pt-4">
                    <p className="text-[15px] font-medium">
                      {formatBDT(v.priceFrom)}
                    </p>
                    <span
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-full bg-bg-tint text-toyota-red transition-all duration-500 group-hover:bg-toyota-red group-hover:text-white"
                    >
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
