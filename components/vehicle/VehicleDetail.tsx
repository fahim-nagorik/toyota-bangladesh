"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/data/vehicles";
import ModelHero from "./ModelHero";
import ColorSelector from "./ColorSelector";
import SpecBlocks from "./SpecBlocks";
import Gallery from "./Gallery";
import FeatureRows from "./FeatureRows";
import RelatedModels from "./RelatedModels";
import StickyBuyBar from "./StickyBuyBar";
import Rav4Viewer from "./Rav4Viewer";
import { Reveal } from "@/components/ui/RevealText";

export default function VehicleDetail({
  vehicle,
  related,
}: {
  vehicle: Vehicle;
  related: Vehicle[];
}) {
  const [colorIndex, setColorIndex] = useState(0);

  // Only swap the hero shot when the colour actually has its own photograph.
  const heroImage = vehicle.colors[colorIndex]?.image ?? vehicle.heroImage;

  // RAV4 is the flagship: the 360° viewer replaces its gallery (§4.2).
  const isFlagship = vehicle.slug === "rav4";

  return (
    <>
      <ModelHero vehicle={vehicle} image={heroImage} />

      <div className="bg-bg-tint pb-16">
        <div className="container-site">
          <ColorSelector
            colors={vehicle.colors}
            index={colorIndex}
            onChange={setColorIndex}
          />
        </div>
      </div>

      <SpecBlocks vehicle={vehicle} />

      {isFlagship ? (
        <section className="section-y bg-bg-tint">
          <div className="container-site">
            <Reveal className="mb-12 max-w-3xl">
              <p className="eyebrow">360° Experience</p>
              <h2 className="text-h2 mt-3">Walk around it.</h2>
              <p className="measure mt-6 text-[17px] leading-relaxed text-ink-muted">
                Drag to rotate through a full turn. Tap the red markers to open
                the details, or use the arrow keys once the viewer has focus.
              </p>
            </Reveal>
            <Rav4Viewer colors={vehicle.colors} />
          </div>
        </section>
      ) : (
        <Gallery shots={vehicle.gallery} modelName={vehicle.name} />
      )}

      <FeatureRows features={vehicle.features} modelName={vehicle.name} />
      <RelatedModels models={related} />
      <StickyBuyBar vehicle={vehicle} />
    </>
  );
}
