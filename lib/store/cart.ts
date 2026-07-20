"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, VAT_RATE, type Product } from "@/lib/data/products";

export interface CartLine {
  id: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (id: string, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      add: (id, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.id === id);
          return {
            lines: existing
              ? s.lines.map((l) =>
                  l.id === id ? { ...l, quantity: l.quantity + quantity } : l,
                )
              : [...s.lines, { id, quantity }],
          };
        }),

      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),

      setQuantity: (id, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.id !== id)
              : s.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
        })),

      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "toyota-bd-cart",
      // `isOpen` is session UI state, not something to restore on reload.
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export interface ResolvedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

/** Joins cart lines to the catalogue and computes the totals. */
export function resolveCart(lines: CartLine[]) {
  const resolved: ResolvedLine[] = lines.flatMap((line) => {
    const product = PRODUCTS.find((p) => p.id === line.id);
    // A line whose product left the catalogue is dropped rather than crashing.
    if (!product) return [];
    return [{ ...line, product, lineTotal: product.price * line.quantity }];
  });

  const subtotal = resolved.reduce((sum, l) => sum + l.lineTotal, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const itemCount = resolved.reduce((sum, l) => sum + l.quantity, 0);

  return { resolved, subtotal, vat, total: subtotal + vat, itemCount };
}
