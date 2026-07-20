import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Toyota Genuine Parts order. Delivery across Bangladesh or collection and fitting at a Toyota service centre.",
  // A cart-dependent page has nothing useful to offer a crawler.
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <div className="bg-bg-alt">
      <div className="container-site pb-24 pt-32 md:pb-32 md:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-ink-muted">
            <li>
              <Link href="/service" className="transition-colors hover:text-ink">
                Genuine Parts
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              Checkout
            </li>
          </ol>
        </nav>

        <header className="mb-12">
          <p className="eyebrow">Checkout</p>
          <h1 className="text-h2 mt-3">Checkout</h1>
          <p className="measure mt-6 text-[17px] leading-relaxed text-ink-muted">
            We confirm every part against your vehicle before it is dispatched,
            so the details below matter.
          </p>
        </header>

        <CheckoutClient />
      </div>
    </div>
  );
}
