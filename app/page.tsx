import Hero from "@/components/home/Hero";
import VehicleGrid from "@/components/home/VehicleGrid";
import Technology from "@/components/home/Technology";
import Safety from "@/components/home/Safety";
import Offers from "@/components/home/Offers";
import DealerLocator from "@/components/home/DealerLocator";
import TestDrive from "@/components/home/TestDrive";
import Marquee from "@/components/ui/Marquee";

const TRUST = [
  "Since 1937",
  "Toyota Hybrid Electric",
  "Toyota Safety Sense",
  "Genuine Parts",
  "8 Dealers Nationwide",
  "Factory-Trained Technicians",
  "3-Year Warranty",
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-b border-hairline bg-bg">
        <Marquee items={TRUST} />
      </div>
      <VehicleGrid />
      <Technology />
      <Safety />
      <Offers />
      <DealerLocator />
      <TestDrive />
    </>
  );
}
