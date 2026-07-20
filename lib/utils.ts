import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Bangladeshi taka, lakh-grouped (12,50,000 not 1,250,000). */
export function formatBDT(amount: number): string {
  const [whole] = amount.toFixed(0).split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3
    : last3;
  return `৳ ${grouped}`;
}

/** Expo-out — the single easing curve for the whole site (§2). */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  micro: 0.2,
  standard: 0.6,
  hero: 1.1,
} as const;

/** Standard scroll-reveal viewport config (§2). */
export const VIEWPORT = { once: true, margin: "-15%" } as const;
