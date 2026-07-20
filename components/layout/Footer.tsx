"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { VEHICLES } from "@/lib/data/vehicles";

const COLUMNS = [
  {
    title: "Vehicles",
    links: VEHICLES.slice(0, 6).map((v) => ({
      label: v.name,
      href: `/vehicles/${v.slug}`,
    })),
  },
  {
    title: "Services",
    links: [
      { label: "Book a Service", href: "/service?tab=book" },
      { label: "Genuine Parts", href: "/service?tab=shop" },
      { label: "Genuine Engine Oil", href: "/service?tab=shop" },
      { label: "Body & Paint", href: "/service?tab=book" },
      { label: "Extended Warranty", href: "/service?tab=book" },
      { label: "Roadside Assistance", href: "/service?tab=book" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Toyota Bangladesh", href: "/#technology" },
      { label: "Toyota Safety Sense", href: "/#safety" },
      { label: "Hybrid Electric", href: "/#technology" },
      { label: "Current Offers", href: "/#offers" },
      { label: "Find a Dealer", href: "/#dealers" },
      { label: "Careers", href: "/#dealers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Book a Test Drive", href: "/#test-drive" },
      { label: "Contact Us", href: "/#dealers" },
      { label: "Owner's Manuals", href: "/service?tab=book" },
      { label: "Service Schedule", href: "/service?tab=book" },
      { label: "Warranty Terms", href: "/service?tab=book" },
      { label: "Recall Information", href: "/service?tab=book" },
    ],
  },
];

/* lucide-react no longer ships brand marks, so the social glyphs are inline. */
const SOCIALS = [
  {
    label: "Toyota Bangladesh on Facebook",
    path: "M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z",
  },
  {
    label: "Toyota Bangladesh on Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.5-1.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  },
  {
    label: "Toyota Bangladesh on YouTube",
    path: "M22 12s0-3.5-.45-5.18a2.6 2.6 0 0 0-1.83-1.84C18.05 4.5 12 4.5 12 4.5s-6.05 0-7.72.48A2.6 2.6 0 0 0 2.45 6.8C2 8.5 2 12 2 12s0 3.5.45 5.18a2.6 2.6 0 0 0 1.83 1.84c1.67.48 7.72.48 7.72.48s6.05 0 7.72-.48a2.6 2.6 0 0 0 1.83-1.84C22 15.5 22 12 22 12ZM10 15.5v-7l6 3.5-6 3.5Z",
  },
  {
    label: "Toyota Bangladesh on LinkedIn",
    path: "M6.5 8H3.8v12h2.7V8Zm-1.35-4.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.2 20v-6.6c0-3.2-1.7-4.7-4-4.7a3.5 3.5 0 0 0-3.1 1.7V8H10.4v12h2.7v-6.4c0-1.7.9-2.5 2.1-2.5s2.3.8 2.3 2.6V20h2.7Z",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-bg-tint">
      <div className="container-site relative z-10 pb-40 pt-24 md:pb-52">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Image
              src="/logos/ToyotaCorporateLogo_Black_RGB.png"
              alt="Toyota"
              width={140}
              height={44}
              className="h-[30px] w-auto"
            />
            <p className="measure mt-5 text-[15px] leading-relaxed text-ink-muted">
              Toyota vehicles, genuine parts and factory-trained service across
              Bangladesh — from Tejgaon to Chattogram.
            </p>

            <form onSubmit={submit} className="mt-7 max-w-sm">
              <label
                htmlFor="newsletter"
                className="eyebrow mb-2 block"
              >
                Stay informed
              </label>
              <div className="relative">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscribed(false);
                  }}
                  placeholder="your@email.com"
                  className="h-12 w-full rounded-full border border-hairline bg-white pl-5 pr-14 text-[15px] outline-none transition-colors placeholder:text-ink-muted/70 focus:border-toyota-red"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to the newsletter"
                  className="absolute right-1.5 top-1.5 flex size-9 items-center justify-center rounded-full bg-toyota-red text-white transition-transform duration-200 hover:scale-105"
                >
                  {subscribed ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight className="size-4" strokeWidth={2} />
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-[13px] text-ink-muted">
                  Thank you — you&apos;re on the list.
                </p>
              )}
            </form>

            <ul className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ label, path }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className="hit-44 flex size-10 items-center justify-center rounded-full border border-hairline bg-white text-ink-muted transition-colors hover:border-ink hover:text-ink"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                      className="size-[18px]"
                    >
                      <path d={path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="eyebrow mb-5">{col.title}</h2>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-hairline pt-8 text-[13px] text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Toyota Bangladesh. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="#" className="hover:text-ink">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-ink">Terms of Use</Link></li>
            <li><Link href="#" className="hover:text-ink">Cookie Preferences</Link></li>
            <li><Link href="#" className="hover:text-ink">Accessibility</Link></li>
          </ul>
        </div>

        <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-muted/70">
          Demonstration site. Vehicle specifications, pricing and availability
          are indicative and subject to change. Fuel economy figures are
          manufacturer test values and will vary with driving conditions.
        </p>
      </div>

      {/* Ghosted wordmark bleeding off the bottom edge — §3.9 */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[0.22em] select-none text-center font-semibold leading-none tracking-[-0.04em] text-ink"
        style={{ fontSize: "clamp(5rem, 19vw, 19rem)", opacity: 0.04 }}
      >
        TOYOTA
      </span>
    </footer>
  );
}
