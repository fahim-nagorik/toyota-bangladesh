"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Vehicle } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO } from "@/lib/utils";

/** Mobile-only bar that appears once the hero has scrolled away (§4.1). */
export default function StickyBuyBar({ vehicle }: { vehicle: Vehicle }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.5, ease: EASE_EXPO }}
          className="glass fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 md:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-[12px] uppercase tracking-[0.12em] text-ink-muted">
                {vehicle.name}
              </p>
              <p className="text-[17px] font-semibold tracking-[-0.02em]">
                {formatBDT(vehicle.priceFrom)}
              </p>
            </div>
            <Link
              href="/book-test-drive"
              className="shrink-0 rounded-full bg-toyota-red px-6 py-3 text-[15px] font-medium text-white"
            >
              Book Test Drive
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
