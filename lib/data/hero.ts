/**
 * Homepage hero content (§5.1).
 *
 * The hero is a full-bleed, muted, looping background video (Porsche-style
 * cinematic hero) with the headline and CTAs overlaid on a dark scrim. The
 * clip is compressed and shipped from /public; a poster frame covers first
 * paint / reduced-motion / any decode failure.
 */
export interface HeroContent {
  /** Compressed, web-optimised MP4 (H.264, faststart, muted). */
  video: string;
  /** Poster frame shown before playback, on reduced-motion, and as a fallback. */
  poster: string;
  eyebrow: string;
  heading: string;
  subhead: string;
}

export const HERO: HeroContent = {
  video: "/rav4/hero.mp4",
  poster: "/rav4/hero-poster.jpg",
  eyebrow: "",
  heading: "Take the wheel.",
  subhead: "Electrified capability, engineered for every road in Bangladesh.",
};
