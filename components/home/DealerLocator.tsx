"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Phone, Clock, Search, ChevronDown } from "lucide-react";
import { DEALERS } from "@/lib/data/dealers";
import { EASE_EXPO, cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/RevealText";

/** How many dealers show before the list collapses (§3.7). */
const COLLAPSED_COUNT = 3;

export default function DealerLocator() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(DEALERS[0].id);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEALERS;
    return DEALERS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q),
    );
  }, [query]);

  // A search already narrows the list, so collapsing filtered results on top
  // of that just hides matches. The collapse only applies to the full list.
  const searching = query.trim().length > 0;
  const collapsed = !searching && !expanded;
  const visible = collapsed ? results.slice(0, COLLAPSED_COUNT) : results;

  const active = DEALERS.find((d) => d.id === activeId) ?? DEALERS[0];

  return (
    <section id="dealers" className="section-y scroll-mt-20 bg-bg">
      <div className="container-site">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Dealers</p>
          <h2 className="text-h2 mt-3">Eight points of contact.</h2>
          <p className="measure mt-6 text-[17px] leading-relaxed text-ink-muted">
            Sales, factory-trained service and genuine parts — from Tejgaon to
            Chattogram, Sylhet to Khulna.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          {/* Left: search + list */}
          <Reveal>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-muted"
                strokeWidth={1.5}
              />
              <label htmlFor="dealer-search" className="sr-only">
                Search dealers by city or name
              </label>
              <input
                id="dealer-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by city or dealer name"
                className="h-13 w-full rounded-full border border-hairline bg-white py-3.5 pl-12 pr-5 text-[15px] outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red"
              />
            </div>

            <ul className="mt-4 space-y-3" aria-label="Dealer list">
              {visible.map((d) => {
                const isActive = d.id === activeId;
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => setActiveId(d.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "w-full rounded-[20px] border-l-2 p-5 text-left transition-all duration-300",
                        isActive
                          ? "glass border-l-toyota-red"
                          : "border-l-transparent bg-bg-alt hover:bg-bg-tint",
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-[17px] font-medium tracking-[-0.01em]">
                            {d.name}
                          </h3>
                          <p className="mt-0.5 text-[13px] uppercase tracking-[0.12em] text-ink-muted">
                            {d.city}
                          </p>
                        </div>
                        {isActive && (
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-toyota-red" />
                        )}
                      </div>

                      <p className="mt-3 flex items-start gap-2 text-[14px] leading-relaxed text-ink-muted">
                        <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                        {d.address}
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-[14px] text-ink-muted">
                        <Phone className="size-4 shrink-0" strokeWidth={1.5} />
                        <a
                          href={`tel:${d.phone.replace(/\s/g, "")}`}
                          className="hover:text-ink"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {d.phone}
                        </a>
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-[14px] text-ink-muted">
                        <Clock className="size-4 shrink-0" strokeWidth={1.5} />
                        {d.hours}
                      </p>

                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {d.services.map((s) => (
                          <li
                            key={s}
                            className="rounded-full bg-ink/[0.05] px-2.5 py-1 text-[12px] text-ink-muted"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && (
                <li className="rounded-[20px] bg-bg-alt p-8 text-center text-[15px] text-ink-muted">
                  No dealers match “{query}”. Try a city name.
                </li>
              )}
            </ul>

            {/* Collapse control — only when the full list is longer than the
                collapsed view. Hidden during a search, which shows all matches. */}
            {!searching && results.length > COLLAPSED_COUNT && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-bg-alt py-3 text-[14px] font-medium text-ink transition-colors hover:bg-bg-tint"
              >
                {expanded
                  ? "Show fewer dealers"
                  : `Show all ${results.length} dealers`}
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-300",
                    expanded && "rotate-180",
                  )}
                  strokeWidth={2}
                />
              </button>
            )}
          </Reveal>

          {/* Right: stylised map panel */}
          <Reveal index={1}>
            <div className="relative h-[420px] overflow-hidden rounded-[24px] bg-bg-tint lg:h-full lg:min-h-[580px]">
              {/* Grid backdrop — a stylised panel, not a real map */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.55]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(245,245,247,0) 70%)",
                }}
              />

              {/* Pans toward the active pin */}
              <motion.div
                className="absolute inset-0"
                animate={
                  reduced
                    ? undefined
                    : {
                        x: (0.5 - active.x) * 120,
                        y: (0.5 - active.y) * 120,
                      }
                }
                transition={{ duration: 0.9, ease: EASE_EXPO }}
              >
                {DEALERS.map((d) => {
                  const isActive = d.id === activeId;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveId(d.id)}
                      aria-label={`${d.name}, ${d.city}`}
                      className="hit-44 absolute -translate-x-1/2 -translate-y-full"
                      style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}
                    >
                      <motion.span
                        animate={{ scale: isActive ? 1.3 : 1 }}
                        transition={{ duration: 0.45, ease: EASE_EXPO }}
                        className="relative flex flex-col items-center"
                      >
                        {isActive && !reduced && (
                          <motion.span
                            aria-hidden
                            className="absolute bottom-0 size-6 rounded-full bg-toyota-red/25"
                            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                            }}
                          />
                        )}
                        <MapPin
                          className={cn(
                            "size-7 drop-shadow-sm transition-colors duration-300",
                            isActive ? "text-toyota-red" : "text-ink/35",
                          )}
                          fill={isActive ? "#EB0A1E" : "transparent"}
                          strokeWidth={1.5}
                        />
                        {isActive && (
                          <span className="glass mt-1 whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-medium">
                            {d.city}
                          </span>
                        )}
                      </motion.span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Active dealer summary */}
              <div className="absolute inset-x-4 bottom-4">
                <motion.div
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_EXPO }}
                  className="glass rounded-[20px] p-5"
                >
                  <p className="eyebrow">Selected dealer</p>
                  <h3 className="mt-1.5 text-lg font-medium tracking-[-0.01em]">
                    {active.name}
                  </h3>
                  <p className="mt-1 text-[14px] text-ink-muted">
                    {active.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-ink-muted">
                    <a
                      href={`tel:${active.phone.replace(/\s/g, "")}`}
                      className="font-medium text-toyota-red"
                    >
                      {active.phone}
                    </a>
                    <span>{active.hours}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
