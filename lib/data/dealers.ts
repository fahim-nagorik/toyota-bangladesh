/**
 * Dealer network (§3.7). Locations correspond to Navana / Toyota's real
 * Bangladeshi service footprint; addresses and numbers are demo data.
 * `x`/`y` are fractions of the stylised map panel, roughly geographic.
 */

export interface Dealer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  x: number;
  y: number;
}

export const DEALERS: Dealer[] = [
  {
    id: "tejgaon",
    name: "Toyota Tejgaon",
    city: "Dhaka",
    address: "205/A Tejgaon Industrial Area, Dhaka 1208",
    phone: "+880 2 8878 400",
    hours: "Sat–Thu, 9:00 — 19:00",
    services: ["Sales", "Service", "Genuine Parts", "Body & Paint"],
    x: 0.52,
    y: 0.44,
  },
  {
    id: "gulshan",
    name: "Toyota Gulshan",
    city: "Dhaka",
    address: "House 42, Road 11, Gulshan 1, Dhaka 1212",
    phone: "+880 2 9885 210",
    hours: "Sat–Thu, 9:00 — 19:00",
    services: ["Sales", "Service", "Genuine Parts"],
    x: 0.56,
    y: 0.4,
  },
  {
    id: "uttara",
    name: "Toyota Uttara",
    city: "Dhaka",
    address: "Plot 14, Sector 3, Uttara Model Town, Dhaka 1230",
    phone: "+880 2 8991 733",
    hours: "Sat–Thu, 9:00 — 19:00",
    services: ["Sales", "Service", "Genuine Parts", "Body & Paint"],
    x: 0.54,
    y: 0.33,
  },
  {
    id: "chattogram",
    name: "Toyota Chattogram",
    city: "Chattogram",
    address: "1054 CDA Avenue, Nasirabad, Chattogram 4000",
    phone: "+880 31 2551 900",
    hours: "Sat–Thu, 9:00 — 18:30",
    services: ["Sales", "Service", "Genuine Parts", "Body & Paint"],
    x: 0.68,
    y: 0.72,
  },
  {
    id: "sylhet",
    name: "Toyota Sylhet",
    city: "Sylhet",
    address: "Airport Road, Amberkhana, Sylhet 3100",
    phone: "+880 821 719 400",
    hours: "Sat–Thu, 9:00 — 18:30",
    services: ["Sales", "Service", "Genuine Parts"],
    x: 0.79,
    y: 0.27,
  },
  {
    id: "khulna",
    name: "Toyota Khulna",
    city: "Khulna",
    address: "Jashore Road, Boyra Bazar, Khulna 9000",
    phone: "+880 41 762 330",
    hours: "Sat–Thu, 9:00 — 18:30",
    services: ["Sales", "Service", "Genuine Parts"],
    x: 0.34,
    y: 0.68,
  },
  {
    id: "rajshahi",
    name: "Toyota Rajshahi",
    city: "Rajshahi",
    address: "Greater Road, Laxmipur, Rajshahi 6000",
    phone: "+880 721 774 120",
    hours: "Sat–Thu, 9:00 — 18:30",
    services: ["Sales", "Service", "Genuine Parts"],
    x: 0.23,
    y: 0.38,
  },
  {
    id: "bogura",
    name: "Toyota Bogura",
    city: "Bogura",
    address: "Sherpur Road, Banani, Bogura 5800",
    phone: "+880 51 668 900",
    hours: "Sat–Thu, 9:00 — 18:30",
    services: ["Service", "Genuine Parts"],
    x: 0.36,
    y: 0.3,
  },
];

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: string;
  priceFrom: number;
}

export const SERVICE_TYPES: ServiceType[] = [
  {
    id: "periodic",
    name: "Periodic Maintenance",
    description:
      "Scheduled inspection to Toyota's service interval — engine oil and filter, brake and fluid check, tyre rotation and a 40-point vehicle report.",
    duration: "2–3 hours",
    priceFrom: 6500,
  },
  {
    id: "repair",
    name: "Repair & Diagnostics",
    description:
      "Fault diagnosis on Toyota's own diagnostic equipment, with a written estimate before any work begins. Genuine parts only.",
    duration: "4–8 hours",
    priceFrom: 3500,
  },
  {
    id: "body-paint",
    name: "Body & Paint",
    description:
      "Panel repair and refinishing in a temperature-controlled booth, colour-matched to your vehicle's original paint code.",
    duration: "3–5 days",
    priceFrom: 15000,
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
