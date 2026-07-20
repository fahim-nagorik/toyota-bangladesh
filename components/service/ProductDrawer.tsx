"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Check } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { formatBDT, EASE_EXPO } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ProductDrawer({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [lastId, setLastId] = useState<string | null>(null);

  // Reset the stepper when a different product opens the drawer. Adjusting
  // during render (not in an effect) avoids a second render pass.
  if (product && product.id !== lastId) {
    setLastId(product.id);
    setQuantity(1);
  }

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-ink/45 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE_EXPO }}
            className="glass fixed inset-y-0 right-0 z-[81] flex w-full max-w-[480px] flex-col rounded-l-[24px] border-y-0 border-r-0"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <p className="eyebrow">{product.category}</p>
              <button
                onClick={onClose}
                aria-label="Close product details"
                className="hit-44 flex size-10 items-center justify-center rounded-full text-ink-muted hover:text-ink"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-white/60">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="480px"
                  className="object-contain p-8"
                />
              </div>

              <h2 className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                {product.name}
              </h2>
              <p className="mt-2 font-mono text-[13px] uppercase tracking-[0.08em] text-ink-muted">
                Part no. {product.partNumber}
              </p>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">
                {product.description}
              </p>

              <div className="mt-7">
                <h3 className="eyebrow mb-3">Fits</h3>
                <ul className="flex flex-wrap gap-2">
                  {product.compatibility.map((model) => (
                    <li
                      key={model}
                      className="flex items-center gap-1.5 rounded-full border border-hairline bg-white/70 px-3 py-1.5 text-[13px]"
                    >
                      <Check className="size-3.5 text-toyota-red" strokeWidth={2.5} />
                      {model}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-hairline px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-full border border-hairline bg-white p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="hit-44 flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                  >
                    <Minus className="size-4" strokeWidth={2} />
                  </button>
                  <span
                    aria-live="polite"
                    className="min-w-8 text-center text-[15px] font-medium tabular-nums"
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="hit-44 flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-ink"
                  >
                    <Plus className="size-4" strokeWidth={2} />
                  </button>
                </div>

                <p className="text-xl font-semibold tracking-[-0.02em]">
                  {formatBDT(product.price * quantity)}
                </p>
              </div>

              <MagneticButton
                variant="red"
                className="w-full"
                onClick={() => {
                  onAdd(product, quantity);
                  onClose();
                }}
              >
                Add to Cart
              </MagneticButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
