"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart, resolveCart } from "@/lib/store/cart";
import {
  DIVISIONS,
  PAYMENT_METHODS,
  FULFILMENT_METHODS,
  FREE_DELIVERY_ABOVE,
  deliveryFeeFor,
} from "@/lib/data/checkout";
import { formatBDT, EASE_EXPO, cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    // Bangladeshi mobile: 01[3-9] + 8 digits, optionally +880 prefixed.
    phone: z
      .string()
      .regex(
        /^(?:\+?880|0)1[3-9]\d{8}$/,
        "Enter a valid Bangladeshi mobile, e.g. 01712 345678",
      ),
    email: z
      .union([z.string().email("Enter a valid email address"), z.literal("")])
      .optional(),
    fulfilment: z.enum(FULFILMENT_METHODS.map((m) => m.value)),
    address: z.string().optional(),
    area: z.string().optional(),
    division: z.union([z.enum(DIVISIONS), z.literal("")]).optional(),
    payment: z.enum(PAYMENT_METHODS.map((m) => m.value), {
      message: "Choose a payment method",
    }),
  })
  // Address only matters when we are delivering — asking for it on a
  // collection order would be a dead end the customer cannot satisfy.
  .refine((v) => v.fulfilment !== "delivery" || (v.address ?? "").length >= 8, {
    message: "Enter a house, road and area we can deliver to",
    path: ["address"],
  })
  .refine((v) => v.fulfilment !== "delivery" || !!v.division, {
    message: "Choose a division",
    path: ["division"],
  });

export type CheckoutValues = z.infer<typeof schema>;

const FIELD =
  "h-[52px] w-full rounded-[14px] border border-hairline bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red";

const LABEL =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      role="alert"
      className="mt-2 text-[13px] text-toyota-red"
    >
      {message}
    </motion.p>
  );
}

function SectionHeading({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[13px] font-medium text-toyota-red">
          {index}
        </span>
        <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
      </div>
      {children && (
        <p className="measure mt-2 text-[14px] leading-relaxed text-ink-muted">
          {children}
        </p>
      )}
    </div>
  );
}

/** Radio card shared by the fulfilment and payment groups. */
function ChoiceCard({
  selected,
  label,
  hint,
  layoutId,
  ...input
}: {
  selected: boolean;
  label: string;
  hint: string;
  layoutId: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-[16px] border p-4 transition-colors duration-200",
        selected
          ? "border-ink bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          : "border-hairline bg-bg-tint hover:bg-white",
      )}
    >
      <input type="radio" className="sr-only" {...input} />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          selected ? "border-toyota-red" : "border-ink/25",
        )}
      >
        {selected && (
          <motion.span
            layoutId={layoutId}
            transition={{ duration: 0.3, ease: EASE_EXPO }}
            className="size-2.5 rounded-full bg-toyota-red"
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-snug">
          {label}
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">
          {hint}
        </span>
      </span>
    </label>
  );
}

export default function CheckoutClient() {
  const { lines, clear } = useCart();
  const { resolved, subtotal, vat, itemCount } = resolveCart(lines);

  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState<CheckoutValues | null>(null);
  /* The cart is restored from localStorage after mount, so the first client
     render must match the empty server render or React throws a hydration
     mismatch. Everything cart-dependent waits for this flag. */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { payment: "bkash", fulfilment: "delivery", division: "" },
  });

  const payment = watch("payment");
  const fulfilment = watch("fulfilment");
  const delivery = deliveryFeeFor(fulfilment, subtotal);
  const total = subtotal + vat + delivery;

  const placeOrder = async (values: CheckoutValues) => {
    setSubmitting(true);
    // No backend (§1) — this stands in for the network round trip.
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setPlaced(values);
    clear();
  };

  if (!hydrated) {
    return (
      <div className="min-h-[40vh]" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading your cart…</span>
      </div>
    );
  }

  /* Order placed — the cart has been cleared, so this must be checked before
     the empty-cart branch or a successful order would look like an empty one. */
  if (placed) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <svg
          viewBox="0 0 52 52"
          className="mx-auto size-16 text-toyota-red"
          fill="none"
          aria-hidden
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
          />
          <motion.path
            d="M15 27l8 8 15-16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_EXPO }}
          />
        </svg>

        <h2 className="mt-7 text-3xl font-semibold tracking-[-0.02em]">
          Order placed.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
          Reference <span className="font-mono">TBD-P-2026-0417</span>.{" "}
          {placed.fulfilment === "collect"
            ? "Your parts will be ready for collection at Toyota Tejgaon within two working days."
            : `Your parts will be delivered to ${placed.division} within two working days.`}{" "}
          {placed.payment === "cod"
            ? "Payable to the rider on arrival."
            : `Paid by ${
                PAYMENT_METHODS.find((m) => m.value === placed.payment)?.label
              }.`}
        </p>
        <p className="mt-3 text-[14px] text-ink-muted">
          We call {placed.phone} to confirm the parts fit your car before
          anything is dispatched.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <MagneticButton href="/service" variant="red">
            Browse more parts
          </MagneticButton>
          <MagneticButton href="/" variant="ghost">
            Back to home
          </MagneticButton>
        </div>
      </div>
    );
  }

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-ink/[0.05] text-ink-muted">
          <ShoppingBag className="size-7" strokeWidth={1.25} />
        </span>
        <h2 className="mt-7 text-3xl font-semibold tracking-[-0.02em]">
          Nothing to check out.
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">
          Your cart is empty, so there is no order to place. Add the parts you
          need and come back — we confirm they fit your car before anything is
          dispatched.
        </p>
        <div className="mt-9 flex justify-center">
          <MagneticButton href="/service" variant="red">
            Browse Genuine Parts
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(placeOrder)}
      noValidate
      className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
    >
      <div className="space-y-12">
        <section aria-labelledby="co-contact">
          <SectionHeading index="01" title="Contact">
            We call this number to confirm the parts fit your car.
          </SectionHeading>
          <div className="space-y-4">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-phone" className={LABEL}>
                  Phone
                </label>
                <input
                  id="co-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01712 345678"
                  aria-invalid={!!errors.phone}
                  className={FIELD}
                  {...register("phone")}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div>
                <label htmlFor="co-email" className={LABEL}>
                  Email <span className="normal-case">(optional)</span>
                </label>
                <input
                  id="co-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={FIELD}
                  {...register("email")}
                />
                <FieldError message={errors.email?.message} />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="co-fulfilment">
          <SectionHeading index="02" title="Fulfilment">
            How you want the parts.
          </SectionHeading>
          <div className="space-y-2">
            {FULFILMENT_METHODS.map((m) => (
              <ChoiceCard
                key={m.value}
                layoutId="fulfilment-dot"
                selected={fulfilment === m.value}
                label={m.label}
                hint={m.hint}
                value={m.value}
                {...register("fulfilment")}
              />
            ))}
          </div>
        </section>

        {/* Progressive disclosure: the address block only exists for delivery. */}
        <AnimatePresence initial={false}>
          {fulfilment === "delivery" && (
            <motion.section
              key="delivery"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
              className="overflow-hidden"
              aria-labelledby="co-delivery"
            >
              <SectionHeading index="03" title="Delivery address">
                Where the parts should go. Riders call before arriving.
              </SectionHeading>
              <div className="space-y-4">
                <div>
                  <label htmlFor="co-address" className={LABEL}>
                    Address
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="co-area" className={LABEL}>
                      Area / Thana{" "}
                      <span className="normal-case">(optional)</span>
                    </label>
                    <input
                      id="co-area"
                      placeholder="Banani"
                      className={FIELD}
                      {...register("area")}
                    />
                  </div>
                  <div>
                    <label htmlFor="co-division" className={LABEL}>
                      Division
                    </label>
                    <select
                      id="co-division"
                      aria-invalid={!!errors.division}
                      className={cn(FIELD, "appearance-none bg-white pr-10")}
                      {...register("division")}
                    >
                      <option value="">Choose a division</option>
                      {DIVISIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.division?.message} />
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section aria-labelledby="co-payment">
          <SectionHeading
            index={fulfilment === "delivery" ? "04" : "03"}
            title="Payment"
          >
            How you want to pay.
          </SectionHeading>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <ChoiceCard
                key={m.value}
                layoutId="payment-dot"
                selected={payment === m.value}
                label={m.label}
                hint={m.hint}
                value={m.value}
                {...register("payment")}
              />
            ))}
          </div>
          <FieldError message={errors.payment?.message} />
          <p className="measure mt-4 text-[13px] leading-relaxed text-ink-muted">
            Demonstration checkout — no card details are collected anywhere on
            this site and nothing is charged when you place the order.
          </p>

          <div className="mt-6 lg:hidden">
            <MagneticButton
              type="submit"
              variant="red"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Placing order…" : `Place Order — ${formatBDT(total)}`}
            </MagneticButton>
          </div>
        </section>
      </div>

      {/* Order summary — sticky on desktop so the total stays in view. */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[24px] border border-hairline bg-white p-6 md:p-7">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            Order summary
          </h2>

          <ul className="mt-5 space-y-4">
            {resolved.map((line) => (
              <li key={line.id} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-[12px] bg-bg-tint">
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium leading-snug">
                    {line.product.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">
                    Qty {line.quantity}
                  </p>
                </div>
                <p className="text-[14px] font-medium tabular-nums">
                  {formatBDT(line.lineTotal)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-hairline pt-5 text-[15px]">
            <div className="flex justify-between text-ink-muted">
              <dt>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </dt>
              <dd className="tabular-nums">{formatBDT(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>VAT (15%)</dt>
              <dd className="tabular-nums">{formatBDT(vat)}</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Delivery</dt>
              <dd className="tabular-nums">
                {delivery === 0 ? "Free" : formatBDT(delivery)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-hairline pt-4 text-[19px] font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatBDT(total)}</dd>
            </div>
          </dl>

          {fulfilment === "delivery" && subtotal < FREE_DELIVERY_ABOVE && (
            <p className="mt-3 text-[13px] text-ink-muted">
              Delivery is free above {formatBDT(FREE_DELIVERY_ABOVE)}.
            </p>
          )}

          <div className="mt-6 hidden lg:block">
            <MagneticButton
              type="submit"
              variant="red"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Placing order…" : `Place Order — ${formatBDT(total)}`}
            </MagneticButton>
          </div>

          <Link
            href="/service"
            className="mt-4 block text-center text-[14px] text-ink-muted transition-colors hover:text-ink"
          >
            ← Edit cart
          </Link>
        </div>
      </aside>
    </form>
  );
}
