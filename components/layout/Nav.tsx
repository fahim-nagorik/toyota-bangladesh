"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, ChevronRight } from "lucide-react";
import { VEHICLES } from "@/lib/data/vehicles";
import { formatBDT, EASE_EXPO, cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

const LINKS = [
  { label: "Models", href: "/models" },
  { label: "Technology", href: "/technology" },
  { label: "Safety", href: "/safety" },
  { label: "Offers", href: "/offers" },
  { label: "Service", href: "/service" },
  { label: "Dealers", href: "/dealers" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // The home hero is a dark full-bleed video, so the transparent nav needs
  // light text/logo while it sits over it. Every other route has a light top,
  // and once the glass bar kicks in the nav is light-backed everywhere — both
  // keep the default dark ink.
  const overDarkHero = pathname === "/" && !scrolled;

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
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "glass border-x-0 border-t-0 border-b border-b-hairline"
            : "border-b border-transparent bg-transparent",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="container-site flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label="Toyota Bangladesh — home" className="shrink-0">
            {/* Product logo (emblem + wordmark). The asset carries brand
                clear-space — only ~41% of its height is ink — so it is set
                taller than the old corporate wordmark to read at the same size. */}
            <Image
              src={
                overDarkHero
                  ? "/logos/ToyotaProductLogo_Secondary_White_RGB.png"
                  : "/logos/ToyotaProductLogo_Secondary_Black_RGB.png"
              }
              alt="Toyota"
              width={306}
              height={100}
              priority
              className="h-[38px] w-auto md:h-[44px]"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[15px] font-medium transition-colors",
                  overDarkHero
                    ? "text-white/85 hover:text-white"
                    : "text-ink/80 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <MagneticButton
              href="/book-test-drive"
              variant="red"
              className="hidden px-5 py-2.5 text-sm sm:inline-flex"
            >
              Book a Test Drive
            </MagneticButton>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className={cn(
                "hit-44 flex size-11 items-center justify-center rounded-full lg:hidden",
                overDarkHero ? "text-white" : "text-ink",
              )}
            >
              <Menu className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

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
                src="/logos/ToyotaProductLogo_Secondary_Black_RGB.png"
                alt="Toyota"
                width={306}
                height={100}
                className="h-[38px] w-auto"
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
                        href={`/models/${v.slug}`}
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
                  href="/book-test-drive"
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
