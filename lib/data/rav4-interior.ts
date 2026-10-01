/**
 * RAV4 interior view (§4.3): reached from the INT button on the 360° exterior.
 * A cockpit photograph with "+" hotspots, each opening a photo and write-up.
 * Photos live in /public/rav4/interior — the originals were screenshots with
 * light borders, trimmed and converted to WebP.
 */
export interface InteriorHotspot {
  id: string;
  title: string;
  body: string;
  /** Detail photo shown in the modal. */
  image: string;
  /** CSS object-position for the detail photo. */
  position?: string;
  /** Position on the cockpit photo, as fractions of its width / height. */
  x: number;
  y: number;
}

export const RAV4_COCKPIT = {
  src: "/rav4/interior/rav4-interior-7.webp",
  alt: "Toyota RAV4 cockpit and dashboard",
};

export const RAV4_INTERIOR_HOTSPOTS: InteriorHotspot[] = [
  {
    id: "cluster",
    title: "Digital instrument cluster",
    body: "A configurable display with Eco coaching, hybrid status and driver-assist readouts at a glance, so the information you need is always in your line of sight.",
    image: "/rav4/interior/rav4-interior-5.webp",
    x: 0.73,
    y: 0.47,
  },
  {
    id: "console",
    title: "Drive mode console",
    body: "A leather-wrapped shifter sits beside the Drive Mode dial and wireless charging pad, putting everything that shapes the drive within easy reach.",
    image: "/rav4/interior/rav4-interior-6.webp",
    position: "center 40%",
    x: 0.505,
    y: 0.72,
  },
  {
    id: "door",
    title: "Door controls",
    body: "One-touch power windows, central locking and mirror adjustment are grouped together on the armrest, where your hand naturally rests.",
    image: "/rav4/interior/rav4-interior-4.webp",
    x: 0.9,
    y: 0.66,
  },
  {
    id: "cargo",
    title: "Flexible cargo space",
    body: "A low, flat load floor with split-folding rear seats makes room for longer items without giving up passenger space.",
    image: "/rav4/interior/rav4-interior-3.webp",
    x: 0.3,
    y: 0.9,
  },
];
