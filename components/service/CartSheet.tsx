"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, resolveCart } from "@/lib/store/cart";
import { formatBDT, EASE_EXPO } from "@/lib/utils";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

/** Animated money value — re-keyed so it counts on every total change. */
function Amount({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      ৳{" "}
      <motion.span
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        {value.toLocaleString("en-IN")}
      </motion.span>
    </span>
  );
}

export default function CartSheet() {
  const { lines, isOpen, close, setQuantity, remove } = useCart();
  const { resolved, subtotal, vat, total, itemCount } = resolveCart(lines);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-[2px]"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE_EXPO }}
            className="glass-sheet fixed inset-y-0 right-0 z-[91] flex w-full max-w-[460px] flex-col rounded-l-[24px] border-y-0 border-r-0"
          >
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
              <h2 className="text-lg font-semibold tracking-[-0.02em]">
                Your Cart{itemCount > 0 && ` (${itemCount})`}
              </h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="hit-44 flex size-10 items-center justify-center rounded-full text-ink-muted hover:text-ink"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            {resolved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-ink/[0.05] text-ink-muted">
                  <ShoppingBag className="size-7" strokeWidth={1.25} />
                </span>
                <h3 className="mt-6 text-lg font-medium">Your cart is empty</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  Genuine oil, filters, brakes and batteries — all fitted to
                  your model.
                </p>
                <button
                  onClick={close}
                  className="mt-7 text-[15px] font-medium text-toyota-red"
                >
                  Browse parts
                </button>
              </div>
            ) : (
              <>
                <ul className="no-scrollbar flex-1 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {resolved.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.4, ease: EASE_EXPO }}
                        className="mb-4 overflow-hidden"
                      >
                        <div className="flex gap-4 rounded-[20px] bg-bg-tint p-3">
                          <div className="relative size-20 shrink-0 overflow-hidden rounded-[14px] bg-bg-tint">
                            <Image
                              src={line.product.image}
                              alt={line.product.name}
                              fill
                              sizes="80px"
                              className="object-contain p-2"
                            />
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="truncate text-[15px] font-medium leading-snug">
                              {line.product.name}
                            </p>
                            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
                              {line.product.partNumber}
                            </p>

                            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                              <div className="flex items-center gap-0.5 rounded-full border border-hairline bg-white p-0.5">
                                <button
                                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                                  aria-label={`Decrease quantity of ${line.product.name}`}
                                  className="hit-44 flex size-8 items-center justify-center rounded-full text-ink-muted hover:text-ink"
                                >
                                  {line.quantity === 1 ? (
                                    <Trash2 className="size-3.5" strokeWidth={1.75} />
                                  ) : (
                                    <Minus className="size-3.5" strokeWidth={2} />
                                  )}
                                </button>
                                <span className="min-w-6 text-center text-[14px] font-medium tabular-nums">
                                  {line.quantity}
                                </span>
                                <button
                                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                                  aria-label={`Increase quantity of ${line.product.name}`}
                                  className="hit-44 flex size-8 items-center justify-center rounded-full text-ink-muted hover:text-ink"
                                >
                                  <Plus className="size-3.5" strokeWidth={2} />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <p className="text-[15px] font-medium tabular-nums">
                                  {formatBDT(line.lineTotal)}
                                </p>
                                <button
                                  onClick={() => remove(line.id)}
                                  aria-label={`Remove ${line.product.name} from cart`}
                                  className="hit-44 text-ink-muted transition-colors hover:text-toyota-red"
                                >
                                  <X className="size-4" strokeWidth={1.75} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="relative z-10 border-t border-hairline bg-bg-tint px-6 py-5">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-bg-tint to-transparent"
                  />
                  <dl className="space-y-2 text-[15px]">
                    <div className="flex justify-between text-ink-muted">
                      <dt>Subtotal</dt>
                      <dd><Amount value={subtotal} /></dd>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <dt>VAT (15%)</dt>
                      <dd><Amount value={vat} /></dd>
                    </div>
                    <div className="flex justify-between border-t border-hairline pt-3 text-[17px] font-semibold">
                      <dt>Total</dt>
                      <dd><Amount value={total} /></dd>
                    </div>
                  </dl>

                  {/* Checkout is its own page, so the drawer closes as it
                      navigates rather than leaving a sheet over the form. */}
                  <Link
                    href="/genuine-parts/checkout"
                    onClick={close}
                    className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-toyota-red px-7 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-white shadow-[0_4px_16px_rgba(235,10,30,0.24)] transition-colors duration-200 hover:bg-toyota-red-dark"
                  >
                    Proceed to Checkout
                  </Link>
                  <p className="mt-3 text-center text-[12px] text-ink-muted">
                    Demonstration checkout — no payment is taken.
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
