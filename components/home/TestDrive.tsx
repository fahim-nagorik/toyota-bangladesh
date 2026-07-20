import { Reveal } from "@/components/ui/RevealText";
import TestDriveForm from "@/components/testdrive/TestDriveForm";

/**
 * Home page test drive section (§5.1). The form itself lives in
 * TestDriveForm so this section and /book-test-drive share one implementation.
 */
export default function TestDrive() {
  return (
    <section id="test-drive" className="section-y scroll-mt-20 bg-bg-alt">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <Reveal className="text-center">
            <p className="eyebrow">Test Drive</p>
            <h2 className="text-h2 mt-3">Take the wheel.</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-ink-muted">
              Pick a model and a dealer. We&apos;ll confirm your slot by phone
              within one working day.
            </p>
          </Reveal>

          <Reveal index={1} className="mt-12">
            <div className="glass rounded-[24px] p-6 md:p-9">
              <TestDriveForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
