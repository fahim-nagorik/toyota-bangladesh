/**
 * Genuine Toyota Parts catalogue (§5.1). Part numbers follow Toyota's real
 * numbering conventions; prices are indicative BDT retail for the demo.
 */

export type ProductCategory =
  | "Engine Oil"
  | "Filters"
  | "Brakes"
  | "Batteries"
  | "Wipers"
  | "Accessories";

export interface Product {
  id: string;
  name: string;
  partNumber: string;
  category: ProductCategory;
  price: number;
  image: string;
  blurb: string;
  description: string;
  compatibility: string[];
}

export const PRODUCT_CATEGORIES: Array<"All" | ProductCategory> = [
  "All",
  "Engine Oil",
  "Filters",
  "Brakes",
  "Batteries",
  "Wipers",
  "Accessories",
];

export const PRODUCTS: Product[] = [
  {
    id: "oil-0w20-1l",
    name: "Toyota Genuine Motor Oil 0W-20 (1L)",
    partNumber: "08880-83265",
    category: "Engine Oil",
    price: 1450,
    image: "/parts/oil-0w20.webp",
    blurb: "Fully synthetic, hybrid-rated.",
    description:
      "The low-viscosity synthetic Toyota specifies for its hybrid and Dynamic Force engines. The 0W rating means it reaches the top of the head almost immediately from cold — which is where nearly all engine wear happens.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry"],
  },
  {
    id: "oil-0w20-4l",
    name: "Toyota Genuine Motor Oil 0W-20 (4L)",
    partNumber: "08880-83266",
    category: "Engine Oil",
    price: 5200,
    image: "/parts/oil-0w20.webp",
    blurb: "Service-size pack, one full change.",
    description:
      "The four-litre pack covers a complete oil change on most Toyota hybrid four-cylinder engines with a margin left over. Buying the service pack rather than four singles is meaningfully cheaper per litre.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry"],
  },
  {
    id: "oil-5w30-4l",
    name: "Toyota Genuine Motor Oil 5W-30 (4L)",
    partNumber: "08880-83346",
    category: "Engine Oil",
    price: 4800,
    image: "/parts/oil-5w30.webp",
    blurb: "For turbo diesel and older petrol units.",
    description:
      "The heavier grade for the 2.8L turbo diesel in the Hilux and Fortuner, and for older naturally aspirated petrol engines. Holds its film strength at the sustained high oil temperatures a loaded pickup generates.",
    compatibility: ["Hilux", "Fortuner", "Land Cruiser", "Rush"],
  },
  {
    id: "oil-filter",
    name: "Genuine Oil Filter",
    partNumber: "04152-YZZA1",
    category: "Filters",
    price: 950,
    image: "/parts/oil-filter.webp",
    blurb: "Replace at every oil change.",
    description:
      "A cartridge filter with the correct bypass valve pressure for your engine. Aftermarket filters frequently get this specification wrong, which sends unfiltered oil around the engine on cold starts.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry", "Rush"],
  },
  {
    id: "air-filter",
    name: "Genuine Air Filter",
    partNumber: "17801-0T050",
    category: "Filters",
    price: 1650,
    image: "/parts/air-filter.webp",
    blurb: "Sized for high-dust conditions.",
    description:
      "Dhaka's air loads an intake filter far faster than the service manual's temperate-climate interval assumes. Inspect this one at every service rather than every second one.",
    compatibility: ["Corolla Altis", "Corolla Cross", "RAV4", "Camry"],
  },
  {
    id: "cabin-filter",
    name: "Genuine Cabin Air Filter",
    partNumber: "87139-0N010",
    category: "Filters",
    price: 1850,
    image: "/parts/cabin-filter.webp",
    blurb: "Activated carbon, particulate rated.",
    description:
      "An activated-carbon element that traps particulates and absorbs exhaust odour before it reaches the vents. In heavy traffic this is the single part with the most direct effect on the air you breathe.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry", "Fortuner"],
  },
  {
    id: "brake-pads-front",
    name: "Genuine Brake Pads — Front",
    partNumber: "04465-42180",
    category: "Brakes",
    price: 7400,
    image: "/parts/brake-pads-front.webp",
    blurb: "Matched to the original disc compound.",
    description:
      "Toyota's friction compound is validated against the specific disc metallurgy and the vehicle's ABS calibration. Mismatched aftermarket pads change stopping distance and can confuse the stability control.",
    compatibility: ["RAV4", "Corolla Cross", "Camry"],
  },
  {
    id: "brake-disc",
    name: "Genuine Brake Disc — Front",
    partNumber: "43512-42060",
    category: "Brakes",
    price: 11200,
    image: "/parts/brake-disc.webp",
    blurb: "Ventilated, sold individually.",
    description:
      "A ventilated cast-iron rotor machined to Toyota's runout tolerance. Always replace discs in axle pairs to keep braking balanced side to side.",
    compatibility: ["RAV4", "Corolla Cross", "Camry", "Corolla Altis"],
  },
  {
    id: "battery-45ah",
    name: "Toyota Genuine Battery 45Ah",
    partNumber: "28800-21170",
    category: "Batteries",
    price: 9800,
    image: "/parts/battery-45ah.webp",
    blurb: "Maintenance-free, 18-month warranty.",
    description:
      "A sealed calcium battery sized for compact Toyota petrol engines. Sustained heat is what kills batteries in this climate — this one is specified for it, and carries an 18-month replacement warranty.",
    compatibility: ["Corolla Altis", "Rush", "Corolla Cross"],
  },
  {
    id: "battery-65ah",
    name: "Toyota Genuine Battery 65Ah",
    partNumber: "28800-21200",
    category: "Batteries",
    price: 14500,
    image: "/parts/battery-65ah.webp",
    blurb: "For diesel and large-displacement engines.",
    description:
      "Higher cold-cranking amps for the 2.8L turbo diesel and the Land Cruiser's V6. Diesels need substantially more current to turn over than an equivalent petrol engine.",
    compatibility: ["Hilux", "Fortuner", "Land Cruiser"],
  },
  {
    id: "wiper-set",
    name: "Genuine Wiper Blade Set",
    partNumber: "85212-0K120",
    category: "Wipers",
    price: 3200,
    image: "/parts/wiper-set.webp",
    blurb: "Driver and passenger pair.",
    description:
      "Graphite-coated rubber that stays pliable through a monsoon season. A blade that chatters or streaks at speed is not a comfort problem — it is a visibility one.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry", "Rush"],
  },
  {
    id: "floor-mats",
    name: "Genuine All-Weather Floor Mats",
    partNumber: "PT908-42200",
    category: "Accessories",
    price: 8900,
    image: "/parts/floor-mats.webp",
    blurb: "Moulded TPE, retained to the floor anchors.",
    description:
      "Deep-lipped thermoplastic mats that hold water and mud rather than letting it reach the carpet. They clip to the factory floor anchors, so they cannot slide under the pedals.",
    compatibility: ["RAV4", "Corolla Cross", "Fortuner", "Hilux"],
  },
  {
    id: "dash-cam",
    name: "Toyota Genuine Dash Camera",
    partNumber: "PZ474-00100",
    category: "Accessories",
    price: 18500,
    image: "/parts/dash-cam.webp",
    blurb: "Front and rear, wired to the fuse box.",
    description:
      "A dual-channel recorder that wires into the vehicle's own fuse box rather than the accessory socket, so it powers down cleanly with the ignition and cannot flatten the battery overnight.",
    compatibility: ["RAV4", "Corolla Cross", "Corolla Altis", "Camry", "Fortuner"],
  },
];

export const VAT_RATE = 0.15;
