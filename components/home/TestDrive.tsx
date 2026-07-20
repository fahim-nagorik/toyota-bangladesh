"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { VEHICLES } from "@/lib/data/vehicles";
import { DEALERS } from "@/lib/data/dealers";
import { EASE_EXPO, cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  // Bangladeshi mobile: 01[3-9] + 8 digits, optionally +880 prefixed.
  phone: z
    .string()
    .regex(
      /^(?:\+?880|0)1[3-9]\d{8}$/,
      "Enter a valid Bangladeshi mobile, e.g. 01712 345678",
    ),
  email: z.string().email("Enter a valid email address"),
  model: z.string().min(1, "Choose a model"),
  dealer: z.string().min(1, "Choose a dealer"),
  date: z.string().min(1, "Choose a date"),
});

type FormValues = z.infer<typeof schema>;

/** Input with a label that floats up on focus or when filled. */
function FloatingField({
  id,
  label,
  error,
  children,
  filled,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  filled: boolean;
}) {
  return (
    <div className="relative">
      <div className="relative">
        {children}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-5 origin-left text-ink-muted transition-all duration-200",
            filled
              ? "top-2 text-[11px] uppercase tracking-[0.14em]"
              : "top-1/2 -translate-y-1/2 text-[15px]",
          )}
        >
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-1.5 pl-5 text-[13px] text-toyota-red"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const FIELD_CLASS =
  "peer h-[62px] w-full rounded-[16px] border border-hairline bg-white px-5 pb-2 pt-6 text-[15px] outline-none transition-colors focus:border-toyota-red";

export default function TestDrive() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const reduced = useReducedMotion();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", model: "", dealer: "", date: "" },
  });

  const values = watch();
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: FormValues) => {
    setPending(true);
    // No backend (§1) — this stands in for the network round trip.
    await new Promise((r) => setTimeout(r, 900));
    console.info("Test drive request", data);
    setPending(false);
    setSubmitted(true);
  };

  return (
    <section id="test-drive" className="section-y scroll-mt-20 bg-bg-alt">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <Reveal className="text-center">
            <p className="eyebrow">Test Drive</p>
            <h2 className="text-h2 mt-3">Take the wheel.</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-ink-muted">
              Pick a model and a dealer. We&apos;ll confirm your slot by phone within
              one working day.
            </p>
          </Reveal>

          <Reveal index={1} className="mt-12">
            <div className="glass rounded-[24px] p-6 md:p-9">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE_EXPO }}
                    className="flex flex-col items-center py-10 text-center"
                  >
                    <svg
                      viewBox="0 0 52 52"
                      className="size-16 text-toyota-red"
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

                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
                      Request received.
                    </h3>
                    <p className="measure mt-3 text-[15px] leading-relaxed text-ink-muted">
                      Thank you. A product advisor from your chosen dealer will
                      call to confirm the date and time.
                    </p>
                    <button
                      onClick={() => {
                        reset();
                        setSubmitted(false);
                      }}
                      className="mt-7 text-[15px] font-medium text-toyota-red"
                    >
                      Book another test drive
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                    className="space-y-4"
                  >
                    <FloatingField id="td-name" label="Full name" error={errors.name?.message} filled={!!values.name}>
                      <input id="td-name" className={FIELD_CLASS} {...register("name")} />
                    </FloatingField>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FloatingField id="td-phone" label="Mobile number" error={errors.phone?.message} filled={!!values.phone}>
                        <input id="td-phone" type="tel" inputMode="tel" className={FIELD_CLASS} {...register("phone")} />
                      </FloatingField>
                      <FloatingField id="td-email" label="Email" error={errors.email?.message} filled={!!values.email}>
                        <input id="td-email" type="email" inputMode="email" className={FIELD_CLASS} {...register("email")} />
                      </FloatingField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FloatingField id="td-model" label="Model" error={errors.model?.message} filled={!!values.model}>
                        <select id="td-model" className={cn(FIELD_CLASS, "appearance-none")} {...register("model")}>
                          <option value="" />
                          {VEHICLES.map((v) => (
                            <option key={v.slug} value={v.slug}>{v.name}</option>
                          ))}
                        </select>
                      </FloatingField>
                      <FloatingField id="td-dealer" label="Preferred dealer" error={errors.dealer?.message} filled={!!values.dealer}>
                        <select id="td-dealer" className={cn(FIELD_CLASS, "appearance-none")} {...register("dealer")}>
                          <option value="" />
                          {DEALERS.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} — {d.city}</option>
                          ))}
                        </select>
                      </FloatingField>
                    </div>

                    {/* A date input always renders its own mm/dd/yyyy hint, so
                        the label stays raised or the two overlap. */}
                    <FloatingField id="td-date" label="Preferred date" error={errors.date?.message} filled>
                      <input id="td-date" type="date" min={today} className={FIELD_CLASS} {...register("date")} />
                    </FloatingField>

                    <div className="pt-3">
                      <MagneticButton type="submit" variant="red" disabled={pending} className="w-full">
                        {pending ? "Sending…" : "Request Test Drive"}
                      </MagneticButton>
                      <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-muted">
                        By submitting you agree to be contacted about this
                        request. Demonstration form — nothing is transmitted.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
