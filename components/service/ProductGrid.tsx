"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Plus } from "lucide-react";
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategory,
} from "@/lib/data/products";
import { useCart } from "@/lib/store/cart";
import { formatBDT, EASE_EXPO, VIEWPORT, cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";
import ProductDrawer from "./ProductDrawer";

export default function ProductGrid() {
  const [category, setCategory] = useState<"All" | ProductCategory>("All");
  const [active, setActive] = useState<Product | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const add = useCart((s) => s.add);
  const reduced = useReducedMotion();

  const visible = useMemo(
    () =>
      category === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const handleAdd = (product: Product, quantity = 1) => {
    add(product.id, quantity);
    setJustAdded(product.id);
    // Revert the checkmark so the button can be pressed again meaningfully.
    setTimeout(() => setJustAdded((c) => (c === product.id ? null : c)), 1400);
  };

  return (
    <>
      <section className="pb-24">
        <div className="container-site">
          <Reveal>
            <div
              role="tablist"
              aria-label="Filter parts by category"
              className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0"
            >
              {PRODUCT_CATEGORIES.map((c) => {
                const isActive = c === category;
                return (
                  <button
                    key={c}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "relative shrink-0 rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="parts-category-pill"
                        transition={{ duration: 0.4, ease: EASE_EXPO }}
                        className="absolute inset-0 rounded-full bg-ink"
                      />
                    )}
                    <span className="relative z-10">{c}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <motion.ul
            layout={!reduced}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout={!reduced}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i, 5) * 0.05,
                    ease: EASE_EXPO,
                  }}
                  className="flex"
                >
                  <article className="group flex w-full flex-col rounded-[24px] border border-hairline bg-white p-5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                    <button
                      onClick={() => setActive(p)}
                      aria-label={`View details for ${p.name}`}
                      className="relative aspect-square overflow-hidden rounded-[16px] bg-bg-tint"
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.05]"
                        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                      />
                    </button>

                    <div className="flex flex-1 flex-col px-1 pt-5">
                      <p className="eyebrow">{p.category}</p>
                      <h3 className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.01em]">
                        <button
                          onClick={() => setActive(p)}
                          className="text-left hover:text-toyota-red"
                        >
                          {p.name}
                        </button>
                      </h3>
                      <p className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
                        {p.partNumber}
                      </p>
                      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-muted">
                        {p.blurb}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4">
                        <p className="text-lg font-semibold tracking-[-0.02em]">
                          {formatBDT(p.price)}
                        </p>
                        <button
                          onClick={() => handleAdd(p)}
                          aria-label={`Add ${p.name} to cart`}
                          className={cn(
                            "flex h-11 min-w-[112px] items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-medium transition-colors duration-300",
                            justAdded === p.id
                              ? "bg-ink text-white"
                              : "bg-toyota-red text-white hover:bg-toyota-red-dark",
                          )}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {justAdded === p.id ? (
                              <motion.span
                                key="added"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                              >
                                <Check className="size-4" strokeWidth={2.5} />
                                Added
                              </motion.span>
                            ) : (
                              <motion.span
                                key="add"
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-1.5"
                              >
                                <Plus className="size-4" strokeWidth={2} />
                                Add to Cart
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      <ProductDrawer
        product={active}
        onClose={() => setActive(null)}
        onAdd={handleAdd}
      />
    </>
  );
}
