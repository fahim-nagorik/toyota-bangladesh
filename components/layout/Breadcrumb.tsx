import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb strip for standalone pages. The trailing crumb is the current
 * page and is never a link (§9).
 */
export default function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <div className="container-site pt-28 md:pt-32">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.label} className="flex items-center gap-2">
                {last || !crumb.href ? (
                  <span
                    aria-current={last ? "page" : undefined}
                    className={last ? "font-medium text-ink" : undefined}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!last && (
                  <ChevronRight className="size-3.5" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
