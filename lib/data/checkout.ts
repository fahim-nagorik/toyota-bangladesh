/**
 * Checkout constants (§5.3). Kept out of the component so the cart drawer and
 * the checkout page quote the same delivery rules.
 */

/** The eight administrative divisions, dealer-network order. */
export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
] as const;

export const PAYMENT_METHODS = [
  {
    value: "bkash",
    label: "bKash",
    hint: "We send a payment request to your bKash number.",
  },
  {
    value: "card",
    label: "Card",
    hint: "Visa, Mastercard or Amex, charged when the parts are dispatched.",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    hint: "Pay the rider in cash when the parts reach you.",
  },
] as const;

export const FULFILMENT_METHODS = [
  {
    value: "delivery",
    label: "Deliver to my address",
    hint: "Riders call before arriving. You arrange fitting yourself.",
  },
  {
    value: "collect",
    label: "Collect at a Toyota service centre",
    hint: "No delivery fee. A factory-trained technician fits the parts, which keeps the fitment warranty intact.",
  },
] as const;

export const DELIVERY_FEE = 350;
export const FREE_DELIVERY_ABOVE = 5000;

/** Delivery is waived on collection, and on large orders. */
export function deliveryFeeFor(fulfilment: string, subtotal: number): number {
  if (fulfilment === "collect") return 0;
  return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
}
