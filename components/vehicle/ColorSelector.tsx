"use client";

import type { VehicleColor } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";

/**
 * Glass swatch bar under the hero (§4.2).
 *
 * ASSET NOTE: only models with genuine per-colour photography (RAV4) drive an
 * image cross-fade. For the rest the bar lists the paint options without
 * swapping the image — showing one colour's photo under another's name would
 * misrepresent the car.
 */
export default function ColorSelector({
  colors,
  index,
  onChange,
}: {
  colors: VehicleColor[];
  index: number;
  onChange: (i: number) => void;
}) {
  const interactive = colors.some((c) => c.image);
  const active = colors[index];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role={interactive ? "radiogroup" : "list"}
        aria-label="Exterior colour"
        className="glass inline-flex items-center gap-1.5 rounded-full p-1.5"
      >
        {colors.map((c, i) => {
          const selected = i === index;
          const Tag = interactive ? "button" : "div";
          return (
            <Tag
              key={c.name}
              {...(interactive
                ? {
                    role: "radio",
                    "aria-checked": selected,
                    "aria-label": c.name,
                    onClick: () => onChange(i),
                    type: "button" as const,
                  }
                : { role: "listitem", "aria-label": c.name })}
              title={c.name}
              className={cn(
                "hit-44 relative size-9 rounded-full border border-black/[0.06]",
                interactive && "transition-transform duration-200 hover:scale-105",
                selected && interactive && "ring-2 ring-toyota-red ring-offset-2",
              )}
              style={{ backgroundColor: c.hex }}
            >
              <span className="sr-only">{c.name}</span>
            </Tag>
          );
        })}
      </div>

      <p className="text-[13px] text-ink-muted">
        {interactive ? active.name : `${colors.length} exterior colours available`}
      </p>
    </div>
  );
}
