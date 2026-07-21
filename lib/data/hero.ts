/**
 * Slides for the homepage hero slideshow (§5.1).
 *
 * Seeded with the RAV4 colour renders — the only real photography on the site
 * today. Each slide carries its own eyebrow colour, headline and supporting
 * line so the hero reads as a product carousel (text changes with the car).
 * To feature another model, add an entry here once a real render exists for it
 * (shot on white so `mix-blend-multiply` drops the background cleanly). The
 * hero grows automatically: one entry renders as a still hero, two or more turn
 * on the slide transition, arrows and dots.
 */
export interface HeroSlide {
  image: string;
  alt: string;
  /** Short caption for the dot's accessible label, e.g. model + colour. */
  label: string;
  /** Display colour shown in the eyebrow, e.g. "Silver Metallic". */
  color: string;
  /** Per-slide headline. */
  heading: string;
  /** Per-slide supporting line under the headline. */
  subhead: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/rav4/colors/silver.webp",
    alt: "Toyota RAV4 Hybrid in Silver Metallic",
    label: "RAV4 · Silver Metallic",
    color: "Silver Metallic",
    heading: "Take the wheel.",
    subhead: "Book a test drive at your nearest dealer in minutes.",
  },
  {
    image: "/rav4/colors/grey.webp",
    alt: "Toyota RAV4 Hybrid in Grey Metallic",
    label: "RAV4 · Grey Metallic",
    color: "Grey Metallic",
    heading: "Safety that never blinks.",
    subhead: "Toyota Safety Sense camera and radar, standard on every grade.",
  },
  {
    image: "/rav4/colors/blue.webp",
    alt: "Toyota RAV4 Hybrid in Dark Blue Mica",
    label: "RAV4 · Dark Blue Mica",
    color: "Dark Blue Mica",
    heading: "Command every road.",
    subhead: "E-Four electric AWD with self-charging hybrid power.",
  },
  {
    image: "/rav4/colors/white.webp",
    alt: "Toyota RAV4 Hybrid in Platinum White Pearl",
    label: "RAV4 · Platinum White Pearl",
    color: "Platinum White Pearl",
    heading: "RAV4 Hybrid.",
    subhead: "Electrified capability, engineered for every road in Bangladesh.",
  },
];
