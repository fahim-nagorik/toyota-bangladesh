"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Percent, Wrench, Repeat, Package } from "lucide-react";
import { Reveal } from "@/components/ui/RevealText";
import { EASE_EXPO, VIEWPORT } from "@/lib/utils";

const OFFERS = [
  {
    Icon: Percent,
    title: "0% Interest EMI",
    body: "Spread the cost over 24 months at zero interest with participating banks — City, BRAC, EBL and Standard Chartered.",
    terms: "On selected models. Subject to credit approval. Ends 31 March.",
  },
  {
    Icon: Wrench,
    title: "Free 3-Year Maintenance",
    body: "All scheduled servicing covered for three years or 60,000km, including genuine oil, filters and labour.",
    terms: "New vehicle purchases only. Non-transferable after first owner.",
  },
  {
    Icon: Repeat,
    title: "Trade-In Bonus",
    body: "Up to ৳ 2,00,000 above valuation when you trade any make against a new Toyota. Free on-site appraisal.",
    terms: "Vehicle must be registered in the buyer's name for 12 months.",
  },
  {
    Icon: Package,
    title: "Genuine Parts Discount",
    body: "15% off all Toyota Genuine Parts and engine oil for the first year of ownership, at every dealer nationwide.",
    terms: "Applied automatically at checkout. Excludes accessories.",
  },
];

export default function Offers() {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section id="offers" className="section-y overflow-x-clip scroll-mt-20 bg-bg-alt">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Offers</p>
            <h2 className="text-h2 mt-3">Worth arriving early for.</h2>
          </div>
          <p className="hidden text-[13px] text-ink-muted md:block">
            Drag to browse
          </p>
        </Reveal>
      </div>

      {/* Bleeds to the viewport edge so cards run off-screen — §3.6 */}
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
            {OFFERS.map((offer, i) => {
              const { Icon } = offer;
              return (
                <motion.li
                  key={offer.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: EASE_EXPO,
                  }}
                  style={{ scrollSnapAlign: "start" }}
                  className="w-[300px] shrink-0 sm:w-[360px]"
                >
                  <article className="glass relative flex h-full flex-col overflow-hidden rounded-[24px] p-7">
                    {/* Red gradient wash in the corner — accent, never a wash (§6) */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(235,10,30,0.16) 0%, rgba(235,10,30,0) 70%)",
                      }}
                    />

                    <span className="relative mb-6 flex size-11 items-center justify-center rounded-full bg-toyota-red/10 text-toyota-red">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </span>

                    <h3 className="relative text-xl font-semibold tracking-[-0.02em]">
                      {offer.title}
                    </h3>
                    <p className="relative mt-3 flex-1 text-[15px] leading-relaxed text-ink-muted">
                      {offer.body}
                    </p>

                    <p className="relative mt-6 text-[12px] leading-relaxed text-ink-muted/75">
                      {offer.terms}
                    </p>

                    <a
                      href="#test-drive"
                      className="relative mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-toyota-red"
                    >
                      Claim Offer
                      <ArrowRight className="size-4" />
                    </a>
                  </article>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </Reveal>
    </section>
  );
}
