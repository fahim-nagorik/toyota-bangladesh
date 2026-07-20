"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowRight, Leaf, ShieldCheck, Radio } from "lucide-react";
import { EASE_EXPO } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";

const CARDS = [
  {
    Icon: Leaf,
    title: "Toyota Hybrid System",
    body: "A petrol engine and two electric motors that hand off to each other automatically. Nothing to plug in, and the battery is warranted for a decade.",
    image: "/tech/hybrid.webp",
    href: "/models/rav4",
  },
  {
    Icon: ShieldCheck,
    title: "Toyota Safety Sense",
    body: "Pre-Collision braking, radar cruise, lane tracing and road-sign assist. Fitted as standard across the range, not sold as an options pack.",
    image: "/tech/safety-sense.webp",
    href: "/safety",
  },
  {
    Icon: Radio,
    title: "Connected Services",
    body: "Remote lock, vehicle health reports and service reminders from your phone. Stolen-vehicle tracking is included for the first three years.",
    image: "/tech/connected.webp",
    href: "/service",
  },
];

/** Card that tilts toward the cursor, capped at 6° per §3.4. */
function TiltCard({
  card,
  index,
}: {
  card: (typeof CARDS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 12); // ±6°
    ry.set(px * 12);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const { Icon } = card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE_EXPO }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-dark group h-full rounded-[24px] p-7"
      >
        <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-[16px] bg-white/5">
          <Image
            src={card.image}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
        </div>

        <span className="mb-5 flex size-11 items-center justify-center rounded-full bg-white/10 text-white">
          <Icon className="size-5" strokeWidth={1.5} />
        </span>

        <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
          {card.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">
          {card.body}
        </p>

        <Link
          href={card.href}
          className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-white transition-colors hover:text-toyota-red"
        >
          Learn more
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Technology() {
  return (
    <section
      id="technology"
      className="section-y scroll-mt-20 bg-ink text-white"
    >
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow !text-white/50">Technology</p>
          <h2 className="text-h2 mt-3 text-white">
            Engineering you never have to think about.
          </h2>
          <p className="measure mt-6 text-[17px] leading-relaxed text-white/60">
            Three systems doing quiet work in the background — saving fuel,
            watching the road ahead, and keeping the car in touch with you.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <TiltCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
