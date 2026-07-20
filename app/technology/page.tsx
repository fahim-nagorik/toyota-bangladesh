import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Technology from "@/components/home/Technology";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Toyota Hybrid Electric, Safety Sense and connected technology — engineered for Bangladesh's roads.",
};

export default function TechnologyPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Technology" }]} />
      <Technology />
    </>
  );
}
