"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, ChevronRight } from "lucide-react";
import { VEHICLES } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO, cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
  { label: "Vehicles", href: "/#vehicles", mega: true },
  { label: "Technology", href: "/#technology" },
  { label: "Safety", href: "/#safety" },
  { label: "Offers", href: "/#offers" },
  { label: "Service", href: "/service" },
  { label: "Dealers", href: "/#dealers" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Glass kicks in past 60px (§3.1).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile overlay.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMega(false);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Small grace period so a diagonal cursor path to the panel doesn't close it.
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };

  const solid = scrolled || mega;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "glass border-x-0 border-t-0 border-b border-b-hairline"
            : "border-b border-transparent bg-transparent",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        onMouseLeave={closeMega}
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label="Toyota Bangladesh — home" className="shrink-0">
            <Image
              src="/logos/ToyotaCorporateLogo_Red_RGB.png"
              alt="Toyota"
              width={120}
              height={38}
              priority
              className="h-[26px] w-auto md:h-[30px]"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {LINKS.map((link) =>
              link.mega ? (
                <button
                  key={link.label}
                  onMouseEnter={openMega}
                  onFocus={openMega}
                  onClick={() => setMega((v) => !v)}
                  aria-expanded={mega}
                  aria-haspopup="true"
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={closeMega}
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton
              href="/#test-drive"
              variant="red"
              className="hidden px-5 py-2.5 text-sm sm:inline-flex"
            >
              Book a Test Drive
            </MagneticButton>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="hit-44 flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
            >
              <Menu className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mega menu — §3.1 */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_EXPO }}
              onMouseEnter={openMega}
              className="absolute inset-x-0 top-full hidden border-t border-hairline lg:block"
            >
              <div className="glass border-x-0 border-b border-t-0 border-b-hairline">
                <div className="container-site py-10">
                  <div className="mb-6 flex items-baseline justify-between">
                    <p className="eyebrow">The Range</p>
                    <Link
                      href="/#vehicles"
                      className="inline-flex items-center gap-1 text-sm font-medium text-toyota-red"
                    >
                      View all {VEHICLES.length} models
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                  <ul className="grid grid-cols-4 gap-x-6 gap-y-8">
                    {VEHICLES.map((v, i) => (
                      <motion.li
                        key={v.slug}
                        initial={reduced ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: i * 0.03,
                          ease: EASE_EXPO,
                        }}
                      >
                        <Link
                          href={`/vehicles/${v.slug}`}
                          onClick={() => setMega(false)}
                          className="group block"
                        >
                          <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[16px] bg-bg-tint">
                            <Image
                              src={v.image}
                              alt={v.name}
                              fill
                              sizes="(max-width: 1440px) 22vw, 300px"
                              className="object-contain mix-blend-multiply p-3 transition-transform duration-500 group-hover:scale-105"
                              style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
                            />
                          </div>
                          <p className="text-[15px] font-medium leading-tight">
                            {v.name}
                          </p>
                          <p className="mt-0.5 text-[13px] text-ink-muted">
                            {formatBDT(v.priceFrom)}
                          </p>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile overlay — §3.1 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_EXPO }}
            className="fixed inset-0 z-[70] bg-bg lg:hidden"
          >
            <div className="container-site flex h-[72px] items-center justify-between">
              <Image
                src="/logos/ToyotaCorporateLogo_Red_RGB.png"
                alt="Toyota"
                width={120}
                height={38}
                className="h-[26px] w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="hit-44 flex size-11 items-center justify-center rounded-full"
              >
                <X className="size-6" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="container-site flex h-[calc(100dvh-72px)] flex-col overflow-y-auto pb-10"
            >
              <ul className="flex flex-col pt-6">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.06 + i * 0.05,
                      ease: EASE_EXPO,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between border-b border-hairline py-5 text-2xl font-medium tracking-[-0.02em]"
                    >
                      {link.label}
                      <ChevronRight className="size-5 text-ink-muted" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: EASE_EXPO }}
                className="mt-8"
              >
                <p className="eyebrow mb-4">Models</p>
                <ul className="grid grid-cols-2 gap-3">
                  {VEHICLES.map((v) => (
                    <li key={v.slug}>
                      <Link
                        href={`/vehicles/${v.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-[16px] bg-bg-tint p-3"
                      >
                        <div className="relative mb-2 aspect-[4/3]">
                          <Image
                            src={v.image}
                            alt={v.name}
                            fill
                            sizes="45vw"
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-ink-muted">
                          {formatBDT(v.priceFrom)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="mt-8">
                <MagneticButton
                  href="/#test-drive"
                  variant="red"
                  className="w-full"
                >
                  Book a Test Drive
                </MagneticButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
