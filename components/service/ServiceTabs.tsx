"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart, resolveCart } from "@/lib/store/cart";
import { EASE_EXPO, cn } from "@/lib/utils";
import { RevealText } from "@/components/ui/RevealText";
import ProductGrid from "./ProductGrid";
import BookingFlow from "./BookingFlow";
import CartSheet from "./CartSheet";

type Tab = "shop" | "book";

export default function ServiceTabs({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const { lines, open } = useCart();
  const { itemCount } = resolveCart(lines);

  return (
    <>
      <section className="bg-bg-tint pb-14 pt-[112px] md:pt-[136px]">
        <div className="container-site">
          <div className="flex flex-col items-center text-center">
            <p className="eyebrow">Service &amp; Parts</p>

            <RevealText
              text={
                tab === "shop"
                  ? "Genuine Toyota Parts."
                  : "Book a Service."
              }
              as="h1"
              className="mt-3 text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
            />

            <p className="measure mt-5 text-[17px] leading-relaxed text-ink-muted md:text-xl">
              {tab === "shop"
                ? "Engineered by the people who built your car."
                : "Factory-trained technicians, genuine parts, and a written estimate before any work begins."}
            </p>

            {/* Glass segmented control with an animated pill — §5 */}
            <div
              role="tablist"
              aria-label="Service sections"
              className="glass mt-9 inline-flex rounded-full p-1.5"
            >
              {(
                [
                  { id: "shop", label: "Shop Parts" },
                  { id: "book", label: "Book a Service" },
                ] as const
              ).map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative min-h-[44px] rounded-full px-6 py-2.5 text-[15px] font-medium transition-colors duration-200",
                      active ? "text-white" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="service-tab-pill"
                        transition={{ duration: 0.45, ease: EASE_EXPO }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-bg pt-14">
        <div
          role="tabpanel"
          id="panel-shop"
          aria-labelledby="tab-shop"
          hidden={tab !== "shop"}
        >
          {tab === "shop" && <ProductGrid />}
        </div>
        <div
          role="tabpanel"
          id="panel-book"
          aria-labelledby="tab-book"
          hidden={tab !== "book"}
        >
          {tab === "book" && <BookingFlow />}
        </div>
      </div>

      {/* Floating cart button — only while shopping */}
      {tab === "shop" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          onClick={open}
          aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          className="glass fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <ShoppingBag className="size-5" strokeWidth={1.5} />
          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0.5 }}
              animate={{ scale: [1.35, 1] }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
              className="absolute -right-0.5 -top-0.5 flex min-w-6 items-center justify-center rounded-full bg-toyota-red px-1.5 py-0.5 text-[12px] font-semibold text-white"
            >
              {itemCount}
            </motion.span>
          )}
        </motion.button>
      )}

      <CartSheet />
    </>
  );
}
