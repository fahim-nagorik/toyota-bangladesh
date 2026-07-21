/**
 * Slides for the homepage hero slideshow (§5.1).
 *
 * Seeded with the RAV4 colour renders — the only real photography on the site
 * today. To feature another model, add an entry here once a real render exists
 * for it (shot on white so `mix-blend-multiply` drops the background cleanly).
 * The hero grows automatically: one entry renders as a still image, two or more
 * turn on the crossfade and dots. Never add a grey placeholder here — the hero
 * is the most prominent surface on the site.
 */
export interface HeroSlide {
  image: string;
  alt: string;
  /** Short caption for the dot's accessible label, e.g. model + colour. */
  label: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/rav4/colors/silver.webp",
    alt: "Toyota RAV4 Hybrid in Silver Metallic",
    label: "RAV4 · Silver Metallic",
  },
  {
    image: "/rav4/colors/blue.webp",
    alt: "Toyota RAV4 Hybrid in Blueprint Blue",
    label: "RAV4 · Blueprint Blue",
  },
  {
    image: "/rav4/colors/grey.webp",
    alt: "Toyota RAV4 Hybrid in Attitude Grey",
    label: "RAV4 · Attitude Grey",
  },
  {
    image: "/rav4/colors/white.webp",
    alt: "Toyota RAV4 Hybrid in Platinum White",
    label: "RAV4 · Platinum White",
  },
];
