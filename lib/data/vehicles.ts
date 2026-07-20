/**
 * Vehicle catalogue — model names, body types and specs referenced from
 * toyota-bd.com. Prices are indicative BDT landed cost for the demo.
 *
 * ASSET NOTE: the range is scoped to the eight models we hold real
 * photography for. `colors` carries image paths only where genuine per-colour
 * shots exist (RAV4); elsewhere the swatches render as paint options with no
 * misleading image swap. See ColorSelector.
 */

export type BodyType =
  | "SUV"
  | "Sedan"
  | "Hybrid"
  | "Pickup"
  | "MPV";

export interface VehicleColor {
  name: string;
  hex: string;
  /** Real photograph of the car in this colour, when one exists. */
  image?: string;
}

export interface GalleryShot {
  src: string;
  caption: string;
}

export interface FeatureRow {
  title: string;
  body: string;
  image: string;
}

export interface Vehicle {
  slug: string;
  name: string;
  tagline: string;
  bodyType: BodyType;
  /** Every body type this model filters under. */
  filters: BodyType[];
  priceFrom: number;
  /** Two-line card description. */
  description: string;
  image: string;
  heroImage: string;
  specs: {
    engine: string;
    /** Numeric parts drive the count-up animation. */
    power: { value: number; unit: string; label: string };
    torque: { value: number; unit: string; label: string };
    transmission: string;
    fuelEconomy: { value: number; unit: string; label: string };
    seats: { value: number; unit: string; label: string };
    drivetrain: string;
  };
  colors: VehicleColor[];
  gallery: GalleryShot[];
  features: FeatureRow[];
  highlights: string[];
}

/** Feature photography shared across the range — genuine Toyota system shots. */
const TSS_SHOT = "/tech/safety-sense.webp";
const HYBRID_SHOT = "/tech/hybrid.webp";
const CONNECTED_SHOT = "/tech/connected.webp";

export const VEHICLES: Vehicle[] = [
  {
    slug: "rav4",
    name: "RAV4",
    tagline: "The hybrid SUV that redefined the segment.",
    bodyType: "SUV",
    filters: ["SUV", "Hybrid"],
    priceFrom: 9500000,
    description:
      "Toyota's self-charging hybrid SUV, tuned for Dhaka traffic and highway runs alike. E-Four electric all-wheel drive engages the moment grip disappears.",
    // RAV4 is the one model with genuine photography, so it uses it everywhere.
    image: "/rav4/colors/silver.webp",
    heroImage: "/rav4/colors/silver.webp",
    specs: {
      engine: "2.5L Dynamic Force Hybrid",
      power: { value: 218, unit: "hp", label: "System Output" },
      torque: { value: 221, unit: "Nm", label: "Torque" },
      transmission: "e-CVT",
      fuelEconomy: { value: 21, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 5, unit: "seats", label: "Seating" },
      drivetrain: "E-Four Electric AWD",
    },
    colors: [
      { name: "Silver Metallic", hex: "#C9CBCC", image: "/rav4/colors/silver.webp" },
      { name: "Attitude Grey", hex: "#6B6E70", image: "/rav4/colors/grey.webp" },
      { name: "Blueprint Blue", hex: "#2E4A6B", image: "/rav4/colors/blue.webp" },
      { name: "Platinum White", hex: "#EDEDED", image: "/rav4/colors/white.webp" },
    ],
    // RAV4's gallery is replaced by the 360° viewer (§4.2) — kept for fallback.
    gallery: [
      { src: "/rav4/colors/silver.webp", caption: "Silver Metallic" },
      { src: "/rav4/colors/grey.webp", caption: "Attitude Grey" },
      { src: "/rav4/colors/blue.webp", caption: "Blueprint Blue" },
      { src: "/rav4/colors/white.webp", caption: "Platinum White" },
    ],
    features: [
      {
        title: "Self-charging hybrid",
        body: "The battery replenishes under braking and coasting — there is nothing to plug in. In stop-start Gulshan traffic the RAV4 runs on electric power alone for much of the journey, which is exactly where a conventional SUV drinks the most fuel.",
        image: HYBRID_SHOT,
      },
      {
        title: "E-Four electric all-wheel drive",
        body: "A second motor drives the rear axle on demand. There is no propeller shaft, so torque reaches the rear wheels in milliseconds — useful on a waterlogged monsoon street long before it matters off-road.",
        image: "/rav4/colors/blue.webp",
      },
      {
        title: "Toyota Safety Sense",
        body: "Pre-Collision System with pedestrian detection, Dynamic Radar Cruise Control, Lane Departure Alert and Automatic High Beam — standard, not an options-list upsell.",
        image: TSS_SHOT,
      },
    ],
    highlights: [
      "E-Four electric AWD",
      "Toyota Safety Sense 2.5",
      "Panoramic moonroof",
      "Wireless Apple CarPlay",
    ],
  },
  {
    slug: "corolla-cross",
    name: "Corolla Cross",
    tagline: "Corolla sense, SUV stance.",
    bodyType: "SUV",
    filters: ["SUV", "Hybrid"],
    priceFrom: 6000000,
    description:
      "The Corolla's running costs in a raised, crossover body. A hybrid that returns sedan economy with the ground clearance Dhaka's streets demand.",
    image: "/vehicles/corolla-cross.webp",
    heroImage: "/vehicles/corolla-cross-hero.webp",
    specs: {
      engine: "1.8L Hybrid Dynamic Force",
      power: { value: 140, unit: "hp", label: "System Output" },
      torque: { value: 185, unit: "Nm", label: "Torque" },
      transmission: "e-CVT",
      fuelEconomy: { value: 24, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 5, unit: "seats", label: "Seating" },
      drivetrain: "Front-Wheel Drive",
    },
    colors: [
      { name: "Platinum White Pearl", hex: "#EDEDED" },
      { name: "Celestite Grey", hex: "#7A7D80" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Emotional Red", hex: "#B4131F" },
    ],
    gallery: [
      { src: "/vehicles/corolla-cross-hero.webp", caption: "Front three-quarter" },
      { src: "/vehicles/corolla-cross.webp", caption: "Profile" },
      { src: HYBRID_SHOT, caption: "Hybrid powertrain" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "24 km/l, honestly",
        body: "The 1.8-litre hybrid spends most of a city commute with the engine off. Owners running Uttara-to-Motijheel daily report the tank lasting a fortnight — the running-cost argument that makes a hybrid pay for itself.",
        image: HYBRID_SHOT,
      },
      {
        title: "Ground clearance that matters here",
        body: "161mm of clearance and short overhangs. Speed breakers, kerb ramps and the standing water that follows a heavy shower stop being a calculation you make before every turn.",
        image: "/vehicles/corolla-cross-hero.webp",
      },
      {
        title: "Connected from the driver's seat",
        body: "Wireless smartphone mirroring, over-the-air map updates and a companion app that reports fuel level and service intervals before the dashboard does.",
        image: CONNECTED_SHOT,
      },
    ],
    highlights: [
      "24 km/l combined",
      "161mm ground clearance",
      "Toyota Safety Sense",
      "Wireless smartphone mirroring",
    ],
  },
  {
    slug: "corolla-altis",
    name: "Corolla Altis",
    tagline: "The sedan the country learned to trust.",
    bodyType: "Sedan",
    filters: ["Sedan", "Hybrid"],
    priceFrom: 4800000,
    description:
      "Fifty years and fifty million cars of accumulated engineering. The Altis is the default answer in Bangladesh for a reason — it simply does not break.",
    image: "/vehicles/corolla-altis.webp",
    heroImage: "/vehicles/corolla-altis.webp",
    specs: {
      engine: "1.8L Hybrid Dynamic Force",
      power: { value: 138, unit: "hp", label: "System Output" },
      torque: { value: 172, unit: "Nm", label: "Torque" },
      transmission: "e-CVT",
      fuelEconomy: { value: 26, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 5, unit: "seats", label: "Seating" },
      drivetrain: "Front-Wheel Drive",
    },
    colors: [
      { name: "Super White", hex: "#F2F2F2" },
      { name: "Silver Metallic", hex: "#C9CBCC" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Dark Blue Mica", hex: "#22334D" },
    ],
    gallery: [
      { src: "/vehicles/corolla-altis.webp", caption: "Profile" },
      { src: HYBRID_SHOT, caption: "Hybrid powertrain" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "Resale value is a feature",
        body: "The Altis holds its value better than anything else in its class on the Bangladeshi used market. That is not marketing — it is what a reputation for not breaking is worth in cash, three years on.",
        image: "/vehicles/corolla-altis.webp",
      },
      {
        title: "26 km/l from the hybrid",
        body: "The most efficient car in this range. The engine cuts out at every light, the battery recovers energy at every brake application, and the fuel bill reflects both.",
        image: HYBRID_SHOT,
      },
      {
        title: "Safety Sense as standard",
        body: "Pre-Collision braking, lane tracing and radar cruise on a mainstream sedan — the equipment list that used to belong two segments above.",
        image: TSS_SHOT,
      },
    ],
    highlights: [
      "26 km/l combined",
      "Class-leading resale",
      "Toyota Safety Sense",
      "8 SRS airbags",
    ],
  },
  {
    slug: "camry",
    name: "Camry",
    tagline: "Quiet authority.",
    bodyType: "Sedan",
    filters: ["Sedan", "Hybrid"],
    priceFrom: 8900000,
    description:
      "The executive hybrid saloon. Near-silent at city speed, composed at highway pace, and appointed to a standard that makes the badge on the bonnet feel understated.",
    image: "/vehicles/camry.webp",
    heroImage: "/vehicles/camry-hero.webp",
    specs: {
      engine: "2.5L Dynamic Force Hybrid",
      power: { value: 218, unit: "hp", label: "System Output" },
      torque: { value: 221, unit: "Nm", label: "Torque" },
      transmission: "e-CVT",
      fuelEconomy: { value: 23, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 5, unit: "seats", label: "Seating" },
      drivetrain: "Front-Wheel Drive",
    },
    colors: [
      { name: "Platinum White Pearl", hex: "#EDEDED" },
      { name: "Graphite Metallic", hex: "#5C5F61" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Dark Blue Mica", hex: "#22334D" },
    ],
    gallery: [
      { src: "/vehicles/camry-hero.webp", caption: "Front three-quarter" },
      { src: "/vehicles/camry.webp", caption: "Profile" },
      { src: HYBRID_SHOT, caption: "Hybrid powertrain" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "Silence as engineering",
        body: "Acoustic glass, a sealed floor pan and an engine that shuts off entirely below 40 km/h. The cabin is quiet enough that the stereo becomes the loudest thing in it.",
        image: "/vehicles/camry-hero.webp",
      },
      {
        title: "218 hp, 23 km/l",
        body: "The hybrid system refuses the usual trade. Full-throttle overtakes on the Dhaka-Chattogram highway, and a fuel figure a 1.5-litre hatchback would be pleased with.",
        image: HYBRID_SHOT,
      },
      {
        title: "Chauffeur-grade rear cabin",
        body: "Reclining rear seats, independent climate control and rear sunshades. The Camry is bought as often for the back seat as the front.",
        image: CONNECTED_SHOT,
      },
    ],
    highlights: [
      "218 hp hybrid",
      "Acoustic laminated glass",
      "Reclining rear seats",
      "9-speaker JBL audio",
    ],
  },
  {
    slug: "fortuner",
    name: "Fortuner",
    tagline: "Built on a ladder frame. Built to stay.",
    bodyType: "SUV",
    filters: ["SUV"],
    priceFrom: 11500000,
    description:
      "A body-on-frame seven-seater with genuine four-wheel drive. Where a crossover asks to turn back, the Fortuner keeps going.",
    image: "/vehicles/fortuner.webp",
    heroImage: "/vehicles/fortuner.webp",
    specs: {
      engine: "2.8L Turbo Diesel",
      power: { value: 204, unit: "hp", label: "Max Power" },
      torque: { value: 500, unit: "Nm", label: "Torque" },
      transmission: "6-Speed Automatic",
      fuelEconomy: { value: 14, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 7, unit: "seats", label: "Seating" },
      drivetrain: "Part-Time 4WD",
    },
    colors: [
      { name: "Super White", hex: "#F2F2F2" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Phantom Brown", hex: "#4A3B32" },
      { name: "Silver Metallic", hex: "#C9CBCC" },
    ],
    gallery: [
      { src: "/vehicles/fortuner.webp", caption: "Profile" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "500 Nm, low down",
        body: "The 2.8-litre turbo diesel delivers peak torque from 1,600 rpm. Fully loaded with seven people and luggage, it never feels like it is working.",
        image: "/vehicles/fortuner.webp",
      },
      {
        title: "Ladder-frame construction",
        body: "A separate chassis under the body — heavier than a monocoque, and far more tolerant of broken road surfaces, deep ruts and years of them.",
        image: "/vehicles/fortuner.webp",
      },
      {
        title: "Seven seats, three rows",
        body: "The third row folds flat into the floor. Fold it down and the Fortuner swallows a family's worth of luggage for a trip to Cox's Bazar without a roof box.",
        image: CONNECTED_SHOT,
      },
    ],
    highlights: [
      "500 Nm turbo diesel",
      "Part-time 4WD with low range",
      "279mm ground clearance",
      "7 seats",
    ],
  },
  {
    slug: "hilux",
    name: "Hilux",
    tagline: "The one that refuses to die.",
    bodyType: "Pickup",
    filters: ["Pickup"],
    priceFrom: 5900000,
    description:
      "A working pickup with a one-tonne payload and a reputation earned in the hardest places on earth. Bought to work, kept for decades.",
    image: "/vehicles/hilux.webp",
    heroImage: "/vehicles/hilux.webp",
    specs: {
      engine: "2.8L Turbo Diesel",
      power: { value: 204, unit: "hp", label: "Max Power" },
      torque: { value: 500, unit: "Nm", label: "Torque" },
      transmission: "6-Speed Automatic",
      fuelEconomy: { value: 15, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 5, unit: "seats", label: "Seating" },
      drivetrain: "Part-Time 4WD",
    },
    colors: [
      { name: "Super White", hex: "#F2F2F2" },
      { name: "Silver Metallic", hex: "#C9CBCC" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Nebula Blue", hex: "#2B3A52" },
    ],
    gallery: [
      { src: "/vehicles/hilux.webp", caption: "Profile" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "One tonne, all day",
        body: "A payload rated at 1,000kg and a braked towing capacity of 3,500kg. The Hilux is specified for work first, and the ride comfort follows from the chassis rather than compromising it.",
        image: "/vehicles/hilux.webp",
      },
      {
        title: "700mm wading depth",
        body: "Sealed electrics, a raised air intake path and a high-mounted alternator. Monsoon flooding that strands other vehicles is a Tuesday.",
        image: "/vehicles/hilux.webp",
      },
      {
        title: "Parts, everywhere",
        body: "Every Toyota service point in the country stocks Hilux consumables. Its ubiquity is itself a feature — a breakdown far from Dhaka is an inconvenience, not a recovery operation.",
        image: CONNECTED_SHOT,
      },
    ],
    highlights: [
      "1,000kg payload",
      "3,500kg towing",
      "700mm wading depth",
      "Part-time 4WD",
    ],
  },
  {
    slug: "land-cruiser",
    name: "Land Cruiser",
    tagline: "Seventy years of going anywhere.",
    bodyType: "SUV",
    filters: ["SUV"],
    priceFrom: 32000000,
    description:
      "The flagship. A twin-turbo V6 on a new GA-F platform, engineered against a standard of reliability that predates most of the roads it drives on.",
    image: "/vehicles/land-cruiser.webp",
    heroImage: "/vehicles/land-cruiser-hero.webp",
    specs: {
      engine: "3.3L Twin-Turbo V6 Diesel",
      power: { value: 305, unit: "hp", label: "Max Power" },
      torque: { value: 700, unit: "Nm", label: "Torque" },
      transmission: "10-Speed Automatic",
      fuelEconomy: { value: 10, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 7, unit: "seats", label: "Seating" },
      drivetrain: "Full-Time 4WD",
    },
    colors: [
      { name: "Precious White Pearl", hex: "#EFEFEF" },
      { name: "Gun Metallic", hex: "#55595C" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Dark Blue Mica", hex: "#22334D" },
    ],
    gallery: [
      { src: "/vehicles/land-cruiser-hero.webp", caption: "Front three-quarter" },
      { src: "/vehicles/land-cruiser.webp", caption: "Profile" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "700 Nm from a twin-turbo V6",
        body: "The new 3.3-litre diesel makes more torque than the V8 it replaced, on less fuel and 200kg less mass. The GA-F frame is stiffer by half again.",
        image: "/vehicles/land-cruiser-hero.webp",
      },
      {
        title: "Multi-Terrain Select",
        body: "Sand, mud, rock and deep snow modes retune throttle, braking and differential behaviour. Turn the dial and the vehicle reconfigures itself for the surface.",
        image: "/vehicles/land-cruiser.webp",
      },
      {
        title: "Engineered against a longer clock",
        body: "Land Cruisers are validated for service lives measured in decades, in territories with no dealer network. It is the vehicle the UN and the Red Cross specify when failure is not survivable.",
        image: TSS_SHOT,
      },
    ],
    highlights: [
      "700 Nm twin-turbo V6",
      "Multi-Terrain Select",
      "GA-F ladder frame",
      "7 seats",
    ],
  },
  {
    slug: "rush",
    name: "Rush",
    tagline: "Seven seats, small footprint.",
    bodyType: "MPV",
    filters: ["MPV", "SUV"],
    priceFrom: 3900000,
    description:
      "A compact seven-seater built on a rear-wheel-drive frame. High enough to clear a flooded street, narrow enough for an old Dhaka lane.",
    image: "/vehicles/rush.webp",
    heroImage: "/vehicles/rush.webp",
    specs: {
      engine: "1.5L Dual VVT-i",
      power: { value: 104, unit: "hp", label: "Max Power" },
      torque: { value: 136, unit: "Nm", label: "Torque" },
      transmission: "4-Speed Automatic",
      fuelEconomy: { value: 17, unit: "km/l", label: "Fuel Economy" },
      seats: { value: 7, unit: "seats", label: "Seating" },
      drivetrain: "Rear-Wheel Drive",
    },
    colors: [
      { name: "Super White", hex: "#F2F2F2" },
      { name: "Silver Metallic", hex: "#C9CBCC" },
      { name: "Attitude Black", hex: "#1A1A1A" },
      { name: "Bordeaux Mica", hex: "#5C2733" },
    ],
    gallery: [
      { src: "/vehicles/rush.webp", caption: "Profile" },
      { src: TSS_SHOT, caption: "Toyota Safety Sense" },
      { src: CONNECTED_SHOT, caption: "Connected Services" },
    ],
    features: [
      {
        title: "220mm of clearance",
        body: "More ground clearance than most full-size SUVs, on a footprint that fits the lanes of Old Dhaka. It is the specification that actually matters in a monsoon city.",
        image: "/vehicles/rush.webp",
      },
      {
        title: "Seven seats under 40 lakh",
        body: "Three rows at a price where the competition offers five. The rearmost row folds flat when the family is smaller than the car.",
        image: "/vehicles/rush.webp",
      },
      {
        title: "Six airbags as standard",
        body: "Front, side and curtain airbags with vehicle stability control and hill-start assist — a safety specification not usually found at this price.",
        image: TSS_SHOT,
      },
    ],
    highlights: [
      "220mm ground clearance",
      "7 seats",
      "6 SRS airbags",
      "Rear-wheel drive",
    ],
  },
];

export const VEHICLE_FILTERS: Array<"All" | BodyType> = [
  "All",
  "SUV",
  "Sedan",
  "Hybrid",
  "Pickup",
  "MPV",
];

export function getVehicle(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug);
}

/** Up to three other models sharing a body type, for the related rail. */
export function getRelated(slug: string, limit = 3): Vehicle[] {
  const vehicle = getVehicle(slug);
  if (!vehicle) return [];
  const sameType = VEHICLES.filter(
    (v) => v.slug !== slug && v.filters.some((f) => vehicle.filters.includes(f)),
  );
  // Backfill from the rest of the range so the rail is never short.
  const rest = VEHICLES.filter(
    (v) => v.slug !== slug && !sameType.includes(v),
  );
  return [...sameType, ...rest].slice(0, limit);
}
