"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { formatBDT, EASE_EXPO, cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

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

/* Single-line rows: the whole form has to clear the fold so all three options
   are visible on arrival, which the descriptive hints cost too much height for. */
export const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash" },
  { value: "card", label: "Card" },
  { value: "cod", label: "Cash on Delivery" },
] as const;

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  // Bangladeshi mobile: 01[3-9] + 8 digits, optionally +880 prefixed.
  phone: z
    .string()
    .regex(
      /^(?:\+?880|0)1[3-9]\d{8}$/,
      "Enter a valid Bangladeshi mobile, e.g. 01712 345678",
    ),
  address: z.string().min(8, "Enter a house, road and area we can deliver to"),
  division: z.enum(DIVISIONS, { message: "Choose a division" }),
  payment: z.enum(
    PAYMENT_METHODS.map((m) => m.value),
    { message: "Choose a payment method" },
  ),
});

export type CheckoutValues = z.infer<typeof schema>;

const FIELD =
  "h-[44px] w-full rounded-[13px] border border-hairline bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red";

const LABEL =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-2 text-[13px] text-toyota-red"
    >
      {message}
    </motion.p>
  );
}

/**
 * Delivery + payment step, shown between the cart and the confirmation (§5.3).
 * Submission is simulated by the parent — no payment is taken.
 */
export default function CheckoutForm({
  total,
  submitting,
  onSubmit,
  onBack,
}: {
  total: number;
  submitting: boolean;
  onSubmit: (values: CheckoutValues) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: { payment: "bkash" },
  });

  const payment = watch("payment");

  return (
    <motion.form
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: EASE_EXPO }}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-6 pb-4 pt-4">
        <div>
          <label htmlFor="co-name" className={LABEL}>
            Full name
          </label>
          <input
            id="co-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={FIELD}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="co-phone" className={LABEL}>
            Phone
          </label>
          <input
            id="co-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+880 1X XXXX XXXX"
            aria-invalid={!!errors.phone}
            className={FIELD}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div>
          <label htmlFor="co-address" className={LABEL}>
            Delivery address
          </label>
          <input
            id="co-address"
            autoComplete="street-address"
            placeholder="House, road, area"
            aria-invalid={!!errors.address}
            className={FIELD}
            {...register("address")}
          />
          <FieldError message={errors.address?.message} />
        </div>

        <div>
          <label htmlFor="co-division" className={LABEL}>
            Division
          </label>
          <select
            id="co-division"
            defaultValue=""
            aria-invalid={!!errors.division}
            className={cn(FIELD, "appearance-none bg-white pr-10")}
            {...register("division")}
          >
            <option value="" disabled>
              Choose a division
            </option>
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError message={errors.division?.message} />
        </div>

        <fieldset>
          <legend className={LABEL}>Payment method</legend>
          <div className="space-y-1.5">
            {PAYMENT_METHODS.map((method) => {
              const selected = payment === method.value;
              return (
                <label
                  key={method.value}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-[13px] border px-4 py-3 transition-colors duration-200",
                    selected
                      ? "border-ink bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                      : "border-hairline bg-bg-tint hover:bg-white",
                  )}
                >
                  <input
                    type="radio"
                    value={method.value}
                    className="peer sr-only"
                    {...register("payment")}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                      selected ? "border-toyota-red" : "border-ink/25",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="payment-dot"
                        transition={{ duration: 0.3, ease: EASE_EXPO }}
                        className="size-2.5 rounded-full bg-toyota-red"
                      />
                    )}
                  </span>
                  <span className="min-w-0 text-[15px] font-medium leading-snug">
                    {method.label}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError message={errors.payment?.message} />
        </fieldset>
      </div>

      {/* Opaque, not glass: the scroll area sits behind this bar and would
          otherwise ghost through it. The scrim above it signals that the form
          continues rather than ending mid-card. */}
      <div className="relative z-10 border-t border-hairline bg-bg-tint px-6 py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-bg-tint to-transparent"
        />
        <div className="flex items-baseline justify-between text-[17px] font-semibold">
          <span>Total due</span>
          <span className="tabular-nums">{formatBDT(total)}</span>
        </div>

        <MagneticButton
          variant="red"
          type="submit"
          className="mt-4 w-full"
          disabled={submitting}
        >
          {submitting ? "Placing order…" : `Place Order — ${formatBDT(total)}`}
        </MagneticButton>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full text-center text-[14px] text-ink-muted transition-colors hover:text-ink"
        >
          ← Back to cart
        </button>
      </div>
    </motion.form>
  );
}
