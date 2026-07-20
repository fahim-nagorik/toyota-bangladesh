import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, MapPin, Phone } from "lucide-react";
import { DEALERS } from "@/lib/data/dealers";
import TestDriveForm from "@/components/testdrive/TestDriveForm";

export const metadata: Metadata = {
  title: "Book a Test Drive",
  description:
    "Choose a Toyota model and a dealer in Bangladesh. Book a test drive and a product advisor will confirm your slot within one working day.",
};

/** What the customer should expect after submitting — removes the guesswork. */
const STEPS = [
  {
    title: "We call to confirm",
    body: "A product advisor from your chosen dealer rings within one working day to agree a time.",
  },
  {
    title: "Bring your licence",
    body: "A valid Bangladeshi driving licence is required on the day. The drive takes about 30 minutes.",
  },
  {
    title: "No obligation",
    body: "Drive the car, ask what you like. There is nothing to sign and nothing to pay.",
  },
];

export default function BookTestDrivePage() {
  return (
    <div className="bg-bg-alt">
      <div className="container-site pb-24 pt-32 md:pb-32 md:pt-40">
        {/* Breadcrumb — keeps the page's place in the site clear (§9). */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-[13px] text-ink-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              Book a Test Drive
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Editorial column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Book a Test Drive</p>
            <h1 className="text-h2 mt-3">Feel it for yourself.</h1>
            <p className="measure mt-6 text-[17px] leading-relaxed text-ink-muted">
              Pick a model and a dealer. We&apos;ll confirm your slot by phone
              within one working day — no deposit, no paperwork.
            </p>

            <ol className="mt-10 space-y-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-medium tabular-nums text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[15px] font-medium">{step.title}</p>
                    <p className="measure mt-1 text-[14px] leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-[20px] border border-hairline bg-white p-6">
              <p className="text-[15px] font-medium">Prefer to call?</p>
              <a
                href={`tel:${DEALERS[0].phone.replace(/\s/g, "")}`}
                className="mt-2 inline-flex items-center gap-2 text-[15px] text-toyota-red"
              >
                <Phone className="size-4" strokeWidth={1.75} />
                {DEALERS[0].phone}
              </a>
              <dl className="mt-4 space-y-2 text-[14px] text-ink-muted">
                <div className="flex items-start gap-2">
                  <dt className="sr-only">Address</dt>
                  <MapPin
                    className="mt-0.5 size-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <dd>{DEALERS[0].address}</dd>
                </div>
                <div className="flex items-start gap-2">
                  <dt className="sr-only">Opening hours</dt>
                  <Clock
                    className="mt-0.5 size-4 shrink-0"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <dd>{DEALERS[0].hours}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Form column — the only interactive island on the page. */}
          <div className="glass rounded-[24px] p-6 md:p-9">
            <TestDriveForm />
          </div>
        </div>
      </div>
    </div>
  );
}
