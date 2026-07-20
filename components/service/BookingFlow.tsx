"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CalendarPlus, Clock } from "lucide-react";
import { VEHICLES } from "@/lib/data/vehicles";
import { DEALERS, SERVICE_TYPES, TIME_SLOTS } from "@/lib/data/dealers";
import { formatBDT, EASE_EXPO, cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const STEPS = ["Vehicle", "Service", "Dealer & Slot", "Details", "Confirmed"];

interface BookingState {
  model: string;
  registration: string;
  mileage: string;
  serviceType: string;
  dealer: string;
  date: string | null;
  slot: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY: BookingState = {
  model: "",
  registration: "",
  mileage: "",
  serviceType: "",
  dealer: "",
  date: null,
  slot: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const FIELD =
  "h-[52px] w-full rounded-[14px] border border-hairline bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red";

const BD_MOBILE = /^(?:\+?880|0)1[3-9]\d{8}$/;

/** Calendar grid for the current month, past dates disabled (§5.2). */
function Calendar({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (iso: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = today.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <p className="mb-3 text-[15px] font-medium">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1.5" role="grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="pb-1 text-center text-[12px] font-medium text-ink-muted"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: firstWeekday }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const past = day < today.getDate();
          // Friday is the weekly closure across the dealer network.
          const closed = date.getDay() === 5;
          const disabled = past || closed;
          const selected = value === iso;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-label={date.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              aria-pressed={selected}
              onClick={() => onChange(iso)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-full text-[14px] font-medium transition-colors duration-200",
                disabled && "cursor-not-allowed text-ink-muted/30",
                !disabled && !selected && "text-ink hover:bg-ink/5",
                selected && "text-white",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="calendar-selection"
                  transition={{ duration: 0.35, ease: EASE_EXPO }}
                  className="absolute inset-0 rounded-full bg-toyota-red"
                />
              )}
              <span className="relative z-10">{day}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] text-ink-muted">
        Dealers are closed on Fridays.
      </p>
    </div>
  );
}

export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(EMPTY);
  const [direction, setDirection] = useState(1);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();

  const set = <K extends keyof BookingState>(key: K, value: BookingState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  // Per-step validation — advancing is blocked until the step is complete.
  const stepError = useMemo(() => {
    switch (step) {
      case 0:
        if (!state.model) return "Select the model you're booking for.";
        if (state.registration.trim().length < 4)
          return "Enter the vehicle registration number.";
        if (!/^\d+$/.test(state.mileage.trim()))
          return "Enter the current mileage in kilometres.";
        return null;
      case 1:
        return state.serviceType ? null : "Choose a service type.";
      case 2:
        if (!state.dealer) return "Choose a dealer.";
        if (!state.date) return "Choose a date.";
        if (!state.slot) return "Choose a time slot.";
        return null;
      case 3:
        if (state.name.trim().length < 2) return "Enter your full name.";
        if (!BD_MOBILE.test(state.phone.trim()))
          return "Enter a valid Bangladeshi mobile, e.g. 01712 345678.";
        if (!/^\S+@\S+\.\S+$/.test(state.email.trim()))
          return "Enter a valid email address.";
        return null;
      default:
        return null;
    }
  }, [step, state]);

  const next = () => {
    setTouched(true);
    if (stepError) return;
    setDirection(1);
    setTouched(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setDirection(-1);
    setTouched(false);
    setStep((s) => Math.max(s - 1, 0));
  };

  const vehicle = VEHICLES.find((v) => v.slug === state.model);
  const service = SERVICE_TYPES.find((s) => s.id === state.serviceType);
  const dealer = DEALERS.find((d) => d.id === state.dealer);

  const slide = {
    enter: (dir: number) =>
      reduced ? { opacity: 0 } : { opacity: 0, x: dir * 48 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number) =>
      reduced ? { opacity: 0 } : { opacity: 0, x: dir * -48 },
  };

  return (
    <section className="pb-24">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          {/* Progress bar — §5.2 */}
          <div className="mb-10">
            <div className="mb-3 flex justify-between">
              {STEPS.map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    "text-[12px] uppercase tracking-[0.12em] transition-colors duration-300",
                    i <= step ? "text-ink" : "text-ink-muted/50",
                  )}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </span>
              ))}
            </div>
            <div
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={step + 1}
              aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}
              className="h-[3px] w-full overflow-hidden rounded-full bg-ink/[0.08]"
            >
              <motion.div
                className="h-full bg-toyota-red"
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
              />
            </div>
          </div>

          <div className="glass rounded-[24px] p-6 md:p-9">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE_EXPO }}
              >
                {/* ---------------- Step 1: Vehicle ---------------- */}
                {step === 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                      Which vehicle?
                    </h2>
                    <p className="mt-2 text-[15px] text-ink-muted">
                      Select your model and tell us where it stands today.
                    </p>

                    <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {VEHICLES.map((v) => {
                        const selected = state.model === v.slug;
                        return (
                          <li key={v.slug}>
                            <button
                              type="button"
                              onClick={() => set("model", v.slug)}
                              aria-pressed={selected}
                              className={cn(
                                "w-full rounded-[16px] border p-3 text-left transition-all duration-300",
                                selected
                                  ? "border-toyota-red bg-white shadow-[0_8px_24px_rgba(235,10,30,0.10)]"
                                  : "border-hairline bg-white/60 hover:border-ink/20",
                              )}
                            >
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={v.image}
                                  alt={v.name}
                                  fill
                                  sizes="25vw"
                                  className="object-contain mix-blend-multiply"
                                />
                              </div>
                              <p className="mt-1.5 text-[13px] font-medium leading-tight">
                                {v.name}
                              </p>
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="bk-reg" className="eyebrow mb-2 block">
                          Registration number
                        </label>
                        <input
                          id="bk-reg"
                          className={FIELD}
                          placeholder="DHAKA METRO GA 12-3456"
                          value={state.registration}
                          onChange={(e) => set("registration", e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="bk-mileage" className="eyebrow mb-2 block">
                          Current mileage (km)
                        </label>
                        <input
                          id="bk-mileage"
                          inputMode="numeric"
                          className={FIELD}
                          placeholder="42000"
                          value={state.mileage}
                          onChange={(e) => set("mileage", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- Step 2: Service type ---------------- */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                      What does it need?
                    </h2>
                    <p className="mt-2 text-[15px] text-ink-muted">
                      Not sure? Choose Repair &amp; Diagnostics and we&apos;ll identify it.
                    </p>

                    <ul className="mt-7 space-y-3">
                      {SERVICE_TYPES.map((s) => {
                        const selected = state.serviceType === s.id;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => set("serviceType", s.id)}
                              aria-pressed={selected}
                              className={cn(
                                "w-full rounded-[20px] border p-5 text-left transition-all duration-300",
                                selected
                                  ? "border-toyota-red bg-white shadow-[0_8px_24px_rgba(235,10,30,0.10)]"
                                  : "border-hairline bg-white/60 hover:border-ink/20",
                              )}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-[17px] font-medium">
                                    {s.name}
                                  </h3>
                                  <p className="measure mt-1.5 text-[14px] leading-relaxed text-ink-muted">
                                    {s.description}
                                  </p>
                                </div>
                                <span
                                  className={cn(
                                    "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                    selected
                                      ? "border-toyota-red bg-toyota-red text-white"
                                      : "border-ink/20",
                                  )}
                                >
                                  {selected && (
                                    <Check className="size-3" strokeWidth={3} />
                                  )}
                                </span>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-ink-muted">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="size-3.5" strokeWidth={1.5} />
                                  {s.duration}
                                </span>
                                <span>From {formatBDT(s.priceFrom)}</span>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* ---------------- Step 3: Dealer & slot ---------------- */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                      Where and when?
                    </h2>

                    <div className="mt-7">
                      <label htmlFor="bk-dealer" className="eyebrow mb-2 block">
                        Dealer
                      </label>
                      <select
                        id="bk-dealer"
                        className={cn(FIELD, "appearance-none")}
                        value={state.dealer}
                        onChange={(e) => set("dealer", e.target.value)}
                      >
                        <option value="">Select a dealer</option>
                        {DEALERS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} — {d.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-7 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,240px)]">
                      <Calendar
                        value={state.date}
                        onChange={(iso) => {
                          set("date", iso);
                          set("slot", "");
                        }}
                      />

                      <div>
                        <p className="mb-3 text-[15px] font-medium">Time slot</p>
                        {state.date ? (
                          <ul className="grid grid-cols-3 gap-2 md:grid-cols-2">
                            {TIME_SLOTS.map((t) => {
                              const selected = state.slot === t;
                              return (
                                <li key={t}>
                                  <button
                                    type="button"
                                    onClick={() => set("slot", t)}
                                    aria-pressed={selected}
                                    className={cn(
                                      "relative h-11 w-full rounded-full text-[14px] font-medium transition-colors duration-200",
                                      selected
                                        ? "text-white"
                                        : "border border-hairline bg-white text-ink hover:border-ink/25",
                                    )}
                                  >
                                    {selected && (
                                      <motion.span
                                        layoutId="slot-selection"
                                        transition={{ duration: 0.35, ease: EASE_EXPO }}
                                        className="absolute inset-0 rounded-full bg-toyota-red"
                                      />
                                    )}
                                    <span className="relative z-10">{t}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-[14px] leading-relaxed text-ink-muted">
                            Pick a date to see available times.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- Step 4: Details ---------------- */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.02em]">
                      Your details
                    </h2>
                    <p className="mt-2 text-[15px] text-ink-muted">
                      We&apos;ll send a confirmation and call if anything changes.
                    </p>

                    <div className="mt-7 space-y-4">
                      <div>
                        <label htmlFor="bk-name" className="eyebrow mb-2 block">
                          Full name
                        </label>
                        <input
                          id="bk-name"
                          className={FIELD}
                          value={state.name}
                          onChange={(e) => set("name", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="bk-phone" className="eyebrow mb-2 block">
                            Mobile
                          </label>
                          <input
                            id="bk-phone"
                            type="tel"
                            inputMode="tel"
                            placeholder="01712 345678"
                            className={FIELD}
                            value={state.phone}
                            onChange={(e) => set("phone", e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="bk-email" className="eyebrow mb-2 block">
                            Email
                          </label>
                          <input
                            id="bk-email"
                            type="email"
                            inputMode="email"
                            className={FIELD}
                            value={state.email}
                            onChange={(e) => set("email", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bk-notes" className="eyebrow mb-2 block">
                          Notes for the technician (optional)
                        </label>
                        <textarea
                          id="bk-notes"
                          rows={4}
                          placeholder="Any noises, warning lights or concerns…"
                          className="w-full rounded-[14px] border border-hairline bg-white p-4 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red"
                          value={state.notes}
                          onChange={(e) => set("notes", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- Step 5: Confirmation ---------------- */}
                {step === 4 && (
                  <div className="text-center">
                    <svg
                      viewBox="0 0 52 52"
                      className="mx-auto size-16 text-toyota-red"
                      fill="none"
                      aria-hidden
                    >
                      <motion.circle
                        cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: EASE_EXPO }}
                      />
                      <motion.path
                        d="M15 27l8 8 15-16" stroke="currentColor" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: EASE_EXPO }}
                      />
                    </svg>

                    <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                      Service booked.
                    </h2>
                    <p className="mt-2 text-[15px] text-ink-muted">
                      Booking reference{" "}
                      <span className="font-mono font-medium text-ink">
                        TBD-2026-0417
                      </span>
                    </p>

                    <dl className="mt-8 space-y-0 rounded-[20px] border border-hairline bg-white/60 px-5 text-left">
                      {[
                        { label: "Vehicle", value: vehicle ? `${vehicle.name} — ${state.registration}` : "—" },
                        { label: "Mileage", value: `${Number(state.mileage).toLocaleString("en-IN")} km` },
                        { label: "Service", value: service?.name ?? "—" },
                        { label: "Dealer", value: dealer ? `${dealer.name}, ${dealer.city}` : "—" },
                        {
                          label: "Date & time",
                          value: state.date
                            ? `${new Date(state.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                              })} at ${state.slot}`
                            : "—",
                        },
                        { label: "Contact", value: `${state.name} · ${state.phone}` },
                        { label: "Estimated from", value: service ? formatBDT(service.priceFrom) : "—" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-baseline justify-between gap-6 border-b border-hairline py-3.5 last:border-b-0"
                        >
                          <dt className="text-[14px] text-ink-muted">{row.label}</dt>
                          <dd className="text-right text-[14px] font-medium">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {state.notes.trim() && (
                      <p className="mt-4 rounded-[16px] bg-white/60 p-4 text-left text-[14px] leading-relaxed text-ink-muted">
                        <span className="font-medium text-ink">Your notes: </span>
                        {state.notes}
                      </p>
                    )}

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <MagneticButton variant="ink">
                        <CalendarPlus className="size-4" strokeWidth={1.75} />
                        Add to Calendar
                      </MagneticButton>
                      <MagneticButton
                        variant="ghost"
                        onClick={() => {
                          setState(EMPTY);
                          setDirection(-1);
                          setStep(0);
                        }}
                      >
                        Book Another
                      </MagneticButton>
                    </div>

                    <p className="mt-6 text-[12px] text-ink-muted">
                      Demonstration booking — nothing is transmitted or reserved.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && (
              <div className="mt-8 border-t border-hairline pt-6">
                <AnimatePresence>
                  {touched && stepError && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="mb-4 text-[14px] text-toyota-red"
                    >
                      {stepError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between gap-3">
                  {step > 0 ? (
                    <MagneticButton variant="ghost" onClick={back}>
                      <ArrowLeft className="size-4" strokeWidth={1.75} />
                      Back
                    </MagneticButton>
                  ) : (
                    <span />
                  )}
                  <MagneticButton variant="red" onClick={next}>
                    {step === 3 ? "Confirm Booking" : "Continue"}
                    <ArrowRight className="size-4" strokeWidth={1.75} />
                  </MagneticButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
